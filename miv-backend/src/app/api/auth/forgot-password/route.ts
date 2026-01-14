import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload.config";
export const runtime = "nodejs";
import { generateResetToken } from "@/lib/reset-token";
import { emailService } from "@/lib/email-service";

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config });
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const users = await payload.find({
      collection: "users",
      where: { email: { equals: email } },
      limit: 1,
    });

    if (users.docs.length) {
      const user = users.docs[0];
      const { rawToken, hashedToken } = generateResetToken();

      await payload.update({
        collection: "users",
        id: user.id,
        data: {
          resetPasswordToken: hashedToken,
          resetPasswordExpiration: new Date(Date.now() + 60 * 60 * 1000),
        },
      });

      // const emailservice = new emailService();
      await emailService.sendPasswordResetEmail(user.email, rawToken);
    }

    return NextResponse.json({
      success: true,
      message:
        "If this email exists, a password reset link will be sent.",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
