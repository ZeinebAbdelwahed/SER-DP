import { create } from 'zustand';
import { EmotionAnalysis } from '../types';
import { emotionsAPI } from '../api';

interface EmotionState {
  history: EmotionAnalysis[];
  current: EmotionAnalysis | null;
  analyzing: boolean;
  analyze: (formData: FormData) => Promise<EmotionAnalysis>;
  fetchHistory: () => Promise<void>;
  setCurrent: (a: EmotionAnalysis) => void;
}

export const useEmotionStore = create<EmotionState>((set) => ({
  history: [],
  current: null,
  analyzing: false,

  analyze: async (formData) => {
    set({ analyzing: true });
    try {
      const { data } = await emotionsAPI.analyze(formData);
      set((s) => ({ current: data.analysis, history: [data.analysis, ...s.history], analyzing: false }));
      return data.analysis;
    } catch (err) {
      set({ analyzing: false });
      throw err;
    }
  },

  fetchHistory: async () => {
    const { data } = await emotionsAPI.history();
    set({ history: data });
  },

  setCurrent: (a) => set({ current: a }),
}));
