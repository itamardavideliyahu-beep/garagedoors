import axios from 'axios'
import { config } from './config'

export const api = axios.create({
  baseURL: config.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`
  }
  return cfg
})

export type Service = {
  id: number
  slug: string
  name_en: string
  name_es: string
  description_en: string
  description_es: string
  category: 'repair' | 'installation' | 'maintenance' | 'emergency' | 'commercial'
  icon: string
  starts_at_price: number
  duration_min: number
  is_emergency: boolean
  is_featured: boolean
}

export type ServiceArea = {
  id: number
  slug: string
  name: string
  zip_codes: string[]
  geojson: {
    type: string
    coordinates: number[][][]
  }
  response_time_min: number
}

export type Review = {
  id: number
  customer_name: string
  customer_location: string | null
  rating: number
  title: string | null
  comment: string
  service_type: string | null
  is_featured: boolean
  created_at: string
}

export type FAQItem = {
  question_en: string
  question_es: string
  answer_en: string
  answer_es: string
}

export type GalleryItem = {
  id: number
  title_en: string
  title_es: string
  before_image: string
  after_image: string
  service_type: string
}

export type Brand = {
  name: string
  logo_url: string
}

export type BusinessInfo = {
  name: string
  phone: string
  emergency_phone: string
  email: string
  license: string
  whatsapp_number: string
  hours: Record<string, string>
  badges: string[]
  rating: number
  review_count: number
  years_experience: number
  service_promise_min: number
}

export type Stats = {
  happy_customers: number
  years_experience: number
  technicians: number
  avg_response_min: number
  rating: number
}

export type QuoteRequest = {
  door_type: 'single' | 'double' | 'commercial'
  door_material: 'steel' | 'aluminum' | 'wood' | 'fiberglass' | 'vinyl' | 'unknown'
  issue_type: string
  zip_code?: string
  is_emergency?: boolean
  locale?: 'en' | 'es'
}

export type QuoteResponse = {
  estimated_low: number
  estimated_high: number
  currency: string
  typical_duration_min: number
  issue_label_en: string
  issue_label_es: string
  notes_en: string
  notes_es: string
  in_service_area: boolean | null
  response_time_min: number | null
}

export type LeadSubmitRequest = {
  quote: QuoteRequest
  full_name: string
  phone: string
  email?: string
  address?: string
  message?: string
  urgency?: 'emergency' | 'same_day' | 'this_week' | 'flexible'
  consent: boolean
}

export const apiClient = {
  listServices: () => api.get<Service[]>('/services').then((r) => r.data),
  listServiceAreas: () => api.get<ServiceArea[]>('/services/areas').then((r) => r.data),
  checkZip: (zip_code: string) =>
    api.post<{ zip_code: string; in_service_area: boolean; area_name?: string; response_time_min?: number }>(
      '/services/check-zip',
      { zip_code },
    ).then((r) => r.data),

  listReviews: (limit = 12, featured_only = false) =>
    api.get<Review[]>('/reviews', { params: { limit, featured_only } }).then((r) => r.data),

  estimateQuote: (payload: QuoteRequest) =>
    api.post<QuoteResponse>('/leads/quote', payload).then((r) => r.data),

  submitLead: (payload: LeadSubmitRequest) =>
    api.post<{ id: number }>('/leads/submit', payload).then((r) => r.data),

  createContactLead: (payload: {
    full_name: string
    phone: string
    email?: string
    message?: string
    zip_code?: string
    locale?: 'en' | 'es'
  }) => api.post('/leads', { ...payload, source: 'web_contact' }).then((r) => r.data),

  listFAQs: () => api.get<FAQItem[]>('/public/faqs').then((r) => r.data),
  listGallery: () => api.get<GalleryItem[]>('/public/gallery').then((r) => r.data),
  listBrands: () => api.get<Brand[]>('/public/brands').then((r) => r.data),
  stats: () => api.get<Stats>('/public/stats').then((r) => r.data),
  businessInfo: () => api.get<BusinessInfo>('/business/info').then((r) => r.data),
}
