import { type ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { EmergencyBar } from './EmergencyBar'
import { WhatsAppFab } from './WhatsAppFab'
import { ScrollToTop } from './ScrollToTop'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <ScrollToTop />
      <EmergencyBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFab />
    </div>
  )
}
