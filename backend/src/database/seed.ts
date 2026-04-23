import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { ENV } from '../config/env';
import Therapist from '../database/models/Therapist';
import Movie from '../database/models/Movie';

const therapists = [
  { name: 'Dr. Sonia Ben Salah', specialty: ['anxiety', 'depression', 'CBT'], city: 'Tunis', address: 'Rue de la Liberté, El Menzah', phone: '+216 71 000 001', consultationType: ['online', 'in-person'], languages: ['Arabic', 'French'], bio: 'Certified CBT therapist with 12 years experience.', rating: 4.8, reviewCount: 34, availability: ['Mon', 'Wed', 'Fri'] },
  { name: 'Dr. Karim Trabelsi', specialty: ['anger management', 'stress', 'behavioral therapy'], city: 'Sfax', address: 'Avenue Habib Bourguiba, Centre Ville', phone: '+216 74 000 002', consultationType: ['in-person'], languages: ['Arabic', 'French', 'English'], bio: 'Specialist in anger management and stress resilience.', rating: 4.6, reviewCount: 21, availability: ['Tue', 'Thu', 'Sat'] },
  { name: 'Dr. Nadia Chaabane', specialty: ['trauma', 'PTSD', 'mindfulness'], city: 'Sousse', address: 'Résidence Jasmins, Sousse Nord', phone: '+216 73 000 003', consultationType: ['online', 'in-person'], languages: ['Arabic', 'French'], bio: 'Trauma-focused therapist with mindfulness integration.', rating: 4.9, reviewCount: 57, availability: ['Mon', 'Tue', 'Thu', 'Fri'] },
  { name: 'Dr. Yassine Mejri', specialty: ['couples therapy', 'family therapy', 'depression'], city: 'Tunis', address: 'Les Berges du Lac, Lac 1', phone: '+216 71 000 004', consultationType: ['online', 'in-person'], languages: ['Arabic', 'French'], bio: 'Family and couples specialist with 10 years practice.', rating: 4.5, reviewCount: 18, availability: ['Wed', 'Fri', 'Sat'] },
  { name: 'Dr. Amira Hamdi', specialty: ['child psychology', 'adolescent', 'anxiety'], city: 'Bizerte', address: 'Centre Commercial Bizerte, Appt 5', phone: '+216 72 000 005', consultationType: ['in-person'], languages: ['Arabic', 'French'], bio: 'Child and adolescent psychology expert.', rating: 4.7, reviewCount: 29, availability: ['Mon', 'Wed', 'Fri'] },
  { name: 'Dr. Mehdi Khadhraoui', specialty: ['positive psychology', 'coaching', 'motivation'], city: 'Monastir', address: 'Route de Tunis, Résidence Palmier', phone: '+216 73 000 006', consultationType: ['online'], languages: ['Arabic', 'French', 'English'], bio: 'Certified positive psychology coach and motivational speaker.', rating: 4.4, reviewCount: 12, availability: ['Tue', 'Thu'] },
  { name: 'Dr. Fatma Rekik', specialty: ['eating disorders', 'body image', 'CBT'], city: 'Tunis', address: 'Avenue Mohamed V, Centre', phone: '+216 71 000 007', consultationType: ['online', 'in-person'], languages: ['Arabic', 'French'], bio: 'Specialist in eating disorders and body perception.', rating: 4.6, reviewCount: 22, availability: ['Mon', 'Tue', 'Fri'] },
  { name: 'Dr. Riadh Jomni', specialty: ['addiction', 'substance abuse', 'behavioral therapy'], city: 'Gabès', address: 'Route de Medenine, Gabès Centre', phone: '+216 75 000 008', consultationType: ['in-person'], languages: ['Arabic', 'French'], bio: 'Addiction recovery specialist with hospital background.', rating: 4.3, reviewCount: 9, availability: ['Mon', 'Wed', 'Thu'] },
];

const movies = [
  { title: 'Into the Wild', emotion: 'calm', genre: ['Drama', 'Adventure'], whyRecommended: 'Inspires peace and reflection on what truly matters.', rating: 8.1 },
  { title: 'The Secret Life of Walter Mitty', emotion: 'calm', genre: ['Comedy', 'Drama'], whyRecommended: 'Encourages gentle exploration and inner peace.', rating: 7.3 },
  { title: 'La La Land', emotion: 'happy', genre: ['Romance', 'Musical'], whyRecommended: 'Celebrate joy and creativity with this uplifting musical.', rating: 8.0 },
  { title: 'The Intouchables', emotion: 'happy', genre: ['Drama', 'Comedy'], whyRecommended: 'A warm story about friendship that lifts the spirit.', rating: 8.5 },
  { title: 'The Pursuit of Happyness', emotion: 'sad', genre: ['Drama', 'Biography'], whyRecommended: 'A moving story of resilience that offers hope.', rating: 8.0 },
  { title: 'Forrest Gump', emotion: 'sad', genre: ['Drama', 'Romance'], whyRecommended: 'A timeless reminder that life is beautiful despite hardships.', rating: 8.8 },
  { title: 'Inside Out', emotion: 'sad', genre: ['Animation', 'Family'], whyRecommended: 'Beautifully validates all emotions including sadness.', rating: 8.1 },
  { title: 'Amélie', emotion: 'sad', genre: ['Romance', 'Comedy'], whyRecommended: 'A whimsical film that warms the heart.', rating: 8.3 },
  { title: 'Peaceful Warrior', emotion: 'angry', genre: ['Drama', 'Sport'], whyRecommended: 'Teaches how to channel anger into inner strength.', rating: 7.2 },
  { title: 'Kung Fu Panda', emotion: 'angry', genre: ['Animation', 'Comedy'], whyRecommended: 'Shows that peace and strength come from within.', rating: 7.6 },
  { title: 'Eat Pray Love', emotion: 'disgust', genre: ['Drama', 'Romance'], whyRecommended: 'A journey of sensory and spiritual renewal.', rating: 5.8 },
  { title: 'Life of Pi', emotion: 'fearful', genre: ['Drama', 'Adventure'], whyRecommended: 'Shows courage and survival through overwhelming fear.', rating: 7.9 },
  { title: 'Harry Potter and the Prisoner of Azkaban', emotion: 'fearful', genre: ['Fantasy', 'Adventure'], whyRecommended: 'Facing fears with courage and friendship.', rating: 7.9 },
  { title: 'Interstellar', emotion: 'surprise', genre: ['Sci-Fi', 'Drama'], whyRecommended: 'Invites wonder and expanded thinking beyond the familiar.', rating: 8.6 },
  { title: 'Inception', emotion: 'surprise', genre: ['Sci-Fi', 'Thriller'], whyRecommended: 'A mind-bending journey that rewards reflection.', rating: 8.8 },
  { title: 'The Social Dilemma', emotion: 'neutral', genre: ['Documentary'], whyRecommended: 'Stimulates critical thinking and awareness.', rating: 7.6 },
  { title: 'Chef', emotion: 'neutral', genre: ['Comedy', 'Drama'], whyRecommended: 'Inspires new beginnings and doing what you love.', rating: 7.3 },
];

const seed = async () => {
  await mongoose.connect(ENV.MONGO_URI as string);
  await Therapist.deleteMany({});
  await Movie.deleteMany({});
  await Therapist.insertMany(therapists);
  await Movie.insertMany(movies);
  console.log('Seeded therapists and movies ✓');
  await mongoose.disconnect();
};

seed().catch((err) => { console.error(err); process.exit(1); });
