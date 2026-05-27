export const FEATURES = {
  // GRATIS — siempre disponibles
  planificacion: true,
  mapa_basico: true,
  gps_en_vivo: true,
  geofencing_basico: true,
  sala_grupal: true,
  alerta_nivel_1: true,
  alerta_nivel_2: true,
  tiktok_3_por_mes: true,
  reservas_con_afiliado: true,

  // PRO VIAJERO
  alertas_ia_completas: 'pro',
  reoptimizacion_en_vivo: 'pro',
  modo_offline: 'pro',
  tiktok_ilimitado: 'pro',
  pdf_export: 'pro',
  widget_pantalla_inicio: 'pro',
  alertas_bajada_precio: 'pro',
  recuperacion_actividades: 'pro',
  historial_viajes: 'pro',

  // PRO GRUPO
  split_gastos: 'grupo',
  chat_integrado: 'grupo',
  ubicacion_grupo_vivo: 'grupo',
  alertas_sincronizadas: 'grupo',
  hasta_15_personas: 'grupo',
} as const satisfies Record<string, true | 'pro' | 'grupo'>

export type FeatureKey = keyof typeof FEATURES
export type FeatureGate = (typeof FEATURES)[FeatureKey]
