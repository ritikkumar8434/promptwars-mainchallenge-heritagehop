import { Suspense } from 'react';
import { PlannerForm } from '@/components/PlannerForm';

export const metadata = { title: 'Plan Your Trip — HeritageHop' };

export default function PlannerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-center font-display text-3xl font-bold text-slate-900 sm:text-4xl">
        Tell us about your journey
      </h1>
      <p className="mt-2 text-center text-slate-600">
        HeritageHop will craft a culturally rich, AI-generated plan tailored to your preferences.
      </p>
      <div className="mt-10">
        <Suspense fallback={<div className="skeleton h-96 w-full" />}>
          <PlannerForm />
        </Suspense>
      </div>
    </div>
  );
}
