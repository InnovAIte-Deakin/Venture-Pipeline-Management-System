import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

// Validation schemas
const createMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  role: z.enum(['ADMIN', 'MANAGER', 'ANALYST', 'USER', 'VENTURE_MANAGER', 'GEDSI_ANALYST', 'CAPITAL_FACILITATOR', 'EXTERNAL_STAKEHOLDER']),
  organization: z.string().optional(),
  phone: z.string().optional(),
  skills: z.array(z.string()).optional(),
  bio: z.string().optional(),
  image: z.string().optional(),
});

const updateMemberSchema = createMemberSchema.partial();

// GET /api/team/members - Get all team members
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { organization: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (role) {
      where.role = role;
    }

    const [members, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          organization: true,
          image: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          // Include project relationships
          ledProjects: {
            select: {
              id: true,
              name: true,
              status: true,
            }
          },
          projectMemberships: {
            select: {
              id: true,
              name: true,
              status: true,
            }
          },
          assignedTasks: {
            where: {
              status: { not: 'COMPLETED' }
            },
            select: {
              id: true,
              name: true,
              status: true,
              dueDate: true,
            }
          },
          _count: {
            select: {
              ledProjects: true,
              projectMemberships: true,
              assignedTasks: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ]);

    return NextResponse.json({
      members,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/team/members - Create new team member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createMemberSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Generate a temporary password (should be changed on first login)
    const tempPassword = Math.random().toString(36).slice(-8) + 'A1!';
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const member = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        role: validatedData.role,
        organization: validatedData.organization,
        image: validatedData.image,
        passwordHash,
        notificationPreferences: {
          email: true,
          inApp: true,
          weeklyDigest: false,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        organization: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    // TODO: Send welcome email with temporary password
    console.log(`New member created with temporary password: ${tempPassword}`);

    return NextResponse.json(member, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating team member:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
