import { createContext, useContext, useState, ReactNode } from 'react'
import { clearPlanDrafts } from '../utils/planDrafts'
import { LEGACY_USER_STORAGE_KEY, USER_STORAGE_KEY } from '../utils/storageKeys'

export interface AuthUser {
  id: number
  name: string
  email: string
}

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  login: (user: AuthUser, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const TOKEN_KEY = 'token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY) ?? localStorage.getItem(LEGACY_USER_STORAGE_KEY)
      if (saved && !localStorage.getItem(USER_STORAGE_KEY)) {
        localStorage.setItem(USER_STORAGE_KEY, saved)
        localStorage.removeItem(LEGACY_USER_STORAGE_KEY)
      }
      return saved ? (JSON.parse(saved) as AuthUser) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))

  const login = (u: AuthUser, authToken: string) => {
    clearPlanDrafts()
    setUser(u)
    setToken(authToken)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(u))
    localStorage.removeItem(LEGACY_USER_STORAGE_KEY)
    localStorage.setItem(TOKEN_KEY, authToken)
  }

  const logout = () => {
    clearPlanDrafts()
    setUser(null)
    setToken(null)
    localStorage.removeItem(USER_STORAGE_KEY)
    localStorage.removeItem(LEGACY_USER_STORAGE_KEY)
    localStorage.removeItem(TOKEN_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
