import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Send, CheckCircle2 } from 'lucide-react';
import { inquiryApi } from '../api/services';

// Example of wiring React Hook Form to the inquiries endpoint.
// Adapt the class names to whatever your existing form uses.
export default function ContactForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState(null);

  const onSubmit = async (values) => {
    setServerError(null);
    try {
      await inquiryApi.create({ ...values, source: 'website' });
      setSent(true);
      reset();
    } catch (err) {
      setServerError(err.message);
    }
  };

  if (sent) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
        <CheckCircle2 size={20} />
        <p>Thanks — we&apos;ll get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <input
          {...register('name', { required: 'Name is required' })}
          placeholder="Your name"
          className="w-full rounded-lg border border-stone-300 px-4 py-3 focus:border-amber-600 focus:outline-none"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <input
          {...register('phone', {
            required: 'Phone is required',
            pattern: { value: /^[0-9+\-\s]{7,15}$/, message: 'Enter a valid phone number' },
          })}
          placeholder="Phone number"
          className="w-full rounded-lg border border-stone-300 px-4 py-3 focus:border-amber-600 focus:outline-none"
        />
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
      </div>

      <div>
        <textarea
          {...register('message', { required: 'Tell us what you need', maxLength: 2000 })}
          rows={4}
          placeholder="What work do you need done?"
          className="w-full rounded-lg border border-stone-300 px-4 py-3 focus:border-amber-600 focus:outline-none"
        />
        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
      </div>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <button
        type="button"
        onClick={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 rounded-lg bg-amber-700 px-6 py-3 font-medium text-white hover:bg-amber-800 disabled:opacity-60"
      >
        <Send size={18} />
        {isSubmitting ? 'Sending…' : 'Send enquiry'}
      </button>
    </form>
  );
}
