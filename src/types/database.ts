import type { Trip } from './trip'
import type { Activity } from './activity'

export interface TripRow {
  id: string
  user_id: string
  data: Trip
  paquete: 'basico' | 'confort' | 'premium'
  grupo_link: string | null
  estado: 'planificando' | 'en_viaje' | 'completado'
  actividades_pendientes: Activity[]
  created_at: string
  updated_at: string
}

export interface TripMemberRow {
  id: string
  trip_id: string
  user_id: string
  nombre: string
  avatar_url: string | null
  lat_actual: number | null
  lng_actual: number | null
  ultima_ubicacion: string | null
  joined_at: string
}

export interface ActivityVoteRow {
  id: string
  trip_id: string
  activity_id: string
  user_id: string
  voto: boolean
  created_at: string
}

export interface GroupMessageRow {
  id: string
  trip_id: string
  user_id: string
  nombre_usuario: string
  mensaje: string
  tipo: 'mensaje' | 'sistema' | 'alerta'
  created_at: string
}

export interface GroupExpenseRow {
  id: string
  trip_id: string
  pagado_por: string
  nombre_pagador: string
  concepto: string
  monto: number
  entre_todos: boolean
  created_at: string
}
