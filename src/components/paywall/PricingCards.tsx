'use client'

import { useState } from 'react'
import { PLANS } from '@/constants/pricing'
import { FEATURES } from '@/constants/features'
import { track } from '@/lib/analytics/events'

const FREE_FEATURES = Object.entries(FEATURES)
  .filter(([, v]) => v === true)
  .map(([k]) => k)

const PRO_FEATURES = Object.entries(FEATURES)
  .filter(([, v]) => v === 'pro')
  .map(([k]) => k)

const GROUP_FEATURES = Object.entries(FEATURES)
  .filter(([, v]) => v === 'grupo')
  .map(([k]) => k)

const FEATURE_LABELS: Record<string, string> = {
  planificacion: 'Planificación IA',
  mapa_basico: 'Mapa interactivo',
  gps_en_vivo: 'GPS en vivo',
  geofencing_basico: 'Alertas de proximidad',
  sala_grupal: 'Sala grupal',
  alerta_nivel_1: 'Alertas nivel 1–2',
  alerta_nivel_2: 'Alertas de demora',
  tiktok_3_por_mes: 'Análisis TikTok (3/mes)',
  reservas_con_afiliado: 'Reservas con afiliado',
  alertas_ia_completas: 'Análisis IA de alertas',
  reoptimizacion_en_vivo: 'Reoptimización en vivo',
  modo_offline: 'Modo sin conexión',
  tiktok_ilimitado: 'TikTok ilimitado',
  pdf_export: 'Exportar PDF',
  widget_pantalla_inicio: 'Widget pantalla inicio',
  alertas_bajada_precio: 'Alertas baja de precio',
  recuperacion_actividades: 'Recuperar actividades',
  historial_viajes: 'Historial de viajes',
  split_gastos: 'Dividir gastos',
  chat_integrado: 'Chat en grupo',
  ubicacion_grupo_vivo: 'Ubicación en tiempo real',
  alertas_sincronizadas: 'Alertas sincronizadas',
  hasta_15_personas: 'Hasta 15 personas',
}

export function PricingCards() {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleCheckout(planId: keyof typeof PLANS) {
    setLoading(planId)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      })
      const { url, error } = (await res.json()) as {
        url: string | undefined
        error: string | undefined
      }
      if (error || !url) {
        setLoading(null)
        return
      }
      track('pro_paywall_shown', { plan: planId })
      window.location.href = url
    } catch {
      setLoading(null)
    }
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* Free */}
      <div className="rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold">Gratis</h3>
        <p className="mt-1 text-3xl font-bold">$0</p>
        <p className="text-sm text-gray-500">para siempre</p>
        <ul className="mt-4 space-y-2 text-sm">
          {FREE_FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              {FEATURE_LABELS[f] ?? f}
            </li>
          ))}
        </ul>
      </div>

      {/* Pro mensual */}
      <div className="rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold">{PLANS.pro_mensual.nombre}</h3>
        <p className="mt-1 text-3xl font-bold">${PLANS.pro_mensual.precio}</p>
        <p className="text-sm text-gray-500">por mes</p>
        <ul className="mt-4 space-y-2 text-sm">
          {[...FREE_FEATURES, ...PRO_FEATURES].map((f) => (
            <li key={f} className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              {FEATURE_LABELS[f] ?? f}
            </li>
          ))}
        </ul>
        <button
          onClick={() => void handleCheckout('pro_mensual')}
          disabled={loading === 'pro_mensual'}
          className="mt-6 w-full rounded-xl bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading === 'pro_mensual' ? 'Cargando…' : 'Elegir mensual'}
        </button>
      </div>

      {/* Pro anual */}
      <div className="relative rounded-2xl border-2 border-indigo-600 p-6">
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-xs font-bold text-white">
          MÁS POPULAR
        </span>
        <h3 className="text-lg font-semibold">{PLANS.pro_anual.nombre}</h3>
        <p className="mt-1 text-3xl font-bold">${PLANS.pro_anual.precio}</p>
        <p className="text-sm text-gray-500">por año · ahorra 40%</p>
        <ul className="mt-4 space-y-2 text-sm">
          {[...FREE_FEATURES, ...PRO_FEATURES].map((f) => (
            <li key={f} className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              {FEATURE_LABELS[f] ?? f}
            </li>
          ))}
        </ul>
        <button
          onClick={() => void handleCheckout('pro_anual')}
          disabled={loading === 'pro_anual'}
          className="mt-6 w-full rounded-xl bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading === 'pro_anual' ? 'Cargando…' : 'Elegir anual'}
        </button>
      </div>

      {/* Pro por viaje */}
      <div className="rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold">{PLANS.pro_por_viaje.nombre}</h3>
        <p className="mt-1 text-3xl font-bold">${PLANS.pro_por_viaje.precio}</p>
        <p className="text-sm text-gray-500">pago único por viaje</p>
        <ul className="mt-4 space-y-2 text-sm">
          {[...FREE_FEATURES, ...PRO_FEATURES].map((f) => (
            <li key={f} className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              {FEATURE_LABELS[f] ?? f}
            </li>
          ))}
        </ul>
        <button
          onClick={() => void handleCheckout('pro_por_viaje')}
          disabled={loading === 'pro_por_viaje'}
          className="mt-6 w-full rounded-xl bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading === 'pro_por_viaje' ? 'Cargando…' : 'Pagar por viaje'}
        </button>
      </div>

      {/* Grupo — full width */}
      <div className="col-span-full rounded-2xl border border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 sm:col-span-2 lg:col-span-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold">{PLANS.pro_grupo.nombre}</h3>
            <p className="text-3xl font-bold">
              ${PLANS.pro_grupo.precio}{' '}
              <span className="text-base font-normal text-gray-500">/mes</span>
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Todo lo de Pro más:{' '}
              {GROUP_FEATURES.map((f) => FEATURE_LABELS[f] ?? f).join(' · ')}
            </p>
          </div>
          <button
            onClick={() => void handleCheckout('pro_grupo')}
            disabled={loading === 'pro_grupo'}
            className="shrink-0 rounded-xl bg-purple-600 px-8 py-3 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {loading === 'pro_grupo' ? 'Cargando…' : 'Elegir Grupo'}
          </button>
        </div>
      </div>
    </div>
  )
}
