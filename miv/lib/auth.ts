import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
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
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/users/me`, {
        headers: {
          'Authorization': `JWT ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          const payloadUser = data.user;
          const email = payloadUser.email.toLowerCase();
          const prismaRole = mapBackendRoleToPrisma(payloadUser.role);

          // Sync user to Prisma database (lazy loading)
          let prismaUser = await prisma.user.findUnique({
            where: { email },
          });

          const name = `${payloadUser.first_name || ''} ${payloadUser.last_name || ''}`.trim();

          if (!prismaUser) {
            prismaUser = await prisma.user.create({
              data: {
                email,
                name: name || payloadUser.email,
                role: prismaRole,
              },
            });
          } else {
            if (prismaUser.role !== prismaRole || prismaUser.name !== name) {
              prismaUser = await prisma.user.update({
                where: { id: prismaUser.id },
                data: { role: prismaRole, name },
              });
            }
          }
          return prismaUser;
        }
      }
    }
  } catch (error) {
    console.error('Error getting session user from payload-token:', error);
  }

  return null;
}
