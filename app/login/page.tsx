"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { auth, db } from "@/lib/firebase"

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth"

import {
  doc,
  setDoc,
  serverTimestamp
} from "firebase/firestore"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

import { AnimatedGradient } from "@/components/animated-gradient"
import { ParticlesBackground } from "@/components/particles-background"

export default function LoginPage(){

  const router = useRouter()

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [error,setError] = useState("")

  // EMAIL LOGIN
  const handleLogin = async(e:any)=>{

    e.preventDefault()

    try{

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      router.push("/dashboard")

    }catch(err:any){
      setError(err.message)
    }

  }

  // GOOGLE LOGIN
  const handleGoogleLogin = async()=>{

    try{

      const provider = new GoogleAuthProvider()

      const result = await signInWithPopup(auth,provider)

      const user = result.user

      const userRef = doc(db,"users",user.uid)

      // Create/update user in Firestore
      await setDoc(userRef,{
        uid:user.uid,
        name:user.displayName || "",
        email:user.email || "",
        photoURL:user.photoURL || "",
        lastLogin:serverTimestamp()
      },{merge:true})

      router.push("/dashboard")

    }catch(err:any){
      setError(err.message)
    }

  }

  return(

    <main className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">

      <AnimatedGradient/>
      <ParticlesBackground/>

      <div className="relative z-10 w-full max-w-md px-4">

        <Card className="p-8 border-primary/20 bg-card/40 backdrop-blur-sm shadow-lg shadow-primary/20">

          <h1 className="text-3xl font-bold text-center mb-6">
            Welcome Back
          </h1>

          {error && (
            <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
          )}

          {/* GOOGLE LOGIN */}
          <Button
            onClick={handleGoogleLogin}
            className="w-full mb-4 bg-gradient-to-r from-primary to-accent"
          >
            Continue with Google
          </Button>

          <div className="text-center text-sm text-foreground/50 mb-4">
            OR
          </div>

          {/* EMAIL LOGIN */}
          <form onSubmit={handleLogin} className="space-y-4">

            <input
              required
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-primary/30 bg-background/50"
            />

            <input
              required
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-primary/30 bg-background/50"
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-accent"
            >
              Login
            </Button>

          </form>

          <p className="text-center text-sm text-foreground/70 mt-6">
            Don't have an account?{" "}
            <span
              className="text-primary cursor-pointer"
              onClick={()=>router.push("/signup")}
            >
              Sign up
            </span>
          </p>

        </Card>

      </div>

    </main>

  )
}