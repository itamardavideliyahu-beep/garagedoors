import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export function NotFoundPage() {
  return (
    <section className="grid min-h-[60vh] place-items-center bg-white">
      <div className="container-x text-center">
        <p className="font-display text-7xl font-extrabold text-brand-500">404</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-ink-900">
          We couldn't find that page.
        </h1>
        <p className="mt-3 text-ink-600">
          But we can find your house in under 60 minutes - try our home page.
        </p>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          <Home className="h-4 w-4" />
          Back to home
        </Link>
      </div>
    </section>
  )
}
