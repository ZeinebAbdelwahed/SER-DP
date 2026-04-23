import { useEffect, useRef, useState } from 'react';
import { chatAPI } from '../api';
import { ChatMessage, Emotion } from '../types';
import { useEmotionStore } from '../store/emotionStore';

const SUGGESTED_PROMPTS: Record<string, string[]> = {
  sad: ["I'm feeling really down today", "I don't know how to feel better", "Can you listen to me?"],
  angry: ["I'm so frustrated right now", "Help me calm down", "Let's do a breathing exercise"],
  fearful: ["I feel anxious and scared", "Help me feel safe", "What can I do right now?"],
  happy: ["I want to share something good!", "I had a great day", "How can I share my positivity?"],
  default: ["How are you?", "I need some support today", "What should I do to feel better?"],
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { current } = useEmotionStore();
  const emotion = current?.emotion;

  const prompts = SUGGESTED_PROMPTS[emotion || 'default'] || SUGGESTED_PROMPTS.default;

  useEffect(() => {
    // Welcome message
    setMessages([{
      role: 'assistant',
      content: emotion
        ? `Hi! I detected that you're feeling ${emotion}. I'm here to support you. How can I help?`
        : "Hello! I'm your wellness assistant. I'm here to listen and support you. How are you feeling today?",
    }]);
  }, [emotion]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const { data } = await chatAPI.send({ message: msg, emotion: emotion as Emotion, sessionId });
      setSessionId(data.sessionId);
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: "I'm here for you. Sometimes technology has a glitch. Please try again or consider reaching out to a professional." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 6rem)' }}>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-800">💬 Wellness Chatbot</h1>
        <p className="text-slate-500 text-sm mt-1">Safe, supportive conversation — not a substitute for professional help.</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
              m.role === 'user'
                ? 'bg-sky-500 text-white rounded-br-sm'
                : 'bg-white border border-slate-100 text-slate-700 rounded-bl-sm shadow-sm'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts */}
      <div className="flex gap-2 flex-wrap my-3">
        {prompts.map((p, i) => (
          <button
            key={i}
            onClick={() => send(p)}
            className="text-xs bg-sky-50 text-sky-600 border border-sky-200 px-3 py-1.5 rounded-full hover:bg-sky-100 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Type your message…"
          className="input flex-1"
          disabled={loading}
        />
        <button onClick={() => send()} disabled={!input.trim() || loading} className="btn-primary px-5">
          Send
        </button>
      </div>

      <p className="text-xs text-center text-slate-400 mt-2">
        This chatbot provides wellness support only. For mental health emergencies, please contact a professional.
      </p>
    </div>
  );
}
