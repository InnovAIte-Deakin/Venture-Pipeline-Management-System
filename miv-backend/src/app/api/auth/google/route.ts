import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { randomBytes, createSecretKey } from 'crypto'
import { SignJWT } from 'jose'
import config from '@payload-config'
import { z } from 'zod'
import type { User } from '@/payload-types'

// ─── Input Validation ────────────────────────────────────────────────────────

const GoogleAuthSchema = z.object({
  idToken: z.string().min(1, 'Google ID token is required'),
  mode: z.enum(['login', 'register']),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
})

// ─── Google Token Verification ───────────────────────────────────────────────

interface GoogleTokenInfo {
  sub: string
  email: string
  email_verified: string
  name: string
  given_name: string
  family_name: string
  picture: string
  aud: string
  iss: string
  exp: string
  iat: string
}

/**
 * Verifies a Google ID token via Google's tokeninfo endpoint.
 */
async function verifyGoogleIdToken(idToken: string): Promise<GoogleTokenInfo | null> {
  try {
    const url = new URL('https://oauth2.googleapis.com/tokeninfo')
    url.searchParams.set('id_token', idToken)

    const response = await fetch(url.toString(), {
      method: 'GET',
      cache: 'no-store',
      signal: AbortSignal.timeout(8_000),
    })

    if (!response.ok) {
      console.warn('[GoogleSSO] tokeninfo returned non-OK status:', response.status)
      return null
    }

    const data: GoogleTokenInfo = await response.json()

    // Validate issuer
    const validIssuers = ['accounts.google.com', 'https://accounts.google.com']
    if (!validIssuers.includes(data.iss)) {
      console.warn('[GoogleSSO] Invalid token issuer:', data.iss)
      return null
    }

    // Validate audience against our client ID
    const clientId = process.env.GOOGLE_CLIENT_ID
    if (clientId && data.aud !== clientId) {
      console.warn('[GoogleSSO] Token audience mismatch. Expected:', clientId, 'Got:', data.aud)
      return null
    }

    // Validate expiry
    if (Date.now() / 1000 > Number(data.exp)) {
      console.warn('[GoogleSSO] Token has expired')
      return null
    }

    return data
  } catch (error) {
    console.error('[GoogleSSO] Token verification failed:', error)
    return null
  }
}

// ─── Payload-Compatible JWT Generation ───────────────────────────────────────

const TOKEN_EXPIRY_SECONDS = 60 * 60 * 24 * 7 // 7 days

/**
 * Generates a Payload-compatible HS256 JWT.
 *
 * Uses Node's `createSecretKey` to create a KeyObject, which bypasses jose v5's
 * Uint8Array key-length guard (which throws for secrets < 32 bytes) while
 * producing an identical HMAC-SHA256 signature that Payload's middleware accepts.
 */
async function generatePayloadToken(user: User, secret: string): Promise<string> {
  // createSecretKey produces a KeyObject — jose skips the min-length check
  // for KeyObjects and delegates directly to Node's crypto HMAC.
  const secretKey = createSecretKey(Buffer.from(secret, 'utf8'))
  const now = Math.floor(Date.now() / 1000)

  return new SignJWT({
    id: user.id,
    collection: 'users',
    email: user.email,
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt(now)
    .setExpirationTime(now + TOKEN_EXPIRY_SECONDS)
    .sign(secretKey)
}

// ─── Cookie Helpers ───────────────────────────────────────────────────────────

function buildCookieOptions(req: NextRequest): {
  httpOnly: boolean
  secure: boolean
  sameSite: 'lax' | 'strict' | 'none'
  maxAge: number
  path: string
} {
  const isProduction = process.env.NODE_ENV === 'production'

  // In development the frontend proxies /backend/* to the backend, so the
  // browser sees a single origin — 'lax' is correct and 'none' is not needed.
  // In production, if the frontend and backend are on different domains, use
  // 'none' with Secure=true.
  const reqOrigin = req.headers.get('origin') ?? ''
  const backendOrigin = req.nextUrl.origin

  let sameSite: 'lax' | 'none' = 'lax'
  if (isProduction && reqOrigin && reqOrigin !== backendOrigin) {
    sameSite = 'none'
  }

  return {
    httpOnly: true,
    secure: isProduction || sameSite === 'none',
    sameSite,
    maxAge: TOKEN_EXPIRY_SECONDS,
    path: '/',
  }
}

// ─── Route Handler ────────────────────────────────────────────────────────────

/**
 * POST /api/auth/google
 *
 * Handles Google SSO for both login and registration.
 *
 * Body: { idToken, mode, firstName?, lastName? }
 *
 * LOGIN    — requires existing account; returns 404 if not found.
 * REGISTER — creates account if absent; gracefully signs in if already exists.
 *
 * On success, sets an HTTP-only `payload-token` cookie.
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => null)
    if (!rawBody) {
      return NextResponse.json(
        { success: false, message: 'Request body must be valid JSON.' },
        { status: 400 },
      )
    }

    const parsed = GoogleAuthSchema.safeParse(rawBody)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.errors[0]?.message ?? 'Invalid request data.' },
        { status: 400 },
      )
    }

    const { idToken, mode, firstName, lastName } = parsed.data

    // ── Verify Google ID token ─────────────────────────────────────────────
    const googleUser = await verifyGoogleIdToken(idToken)
    if (!googleUser) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired Google token. Please try again.' },
        { status: 401 },
      )
    }

    if (googleUser.email_verified !== 'true') {
      return NextResponse.json(
        { success: false, message: 'Your Google account email is not verified.' },
        { status: 401 },
      )
    }

    const email = googleUser.email.toLowerCase().trim()
    const googleId = googleUser.sub

    const payload = await getPayload({ config })

    // ── Look up user — by googleId first, then by email ────────────────────
    const byGoogleId = await payload.find({
      collection: 'users',
      where: { googleId: { equals: googleId } },
      limit: 1,
    })

    const byEmail =
      byGoogleId.totalDocs === 0
        ? await payload.find({
            collection: 'users',
            where: { email: { equals: email } },
            limit: 1,
          })
        : null

    const existingByGoogleId = byGoogleId.docs[0] as User | undefined
    const existingByEmail = byEmail?.docs[0] as User | undefined

    let user: User

    if (mode === 'login') {
      // ── LOGIN: account must already exist ─────────────────────────────────
      if (existingByGoogleId) {
        user = existingByGoogleId
      } else if (existingByEmail) {
        // Link existing email account to Google on first Google sign-in
        user = (await payload.update({
          collection: 'users',
          id: existingByEmail.id,
          data: { googleId },
        })) as User
      } else {
        return NextResponse.json(
          {
            success: false,
            message:
              'No account is linked to this Google email. Please register first or contact your administrator.',
          },
          { status: 404 },
        )
      }
    } else {
      // ── REGISTER: create if not found, otherwise sign in ──────────────────
      if (existingByGoogleId) {
        user = existingByGoogleId
      } else if (existingByEmail) {
        user = (await payload.update({
          collection: 'users',
          id: existingByEmail.id,
          data: { googleId },
        })) as User
      } else {
        const first =
          firstName?.trim() ||
          googleUser.given_name ||
          googleUser.name?.split(' ')[0] ||
          'User'
        const last =
          lastName?.trim() ||
          googleUser.family_name ||
          googleUser.name?.split(' ').slice(1).join(' ') ||
          'Account'

        user = (await payload.create({
          collection: 'users',
          data: {
            first_name: first,
            last_name: last,
            email,
            password: randomBytes(32).toString('hex'),
            role: 'founder',
            googleId,
          },
        })) as User
      }
    }

    // ── Generate Payload-compatible JWT and set cookie ─────────────────────
    const token = await generatePayloadToken(user, payload.secret)

    const response = NextResponse.json(
      {
        success: true,
        message: mode === 'login' ? 'Login successful' : 'Registration successful',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
        },
      },
      { status: 200 },
    )

    response.cookies.set('payload-token', token, buildCookieOptions(req))
    return response
  } catch (error: unknown) {
    console.error('[GoogleSSO] Unhandled error:', error)
    return NextResponse.json(
      { success: false, message: 'Authentication failed. Please try again.' },
      { status: 500 },
    )
  }
}
