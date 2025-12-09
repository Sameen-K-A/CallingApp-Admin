import React, { createContext, useContext, useState, type ReactNode } from 'react'
import { setEncryptedItem, getEncryptedItem, removeItem } from '@/lib/secureStorage'
import { ROUTE } from '@/routes/router'
import { useNavigate } from 'react-router-dom'

const AUTH_FLAG_KEY = 'is_admin_auth'

interface AuthContextType {
  isAuthenticated: boolean
  login: () => void;
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return getEncryptedItem<boolean>(AUTH_FLAG_KEY) || false
  })
  const navigate = useNavigate()

  const login = () => {
    setEncryptedItem(AUTH_FLAG_KEY, true)
    setIsAuthenticated(true)
  }

  const logout = () => {
    removeItem(AUTH_FLAG_KEY)
    setIsAuthenticated(false)
    navigate(ROUTE.LOGIN, { replace: true })
  }

  const value = { isAuthenticated, login, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
};