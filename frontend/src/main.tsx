import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './lib/i18n'

// Load the correct brand-color theme before the main stylesheet so the CSS
// variables are defined when Tailwind utility classes are applied.
// Vite statically analyses these branches and only bundles the chosen file.
const theme = import.meta.env.VITE_THEME || 'orange'
if (theme === 'blue')   await import('./styles/themes/theme-blue.css')
else if (theme === 'green') await import('./styles/themes/theme-green.css')
else if (theme === 'teal')  await import('./styles/themes/theme-teal.css')
else                         await import('./styles/themes/theme-orange.css')

// Main stylesheet loads after the theme so component classes inherit the vars.
await import('./styles/index.css')

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
