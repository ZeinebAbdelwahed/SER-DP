import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { ENV } from '../config/env';
import { Emotion } from '../database/models/EmotionAnalysis';

export interface AIAnalysisResult {
  emotion: Emotion;
  confidence: number;
  probabilities?: Record<string, number>;
}

export const analyzeAudio = async (filePath: string): Promise<AIAnalysisResult> => {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));

  try {
    const response = await axios.post<AIAnalysisResult>(
      `${ENV.PYTHON_AI_URL}/predict`,
      form,
      { headers: form.getHeaders(), timeout: 90000 }
    );
    return response.data;
  } catch (err: any) {
    if (err.code === 'ECONNREFUSED' || err.code === 'ECONNRESET') {
      throw Object.assign(new Error('Le serveur AI est hors ligne. Lance ai_server.py et réessaie.'), { status: 503 });
    }
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      throw Object.assign(new Error('Le serveur AI a mis trop de temps à répondre. Réessaie dans quelques secondes.'), { status: 504 });
    }
    const detail = err.response?.data?.error || err.message || 'Erreur inconnue du serveur AI';
    throw Object.assign(new Error(`Erreur AI : ${detail}`), { status: err.response?.status || 500 });
  }
};
