import { useState, useEffect } from 'react'
import { normalizeRole } from '@/lib/rbac'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  name?: string
  image?: string
  role: string
}

interface ApiUser {
  id: string
  email: string
  name?: string | null
  firstName?: string | null
  lastName?: string | null
  image?: string | null
  role?: string | null
}

interface ApiUserResponse {
  success?: boolean
  user?: ApiUser
}

function normalizeUser(user: ApiUser): User {
  const nameParts = (user.name || '').trim().split(/\s+/).filter(Boolean)
  const firstName = user.firstName || nameParts[0] || 'User'
  const lastName = user.lastName || nameParts.slice(1).join(' ') || ''
  const normalizedRole = normalizeRole(user.role)

  return {
    id: user.id,
    email: user.email,
    firstName,
    lastName,
    name: user.name || undefined,
    image: user.image || undefined,
    role: normalizedRole || user.role || 'USER',
  }
}

function getUserFromResponse(data: ApiUser | ApiUserResponse): ApiUser | undefined {
  if (Object.prototype.hasOwnProperty.call(data, 'user')) {
    return (data as ApiUserResponse).user
  }

  return data as ApiUser
}

interface AuthState {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/users/me', {
        credentials: 'include',
      })

      if (response.ok) {
        const data: ApiUser | ApiUserResponse = await response.json()
        const user = getUserFromResponse(data)

        if (user?.id && user.email) {
          setAuthState({
            user: normalizeUser(user),
            loading: false,
            isAuthenticated: true,
          })
          return
        }
      }
    } catch (error) {
      console.debug('Auth check skipped:', error)
    }

    setAuthState({
      user: null,
      loading: false,
      isAuthenticated: false,
    })
  }

  const logout = async () => {
    try {
      await fetch('/api/session/login', {
        method: 'DELETE',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setAuthState({
        user: null,
        loading: false,
        isAuthenticated: false,
      })
      // Redirect to login page
      window.location.href = '/auth/login'
    }
  }

  return {
    ...authState,
    logout,
    refresh: checkAuth,
  }
}
