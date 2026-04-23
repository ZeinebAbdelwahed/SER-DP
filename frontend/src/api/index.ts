import api from './client';
import { EmotionAnalysis, Recommendation, Movie, Therapist, Appointment, ChatMessage } from '../types';

// Auth
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<{ token: string; user: any }>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<{ token: string; user: any }>('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// Emotions
export const emotionsAPI = {
  analyze: (formData: FormData) =>
    api.post<{ analysis: EmotionAnalysis }>('/emotions/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  history: () => api.get<EmotionAnalysis[]>('/emotions/history'),
  getById: (id: string) => api.get<EmotionAnalysis>(`/emotions/${id}`),
};

// Recommendations
export const recommendationsAPI = {
  get: (emotion: string) => api.get<Recommendation>(`/recommendations/${emotion}`),
  activities: (emotion: string) => api.get(`/recommendations/${emotion}/activities`),
  therapy: (emotion: string) => api.get(`/recommendations/${emotion}/therapy`),
  chatbotPrompts: (emotion: string) => api.get(`/recommendations/${emotion}/chatbot-prompts`),
};

// Movies
export const moviesAPI = {
  byEmotion: (emotion: string) => api.get<Movie[]>(`/movies/by-emotion/${emotion}`),
  search: (query: string) => api.get(`/movies/search?query=${encodeURIComponent(query)}`),
  getById: (id: string) => api.get<Movie>(`/movies/${id}`),
};

// Therapists
export const therapistsAPI = {
  list: (params?: { city?: string; specialty?: string; consultationType?: string }) =>
    api.get<Therapist[]>('/therapists', { params }),
  nearby: (city?: string) => api.get<Therapist[]>('/therapists/nearby', { params: { city } }),
  getById: (id: string) => api.get<Therapist>(`/therapists/${id}`),
};

// Appointments
export const appointmentsAPI = {
  create: (data: any) => api.post<Appointment>('/appointments', data),
  myAppointments: () => api.get<Appointment[]>('/appointments/my'),
  cancel: (id: string) => api.patch<Appointment>(`/appointments/${id}/cancel`),
};

// Chat
export const chatAPI = {
  send: (data: { message: string; emotion?: string; sessionId?: string }) =>
    api.post<{ reply: string; sessionId: string }>('/chat', data),
  history: (sessionId?: string) =>
    api.get<ChatMessage[]>('/chat/history', { params: sessionId ? { sessionId } : {} }),
};

// Profile
export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data: any) => api.patch('/profile', data),
};
