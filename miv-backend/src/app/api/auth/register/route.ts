import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { z } from "zod";

const RegisterSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string(),
  confirmPassword: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json().catch(() => null);

    if (!json) {
      return NextResponse.json(
        {
          success: false,
          error: "BadRequest",
          message: "Request body must be JSON.",
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

    const { first_name, last_name, email, password, confirmPassword } =
      parsed.data;

    if (confirmPassword && password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "PasswordMismatch",
          message: "Passwords do not match.",
        },
        { status: 400 }
      );
    }

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

    const user = await payload.create({
      collection: "users",
      data: {
        first_name,
        last_name,
        email: email.toLowerCase(),
        password,
        role: "user",
      } as any,
    });

    const auth = await payload.login({
      collection: "users",
      data: {
        email: email.toLowerCase(),
        password,
      } as any,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: {
          id: (user as any).id,
          email: (user as any).email,
          first_name: (user as any).first_name,
          last_name: (user as any).last_name,
          role: (user as any).role,
        },
      },
      { status: 201 }
    );

    if (auth?.token) {
      response.cookies.set("payload-token", auth.token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
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