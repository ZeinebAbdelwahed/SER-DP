import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/authStore';
import { profileAPI } from '../api';

export default function ProfilePage() {
  const { user, fetchMe, logout } = useAuthStore();
  const { register, handleSubmit, reset, formState: { isSubmitting, isSubmitSuccessful } } = useForm({
    defaultValues: { name: user?.name || '', language: user?.language || 'fr' },
  });

  useEffect(() => {
    if (user) reset({ name: user.name, language: user.language });
  }, [user]);

  const onSubmit = async (data: any) => {
    await profileAPI.update(data);
    await fetchMe();
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">👤 Profile & Settings</h1>

      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center text-2xl font-bold text-sky-600">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-800">{user?.name}</p>
            <p className="text-sm text-slate-400">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
            <input {...register('name')} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Language</label>
            <select {...register('language')} className="input">
              <option value="fr">🇫🇷 Français</option>
              <option value="en">🇬🇧 English</option>
              <option value="ar">🇹🇳 العربية</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save Changes'}
          </button>
          {isSubmitSuccessful && (
            <p className="text-green-600 text-sm">✓ Profile updated</p>
          )}
        </form>
      </div>

      <div className="card">
        <h2 className="font-semibold text-slate-800 mb-3">⚠️ Account</h2>
        <button onClick={logout} className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors">
          🚪 Sign out
        </button>
      </div>

      <div className="card bg-sky-50 border-sky-100">
        <h2 className="font-semibold text-sky-700 mb-1">🌊 About MoodWave</h2>
        <p className="text-xs text-sky-600">
          This platform uses AI-powered speech emotion recognition for wellness support. It is not a medical diagnosis tool.
          Always consult a qualified mental health professional for serious concerns.
        </p>
      </div>
    </div>
  );
}
