import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { createHash } from 'node:crypto';
import { jwtVerify } from 'jose';
import { prisma } from './prisma';
import { authOptions } from './auth-options';
import { UserRole } from '@prisma/client';

function mapBackendRoleToPrisma(backendRole: string): UserRole {
  const r = (backendRole || '').toUpperCase();
  if (r === 'FOUNDER') return UserRole.USER;
  if (r === 'MIV_ANALYST') return UserRole.ANALYST;
  if (r === 'ADMIN') return UserRole.ADMIN;
  if (r === 'USER') return UserRole.USER;
  return UserRole.USER;
}

function getBackendUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

  try {
    const url = new URL(configuredUrl);
    if (url.hostname === 'localhost') {
      url.hostname = '127.0.0.1';
    }
    return url.toString().replace(/\/$/, '');
  } catch {
    return configuredUrl.replace(/\/$/, '');
  }
}

interface PayloadUserLike {
  id?: string;
  email?: string;
  first_name?: string | null;
  last_name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role?: string | null;
}

function getPayloadJwtKey(): Uint8Array | null {
  const secret = process.env.PAYLOAD_SECRET;
  if (!secret) return null;

  const key = createHash('sha256').update(secret).digest('hex').slice(0, 32);
  return new TextEncoder().encode(key);
}

async function getPayloadUserFromToken(token: string): Promise<PayloadUserLike | null> {
  const key = getPayloadJwtKey();
  if (!key) return null;

  const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
  const email = typeof payload.email === 'string' ? payload.email : null;
  if (!email) return null;

  return {
    id: typeof payload.id === 'string' ? payload.id : undefined,
    email,
    role: typeof payload.role === 'string' ? payload.role : undefined,
    first_name: typeof payload.first_name === 'string' ? payload.first_name : undefined,
    last_name: typeof payload.last_name === 'string' ? payload.last_name : undefined,
    firstName: typeof payload.firstName === 'string' ? payload.firstName : undefined,
    lastName: typeof payload.lastName === 'string' ? payload.lastName : undefined,
  };
}

async function syncPayloadUserToPrisma(payloadUser: PayloadUserLike) {
  if (!payloadUser.email) return null;

  const email = payloadUser.email.toLowerCase();
  const prismaRole = mapBackendRoleToPrisma(payloadUser.role || 'user');
  const firstName = payloadUser.first_name || payloadUser.firstName || '';
  const lastName = payloadUser.last_name || payloadUser.lastName || '';
  const name = `${firstName} ${lastName}`.trim() || email;

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (!existing) {
    return prisma.user.create({
      data: {
        email,
        name,
        role: prismaRole,
      },
    });
  }

  if (existing.role !== prismaRole || existing.name !== name) {
    return prisma.user.update({
      where: { id: existing.id },
      data: { role: prismaRole, name },
    });
  }

  return existing;
}

export async function getSessionUser() {
  // 1. Try NextAuth session first
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email.toLowerCase() },
      });
      if (user) return user;
    }
  } catch (e) {
    console.debug('No NextAuth session:', e);
  }

  // 2. Fallback to payload-token cookie
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('payload-token')?.value;
    if (token) {
      const response = await fetch(`${getBackendUrl()}/api/users`, {
        headers: {
          'Authorization': `JWT ${token}`,
          'Cookie': `payload-token=${token}`,
        },
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          const prismaUser = await syncPayloadUserToPrisma(data.user);
          if (prismaUser) return prismaUser;
        }
      }

      const payloadUser = await getPayloadUserFromToken(token);
      if (payloadUser) {
        const prismaUser = await syncPayloadUserToPrisma(payloadUser);
        if (prismaUser) return prismaUser;
      }
    }
  } catch (error) {
    console.error('Error getting session user from payload-token:', error);
  }

  return null;
}
