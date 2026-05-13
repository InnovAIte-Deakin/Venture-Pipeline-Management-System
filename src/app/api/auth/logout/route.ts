import { NextResponse } from 'next/server'
import { signOut } from 'next-auth/react'

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })

    // Clear any session cookies
    response.cookies.delete('next-auth.session-token')
    response.cookies.delete('next-auth.csrf-token')
    response.cookies.delete('next-auth.callback-url')

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to logout' },
      { status: 500 },
    )
  }
}
