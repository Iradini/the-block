import type { VehicleWithBids } from '../../types/vehicle';
import { ConditionBadge } from '../ui/ConditionBadge';

interface ConditionSectionProps {
  vehicle: VehicleWithBids;
}

export function ConditionSection({ vehicle }: ConditionSectionProps) {
  return (
    <section id="condition-report" className="min-w-0 scroll-mt-24">
      <h2 className="section-title mb-3">Condition report</h2>
      <div className="card p-4">
        <div className="mb-3">
          <ConditionBadge grade={vehicle.condition_grade} />
        </div>
        <p className="break-words text-base font-medium leading-relaxed text-openlane-navy">
          {vehicle.condition_report}
        </p>
        <h3 className="mt-4 text-sm font-bold text-openlane-navy">Damage notes</h3>
        {vehicle.damage_notes.length === 0 ? (
          <p className="mt-1 text-sm font-semibold text-slate-600">None reported</p>
        ) : (
          <ul className="mt-1 list-inside list-disc break-words text-base font-semibold text-openlane-navy">
            {vehicle.damage_notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
