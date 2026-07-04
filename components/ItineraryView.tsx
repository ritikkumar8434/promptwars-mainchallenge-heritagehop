import type { DayPlan } from '@/types/travel';

const INTENSITY_STYLE: Record<string, string> = {
  Low: 'bg-emerald-100 text-emerald-800',
  Moderate: 'bg-amber-100 text-amber-800',
  High: 'bg-rose-100 text-rose-800',
};

export function ItineraryView({ days }: { days: DayPlan[] }) {
  if (days.length === 0) {
    return <p className="text-sm text-slate-500">No itinerary available yet.</p>;
  }

  return (
    <ol className="space-y-6">
      {days.map((day) => (
        <li key={day.day} className="card">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-slate-900">{day.title}</h3>
            <span className={`badge ${INTENSITY_STYLE[day.walkingIntensity]}`}>
              🚶 {day.walkingIntensity} walking
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600">{day.summary}</p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <TimeBlock label="Morning" icon="🌅" items={day.morning} />
            <TimeBlock label="Afternoon" icon="☀️" items={day.afternoon} />
            <TimeBlock label="Evening" icon="🌆" items={day.evening} />
          </div>

          {day.notes && <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">ℹ️ {day.notes}</p>}
        </li>
      ))}
    </ol>
  );
}

function TimeBlock({ label, icon, items }: { label: string; icon: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-800">
        <span aria-hidden="true">{icon}</span> {label}
      </h4>
      {items.length > 0 ? (
        <ul className="mt-1 space-y-1 text-sm text-slate-600">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-sm text-slate-400">Free time</p>
      )}
    </div>
  );
}
