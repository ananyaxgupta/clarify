"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'

interface Question {
  id: string
  title: string
  content: string
  created_at: string
}

export function QuestionList() {
  const [questions, setQuestions] = useState<Question[]>([])

  useEffect(() => {
    fetchQuestions()
  }, [])

  async function fetchQuestions() {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching questions:', error)
    } else {
      setQuestions(data)
    }
  }

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <Card key={question.id}>
          <CardHeader>
            <CardTitle>{question.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{question.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              Posted on: {new Date(question.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}