import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AnalysisPage from './pages/AnalysisPage';
import ResultPage from './pages/ResultPage';
import MoviesPage from './pages/MoviesPage';
import ChatbotPage from './pages/ChatbotPage';
import TherapistsPage from './pages/TherapistsPage';
import TherapistDetailPage from './pages/TherapistDetailPage';
import AppointmentsPage from './pages/AppointmentsPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const { token, fetchMe } = useAuthStore();

  useEffect(() => {
    if (token) fetchMe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/result/:id" element={<ResultPage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/therapists" element={<TherapistsPage />} />
            <Route path="/therapists/:id" element={<TherapistDetailPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
