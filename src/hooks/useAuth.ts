import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
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
        const data = await response.json()
        if (data.id && data.email) {
          // Parse name field into firstName and lastName
          const [firstName = '', lastName = ''] = (data.name || '').split(' ')
          setAuthState({
            user: {
              id: data.id,
              email: data.email,
              firstName,
              lastName,
              role: data.role || '',
            },
            loading: false,
            isAuthenticated: true,
          })
          return
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    }

    setAuthState({
      user: null,
      loading: false,
      isAuthenticated: false,
    })
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
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