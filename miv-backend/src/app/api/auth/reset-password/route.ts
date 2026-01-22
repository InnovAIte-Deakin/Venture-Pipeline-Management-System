import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload.config";
import { hashResetToken } from "@/lib/reset-token";

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config });
    const { token, newPassword } = await request.json();

    const hashedToken = hashResetToken(token);

    const result = await payload.find({
      collection: "users",
      where: {
        resetPasswordToken: { equals: hashedToken },
      },
      limit: 1,
    });

    if (!result.docs.length) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token." },
        { status: 400 }
      );
    }

    const user = result.docs[0];

    if (
      user.resetPasswordExpiration &&
      new Date(user.resetPasswordExpiration).getTime() < Date.now()
    ) {
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
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
