"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Star } from "lucide-react"

interface RatingSystemProps {
  answerId: string
  initialRating: number
}

export default function RatingSystem({ answerId, initialRating }: RatingSystemProps) {
  const [rating, setRating] = useState(initialRating)
  const [userRating, setUserRating] = useState(0)

  useEffect(() => {
    fetchUserRating()
  }, [])

  async function fetchUserRating() {
    const { data: user } = await supabase.auth.getUser()
    if (user.user) {
      const { data, error } = await supabase
        .from("ratings")
        .select("rating")
        .eq("answer_id", answerId)
        .eq("user_id", user.user.id)
        .single()

      if (error) {
        console.error("Error fetching user rating:", error)
      } else if (data) {
        setUserRating(data.rating)
      }
    }
  }

  async function handleRating(newRating: number) {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) {
      alert("You must be logged in to rate answers")
      return
    }

    const { data, error } = await supabase
      .from("ratings")
      .upsert({ answer_id: answerId, user_id: user.user.id, rating: newRating }, { onConflict: "answer_id,user_id" })

    if (error) {
      console.error("Error updating rating:", error)
    } else {
      setUserRating(newRating)
      // Recalculate average rating
      const { data: newAvgRating, error: avgError } = await supabase
        .from("ratings")
        .select("rating")
        .eq("answer_id", answerId)
        .avg("rating")

      if (avgError) {
        console.error("Error calculating new average rating:", avgError)
      } else {
        setRating(newAvgRating[0].avg)
      }
    }
  }

  return (
    <div className="flex items-center mt-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 cursor-pointer ${star <= userRating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
          onClick={() => handleRating(star)}
        />
      ))}
      <span className="ml-2 text-sm text-gray-600">
        Average: {rating.toFixed(1)} ({userRating > 0 ? "You rated: " + userRating : "Not rated"})
      </span>
    </div>
  )
}

