"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"

import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth"

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore"

export default function SignupPage() {

  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")

  // 🔵 GOOGLE SIGNUP
  const handleGoogle = async () => {
    try {

      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      const user = result.user
      const userRef = doc(db, "users", user.uid)

      // 🔥 Safe write (create OR update)
      await setDoc(
        userRef,
        {
          uid: user.uid,
          name: user.displayName || "",
          email: user.email || "",
          photoURL: user.photoURL || "",
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        },
        { merge: true }
      )

      router.push("/dashboard")

    } catch (err: any) {
      setError(err.message)
    }
  }


  // 🟣 EMAIL SIGNUP
  const handleSignup = async (e: any) => {

    e.preventDefault()

    try {

      if (password !== confirm)
        return setError("Passwords do not match")

      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      const user = result.user

      // save display name in Firebase Auth
      await updateProfile(user, {
        displayName: name
      })

      const userRef = doc(db, "users", user.uid)

      // 🔥 Safe write to Firestore
      await setDoc(
        userRef,
        {
          uid: user.uid,
          name: name,
          email: email,
          photoURL: "",
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        },
        { merge: true }
      )

      router.push("/dashboard")

    } catch (err: any) {
      setError(err.message)
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900">

      <div className="w-full max-w-md bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

        <h1 className="text-3xl font-bold text-center text-purple-400 mb-4">
          Create Account
        </h1>

        {error && (
          <p className="text-red-400 text-sm mb-3">{error}</p>
        )}

        <button
          onClick={handleGoogle}
          className="w-full mb-4 py-3 bg-purple-600 rounded text-white"
        >
          Continue with Google
        </button>

        <form onSubmit={handleSignup} className="space-y-3">

          <input
            placeholder="Full Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="w-full px-4 py-2 rounded bg-black/40 text-white"
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded bg-black/40 text-white"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-black/40 text-white"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e)=>setConfirm(e.target.value)}
            className="w-full px-4 py-2 rounded bg-black/40 text-white"
          />

          <button className="w-full py-2 bg-purple-600 rounded text-white">
            Signup
          </button>

        </form>

      </div>
    </div>
  )
}