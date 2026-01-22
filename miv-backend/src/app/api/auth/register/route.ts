import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { z } from "zod";
import { emailService } from "@/lib/email-service";

const RegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),

  ventureName: z.string().optional(),
  positionInVenture: z.string().optional(),
  phone: z.string().optional(),
  countryCode: z.string().optional(),
});

const IMPACT_APPLICANT_ROLE = "USER"; // maps to Prisma enum UserRole.USER

export async function POST(req: NextRequest) {
  try {
    const json = await req.json().catch(() => null);

    if (!json) {
      return NextResponse.json(
        {
          success: false,
          error: "Bad Request",
          message: "Request body must be JSON.",
        },
        { status: 400 }
      );
    }

    const parsed = RegisterSchema.safeParse(json);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const message =
        Object.values(fieldErrors)
          .flat()
          .find(Boolean) || "Invalid registration data";

      return NextResponse.json(
        {
          success: false,
          error: "ValidationError",
          message,
          details: fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      firstName,
      lastName,
      email,
      password,
      ventureName,
      positionInVenture,
      phone,
      countryCode,
    } = parsed.data;

    const payload = await getPayload({ config });

    const existing = await payload.find({
      collection: "users",
      where: {
        email: {
          equals: email.toLowerCase(),
        },
      },
      limit: 1,
    });

    if (existing.totalDocs > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "UserExists",
          message: "An account with that email already exists.",
        },
        { status: 409 }
      );
    }

    // 2. Create Impact Applicant user
    const user = await payload.create({
      collection: "users",
      data: {
        firstName,
        lastName,
        email: email.toLowerCase(),
        password,
        role: IMPACT_APPLICANT_ROLE,
      
        ventureName,
        positionInVenture,
        phone,
        countryCode,
      },
    });

    // 3. (Optional) Send welcome email, but don't fail the request if this errors
    try {
      await emailService.sendWelcomeEmail({
        to: email,
        firstName,
      });
    } catch (err) {
      console.error("Failed to send welcome email", err);
    }

    // 4. Log the user in immediately (so dashboard can rely on auth cookie)
    // Adjust this to match your Payload auth setup if the API differs.
    const auth = await payload.login({
      collection: "users",
      data: {
        email: email.toLowerCase(),
        password,
      },
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        // Keep response small; just what the client might need
        user: {
          id: (user as any).id,
          email: (user as any).email,
          firstName: (user as any).firstName,
          lastName: (user as any).lastName,
          role: (user as any).role,
        },
      },
      { status: 201 }
    );

    // Attach Payload auth token as cookie if available
    if (auth?.token) {
      response.cookies.set("payload-token", auth.token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // secure: true in production
      });
    }

    return response;
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "RegistrationFailed",
        message: "Failed to create account. Please try again.",
      },
      { status: 500 }
    );
  }
}
