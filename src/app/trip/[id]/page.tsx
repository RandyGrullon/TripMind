interface TripPageProps {
  params: Promise<{ id: string }>
}

export default async function TripPage({ params }: TripPageProps) {
  const { id } = await params

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Trip {id}</h1>
    </main>
  )
}
