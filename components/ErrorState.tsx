export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div role="alert" className="card border-heritage-300 bg-heritage-50 text-center">
      <p className="text-2xl" aria-hidden="true">⚠️</p>
      <h3 className="mt-2 text-lg font-semibold text-heritage-900">{title}</h3>
      <p className="mt-1 text-sm text-heritage-800">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-primary mt-4">
          Try again
        </button>
      )}
    </div>
  );
}

export function InlineAlert({ message, tone = 'info' }: { message: string; tone?: 'info' | 'warning' }) {
  const styles = tone === 'warning' ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-sky-50 border-sky-300 text-sky-900';
  return (
    <div role="status" className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>
      {message}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
      {message}
    </div>
  );
}
