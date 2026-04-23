import { Response, NextFunction } from 'express';
import axios from 'axios';
import https from 'https';
import { AuthRequest } from '../../middleware/auth';
import ChatMessage from '../../database/models/ChatMessage';
import { RECOMMENDATIONS } from '../../data/recommendations.data';
import { Emotion } from '../../database/models/EmotionAnalysis';
import { ENV } from '../../config/env';
import { v4 as uuidv4 } from 'uuid';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const buildSystemPrompt = (emotion?: Emotion): string => {
  const base = `You are Wellness AI, an empathetic mental wellness assistant integrated into the SER Wellness platform.
Your role is to provide emotional support, coping strategies, and wellness guidance.

RULES:
- Be warm, empathetic, and concise (2-4 sentences max per reply)
- Never diagnose or replace professional therapy
- For crisis or suicidal messages, always urge professional help immediately
- Use emojis sparingly but naturally
- Respond in the same language the user writes in (Arabic, French, or English)
- Give varied, personalized responses, never repeat the exact same reply`;

  if (!emotion) return base;

  const rec = RECOMMENDATIONS[emotion];
  return `${base}

CONTEXT: The user voice was analyzed using AI speech emotion recognition. Detected emotion: **${emotion.toUpperCase()}**
- Wellness goal: ${rec.goal}
- Helpful message: ${rec.message}
- Suggested activities: ${rec.activities.slice(0, 4).join(', ')}
- Therapy approaches: ${rec.therapy.join(', ')}
- Chatbot tone: ${rec.chatbotMode}

Tailor your responses to support someone feeling ${emotion}. Naturally reference relevant activities or therapy approaches when appropriate.`;
};

const fallbackReply = (emotion?: Emotion): string => {
  if (!emotion) return "I'm here to support you. Tell me more about how you're feeling.";
  const rec = RECOMMENDATIONS[emotion];
  return `${rec.message} ${rec.chatbotPrompt}`;
};

export const chat = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { message, emotion, sessionId } = req.body;
    const sid = sessionId || uuidv4();

    const recentMessages = await ChatMessage.find({ user: req.user!.id, sessionId: sid })
      .sort({ createdAt: -1 }).limit(10).lean();
    const conversationHistory = recentMessages.reverse().map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    await ChatMessage.create({ user: req.user!.id, role: 'user', content: message, emotion, sessionId: sid });

    let reply: string;
    try {
      const response = await axios.post(
        GROQ_URL,
        {
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: buildSystemPrompt(emotion as Emotion | undefined) },
            ...conversationHistory,
            { role: 'user', content: message },
          ],
          max_tokens: 300,
          temperature: 0.8,
        },
        {
          headers: {
            Authorization: `Bearer ${ENV.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 45000,
          httpsAgent,
        }
      );
      reply = response.data.choices?.[0]?.message?.content?.trim() || 'I am here for you. How can I help?';
    } catch (groqErr: any) {
      const errMsg = groqErr?.response?.data?.error?.message || groqErr?.message || 'unknown';
      console.error('[Groq ERROR]', errMsg);
      reply = fallbackReply(emotion as Emotion | undefined);
    }

    await ChatMessage.create({ user: req.user!.id, role: 'assistant', content: reply, emotion, sessionId: sid });
    res.json({ reply, sessionId: sid });
  } catch (err) {
    next(err);
  }
};

export const getChatHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.query;
    const filter: Record<string, unknown> = { user: req.user!.id };
    if (sessionId) filter.sessionId = sessionId;
    const messages = await ChatMessage.find(filter).sort({ createdAt: 1 }).limit(100);
    res.json(messages);
  } catch (err) {
    next(err);
  }
};
