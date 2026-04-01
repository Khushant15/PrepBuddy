"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

import { auth } from "@/lib/firebase"
import { onAuthStateChanged, User } from "firebase/auth"

type AuthContextType = {
  user: User | null
  loading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
})

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const logout = async () => {
    if (!auth) return
    const { signOut } = await import("firebase/auth")
    await signOut(auth)
  }

  useEffect(() => {
    if (!auth) {
        setLoading(false)
        return
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })

    return () => unsubscribe()

  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)