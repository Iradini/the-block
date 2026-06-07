import type { VehicleWithBids } from '../../types/vehicle';
import { ConditionBadge } from '../ui/ConditionBadge';

interface ConditionSectionProps {
  vehicle: VehicleWithBids;
}

export function ConditionSection({ vehicle }: ConditionSectionProps) {
  return (
    <section className="min-w-0">
      <h2 className="section-title mb-3">Condition report</h2>
      <div className="card p-4">
        <div className="mb-3">
          <ConditionBadge grade={vehicle.condition_grade} />
        </div>
        <p className="break-words text-sm leading-relaxed text-slate-700">{vehicle.condition_report}</p>
        <h3 className="mt-4 text-sm font-medium text-openlane-navy">Damage notes</h3>
        {vehicle.damage_notes.length === 0 ? (
          <p className="mt-1 text-sm text-slate-500">None reported</p>
        ) : (
          <ul className="mt-1 list-inside list-disc break-words text-sm text-slate-700">
            {vehicle.damage_notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
