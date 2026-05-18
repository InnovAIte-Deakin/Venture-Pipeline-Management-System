import { useState, useEffect } from 'react'

/**
 * Interface representing the authenticated User.
 * Adjusted to match standard Payload 3.0 fields.
 */
interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: 'admin' | 'user' | string
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

  // Check authentication status on mount
  useEffect(() => {
    checkAuth()
  }, [])

  /**
   * Fetches current user session from the unified Payload endpoint.
   * Replaces legacy /backend/api structure.
   */
  const checkAuth = async () => {
    try {
      const response = await fetch('/api/users/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Crucial for cookie-based auth
      })

      if (response.ok) {
        const data = await response.json()
        
        // Payload returns the user object under the 'user' key.
        // If logged in as the default admin, user will contain admin@example.com
        if (data.user) {
          setAuthState({
            user: data.user,
            loading: false,
            isAuthenticated: true,
          })
          return
        }
      }
    } catch (error) {
      console.error('[AuthHook] Check failed:', error)
    }

    // Default to unauthenticated state if fetch fails or no user found
    setAuthState({
      user: null,
      loading: false,
      isAuthenticated: false,
    })
  }

  /**
   * Clears the session on the server and resets local state.
   */
  const logout = async () => {
    try {
      await fetch('/api/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
    } catch (error) {
      console.error('[AuthHook] Logout error:', error)
    } finally {
      // Always clear local state regardless of server response
      setAuthState({
        user: null,
        loading: false,
        isAuthenticated: false,
      })
      
      // Force redirect to login page
      window.location.href = '/auth/login'
    }
  }

  return {
    ...authState,
    logout,
    refresh: checkAuth,
  }
}