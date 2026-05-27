import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

const nextConfig: NextConfig = {
  serverExternalPackages: [
    '@ffmpeg-installer/ffmpeg',
    'fluent-ffmpeg',
    'yt-dlp-exec',
  ],
}

const sentryOrg = process.env['SENTRY_ORG']
const sentryProject = process.env['SENTRY_PROJECT']

export default withSentryConfig(nextConfig, {
  ...(sentryOrg !== undefined ? { org: sentryOrg } : {}),
  ...(sentryProject !== undefined ? { project: sentryProject } : {}),
  silent: true,
  telemetry: false,
  sourcemaps: { disable: !process.env['SENTRY_DSN'] },
})
