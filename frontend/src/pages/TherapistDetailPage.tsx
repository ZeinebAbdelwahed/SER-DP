import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { therapistsAPI, appointmentsAPI } from '../api';
import { Therapist } from '../types';

const schema = z.object({
  consultationType: z.enum(['online', 'in-person']),
  date: z.string().min(1, 'Date required'),
  time: z.string().min(1, 'Time required'),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function TherapistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [booked, setBooked] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { consultationType: 'online' },
  });

  useEffect(() => {
    if (id) therapistsAPI.getById(id).then(({ data }) => setTherapist(data));
  }, [id]);

  const onSubmit = async (data: FormData) => {
    try {
      await appointmentsAPI.create({ ...data, therapist: id });
      setBooked(true);
      setTimeout(() => navigate('/appointments'), 2000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Booking failed');
    }
  };

  if (!therapist) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Therapist info */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center text-3xl">🧑‍⚕️</div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">{therapist.name}</h1>
            <p className="text-slate-500 text-sm">📍 {therapist.city}</p>
            <p className="text-amber-500 text-sm">⭐ {therapist.rating.toFixed(1)} ({therapist.reviewCount} reviews)</p>
          </div>
        </div>
        {therapist.bio && <p className="mt-4 text-sm text-slate-600">{therapist.bio}</p>}
        <div className="flex flex-wrap gap-2 mt-3">
          {therapist.specialty.map((s) => (
            <span key={s} className="text-xs bg-sky-50 text-sky-600 px-2 py-1 rounded-full">{s}</span>
          ))}
        </div>
      </div>

      {/* Booking form */}
      {booked ? (
        <div className="card bg-green-50 border-green-100 text-center py-8">
          <span className="text-4xl">✅</span>
          <h2 className="text-lg font-semibold text-green-700 mt-2">Appointment booked!</h2>
          <p className="text-sm text-green-600 mt-1">Redirecting to your appointments…</p>
        </div>
      ) : (
        <div className="card">
          <h2 className="font-semibold text-slate-800 mb-4">Book an Appointment</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Consultation Type</label>
              <select {...register('consultationType')} className="input">
                {therapist.consultationType.map((t) => (
                  <option key={t} value={t}>{t === 'online' ? '🌐 Online' : '🏥 In-person'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input {...register('date')} type="date" className="input"
                min={new Date().toISOString().split('T')[0]} />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
              <input {...register('time')} type="time" className="input" />
              {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notes (optional)</label>
              <textarea {...register('notes')} className="input resize-none" rows={3}
                placeholder="Any specific concerns or context…" />
            </div>
            <button type="submit" className="btn-primary w-full">Confirm Booking</button>
          </form>
        </div>
      )}
    </div>
  );
}
