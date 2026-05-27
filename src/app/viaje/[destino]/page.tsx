import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { DESTINOS, getDestino } from '@/lib/seo/destinos'
import { buildTravelActionSchema } from '@/lib/seo/schemas'

type Props = { params: Promise<{ destino: string }> }

export async function generateStaticParams() {
  return DESTINOS.map((d) => ({ destino: d.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { destino: slug } = await params
  const destino = getDestino(slug)
  if (!destino) return {}

  const base = process.env['NEXT_PUBLIC_BASE_URL'] ?? 'https://tripmind.app'
  const url = `${base}/viaje/${slug}`

  return {
    title: `Itinerario ${destino.diasRecomendados} días en ${destino.nombre} — TripMind`,
    description: destino.descripcion,
    keywords: destino.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: `Viaje a ${destino.nombre}: itinerario con IA`,
      description: destino.descripcion,
      url,
      type: 'website',
      images: [
        {
          url: destino.imagen,
          width: 1200,
          height: 630,
          alt: destino.nombre,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Viaje a ${destino.nombre} — TripMind`,
      description: destino.descripcion,
      images: [destino.imagen],
    },
  }
}

const SAMPLE_ACTIVITIES = [
  { emoji: '🗺️', label: 'Planificación IA del itinerario completo' },
  { emoji: '📍', label: 'GPS en vivo con alertas de proximidad' },
  { emoji: '🏨', label: 'Recomendaciones de hoteles optimizadas' },
  { emoji: '🍽️', label: 'Los mejores restaurantes locales' },
  { emoji: '🔔', label: 'Alertas inteligentes de demoras y cambios' },
  { emoji: '👥', label: 'Sala grupal para viajes en equipo' },
]

export default async function DestinoPage({ params }: Props) {
  const { destino: slug } = await params
  const destino = getDestino(slug)
  if (!destino) notFound()

  const schema = buildTravelActionSchema(destino)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* Hero */}
        <div className="mb-10 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-indigo-600">
            {destino.pais}
          </p>
          <h1 className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Viaje a {destino.nombre}
          </h1>
          <p className="mt-4 text-lg text-gray-600">{destino.descripcion}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {destino.keywords.map((kw) => (
              <span
                key={kw}
                className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Quick facts */}
        <div className="mb-10 grid grid-cols-2 gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-6 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Días recomendados
            </p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {destino.diasRecomendados}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Mejor época
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {destino.mejorEpoca}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              País
            </p>
            <p className="mt-1 text-sm font-medium text-gray-900">
              {destino.pais}
            </p>
          </div>
        </div>

        {/* What TripMind includes */}
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Tu itinerario a {destino.nombreCorto} incluye
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {SAMPLE_ACTIVITIES.map(({ emoji, label }) => (
              <li
                key={label}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <span className="text-2xl">{emoji}</span>
                <span className="text-sm font-medium text-gray-700">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <div className="rounded-2xl bg-indigo-600 px-8 py-10 text-center text-white">
          <h2 className="text-2xl font-bold">
            Planifica tu viaje a {destino.nombreCorto} ahora
          </h2>
          <p className="mt-2 text-indigo-200">
            Gratis en minutos. IA que conoce {destino.nombreCorto} de punta a
            punta.
          </p>
          <Link
            href={`/?destino=${destino.slug}`}
            className="mt-6 inline-block rounded-xl bg-white px-8 py-3 text-sm font-bold text-indigo-700 hover:bg-indigo-50"
          >
            Crear mi itinerario gratis
          </Link>
        </div>

        {/* Other destinations */}
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Otros destinos populares
          </h2>
          <div className="flex flex-wrap gap-2">
            {DESTINOS.filter((d) => d.slug !== slug)
              .slice(0, 12)
              .map((d) => (
                <Link
                  key={d.slug}
                  href={`/viaje/${d.slug}`}
                  className="rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-700 hover:border-indigo-400 hover:text-indigo-700"
                >
                  {d.nombreCorto}
                </Link>
              ))}
          </div>
        </section>
      </main>
    </>
  )
}
