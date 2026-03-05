import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Admin } from '@/types'

interface AuthContextType {
  admin: Admin | null
  token: string | null
  login: (token: string, admin: Admin) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token')
    const savedAdmin = localStorage.getItem('admin_info')
    if (savedToken && savedAdmin) {
      setToken(savedToken)
      setAdmin(JSON.parse(savedAdmin))
    }
  }, [])

  const login = (newToken: string, newAdmin: Admin) => {
    localStorage.setItem('admin_token', newToken)
    localStorage.setItem('admin_info', JSON.stringify(newAdmin))
    setToken(newToken)
    setAdmin(newAdmin)
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_info')
    setToken(null)
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
