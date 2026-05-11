export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  businessPhone: import.meta.env.VITE_BUSINESS_PHONE || '+13105551234',
  emergencyPhone: import.meta.env.VITE_EMERGENCY_PHONE || '+13105550911',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '13105551234',
}
