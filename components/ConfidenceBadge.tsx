import { confidenceLabel, formatConfidence } from '@/lib/utils';

const STYLE_BY_LABEL: Record<string, string> = {
  High: 'bg-teal-100 text-teal-800',
  Medium: 'bg-saffron-100 text-saffron-800',
  Low: 'bg-heritage-100 text-heritage-800',
};

export function ConfidenceBadge({ confidence }: { confidence: number }) {
  const label = confidenceLabel(confidence);
  return (
    <span className={`badge ${STYLE_BY_LABEL[label]}`}>
      <span aria-hidden="true">●</span>
      <span>{label} confidence · {formatConfidence(confidence)}</span>
    </span>
  );
}

export function AIBadge() {
  return (
    <span className="badge bg-indigo-100 text-indigo-800">
      <span aria-hidden="true">✨</span> AI-generated
    </span>
  );
}

export function GroundedBadge() {
  return (
    <span className="badge bg-emerald-100 text-emerald-800">
      <span aria-hidden="true">📍</span> Grounded with local data
    </span>
  );
}

export function AccessibilityBadge({ label }: { label: string }) {
  return (
    <span className="badge bg-sky-100 text-sky-800">
      <span aria-hidden="true">♿</span> {label}
    </span>
  );
}

export function BudgetBadge({ level }: { level: string }) {
  const dollarSigns: Record<string, string> = { Free: 'Free', Low: '₹', Medium: '₹₹', Premium: '₹₹₹' };
  return (
    <span className="badge bg-amber-100 text-amber-800">
      {dollarSigns[level] ?? level}
    </span>
  );
}

export function SafetyBadge() {
  return (
    <span className="badge bg-rose-100 text-rose-800">
      <span aria-hidden="true">🛡️</span> Safety note
    </span>
  );
}

export function HiddenGemBadge() {
  return (
    <span className="badge bg-purple-100 text-purple-800">
      <span aria-hidden="true">💎</span> Hidden gem
    </span>
  );
}
