export function LoadingState({ message = 'Generating your cultural journey…' }: { message?: string }) {
  return (
    <div role="status" aria-live="polite" className="space-y-6">
      <p className="text-center text-sm font-medium text-slate-600">{message}</p>
      <div className="skeleton h-8 w-2/3" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card space-y-3">
            <div className="skeleton h-5 w-3/4" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-5/6" />
            <div className="skeleton h-3 w-2/3" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading your HeritageHop travel plan, please wait.</span>
    </div>
  );
}
