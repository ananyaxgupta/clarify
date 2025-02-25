"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

interface AnswerFormProps {
  questionId: string
}

export default function AnswerForm({ questionId }: AnswerFormProps) {
  const [content, setContent] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const { data: user } = await supabase.auth.getUser()
    if (!user.user) {
      setError("You must be logged in to answer a question")
      return
    }

    const { error } = await supabase.from("answers").insert({
      question_id: questionId,
      user_id: user.user.id,
      content,
      is_anonymous: isAnonymous,
    })

    if (error) {
      setError(error.message)
    } else {
      setContent("")
      setIsAnonymous(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Your Answer</h2>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={4}
        className="w-full p-2 border rounded"
        placeholder="Write your answer here..."
      ></textarea>
      <div className="flex items-center mt-2">
        <input
          type="checkbox"
          id="isAnonymous"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="isAnonymous">Answer anonymously</label>
      </div>
      <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Submit Answer
      </button>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </form>
  )
}

