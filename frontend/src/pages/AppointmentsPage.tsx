import { useEffect, useState } from 'react';
import { appointmentsAPI } from '../api';
import { Appointment } from '../types';

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentsAPI.myAppointments()
      .then(({ data }) => setAppointments(data))
      .finally(() => setLoading(false));
  }, []);

  const cancel = async (id: string) => {
    if (!confirm('Cancel this appointment?')) return;
    await appointmentsAPI.cancel(id);
    setAppointments((prev) =>
      prev.map((a) => a._id === id ? { ...a, status: 'cancelled' } : a)
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">📅 My Appointments</h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="card text-center py-10">
          <p className="text-slate-400">No appointments yet.</p>
          <a href="/therapists" className="text-sky-500 text-sm hover:underline mt-2 block">Find a therapist →</a>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((a) => (
            <div key={a._id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800">{(a.therapist as any)?.name}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    📍 {(a.therapist as any)?.city} · {a.consultationType === 'online' ? '🌐 Online' : '🏥 In-person'}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    📅 {new Date(a.date).toLocaleDateString()} at {a.time}
                  </p>
                  {a.notes && <p className="text-xs text-slate-400 mt-1">"{a.notes}"</p>}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLOR[a.status]}`}>
                  {a.status}
                </span>
              </div>
              {a.status === 'pending' && (
                <div className="mt-3 pt-3 border-t border-slate-50">
                  <button onClick={() => cancel(a._id)} className="text-sm text-red-500 hover:text-red-700 transition-colors">
                    Cancel appointment
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
