import { useEffect, useState } from 'react';
import { moviesAPI } from '../api';
import { Movie, Emotion } from '../types';

const EMOTIONS: Emotion[] = ['calm', 'happy', 'sad', 'angry', 'disgust', 'fearful', 'surprise', 'neutral'];

const EMOTION_EMOJI: Record<string, string> = {
  calm: '😌', happy: '😊', sad: '😢', angry: '😠',
  disgust: '🤢', fearful: '😨', surprise: '😲', neutral: '😐',
};

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [emotion, setEmotion] = useState<Emotion>('happy');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    moviesAPI.byEmotion(emotion)
      .then(({ data }) => setMovies(data))
      .finally(() => setLoading(false));
  }, [emotion]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">🎬 Movie Recommendations</h1>
        <p className="text-slate-500 mt-1">Curated films based on your emotion.</p>
      </div>

      {/* Emotion filter */}
      <div className="flex flex-wrap gap-2">
        {EMOTIONS.map((e) => (
          <button
            key={e}
            onClick={() => setEmotion(e)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              emotion === e ? 'bg-sky-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-sky-50'
            }`}
          >
            {EMOTION_EMOJI[e]} {e}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : movies.length === 0 ? (
        <div className="card text-center py-10">
          <p className="text-slate-400">No movies found for this emotion.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {movies.map((m) => (
            <div key={m._id} className="card p-0 overflow-hidden hover:shadow-md transition-shadow group">
              {m.poster ? (
                <img src={m.poster} alt={m.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="w-full h-48 bg-slate-100 flex items-center justify-center text-4xl">🎬</div>
              )}
              <div className="p-3">
                <p className="font-semibold text-sm text-slate-800 truncate">{m.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{m.genre.slice(0, 2).join(', ')}</p>
                {m.rating && (
                  <p className="text-xs text-amber-500 mt-1">⭐ {m.rating.toFixed(1)}</p>
                )}
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{m.whyRecommended}</p>
                {m.watchLink && (
                  <a href={m.watchLink} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-sky-500 hover:underline mt-1 block">
                    ▶ Watch now
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
