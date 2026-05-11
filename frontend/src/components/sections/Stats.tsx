import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Users, Clock, Award, Wrench } from 'lucide-react'
import { apiClient } from '@/lib/api'

export function Stats() {
  const { t } = useTranslation()
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => apiClient.stats(),
  })

  const items = [
    {
      icon: Users,
      value: stats ? stats.happy_customers.toLocaleString() + '+' : '12,500+',
      label: t('stats.happyCustomers'),
    },
    {
      icon: Award,
      value: stats ? `${stats.years_experience}` : '15',
      label: t('stats.yearsExperience'),
    },
    {
      icon: Wrench,
      value: stats ? `${stats.technicians}` : '24',
      label: t('stats.technicians'),
    },
    {
      icon: Clock,
      value: stats ? `${stats.avg_response_min}` : '38',
      label: t('stats.avgResponse'),
    },
  ]

  return (
    <section className="bg-gradient-to-r from-brand-600 to-brand-700 py-12 text-white">
      <div className="container-x">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {items.map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center">
              <Icon className="mx-auto h-7 w-7 text-brand-200" />
              <div className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
                {value}
              </div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-brand-100">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
