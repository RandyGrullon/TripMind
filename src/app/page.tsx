import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900">TripMind</h1>
        <p className="mt-4 text-xl text-gray-600">
          AI-powered travel planning with live GPS guidance
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/(auth)/login"
            className="rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  )
}
