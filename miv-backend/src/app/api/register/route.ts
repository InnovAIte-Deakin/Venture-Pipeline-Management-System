import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { z } from "zod";
import type { User } from "@/payload-types";

// Validation schema for registration
const RegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: NextRequest) {
  try {
    // Parse JSON body
    const json = await req.json().catch(() => null);

    if (!json) {
      return NextResponse.json(
        {
          success: false,
          error: "Bad Request",
          message: "Request body must be valid JSON.",
        },
        { status: 400 }
      );
    }

    // Validate input data
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

    const { firstName, lastName, email, password } = parsed.data;

    // Get Payload instance
    const payload = await getPayload({ config });

    // Check if user already exists
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

    // Create new user
    const user = await payload.create({
      collection: "users",
      data: {
        first_name: firstName,
        last_name: lastName,
        email: email.toLowerCase(),
        password,
        role: "founder", // Default role for new registrations
      },
    });

    // Send welcome email using the email API
    try {
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          toName: `${firstName} ${lastName}`,
          subject: 'Welcome to MIV Platform!',
          html: `
            <h1>Welcome to MIV Platform!</h1>
            <p>Dear ${firstName},</p>
            <p>Thank you for registering with the MIV Platform. Your account has been successfully created.</p>
            <p>You can now log in to access the platform and explore all the features available to you.</p>
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            <p>Best regards,<br>The MIV Platform Team</p>
          `,
          text: `Welcome to MIV Platform!

Dear ${firstName},

Thank you for registering with the MIV Platform. Your account has been successfully created.

You can now log in to access the platform and explore all the features available to you.

If you have any questions or need assistance, please don't hesitate to contact our support team.

Best regards,
The MIV Platform Team`
        }),
      });

      if (!emailResponse.ok) {
        console.warn('Welcome email failed to send, but registration succeeded');
      }
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Don't fail the registration if email sending fails
    }

    // Log the user in immediately
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
        user: {
          id: (user as User).id,
          email: (user as User).email,
          firstName: (user as User).first_name,
          lastName: (user as User).last_name,
          role: (user as User).role,
        },
      },
      { status: 201 }
    );

    // Set authentication cookie if login was successful
    if (auth?.token) {
      response.cookies.set("payload-token", auth.token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
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
