import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useEmotionStore } from '../store/emotionStore';

const EMOTION_EMOJI: Record<string, string> = {
  calm: '😌', happy: '😊', sad: '😢', angry: '😠',
  disgust: '🤢', fearful: '😨', surprise: '😲', neutral: '😐',
};

const COLORS: Record<string, string> = {
  calm: '#60a5fa', happy: '#fbbf24', sad: '#818cf8', angry: '#f87171',
  disgust: '#34d399', fearful: '#a78bfa', surprise: '#fb923c', neutral: '#94a3b8',
};

export default function HistoryPage() {
  const { history, fetchHistory } = useEmotionStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory().finally(() => setLoading(false));
  }, []);

  const emotionCounts = history.reduce((acc, a) => {
    acc[a.emotion] = (acc[a.emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(emotionCounts).map(([emotion, count]) => ({ emotion, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">📊 Emotion History</h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Chart */}
          {chartData.length > 0 && (
            <div className="card">
              <h2 className="font-semibold text-slate-800 mb-4">Emotion Frequency</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <XAxis dataKey="emotion" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry) => (
                      <Cell key={entry.emotion} fill={COLORS[entry.emotion] || '#a78bfa'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* List */}
          <div className="card">
            <h2 className="font-semibold text-slate-800 mb-3">All Analyses ({history.length})</h2>
            {history.length === 0 ? (
              <p className="text-slate-400 text-sm">
                No analyses yet. <Link to="/analysis" className="text-sky-500 hover:underline">Start your first one.</Link>
              </p>
            ) : (
              <div className="space-y-2">
                {history.map((a) => (
                  <Link
                    key={a._id}
                    to={`/result/${a._id}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{EMOTION_EMOJI[a.emotion]}</span>
                      <div>
                        <span className="text-sm font-medium text-slate-700 capitalize group-hover:text-sky-600">
                          {a.emotion}
                        </span>
                        <p className="text-xs text-slate-400">{new Date(a.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-slate-500">
                      {Math.round(a.confidence * 100)}%
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
