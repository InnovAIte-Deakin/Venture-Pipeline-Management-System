import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface User {
  email: string;
  id: string;
  role: string; // $Enums.UserRole
  name: string | null;
  organization: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * GET /api/users/ventures
 * Fetch current user and return all ventures where user is creator or assignee
 */
export async function GET(request: NextRequest) {
  try {
    // Step 1: Fetch user data from /api/users/me with full URL
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const meResponse = await fetch(`${baseUrl}/api/users/me`);

    if (!meResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: "Failed to fetch user data. Please log in.",
        },
        { status: meResponse.status }
      );
    }

    const meData = await meResponse.json();

    // Step 2: Format user data
    const user: User = {
      email: meData.email,
      id: meData.id,
      role: meData.role,
      name: meData.name || null,
      organization: meData.organization || null,
      createdAt: new Date(meData.createdAt),
      updatedAt: new Date(meData.updatedAt),
    };

    // Step 3: Query Prisma for ventures
    const ventures = await prisma.venture.findMany({
      where: {
        OR: [{ createdById: user.id }, { assignedToId: user.id }],
      },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Step 4: Return response
    return NextResponse.json({
      success: true,
      user: {
        email: user.email,
        id: user.id,
        role: user.role,
        name: user.name,
        organization: user.organization,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      ventures: ventures,
      ventureCount: ventures.length,
    });
  } catch (error) {
    console.error("Error fetching user ventures:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}