import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle2, Send } from 'lucide-react';
import { inquiryApi } from '../api/services';
export default function ContactForm({ source = 'website' }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [sent, setSent] = useState(false), [serverError, setServerError] = useState('');
  const onSubmit = async (values) => { setServerError(''); try { await inquiryApi.create({ ...values, budget: values.budget ? Number(values.budget) : undefined, source }); setSent(true); reset(); } catch (e) { setServerError(e.message); } };
  if (sent) return <div className="success-box"><CheckCircle2 size={22}/><div><strong>Enquiry received.</strong><p>Thank you — Wooden Lines will get back to you shortly.</p><button className="text-button" onClick={() => setSent(false)}>Send another enquiry</button></div></div>;
  return <form className="form-grid" onSubmit={handleSubmit(onSubmit)} noValidate>
    <label>Name<input {...register('name', { required: 'Name is required' })} placeholder="Your name"/>{errors.name && <small>{errors.name.message}</small>}</label>
    <label>Phone<input {...register('phone', { required: 'Phone is required', pattern: { value: /^[0-9+\-\s]{7,15}$/, message: 'Enter a valid phone number' } })} placeholder="Phone number"/>{errors.phone && <small>{errors.phone.message}</small>}</label>
    <label>Email <span className="muted">(optional)</span><input type="email" {...register('email')} placeholder="you@example.com"/></label>
    <label>Service<select {...register('serviceType')} defaultValue=""><option value="">Choose a service</option><option>Modular Kitchens</option><option>Wardrobes</option><option>Custom Furniture</option><option>Full Home Interiors</option><option>Doors</option><option>Office Interiors</option><option>Other</option></select></label>
    <label>Budget <span className="muted">(optional)</span><input type="number" min="0" {...register('budget')} placeholder="Approx. budget in ₹"/></label>
    <label className="full">Tell us about the work<textarea rows="5" {...register('message', { required: 'Please tell us what you need', maxLength: { value: 2000, message: 'Maximum 2000 characters' } })} placeholder="Kitchen, wardrobe, door, office, measurements, location…"/>{errors.message && <small>{errors.message.message}</small>}</label>
    {serverError && <div className="form-error full">{serverError}</div>}
    <button className="btn full" disabled={isSubmitting}><Send size={17}/>{isSubmitting ? 'Sending…' : 'Send enquiry'}</button>
  </form>;
}
