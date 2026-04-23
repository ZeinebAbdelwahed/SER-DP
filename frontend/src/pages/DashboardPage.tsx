import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useEmotionStore } from '../store/emotionStore';
import { EmotionAnalysis } from '../types';

const EMOTION_EMOJI: Record<string, string> = {
  calm: '😌', happy: '😊', sad: '😢', angry: '😠',
  disgust: '🤢', fearful: '😨', surprise: '😲', neutral: '😐',
};

const EMOTION_COLOR: Record<string, string> = {
  calm: 'bg-blue-100 text-blue-700',
  happy: 'bg-yellow-100 text-yellow-700',
  sad: 'bg-indigo-100 text-indigo-700',
  angry: 'bg-red-100 text-red-700',
  disgust: 'bg-green-100 text-green-700',
  fearful: 'bg-purple-100 text-purple-700',
  surprise: 'bg-orange-100 text-orange-700',
  neutral: 'bg-slate-100 text-slate-700',
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { history, fetchHistory } = useEmotionStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory().finally(() => setLoading(false));
  }, []);

  const recent = history.slice(0, 5);
  const lastEmotion = history[0];

  const emotionCounts = history.reduce((acc, a) => {
    acc[a.emotion] = (acc[a.emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-500 mt-1">Here's your emotional wellness overview.</p>
      </div>

      {/* Quick action */}
      <div className="card bg-gradient-to-r from-sky-500 to-teal-500 text-white border-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Analyze your voice</h2>
            <p className="text-sky-100 text-sm mt-1">Upload audio to detect your current emotion</p>
          </div>
          <Link
            to="/analysis"
            className="bg-white text-sky-600 font-semibold px-4 py-2 rounded-xl hover:bg-sky-50 transition-colors text-sm"
          >
            🎙️ Start Analysis
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-bold text-sky-500">{history.length}</p>
          <p className="text-sm text-slate-500 mt-1">Total Analyses</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl">{lastEmotion ? EMOTION_EMOJI[lastEmotion.emotion] : '—'}</p>
          <p className="text-sm text-slate-500 mt-1">Last Detected</p>
          {lastEmotion && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${EMOTION_COLOR[lastEmotion.emotion]}`}>
              {lastEmotion.emotion}
            </span>
          )}
        </div>
        <div className="card text-center">
          <p className="text-3xl">{topEmotion ? EMOTION_EMOJI[topEmotion[0]] : '—'}</p>
          <p className="text-sm text-slate-500 mt-1">Most Frequent</p>
          {topEmotion && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${EMOTION_COLOR[topEmotion[0]]}`}>
              {topEmotion[0]}
            </span>
          )}
        </div>
      </div>

      {/* Quick access */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { to: '/chatbot', icon: '💬', label: 'Chatbot', desc: 'Talk to your wellness assistant' },
          { to: '/therapists', icon: '🧑‍⚕️', label: 'Therapists', desc: 'Find support near you' },
          { to: '/movies', icon: '🎬', label: 'Movies', desc: 'Curated by your emotion' },
          { to: '/history', icon: '📊', label: 'History', desc: 'Review your progress' },
        ].map(({ to, icon, label, desc }) => (
          <Link key={to} to={to} className="card hover:shadow-md transition-shadow group">
            <span className="text-2xl">{icon}</span>
            <p className="font-semibold text-slate-800 mt-2 text-sm group-hover:text-sky-600">{label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent analyses */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-800">Recent Analyses</h2>
          <Link to="/history" className="text-sky-500 text-sm hover:underline">View all</Link>
        </div>
        {loading ? (
          <p className="text-slate-400 text-sm">Loading…</p>
        ) : recent.length === 0 ? (
          <p className="text-slate-400 text-sm">No analyses yet. <Link to="/analysis" className="text-sky-500 hover:underline">Start your first one.</Link></p>
        ) : (
          <div className="space-y-2">
            {recent.map((a: EmotionAnalysis) => (
              <Link
                key={a._id}
                to={`/result/${a._id}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{EMOTION_EMOJI[a.emotion]}</span>
                  <div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${EMOTION_COLOR[a.emotion]}`}>
                      {a.emotion}
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(a.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-slate-600">
                  {Math.round(a.confidence * 100)}%
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
