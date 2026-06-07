import { formatConditionGrade } from '../../lib/format';

interface ConditionBadgeProps {
  grade: number;
}

const tierStyles = {
  excellent: 'bg-emerald-100 text-emerald-800',
  good: 'bg-lime-100 text-lime-800',
  fair: 'bg-amber-100 text-amber-800',
  poor: 'bg-red-100 text-red-800',
};

export function ConditionBadge({ grade }: ConditionBadgeProps) {
  const { label, tier } = formatConditionGrade(grade);
  return (
    <span className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${tierStyles[tier]}`}>
      Grade {label}
    </span>
  );
}
