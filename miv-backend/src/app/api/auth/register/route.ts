import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await req.json()

    const email = body.email
    const password = body.password
    const firstName = body.firstName
    const lastName = body.lastName

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        {
          success: false,
          error: 'Required',
          message: 'Email, password, first name, and last name are required.',
        },
        { status: 400 }
      )
    }

    const existingUser = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
      limit: 1,
    })

    if (existingUser.totalDocs > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'User already exists',
          message: 'An account with this email already exists.',
        },
        { status: 409 }
      )
    }

    const newUser = await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        role: 'founder',
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        user: newUser,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Register error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Registration failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}