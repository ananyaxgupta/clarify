import { QuestionForm } from './components/QuestionForm'
import { QuestionList } from './components/QuestionList'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Q&A Platform</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Ask a Question</h2>
        <QuestionForm />
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Questions</h2>
        <QuestionList />
      </div>
    </div>
  )
}
