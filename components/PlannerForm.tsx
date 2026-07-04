'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CITY_NAMES } from '@/lib/data/india-destinations';
import type {
  InterestTag,
  BudgetChoice,
  TravelPace,
  GroupType,
  AccessibilityNeed,
  ExperienceType,
  TravelPlanInput,
} from '@/types/travel';
import { InlineAlert } from './ErrorState';

const INTERESTS: InterestTag[] = [
  'Heritage', 'Food', 'Art', 'Architecture', 'Spirituality', 'Markets',
  'Nature', 'Museums', 'Festivals', 'Photography', 'Local life', 'Music and dance',
];
const BUDGETS: BudgetChoice[] = ['Budget', 'Mid-range', 'Premium'];
const PACES: TravelPace[] = ['Relaxed', 'Balanced', 'Fast-paced'];
const GROUP_TYPES: GroupType[] = ['Solo', 'Couple', 'Family', 'Friends', 'Senior travelers', 'Students'];
const ACCESSIBILITY_NEEDS: AccessibilityNeed[] = [
  'None', 'Wheelchair-friendly', 'Low walking', 'Senior-friendly', 'Child-friendly', 'Avoid stairs', 'Quiet places',
];
const EXPERIENCE_TYPES: ExperienceType[] = [
  'Heritage walk', 'Artisan workshop', 'Cooking class', 'Local festival', 'Food trail',
  'Spiritual experience', 'Market walk', 'Museum guide', 'Community experience',
];
const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Bengali', 'Kannada', 'Malayalam', 'Marathi', 'Gujarati', 'Punjabi', 'Telugu', 'Other'];
const FOOD_PREFERENCES = ['No preference', 'Vegetarian', 'Vegan', 'Jain (no root vegetables)', 'Non-vegetarian', 'Halal', 'Gluten-free'];

const JAIPUR_DEMO: TravelPlanInput = {
  city: 'Jaipur',
  durationDays: 2,
  interests: ['Heritage', 'Food', 'Markets', 'Architecture', 'Local life'],
  budget: 'Mid-range',
  pace: 'Balanced',
  groupType: 'Friends',
  language: 'English',
  accessibilityNeeds: ['Low walking'],
  foodPreference: 'No preference',
  experienceType: 'Heritage walk',
};

export function PlannerForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState<TravelPlanInput>({
    city: '',
    durationDays: 2,
    interests: [],
    budget: 'Mid-range',
    pace: 'Balanced',
    groupType: 'Solo',
    language: 'English',
    accessibilityNeeds: ['None'],
    foodPreference: 'No preference',
    experienceType: 'Heritage walk',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (searchParams.get('demo') === 'jaipur') {
      setForm(JAIPUR_DEMO);
    }
  }, [searchParams]);

  function toggleInterest(value: InterestTag) {
    setForm((prev) => {
      const next = prev.interests.includes(value)
        ? prev.interests.filter((v) => v !== value)
        : [...prev.interests, value];
      return { ...prev, interests: next };
    });
  }

  function toggleAccessibilityNeed(value: AccessibilityNeed) {
    setForm((prev) => {
      if (value === 'None') return { ...prev, accessibilityNeeds: ['None'] };
      const withoutNone = prev.accessibilityNeeds.filter((v) => v !== 'None');
      const next = withoutNone.includes(value) ? withoutNone.filter((v) => v !== value) : [...withoutNone, value];
      return { ...prev, accessibilityNeeds: next.length ? next : ['None'] };
    });
  }

  function validate(): string[] {
    const errs: string[] = [];
    if (!form.city.trim()) errs.push('Please select or enter a destination city.');
    if (form.durationDays < 1 || form.durationDays > 14) errs.push('Trip duration must be between 1 and 14 days.');
    if (form.interests.length === 0) errs.push('Please select at least one interest.');
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (validationErrors.length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors([data.error ?? 'Unable to generate a plan. Please try again.']);
        setSubmitting(false);
        return;
      }

      sessionStorage.setItem('heritagehop:lastPlan', JSON.stringify(data.plan));
      sessionStorage.setItem('heritagehop:lastMeta', JSON.stringify(data.meta));
      sessionStorage.setItem('heritagehop:lastInput', JSON.stringify(form));
      router.push('/results');
    } catch {
      setErrors(['Network error — please check your connection and try again.']);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-8" noValidate>
      {errors.length > 0 && (
        <div role="alert" className="space-y-1 rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-800">
          {errors.map((err) => (
            <p key={err}>{err}</p>
          ))}
        </div>
      )}

      <fieldset className="card space-y-4">
        <legend className="px-1 text-lg font-semibold text-slate-900">Trip basics</legend>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-slate-700">
            Destination city <span aria-hidden="true">*</span>
          </label>
          <input
            id="city"
            list="city-options"
            required
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-saffron-500 focus:ring-saffron-500"
            placeholder="e.g. Jaipur"
            aria-describedby="city-hint"
          />
          <datalist id="city-options">
            {CITY_NAMES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <p id="city-hint" className="mt-1 text-xs text-slate-500">Choose from our featured cities or type your own.</p>
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-slate-700">
            Trip duration (days) <span aria-hidden="true">*</span>
          </label>
          <input
            id="duration"
            type="number"
            min={1}
            max={14}
            required
            value={form.durationDays}
            onChange={(e) => setForm({ ...form, durationDays: Number(e.target.value) })}
            className="mt-1 w-32 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-saffron-500 focus:ring-saffron-500"
          />
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-medium text-slate-700">Preferred output language</label>
          <select
            id="language"
            value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-saffron-500 focus:ring-saffron-500"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </fieldset>

      <ChipGroup
        legend="Interests"
        required
        options={INTERESTS}
        selected={form.interests}
        onToggle={toggleInterest}
      />

      <fieldset className="card space-y-4">
        <legend className="px-1 text-lg font-semibold text-slate-900">Preferences</legend>

        <RadioGroup
          label="Budget"
          name="budget"
          options={BUDGETS}
          value={form.budget}
          onChange={(v) => setForm({ ...form, budget: v as BudgetChoice })}
        />
        <RadioGroup
          label="Travel pace"
          name="pace"
          options={PACES}
          value={form.pace}
          onChange={(v) => setForm({ ...form, pace: v as TravelPace })}
        />
        <div>
          <label htmlFor="groupType" className="block text-sm font-medium text-slate-700">Group type</label>
          <select
            id="groupType"
            value={form.groupType}
            onChange={(e) => setForm({ ...form, groupType: e.target.value as GroupType })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-saffron-500 focus:ring-saffron-500"
          >
            {GROUP_TYPES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="foodPreference" className="block text-sm font-medium text-slate-700">Food preference</label>
          <select
            id="foodPreference"
            value={form.foodPreference}
            onChange={(e) => setForm({ ...form, foodPreference: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-saffron-500 focus:ring-saffron-500"
          >
            {FOOD_PREFERENCES.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="experienceType" className="block text-sm font-medium text-slate-700">Preferred experience type</label>
          <select
            id="experienceType"
            value={form.experienceType}
            onChange={(e) => setForm({ ...form, experienceType: e.target.value as ExperienceType })}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-saffron-500 focus:ring-saffron-500"
          >
            {EXPERIENCE_TYPES.map((ex) => (
              <option key={ex} value={ex}>{ex}</option>
            ))}
          </select>
        </div>
      </fieldset>

      <ChipGroup
        legend="Accessibility needs"
        options={ACCESSIBILITY_NEEDS}
        selected={form.accessibilityNeeds}
        onToggle={toggleAccessibilityNeed}
      />

      {form.accessibilityNeeds.some((n) => n !== 'None') && (
        <InlineAlert message="Your itinerary will be adjusted for the accessibility needs you've selected — including walking distance, pacing, and notes on stairs or crowds." />
      )}

      <button type="submit" disabled={submitting} className="btn-primary w-full text-base">
        {submitting ? 'Generating your cultural journey…' : 'Generate Cultural Journey'}
      </button>
    </form>
  );
}

function ChipGroup<T extends string>({
  legend,
  options,
  selected,
  onToggle,
  required,
}: {
  legend: string;
  options: T[];
  selected: T[];
  onToggle: (value: T) => void;
  required?: boolean;
}) {
  return (
    <fieldset className="card">
      <legend className="px-1 text-lg font-semibold text-slate-900">
        {legend} {required && <span aria-hidden="true">*</span>}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={legend}>
        {options.map((opt) => {
          const isSelected = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(opt)}
              className={`chip ${isSelected ? 'chip-selected' : ''}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function RadioGroup({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label}>
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => (
          <label
            key={opt}
            className={`chip cursor-pointer ${value === opt ? 'chip-selected' : ''}`}
          >
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
              className="sr-only"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}
