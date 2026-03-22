import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { NextRequest, NextResponse } from "next/server";

interface EmailRequestBody {
  to: string;
  toName?: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  fromName?: string;
}

const mailerSend = new MailerSend({
  apiKey: process.env.NEXT_EMAIL_TOKEN || "",
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Check if API key is configured
    if (!process.env.NEXT_EMAIL_TOKEN) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    // Parse request body
    const body: EmailRequestBody = await request.json();
    
    // Validate required fields
    if (!body.to || !body.subject) {
      return NextResponse.json(
        { error: "Missing required fields: 'to' and 'subject'" },
        { status: 400 }
      );
    }

    if (!body.html && !body.text) {
      return NextResponse.json(
        { error: "Either 'html' or 'text' content is required" },
        { status: 400 }
      );
    }

    // Set up sender (use environment variables or defaults)
    const sentFrom = new Sender(
      body.from || process.env.DEFAULT_FROM_EMAIL || "info@miv.com",
      body.fromName || process.env.DEFAULT_FROM_NAME || "MIV Platform"
    );

    // Set up recipients
    const recipients = [
      new Recipient(body.to, body.toName || body.to)
    ];

    // Create email parameters
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject(body.subject);

    // Add content
    if (body.html) {
      emailParams.setHtml(body.html);
    }
    if (body.text) {
      emailParams.setText(body.text);
    }

    // Send email
    const response = await mailerSend.email.send(emailParams);

    return NextResponse.json(
      { 
        message: "Email sent successfully",
        messageId: response.headers['x-message-id'] 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error sending email:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to send email",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
