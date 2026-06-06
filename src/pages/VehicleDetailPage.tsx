import { useParams, useNavigate } from 'react-router-dom'
import { useVehicle } from '../hooks/useVehicle'
import { Header } from '../components/layout/Header'
import { PhotoGallery } from '../components/vehicle/PhotoGallery'
import { SpecsTable } from '../components/vehicle/SpecsTable'
import { ConditionSection } from '../components/vehicle/ConditionSection'
import { BidPanel } from '../components/vehicle/BidPanel'
import { NotFoundPage } from './NotFoundPage'

export function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const vehicle = useVehicle(id)

  if (!vehicle) {
    return <NotFoundPage />
  }

  const displayTitle = `${vehicle.year} ${vehicle.make} ${vehicle.model}`

  return (
    <div className="min-h-screen bg-gray-50">
      <Header>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 -mx-1"
          aria-label="Back to inventory"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Inventory</span>
        </button>
        <span className="text-sm text-slate-400 truncate hidden md:block">
          {displayTitle}
        </span>
      </Header>

      <main className="max-w-7xl mx-auto px-4 py-6 pb-28 lg:pb-6">
        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-8 lg:items-start">

          {/* Left: content */}
          <div className="space-y-8">
            <PhotoGallery images={vehicle.images} alt={displayTitle} />

            {/* Title block */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {displayTitle} <span className="font-normal text-gray-500">{vehicle.trim}</span>
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                {vehicle.city}, {vehicle.province}
                &ensp;·&ensp;
                Lot {vehicle.lot}
                &ensp;·&ensp;
                {vehicle.selling_dealership}
              </p>
            </div>

            {/* Specs */}
            <section aria-labelledby="specs-heading">
              <h2
                id="specs-heading"
                className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100"
              >
                Specifications
              </h2>
              <SpecsTable vehicle={vehicle} />
            </section>

            {/* Condition */}
            <section aria-labelledby="condition-heading">
              <h2
                id="condition-heading"
                className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100"
              >
                Condition
              </h2>
              <ConditionSection vehicle={vehicle} />
            </section>
          </div>

          {/* Right: bid panel */}
          <div>
            <BidPanel vehicle={vehicle} />
          </div>
        </div>
      </main>
    </div>
  )
}
