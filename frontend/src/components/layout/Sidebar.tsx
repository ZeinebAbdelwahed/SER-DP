import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/analysis', label: 'Voice Analysis', icon: '🎙️' },
  { to: '/history', label: 'My History', icon: '📊' },
  { to: '/movies', label: 'Movies', icon: '🎬' },
  { to: '/chatbot', label: 'Chatbot', icon: '💬' },
  { to: '/therapists', label: 'Therapists', icon: '🧑‍⚕️' },
  { to: '/appointments', label: 'Appointments', icon: '📅' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-100 flex flex-col shadow-sm z-10">
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌊</span>
          <div>
            <p className="font-bold text-sky-600 text-sm">MoodWave</p>
            <p className="text-xs text-slate-400">Emotional AI Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-sky-50 text-sky-600'
                  : 'text-slate-600 hover:bg-sky-50/60 hover:text-slate-900'
              }`
            }
          >
            <span>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-slate-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-sm">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full text-left text-sm text-red-500 hover:text-red-700 px-2 py-1 rounded transition-colors"
        >
          🚪 Sign out
        </button>
      </div>
    </aside>
  );
}
