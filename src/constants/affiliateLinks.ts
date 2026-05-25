export const AFFILIATE_LINKS = {
  booking: 'https://www.booking.com/affiliate/',
  viator: 'https://www.viator.com/affiliate/',
  amadeus: 'https://developers.amadeus.com/',
} as const

export type AffiliateProvider = keyof typeof AFFILIATE_LINKS
