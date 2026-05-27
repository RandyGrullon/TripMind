import { PostHog } from 'posthog-node'

let _posthogServer: PostHog | null = null

export function getPostHogServer(): PostHog {
  if (!_posthogServer) {
    _posthogServer = new PostHog(process.env['NEXT_PUBLIC_POSTHOG_KEY'] ?? '', {
      host:
        process.env['NEXT_PUBLIC_POSTHOG_HOST'] ?? 'https://app.posthog.com',
      flushAt: 20,
      flushInterval: 10000,
    })
  }
  return _posthogServer
}

export function trackServerEvent(
  userId: string,
  event: string,
  properties?: Record<string, unknown>
): void {
  const ph = getPostHogServer()
  if (properties !== undefined) {
    ph.capture({ distinctId: userId, event, properties })
  } else {
    ph.capture({ distinctId: userId, event })
  }
}
