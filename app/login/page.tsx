"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth"

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore"

export default function LoginPage() {

  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  // GOOGLE LOGIN
  const handleGoogle = async () => {
    try {

      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      const user = result.user

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          name: user.displayName || "",
          email: user.email || "",
          photoURL: user.photoURL || "",
          lastLogin: serverTimestamp(),
          createdAt: serverTimestamp(),
        },
        { merge: true }
      )

      router.replace("/dashboard")

    } catch (err: any) {
      setError(err.message)
    }
  }

  // EMAIL LOGIN
  const handleLogin = async (e: any) => {
    e.preventDefault()

    try {

      const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      const user = result.user

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          name: user.displayName || "",
          email: user.email || "",
          lastLogin: serverTimestamp(),
        },
        { merge: true }
      )

      router.replace("/dashboard")

    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">

      <div className="bg-gray-900 p-8 rounded-xl w-96">

        <h1 className="text-2xl mb-4 text-white text-center">
          Login
        </h1>

        {error && (
          <p className="text-red-500 mb-3">{error}</p>
        )}

        <button
          onClick={handleGoogle}
          className="w-full bg-purple-600 py-2 rounded mb-4"
        >
          Continue with Google
        </button>

        <form onSubmit={handleLogin} className="space-y-3">

          <input
            className="w-full px-3 py-2 rounded bg-gray-800 text-white"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full px-3 py-2 rounded bg-gray-800 text-white"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <button
            className="w-full bg-purple-600 py-2 rounded"
          >
            Login
          </button>

        </form>

      </div>
    </div>
  )
}