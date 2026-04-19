import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload.config";
import { hashResetToken } from "@/lib/reset-token";

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Token and password are required." },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config });
    const hashedToken = hashResetToken(token);

    const { docs } = await payload.find({
      collection: "users",
      where: {
        resetPasswordToken: { equals: hashedToken },
      },
      limit: 1,
    });

    if (!docs.length) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token." },
        { status: 400 }
      );
    }

    const user = docs[0];

    if (user.resetPasswordExpiration && new Date(user.resetPasswordExpiration).getTime() < Date.now()) {
      return NextResponse.json(
        { success: false, message: "Token expired." },
        { status: 400 }
      );
    }

    await payload.update({
      collection: "users",
      id: user.id,
      data: {
        password: newPassword,
        resetPasswordToken: null,
        resetPasswordExpiration: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Password reset error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to reset password." },
      { status: 500 }
    );
  }
}
