import { Emotion } from '../database/models/EmotionAnalysis';

interface RecommendationData {
  goal: string;
  message: string;
  activities: string[];
  movies: string[];
  therapy: string[];
  chatbotMode: string;
  chatbotPrompt: string;
}

export const RECOMMENDATIONS: Record<Emotion, RecommendationData> = {
  calm: {
    goal: 'Maintain balance',
    message: 'You are calm. This is a good moment to recenter yourself or move forward gently.',
    activities: [
      'Light meditation',
      'Conscious breathing',
      'Reading a book or spiritual text',
      'Gratitude journaling',
      'Peaceful walk',
      'Soft music',
      'Planning goals',
    ],
    movies: ['Into the Wild', 'The Secret Life of Walter Mitty'],
    therapy: ['Guided meditation', 'Mindfulness'],
    chatbotMode: 'reflective',
    chatbotPrompt: 'What are you grateful for today?',
  },
  happy: {
    goal: 'Reinforce and share positivity',
    message: 'Share your happiness with someone today.',
    activities: [
      'Call a loved one',
      'Listen to joyful music',
      'Dance',
      'Write what made you happy',
      'Do a good deed',
    ],
    movies: ['La La Land', 'The Intouchables'],
    therapy: ['Positive psychology', 'Personal development coaching'],
    chatbotMode: 'sharing',
    chatbotPrompt: 'What made you smile today? Share it!',
  },
  sad: {
    goal: 'Soothe and emotionally support',
    message: 'You are not alone. Try a gentle activity to support yourself.',
    activities: [
      'Listen to comforting music',
      'Spiritual reading or prayer',
      'Watch a light comforting film',
      'Journaling',
      'Talk to someone you trust',
      'Short walk',
    ],
    movies: ['The Pursuit of Happyness', 'Forrest Gump', 'Inside Out', 'Amélie'],
    therapy: ['CBT', 'Supportive talk therapy'],
    chatbotMode: 'listening',
    chatbotPrompt: 'What made you feel sad today?',
  },
  angry: {
    goal: 'Release tension safely',
    message: 'Take a pause and release your energy in a healthy way.',
    activities: [
      'Intense sport',
      'Deep breathing',
      'Pause before reacting',
      'Calming music',
      'Write what is bothering you',
    ],
    movies: ['Peaceful Warrior', 'Kung Fu Panda'],
    therapy: ['Anger management', 'Behavioral therapy'],
    chatbotMode: 'de-escalation',
    chatbotPrompt: "Let's take 30 seconds to breathe together.",
  },
  disgust: {
    goal: 'Reset comfort and sensory state',
    message: 'Change your environment and reconnect with comfort.',
    activities: [
      'Step away from the source',
      'Wash / refresh',
      'Watch something pleasant',
      'Relaxing music',
      'Focus on a clean pleasant activity',
    ],
    movies: ['Eat Pray Love'],
    therapy: ['Light exposure therapy', 'Sensory reset support'],
    chatbotMode: 'grounding',
    chatbotPrompt: 'Can you describe one thing around you that feels clean or comfortable?',
  },
  fearful: {
    goal: 'Reassure and stabilize',
    message: 'You are safe. Breathe slowly and reconnect with the present.',
    activities: [
      'Slow breathing',
      'Grounding exercise',
      'Talk to someone',
      'Calming voice or music',
      'Remind yourself that fear is temporary',
    ],
    movies: ['Life of Pi', 'Harry Potter and the Prisoner of Azkaban'],
    therapy: ['Anxiety-focused CBT', 'Exposure therapy'],
    chatbotMode: 'reassuring',
    chatbotPrompt: 'You are safe. Tell me what is worrying you.',
  },
  surprise: {
    goal: 'Understand and stabilize',
    message: 'Take a moment to understand what you are feeling.',
    activities: [
      'Pause and analyze',
      'Breathe calmly',
      'Write what happened',
      'Celebrate if positive',
      'Seek solution if negative',
    ],
    movies: ['Interstellar', 'Inception'],
    therapy: ['Cognitive reflection support'],
    chatbotMode: 'reflective',
    chatbotPrompt: 'Something surprised you. How do you feel about it now?',
  },
  neutral: {
    goal: 'Stimulate and create meaning',
    message: 'This can be a good moment to explore, create, or move forward.',
    activities: [
      'Try a new activity',
      'Learn something new',
      'Light exercise',
      'Organize your day',
      'Socialize',
    ],
    movies: ['The Social Dilemma', 'Chef'],
    therapy: ['Motivation coaching', 'Orientation support'],
    chatbotMode: 'action',
    chatbotPrompt: 'What is one small thing you could do today to feel more alive?',
  },
};
