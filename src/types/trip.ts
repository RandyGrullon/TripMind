import type { Activity } from '@/types/activity'

export interface Day {
  numero: number
  titulo: string
  descripcion: string
  ciudad: string
  actividades: Activity[]
  presupuestoDia: number
  colorMapa: string
}

export interface Trip {
  id: string
  destino: string
  origen: string
  personas: number
  fechaInicio: string
  fechaFin: string
  presupuestoTotal: number
  presupuestoPorPersona: number
  dias: Day[]
  paquete: 'basico' | 'confort' | 'premium'
  resumenViaje: string
  consejos: string[]
  advertencias: string[]
  listaActividades: string[]
  actividadesPendientes: Activity[]
}

export interface TripPackage {
  type: 'budget' | 'standard' | 'premium' | 'luxury'
  label: string
  priceMultiplier: number
}
