'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { enquirySchema } from '@/lib/schema';
import { useState } from 'react';
import { useFinanceStore } from '@/store/finance';

export default function Enquiry({ offer }: { offer: any }) {
  const [ok, setOk] = useState(false);
  const { term, mileage, initial } = useFinanceStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<z.infer<typeof enquirySchema>>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      customerType: 'limited',
      vatRegistered: true,
      preferredTermMonths: term,
      preferredMileage: mileage,
      initialPaymentMultiple: initial,
      notes: '',
      consent: false,
      marketingOptIn: false
    }
  });

  // Keep form in sync with FinanceCalculator selections
  // so users don't have to re-enter the same values.
  // Updates whenever the calculator values change.
  React.useEffect(() => {
    // use react-hook-form setValue from the hook above
    setValue('preferredTermMonths', term);
    setValue('preferredMileage', mileage);
    setValue('initialPaymentMultiple', initial);
  }, [term, mileage, initial, setValue]);

  return ok ? (
    <div className="p-4 border rounded bg-green-50">
      <p className="font-semibold">Thank you — we’ve received your enquiry.</p>
      <p className="text-sm mt-1">A specialist will be in touch shortly.</p>
    </div>
  ) : (
    <form
      onSubmit={handleSubmit(async (values) => {
        const res = await fetch('/api/enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...values, offer })
        });
        setOk(res.ok);
      })}
      className="grid gap-3"
    >
      <h2 className="text-xl font-semibold">Request A Quote</h2>
      <div className="grid md:grid-cols-2 gap-3">
        <Field label="Full name" error={errors.name?.message}>
          <input {...register('name', { required: 'Required' })} className="border rounded px-3 py-2 w-full text-base" />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input type="email" {...register('email', { required: 'Required' })} className="border rounded px-3 py-2 w-full text-base" />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <input {...register('phone', { required: 'Required' })} className="border rounded px-3 py-2 w-full text-base" />
        </Field>
        <Field label="Company (optional)">
          <input {...register('company')} className="border rounded px-3 py-2 w-full text-base" />
        </Field>
        <Field label="Customer type">
          <select {...register('customerType')} className="border rounded px-3 py-2 w-full text-base">
            <option value="sole-trader">Sole trader</option>
            <option value="limited">Limited</option>
            <option value="partnership">Partnership</option>
            <option value="individual">Individual</option>
          </select>
        </Field>
        <Field label="VAT registered?">
          <select {...register('vatRegistered')} className="border rounded px-3 py-2 w-full text-base">
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </Field>
        <Field label="Preferred term (months)">
          <select {...register('preferredTermMonths')} className="border rounded px-3 py-2 w-full text-base">
            {offer.terms.termMonths.map((t: number) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Annual mileage">
          <select {...register('preferredMileage')} className="border rounded px-3 py-2 w-full text-base">
            {offer.terms.mileagesPerYear.map((m: number) => (
              <option key={m} value={m}>{m.toLocaleString()} miles</option>
            ))}
          </select>
        </Field>
        <Field label="Initial payment (x)">
          <select {...register('initialPaymentMultiple')} className="border rounded px-3 py-2 w-full text-base">
            {offer.terms.initialPaymentMultiples.map((x: number) => (
              <option key={x} value={x}>{x}x</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Notes">
        <textarea {...register('notes')} className="border rounded px-3 py-2 w-full text-base" rows={3} />
      </Field>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" {...register('consent', { required: true })} />
        I consent to my data being used to process this enquiry. See our{' '}
        <a className="text-primary underline" href="/privacy">Privacy Policy</a>.
      </label>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" {...register('marketingOptIn')} />
        Keep me updated with relevant offers (optional).
      </label>
      <button disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded">
        {isSubmitting ? 'Sending…' : 'Send enquiry'}
      </button>
    </form>
  );
}

function Field({
  label,
  children,
  error
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-medium">{label}</span>
      {children}
      {error && <span className="text-red-600">{error}</span>}
    </label>
  );
}