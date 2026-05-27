import type { Instrumentation } from 'next'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const Sentry = await import('@sentry/nextjs')
    Sentry.init({
      dsn: process.env['SENTRY_DSN'],
      environment: process.env['NODE_ENV'],
      tracesSampleRate: process.env['NODE_ENV'] === 'production' ? 0.1 : 1.0,
      enabled: Boolean(process.env['SENTRY_DSN']),
    })
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    const Sentry = await import('@sentry/nextjs')
    Sentry.init({
      dsn: process.env['SENTRY_DSN'],
      environment: process.env['NODE_ENV'],
      tracesSampleRate: 0.1,
      enabled: Boolean(process.env['SENTRY_DSN']),
    })
  }
}

export const onRequestError: Instrumentation.onRequestError = async (
  err,
  request,
  context
) => {
  const Sentry = await import('@sentry/nextjs')
  Sentry.captureException(err, {
    extra: {
      path: request.path,
      method: request.method,
      routeType: context.routeType,
    },
  })
}
