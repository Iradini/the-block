interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="card border-dashed px-4 py-12 text-center sm:px-6 sm:py-16">
      <h2 className="text-lg font-medium text-openlane-navy">{title}</h2>
      {description && <p className="mt-2 text-sm text-slate-600">{description}</p>}
    </div>
  );
}
