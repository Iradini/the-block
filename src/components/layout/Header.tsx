import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface HeaderProps {
  children?: ReactNode
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity"
          aria-label="The Block — back to inventory"
        >
          <span className="text-base font-bold tracking-tight leading-none">The Block</span>
          <span className="text-xs text-slate-500 hidden sm:block leading-none">by OPENLANE</span>
        </Link>

        {children && <div className="flex-1 flex items-center gap-3 min-w-0">{children}</div>}
      </div>
    </header>
  )
}
