import { NextRequest, NextResponse } from 'next/server'
import { OAuth2Client } from 'google-auth-library'
import crypto from 'crypto'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Missing Google token' },
        { status: 400 }
      )
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const googlePayload = ticket.getPayload()

    if (!googlePayload?.email) {
      return NextResponse.json(
        { success: false, message: 'Google account email not found' },
        { status: 400 }
      )
    }

    const email = googlePayload.email
    const googleSub = googlePayload.sub
    const fullName = googlePayload.name || ''
    const [firstName = 'Google', lastName = 'User'] = fullName.split(' ')

    const payload = await getPayload({ config: configPromise })

    // 1. Check if user already exists
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
      limit: 1,
    })

    let user

    if (existingUsers.docs.length > 0) {
      // 2. Existing user found -> update Google fields if needed
      const existingUser = existingUsers.docs[0]

      user = await payload.update({
        collection: 'users',
        id: existingUser.id,
        data: {
          authProvider: 'google',
          googleSub,
        },
      })
    } else {
      // 3. No user found -> create new user with default role
      const randomPassword = crypto.randomUUID() + '!Aa1'

      user = await payload.create({
        collection: 'users',
        data: {
          email,
          password: randomPassword,
          first_name: firstName,
          last_name: lastName,
          role: 'founder',
          authProvider: 'google',
          googleSub,
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Google SSO user connected successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    })
  } catch (error) {
    console.error('Google SSO callback error:', error)

    return NextResponse.json(
      { success: false, message: 'Google SSO failed' },
      { status: 500 }
    )
  }
}