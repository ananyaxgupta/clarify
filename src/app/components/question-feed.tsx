/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { MessageSquare, ThumbsUp } from "lucide-react"

interface Question {
  id: string
  title: string
  description: string
  created_at: string
  user: {
    username: string
  } | null
  is_anonymous: boolean
  _count: {
    answers: number
  }
}

export function QuestionFeed({ type = "latest" }: { type?: "latest" | "trending" | "unanswered" }) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuestions()
  }, [])

  async function fetchQuestions() {
    setLoading(true)
    try {
      let query = supabase.from("questions").select(`
          *,
          user:users(username),
          _count { answers }
        `)

      if (type === "latest") {
        query = query.order("created_at", { ascending: false })
      } else if (type === "unanswered") {
        query = query.eq("_count.answers", 0)
      }

      const { data, error } = await query.limit(10)

      if (error) {
        console.error("Error fetching questions:", error)
      } else {
        setQuestions(data as unknown as Question[])
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading questions...</div>
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No questions found.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {questions.map((question) => (
        <Card key={question.id}>
          <CardHeader>
            <CardTitle>
              <Link href={`/question/${question.id}`} className="hover:text-blue-600">
                {question.title}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 line-clamp-2">{question.description}</p>
          </CardContent>
          <CardFooter className="text-sm text-gray-500 flex items-center gap-4">
            <div>
              Asked by {question.is_anonymous ? "Anonymous" : question.user?.username} on{" "}
              {new Date(question.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              {question._count.answers} answers
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />0 votes
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

