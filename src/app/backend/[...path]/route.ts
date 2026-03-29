import { NextRequest, NextResponse } from 'next/server'

const FORWARDED_HEADERS = [
  'accept',
  'accept-language',
  'content-type',
  'authorization',
  'cookie',
  'user-agent',
]

async function proxyToExternalBackend(request: NextRequest, params: { path: string[] }) {
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.PUBLIC_BACKEND_URL || 'http://localhost:3001'
  const url = new URL(request.url)
  const targetPath = params.path.join('/')
  const target = `${backendBase}/${targetPath}${url.search}`

  try {
    const targetUrl = new URL(target)
    if (targetUrl.origin === url.origin) {
      return NextResponse.json(
        { success: false, message: 'Proxy loop detected. Set NEXT_PUBLIC_BACKEND_URL to external backend host.' },
        { status: 500 },
      )
    }

    const headers = new Headers()
    FORWARDED_HEADERS.forEach((name) => {
      const value = request.headers.get(name)
      if (value) headers.set(name, value)
    })

    const method = request.method.toUpperCase()
    const response = await fetch(target, {
      method,
      headers,
      body: method === 'GET' || method === 'HEAD' ? undefined : await request.arrayBuffer(),
      redirect: 'manual',
    })

    return new NextResponse(response.body, {
      status: response.status,
      headers: response.headers,
    })
  } catch (error) {
    console.error('Backend proxy error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to proxy request to external backend.' },
      { status: 502 },
    )
  }
}

async function handle(request: NextRequest, params: { path: string[] }) {
  return proxyToExternalBackend(request, params)
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handle(request, await context.params)
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handle(request, await context.params)
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handle(request, await context.params)
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handle(request, await context.params)
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handle(request, await context.params)
}

export async function OPTIONS(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handle(request, await context.params)
}
