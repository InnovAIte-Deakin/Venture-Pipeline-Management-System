import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.PUBLIC_BACKEND_URL ||
  'http://localhost:3001'

async function forwardRequest(request: NextRequest, method: string) {
  const backendUrl = `${BACKEND_URL}/api/users`
  const headers = new Headers()
  const contentType = request.headers.get('content-type')
  if (contentType) {
    headers.set('content-type', contentType)
  }
  const cookieHeader = request.headers.get('cookie')
  if (cookieHeader) {
    headers.set('cookie', cookieHeader)
  }

  const body = method !== 'GET' ? await request.text() : undefined

  const backendResponse = await fetch(backendUrl, {
    method,
    headers,
    body,
  })

  const responseBody = await backendResponse.text()
  const response = new NextResponse(responseBody, {
    status: backendResponse.status,
  })

  const contentTypeHeader = backendResponse.headers.get('content-type')
  if (contentTypeHeader) {
    response.headers.set('content-type', contentTypeHeader)
  }

  return response
}

export async function GET(request: NextRequest) {
  try {
    const backendResponse = await forwardRequest(request, 'GET')
    if (backendResponse.status !== 200) {
      return backendResponse
    }

    const data = await backendResponse.json().catch(() => null)
    if (data?.success && data?.user) {
      return NextResponse.json(data.user)
    }

    return backendResponse
  } catch (error) {
    console.error('GET /api/users/me error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    return await forwardRequest(request, 'PATCH')
  } catch (error) {
    console.error('PUT /api/users/me error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


