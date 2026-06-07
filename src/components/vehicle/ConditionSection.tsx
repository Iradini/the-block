import type { VehicleWithBids } from '../../types/vehicle';
import { ConditionBadge } from '../ui/ConditionBadge';

interface ConditionSectionProps {
  vehicle: VehicleWithBids;
}

export function ConditionSection({ vehicle }: ConditionSectionProps) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-slate-900">Condition</h2>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-3">
          <ConditionBadge grade={vehicle.condition_grade} />
        </div>
        <p className="text-sm leading-relaxed text-slate-700">{vehicle.condition_report}</p>
        <h3 className="mt-4 text-sm font-medium text-slate-900">Damage notes</h3>
        {vehicle.damage_notes.length === 0 ? (
          <p className="mt-1 text-sm text-slate-500">None reported</p>
        ) : (
          <ul className="mt-1 list-inside list-disc text-sm text-slate-700">
            {vehicle.damage_notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
