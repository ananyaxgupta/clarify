import { QuestionFeed } from "./components/question-feed"

export default function Home() {
  return (
    <main className="container mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold mb-8">Latest Questions</h1>
      <QuestionFeed />
    </main>
  )
}

