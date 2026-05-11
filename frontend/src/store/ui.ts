import { create } from 'zustand'

type UIState = {
  emergencyModalOpen: boolean
  mobileMenuOpen: boolean
  setEmergencyModal: (open: boolean) => void
  setMobileMenu: (open: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  emergencyModalOpen: false,
  mobileMenuOpen: false,
  setEmergencyModal: (open) => set({ emergencyModalOpen: open }),
  setMobileMenu: (open) => set({ mobileMenuOpen: open }),
}))
