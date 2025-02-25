"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

export default function Header() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            Q&A Platform
          </Link>
          <div className="flex items-center">
            <Link href="/" className="mx-2 text-gray-600 hover:text-gray-900">
              Home
            </Link>
            {user ? (
              <>
                <Link href="/ask" className="mx-2 text-gray-600 hover:text-gray-900">
                  Ask Question
                </Link>
                <Link href="/profile" className="mx-2 text-gray-600 hover:text-gray-900">
                  Profile
                </Link>
                <button onClick={handleSignOut} className="mx-2 text-gray-600 hover:text-gray-900">
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/auth" className="mx-2 text-gray-600 hover:text-gray-900">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

