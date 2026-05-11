import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { MapContainer, Polygon, Popup, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, MapPin, Search, XCircle, Loader2 } from 'lucide-react'
import { apiClient, type ServiceArea } from '@/lib/api'
import { cn } from '@/lib/utils'

// Inline brand-colored pin to avoid the default broken-image issue with bundlers.
const pinIcon = L.divIcon({
  className: 'gd-pin',
  html: `<div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background:#ff7510;color:#fff;border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,.25);font-weight:700;">LA</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

const LA_CENTER: [number, number] = [34.05, -118.34]

function geojsonToLeaflet(coordinates: number[][][]): [number, number][] {
  // GeoJSON polygons are [lng, lat] - Leaflet wants [lat, lng].
  return coordinates[0].map(([lng, lat]) => [lat, lng])
}

export function ServiceAreaMap() {
  const { t } = useTranslation()
  const { data: areas = [], isLoading } = useQuery({
    queryKey: ['service-areas'],
    queryFn: () => apiClient.listServiceAreas(),
  })

  const [zip, setZip] = useState('')
  const check = useMutation({
    mutationFn: (z: string) => apiClient.checkZip(z),
  })

  const popularZips = ['90210', '90401', '91423', '90802', '91101']

  return (
    <section id="areas" className="section bg-ink-50/60">
      <div className="container-x">
        <div className="grid items-center gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <span className="badge-brand">{t('nav.areas')}</span>
            <h2 className="mt-3 section-title text-ink-900 text-balance">
              {t('areas.title')}
            </h2>
            <p className="mt-4 text-lg text-ink-600">{t('areas.subtitle')}</p>

            <div className="mt-6 rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
              <label htmlFor="zip-check" className="label">
                {t('areas.checkZipTitle')}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
                  <input
                    id="zip-check"
                    inputMode="numeric"
                    maxLength={5}
                    placeholder={t('areas.checkZipPlaceholder')}
                    value={zip}
                    onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    className="input pl-10"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => zip && check.mutate(zip)}
                  disabled={zip.length < 5 || check.isPending}
                  className="btn-primary"
                >
                  {check.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    t('areas.checkButton')
                  )}
                </button>
              </div>

              {check.data && check.data.in_service_area && (
                <div className="mt-3 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-600" />
                  <div>
                    <p className="font-semibold">
                      {t('areas.inServiceArea', {
                        area: check.data.area_name,
                        minutes: check.data.response_time_min,
                      })}
                    </p>
                  </div>
                </div>
              )}
              {check.data && !check.data.in_service_area && (
                <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
                  <XCircle className="mt-0.5 h-5 w-5 flex-none text-amber-600" />
                  <p>{t('areas.notInArea')}</p>
                </div>
              )}

              <div className="mt-4 text-xs text-ink-500">
                <span className="font-semibold">{t('areas.popularZips')} </span>
                {popularZips.map((z) => (
                  <button
                    key={z}
                    type="button"
                    onClick={() => {
                      setZip(z)
                      check.mutate(z)
                    }}
                    className="mr-1.5 inline-flex rounded-md bg-ink-100 px-2 py-0.5 font-mono text-ink-700 transition hover:bg-brand-100 hover:text-brand-700"
                  >
                    {z}
                  </button>
                ))}
              </div>
            </div>

            <ul className="mt-6 space-y-2 text-sm">
              {areas.map((a) => (
                <li key={a.id} className="flex items-center gap-2 text-ink-700">
                  <MapPin className="h-4 w-4 flex-none text-brand-500" />
                  <span className="font-medium">{a.name}</span>
                  <span className="ml-auto text-xs text-ink-500">
                    {t('areas.responseTime', { minutes: a.response_time_min })}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <div
              className={cn(
                'overflow-hidden rounded-3xl border border-ink-100 shadow-soft',
                isLoading && 'animate-pulse bg-ink-100',
              )}
            >
              <MapContainer
                center={LA_CENTER}
                zoom={10}
                scrollWheelZoom={false}
                style={{ height: 480, width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={LA_CENTER} icon={pinIcon}>
                  <Popup>Los Angeles HQ</Popup>
                </Marker>
                {areas.map((a) => (
                  <AreaPolygon key={a.id} area={a} />
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function AreaPolygon({ area }: { area: ServiceArea }) {
  if (!area.geojson?.coordinates) return null
  const positions = geojsonToLeaflet(area.geojson.coordinates)
  return (
    <Polygon
      positions={positions}
      pathOptions={{
        color: '#ff7510',
        weight: 2,
        fillColor: '#ff7510',
        fillOpacity: 0.18,
      }}
    >
      <Popup>
        <div className="font-semibold">{area.name}</div>
        <div className="text-xs text-ink-500">
          ~{area.response_time_min} min response
        </div>
      </Popup>
    </Polygon>
  )
}
