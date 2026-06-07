import type { VehicleWithBids } from '../../types/vehicle';
import { getVehicleHighlights } from '../../lib/format';

interface HighlightsSectionProps {
  vehicle: VehicleWithBids;
}

export function HighlightsSection({ vehicle }: HighlightsSectionProps) {
  const highlights = getVehicleHighlights(vehicle);

  return (
    <section className="min-w-0">
      <h2 className="section-title mb-3">Highlights</h2>
      <ul className="card space-y-2 p-4">
        {highlights.map((item) => (
          <li key={item} className="flex gap-2 text-base font-semibold leading-relaxed text-openlane-navy">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-openlane-blue" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
