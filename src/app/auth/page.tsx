"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function Auth() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
    else router.push("/")
    setLoading(false)
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else router.push("/")
    setLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold mb-6">Welcome to Q&A Platform</h1>
        <div className="flex flex-col w-full max-w-md">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 mb-4 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 mb-4 border rounded"
          />
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="px-4 py-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Sign In
          </button>
          <button
            onClick={handleSignUp}
            disabled={loading}
            className="px-4 py-2 mb-4 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Sign Up
          </button>
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="px-4 py-2 mb-4 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sign In with Google
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </main>
    </div>
  )
}

