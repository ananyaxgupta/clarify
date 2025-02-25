import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Q&A Platform
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/ask">
              <Button>Ask Question</Button>
            </Link>
            <Link href="/auth">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

