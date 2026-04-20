export interface Doctor {
  id: string
  name: string
  specialty: string
  clinic: string
  rating: number
  /** Years of practice (localized in UI) */
  experience: number
  availability: 'today' | 'tomorrow'
  fee: string
  about?: string
  location?: string
  patients?: string
  /** BCP-47 style codes for i18n labels */
  languages?: string[]
  image?: string
  procedures?: string[]
  telemedicine?: boolean
  followup?: boolean
}

export type SortOption = 'Relevance' | 'Rating' | 'Price: Low'
export type AvailabilityFilter = 'Any time' | 'Today' | 'Tomorrow' | 'This week'
