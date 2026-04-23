export type Emotion = 'calm' | 'happy' | 'sad' | 'angry' | 'disgust' | 'fearful' | 'surprise' | 'neutral';

export interface User {
  id: string;
  name: string;
  email: string;
  language: 'fr' | 'en' | 'ar';
}

export interface EmotionAnalysis {
  _id: string;
  emotion: Emotion;
  confidence: number;
  probabilities?: Record<string, number>;
  createdAt: string;
}

export interface Recommendation {
  goal: string;
  message: string;
  activities: string[];
  movies: string[];
  therapy: string[];
  chatbotMode: string;
  chatbotPrompt: string;
}

export interface Movie {
  _id: string;
  title: string;
  emotion: Emotion;
  genre: string[];
  whyRecommended: string;
  poster?: string;
  overview?: string;
  rating?: number;
  watchLink?: string;
}

export interface Therapist {
  _id: string;
  name: string;
  specialty: string[];
  city: string;
  address: string;
  phone?: string;
  consultationType: ('online' | 'in-person')[];
  languages: string[];
  bio?: string;
  rating: number;
  reviewCount: number;
  availability: string[];
  imageUrl?: string;
}

export interface Appointment {
  _id: string;
  therapist: Therapist;
  consultationType: 'online' | 'in-person';
  date: string;
  time: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface ChatMessage {
  _id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}
