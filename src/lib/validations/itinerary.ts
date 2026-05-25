import { z } from 'zod'

export const activitySchema = z.object({
  id: z.string(),
  nombre: z.string().min(1),
  descripcion: z.string(),
  horaInicio: z.string(),
  horaFin: z.string(),
  duracionMinutos: z.number().nonnegative(),
  tipo: z.enum([
    'museo',
    'restaurante',
    'templo',
    'parque',
    'barrio',
    'playa',
    'actividad',
    'traslado',
  ]),
  direccion: z.string(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  radioGeofencingMetros: z.number().positive(),
  precioEstimado: z.number().nonnegative(),
  reservaRequerida: z.boolean(),
  mejorHoraVisita: z.string(),
  consejos: z.array(z.string()),
  linkAfiliado: z.string().optional(),
  tiempoHastaSiguiente: z.number().nonnegative(),
})

export const daySchema = z.object({
  numero: z.number().int().positive(),
  titulo: z.string().min(1),
  descripcion: z.string(),
  ciudad: z.string().min(1),
  actividades: z.array(activitySchema),
  presupuestoDia: z.number().nonnegative(),
  colorMapa: z.string(),
})

export type ValidatedActivity = z.infer<typeof activitySchema>
export type ValidatedDay = z.infer<typeof daySchema>
