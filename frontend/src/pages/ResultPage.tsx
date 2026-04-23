import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { emotionsAPI, recommendationsAPI, moviesAPI } from '../api';
import { EmotionAnalysis, Recommendation, Movie } from '../types';

const EMOTION_EMOJI: Record<string, string> = {
  calm: '😌', happy: '😊', sad: '😢', angry: '😠',
  disgust: '🤢', fearful: '😨', surprise: '😲', neutral: '😐',
};

const EMOTION_GRADIENT: Record<string, string> = {
  calm: 'from-blue-500 to-cyan-400',
  happy: 'from-yellow-400 to-orange-400',
  sad: 'from-indigo-500 to-blue-400',
  angry: 'from-red-500 to-rose-400',
  disgust: 'from-green-500 to-teal-400',
  fearful: 'from-indigo-500 to-sky-400',
  surprise: 'from-orange-500 to-amber-400',
  neutral: 'from-slate-400 to-slate-500',
};

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<EmotionAnalysis | null>(null);
  const [rec, setRec] = useState<Recommendation | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      emotionsAPI.getById(id),
    ]).then(async ([{ data: a }]) => {
      setAnalysis(a);
      const [recRes, movRes] = await Promise.all([
        recommendationsAPI.get(a.emotion),
        moviesAPI.byEmotion(a.emotion),
      ]);
      setRec(recRes.data);
      setMovies(movRes.data);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!analysis) return <p className="text-red-500">Analysis not found.</p>;

  const gradient = EMOTION_GRADIENT[analysis.emotion] || 'from-slate-400 to-slate-500';
  const probs = analysis.probabilities ? Object.entries(analysis.probabilities).sort((a, b) => b[1] - a[1]) : [];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Hero */}
      <div className={`card bg-gradient-to-r ${gradient} text-white border-0`}>
        <div className="text-center py-4">
          <span className="text-6xl">{EMOTION_EMOJI[analysis.emotion]}</span>
          <h1 className="text-3xl font-bold mt-3 capitalize">{analysis.emotion}</h1>
          <p className="mt-1 text-white/80 text-sm">
            Confidence: <strong>{Math.round(analysis.confidence * 100)}%</strong>
          </p>
          {rec && <p className="mt-3 text-white/90 text-sm max-w-sm mx-auto">{rec.message}</p>}
        </div>
      </div>

      {/* Probabilities */}
      {probs.length > 0 && (
        <div className="card">
          <h2 className="font-semibold text-slate-800 mb-3">Emotion Probabilities</h2>
          <div className="space-y-2">
            {probs.map(([emotion, score]) => (
              <div key={emotion} className="flex items-center gap-3">
                <span className="text-sm w-20 text-slate-600 capitalize">{emotion}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-sky-400 transition-all"
                    style={{ width: `${Math.round(score * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500 w-10 text-right">{Math.round(score * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activities */}
      {rec && (
        <div className="card">
          <h2 className="font-semibold text-slate-800 mb-3">🌱 Recommended Activities</h2>
          <ul className="space-y-2">
            {rec.activities.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-sky-400 mt-0.5">✓</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Movies */}
      {movies.length > 0 && (
        <div className="card">
          <h2 className="font-semibold text-slate-800 mb-3">🎬 Movie Recommendations</h2>
          <div className="grid grid-cols-2 gap-3">
            {movies.slice(0, 4).map((m) => (
              <div key={m._id} className="rounded-xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                {m.poster ? (
                  <img src={m.poster} alt={m.title} className="w-full h-32 object-cover" />
                ) : (
                  <div className="w-full h-32 bg-slate-100 flex items-center justify-center text-3xl">🎬</div>
                )}
                <div className="p-2">
                  <p className="font-medium text-sm text-slate-800 truncate">{m.title}</p>
                  <p className="text-xs text-slate-400">{m.genre.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/movies" className="text-sky-500 text-sm hover:underline mt-3 block">
            Browse all movies →
          </Link>
        </div>
      )}

      {/* Therapy & Support */}
      {rec && (
        <div className="card">
          <h2 className="font-semibold text-slate-800 mb-3">🧑‍⚕️ Professional Support</h2>
          <ul className="space-y-1 mb-4">
            {rec.therapy.map((t, i) => (
              <li key={i} className="text-sm text-slate-700">• {t}</li>
            ))}
          </ul>
          <p className="text-xs text-slate-400 bg-slate-50 p-3 rounded-lg">
            This is not a diagnosis. If you are struggling, please reach out to a qualified mental health professional.
          </p>
        </div>
      )}

      {/* CTAs */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/chatbot" className="card text-center hover:shadow-md transition-shadow">
          <span className="text-2xl">💬</span>
          <p className="font-semibold text-sm text-slate-800 mt-2">Talk to Chatbot</p>
          <p className="text-xs text-slate-400 mt-0.5">Get emotional support</p>
        </Link>
        <Link to="/therapists" className="card text-center hover:shadow-md transition-shadow">
          <span className="text-2xl">🧑‍⚕️</span>
          <p className="font-semibold text-sm text-slate-800 mt-2">Find a Therapist</p>
          <p className="text-xs text-slate-400 mt-0.5">In Tunisia</p>
        </Link>
      </div>
    </div>
  );
}
