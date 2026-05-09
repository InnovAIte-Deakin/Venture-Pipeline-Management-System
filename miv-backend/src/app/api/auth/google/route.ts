import { OAuth2Client } from "google-auth-library"
import { NextResponse } from "next/server"

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export async function POST(req: Request) {
  const { token } = await req.json()

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  })

  const payload = ticket.getPayload()

  return NextResponse.json({
    email: payload?.email,
    name: payload?.name,
  })
}