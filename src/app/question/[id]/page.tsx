"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import AnswerForm from "@/app/components/AnswerForm"
import AnswerList from "@/app/components/AnswerList"

interface Question {
  id: string
  title: string
  description: string
  created_at: string
  username: string | null
  is_anonymous: boolean
}

export default function QuestionDetail() {
  const { id } = useParams()
  const [question, setQuestion] = useState<Question | null>(null)

  const fetchQuestion = useCallback(async () => {
    const { data, error } = await supabase
      .from("questions")
      .select(`
        *,
        users (username)
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching question:", error)
    } else {
      setQuestion(data as Question)
    }
  }, [id])

  useEffect(() => {
    fetchQuestion()
  }, [fetchQuestion])

  if (!question) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold mb-4">{question.title}</h1>
      <p className="text-gray-600 mb-4">{question.description}</p>
      <div className="text-sm text-gray-500 mb-8">
        Asked by {question.is_anonymous ? "Anonymous" : question.username} on{" "}
        {new Date(question.created_at).toLocaleDateString()}
      </div>
      <AnswerForm questionId={question.id} />
      <AnswerList questionId={question.id} />
    </div>
  )
}

