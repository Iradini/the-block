import type { Vehicle } from '../../types/vehicle'
import { ConditionBadge } from '../ui/ConditionBadge'

interface ConditionSectionProps {
  vehicle: Vehicle
}

const TITLE_STATUS_CONFIG: Record<
  Vehicle['title_status'],
  { label: string; className: string }
> = {
  clean: { label: 'Clean Title', className: 'bg-green-50 text-green-700' },
  rebuilt: { label: 'Rebuilt Title', className: 'bg-amber-50 text-amber-700' },
  salvage: { label: 'Salvage Title', className: 'bg-red-50 text-red-700' },
}

export function ConditionSection({ vehicle }: ConditionSectionProps) {
  const titleConfig = TITLE_STATUS_CONFIG[vehicle.title_status]

  return (
    <div className="space-y-4">
      {/* Grade + title */}
      <div className="flex flex-wrap items-center gap-2">
        <ConditionBadge grade={vehicle.condition_grade} size="md" />
        <span className={`px-2.5 py-1 rounded text-sm font-medium ${titleConfig.className}`}>
          {titleConfig.label}
        </span>
      </div>

      {/* Report */}
      <p className="text-sm text-gray-700 leading-relaxed">{vehicle.condition_report}</p>

      {/* Damage notes */}
      {vehicle.damage_notes.length > 0 ? (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Damage Notes
          </p>
          <ul className="space-y-1.5">
            {vehicle.damage_notes.map((note, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-amber-500 mt-px flex-shrink-0" aria-hidden="true">
                  ⚠
                </span>
                {note}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
          <span aria-hidden="true">✓</span>
          No damage noted
        </p>
      )}
    </div>
  )
}
