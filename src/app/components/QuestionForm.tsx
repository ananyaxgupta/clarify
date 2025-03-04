"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'

export function QuestionForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { data, error } = await supabase
      .from('questions')
      .insert([
        { title, content },
      ])

    if (error) {
      console.error('Error inserting question:', error)
    } else {
      console.log('Question added successfully:', data)
      setTitle('')
      setContent('')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Question title"
        required
      />
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Question content"
        required
      />
      <Button type="submit">Submit Question</Button>
    </form>
  )
}