"use client"

import { useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import RatingSystem from "./RatingSystem"

interface Answer {
  id: string
  content: string
  created_at: string
  username: string | null
  is_anonymous: boolean
  average_rating: number
}

interface AnswerListProps {
  questionId: string
}

export default function AnswerList({ questionId }: AnswerListProps) {
  const [answers, setAnswers] = useState<Answer[]>([])

  const fetchAnswers = useCallback(async () => {
    const { data, error } = await supabase
      .from("answers")
      .select(`
        *,
        users (username),
        ratings (rating)
      `)
      .eq("question_id", questionId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching answers:", error)
    } else {
      const processedAnswers = data.map((answer) => ({
        ...answer,
        username: answer.users?.username,
        average_rating:
          answer.ratings.length > 0
            ? answer.ratings.reduce((sum: number, rating: any) => sum + rating.rating, 0) / answer.ratings.length
            : 0,
      }))
      setAnswers(processedAnswers)
    }
  }, [questionId])

  useEffect(() => {
    fetchAnswers()
  }, [fetchAnswers])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Answers</h2>
      {answers.map((answer) => (
        <div key={answer.id} className="mb-6 p-4 border rounded">
          <p className="mb-2">{answer.content}</p>
          <div className="text-sm text-gray-500">
            Answered by {answer.is_anonymous ? "Anonymous" : answer.username} on{" "}
            {new Date(answer.created_at).toLocaleDateString()}
          </div>
          <RatingSystem answerId={answer.id} initialRating={answer.average_rating} />
        </div>
      ))}
    </div>
  )
}

