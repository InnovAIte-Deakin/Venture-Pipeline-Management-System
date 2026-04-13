import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { z } from "zod";
import type { User } from "@/payload-types";

const RegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: NextRequest) {
  try {
    let json;

    try {
      json = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "BadRequest",
          message: "Request body must be valid JSON.",
        },
        { status: 400 }
      );
    }

    const parsed = RegisterSchema.safeParse(json);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const message =
        Object.values(fieldErrors).flat().find(Boolean) ||
        "Invalid registration data";

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
    const cleanEmail = email.toLowerCase().trim();

    const payload = await getPayload({ config });

    const existing = await payload.find({
      collection: "users",
      where: {
        email: {
          equals: cleanEmail,
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

    let user;

    try {
      user = await payload.create({
        collection: "users",
        data: {
          first_name: firstName,
          last_name: lastName,
          email: cleanEmail,
          password,
          role: "founder",
        },
      });
    } catch (createError) {
      console.error("User creation failed:", createError);

      return NextResponse.json(
        {
          success: false,
          error: "UserCreationFailed",
          message: "Unable to create account right now.",
        },
        { status: 500 }
      );
    }

    try {
      const emailResponse = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/send-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: cleanEmail,
            toName: `${firstName} ${lastName}`,
            subject: "Welcome to MIV Platform!",
            html: `
              <h1>Welcome to MIV Platform!</h1>
              <p>Dear ${firstName},</p>
              <p>Your account has been created successfully.</p>
              <p>You can now log in and use the platform.</p>
            `,
            text: `Welcome ${firstName}, your account has been created successfully.`,
          }),
        }
      );

      if (!emailResponse.ok) {
        console.warn("Welcome email failed, but registration succeeded");
      }
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    let auth;

    try {
      auth = await payload.login({
        collection: "users",
        data: {
          email: cleanEmail,
          password,
        },
      });
    } catch (loginError) {
      console.error("Auto login failed after registration:", loginError);

      return NextResponse.json(
        {
          success: true,
          message: "Account created successfully, but auto-login failed.",
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
    }

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