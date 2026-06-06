import { formatConditionGrade } from '../../lib/format'

interface ConditionBadgeProps {
  grade: number
  size?: 'sm' | 'md'
}

export function ConditionBadge({ grade, size = 'sm' }: ConditionBadgeProps) {
  const { label, badgeClass } = formatConditionGrade(grade)
  const sizeClass = size === 'md' ? 'px-2.5 py-1 text-sm' : 'px-2 py-0.5 text-xs'

  return (
    <span className={`inline-flex items-center rounded font-medium ${badgeClass} ${sizeClass}`}>
      {grade.toFixed(1)}&thinsp;·&thinsp;{label}
    </span>
  )
}
