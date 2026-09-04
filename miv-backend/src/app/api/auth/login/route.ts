import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'

const LoginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
})

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()

    // Validate request body
    const validation = LoginSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.errors,
        },
        { status: 400 },
      )
    }

    const { email, password } = validation.data

    // Attempt to login using Payload's authentication
    try {
      const result = await payload.login({
        collection: 'users',
        data: {
          email: email.toLowerCase(),
          password: password,
        },
      })

      if (result.user && result.token) {
        const reqOrigin = request.headers.get('origin')
        const serverUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || process.env.SERVER_URL || ''
        let sameSite: 'lax' | 'none' = 'lax'
        if (process.env.NODE_ENV === 'production') {
          try {
            if (reqOrigin && serverUrl) {
              const o1 = new URL(reqOrigin)
              const o2 = new URL(serverUrl)
              const isSameSite = o1.protocol === o2.protocol && o1.hostname === o2.hostname
              sameSite = isSameSite ? 'lax' : 'none'
            } else if (reqOrigin) {
              const o1 = new URL(reqOrigin)
              const o2 = new URL(request.nextUrl.origin)
              const isSameSite = o1.protocol === o2.protocol && o1.hostname === o2.hostname
              sameSite = isSameSite ? 'lax' : 'none'
            }
          } catch {
            sameSite = 'none'
          }
        }
        // Create response with authentication token
        const response = NextResponse.json({
          success: true,
          message: 'Login successful',
          user: {
            id: result.user.id,
            email: result.user.email,
            firstName: result.user.first_name,
            lastName: result.user.last_name,
            role: result.user.role,
          },
        })

        // Set the authentication token as an HTTP-only cookie
        // For cross-site usage (frontend on a different domain), SameSite must be 'none'
        // and the cookie must be Secure in production.
        response.cookies.set('payload-token', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite,
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
        })

        return response
      } else {
        return NextResponse.json(
          {
            success: false,
            error: 'Authentication failed',
            message: 'Invalid email or password.',
          },
          { status: 401 },
        )
      }
    }  catch (authError: unknown) {
      console.error('Authentication error:', authError)

      // Check if it's an invalid credentials error
      const message = authError instanceof Error ? authError.message : ''
      if (
        message.includes('Invalid login attempt') ||
        message.includes('Incorrect password')
      ) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid credentials',
            message: 'Invalid email or password.',
          },
          { status: 401 },
        )
      }

      throw authError // Re-throw if it's a different error
    }
  } catch (error) {
    console.error('Login error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Login failed',
        message: 'An error occurred during login. Please try again.',
      },
      { status: 500 },
    )
  }
}

// Logout endpoint
export async function DELETE(_request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })

    // Clear the authentication cookie
    response.cookies.delete('payload-token')

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Logout failed',
      },
      { status: 500 },
    )
  }
}
