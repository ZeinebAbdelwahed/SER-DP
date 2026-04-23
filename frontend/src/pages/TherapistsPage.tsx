import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { therapistsAPI } from '../api';
import { Therapist } from '../types';

const SPECIALTIES = ['anxiety', 'depression', 'CBT', 'couples therapy', 'trauma', 'anger management', 'addiction', 'child psychology'];
const CITIES = ['Tunis', 'Sfax', 'Sousse', 'Bizerte', 'Monastir', 'Gabès'];

export default function TherapistsPage() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [consultationType, setConsultationType] = useState('');

  const fetchTherapists = () => {
    setLoading(true);
    therapistsAPI.list({ city: city || undefined, specialty: specialty || undefined, consultationType: consultationType || undefined })
      .then(({ data }) => setTherapists(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTherapists(); }, [city, specialty, consultationType]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">🧑‍⚕️ Find a Therapist</h1>
        <p className="text-slate-500 mt-1">Certified mental health professionals in Tunisia.</p>
      </div>

      {/* Filters */}
      <div className="card flex flex-wrap gap-3">
        <select value={city} onChange={(e) => setCity(e.target.value)} className="input w-auto">
          <option value="">All cities</option>
          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="input w-auto">
          <option value="">All specialties</option>
          {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={consultationType} onChange={(e) => setConsultationType(e.target.value)} className="input w-auto">
          <option value="">Online & In-person</option>
          <option value="online">Online</option>
          <option value="in-person">In-person</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {therapists.map((t) => (
            <div key={t._id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center text-2xl flex-shrink-0">
                  {t.imageUrl ? <img src={t.imageUrl} alt={t.name} className="w-full h-full rounded-full object-cover" /> : '🧑‍⚕️'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-slate-800">{t.name}</h3>
                    <span className="text-amber-500 text-sm ml-2">⭐ {t.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">📍 {t.city} · {t.address}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {t.specialty.map((s) => (
                      <span key={s} className="text-xs bg-sky-50 text-sky-600 px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    {t.consultationType.includes('online') && (
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">🌐 Online</span>
                    )}
                    {t.consultationType.includes('in-person') && (
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">🏥 In-person</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{t.languages.join(', ')}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-50 flex justify-between items-center">
                <p className="text-xs text-slate-400">Available: {t.availability.join(', ')}</p>
                <Link to={`/therapists/${t._id}`} className="btn-primary text-xs py-1.5 px-3">
                  Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && therapists.length === 0 && (
        <div className="card text-center py-10">
          <p className="text-slate-400">No therapists found with these filters.</p>
        </div>
      )}
    </div>
  );
}
