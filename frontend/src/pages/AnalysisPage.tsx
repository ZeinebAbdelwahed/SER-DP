import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmotionStore } from '../store/emotionStore';

export default function AnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const { analyze, analyzing } = useEmotionStore();
  const navigate = useNavigate();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setError(''); }
  };

  const convertToWav = async (blob: Blob): Promise<File> => {
    const arrayBuffer = await blob.arrayBuffer();
    const audioCtx = new AudioContext({ sampleRate: 16000 });
    const decoded = await audioCtx.decodeAudioData(arrayBuffer);
    await audioCtx.close();

    const numChannels = 1;
    const sampleRate = decoded.sampleRate;
    const samples = decoded.getChannelData(0);
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);
    const writeStr = (off: number, str: string) => { for (let i = 0; i < str.length; i++) view.setUint8(off + i, str.charCodeAt(i)); };
    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, samples.length * 2, true);
    for (let i = 0; i < samples.length; i++) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return new File([buffer], `recording-${Date.now()}.wav`, { type: 'audio/wav' });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      const localChunks: Blob[] = [];
      mr.ondataavailable = (e) => localChunks.push(e.data);
      mr.onstop = async () => {
        const blob = new Blob(localChunks, { type: mr.mimeType });
        try {
          const wavFile = await convertToWav(blob);
          setFile(wavFile);
        } catch {
          // fallback: send as-is
          const f = new File([blob], `recording-${Date.now()}.webm`, { type: blob.type });
          setFile(f);
        }
      };
      mr.start();
      setMediaRecorder(mr);
      setRecording(true);
    } catch {
      setError('Microphone access denied. Please allow microphone access.');
    }
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setRecording(false);
  };

  const handleSubmit = async () => {
    if (!file) { setError('Please select or record an audio file.'); return; }
    try {
      const formData = new FormData();
      formData.append('audio', file);
      const analysis = await analyze(formData);
      navigate(`/result/${analysis._id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Analysis failed. Please try again.');
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">🎙️ Voice Emotion Analysis</h1>
        <p className="text-slate-500 mt-1">Upload or record audio to detect your emotion.</p>
      </div>

      <div className="card space-y-5">
        {/* File upload */}
        <div
          className="border-2 border-dashed border-sky-200 rounded-xl p-8 text-center cursor-pointer hover:border-sky-400 transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          <input ref={fileRef} type="file" accept="audio/*" className="hidden" onChange={handleFile} />
          <p className="text-4xl mb-2">📁</p>
          {file ? (
            <div>
              <p className="font-medium text-slate-700">{file.name}</p>
              <p className="text-xs text-slate-400 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          ) : (
            <div>
              <p className="text-slate-600 font-medium">Click to upload audio</p>
              <p className="text-xs text-slate-400 mt-1">WAV, MP3, WebM, OGG — max 50MB</p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400">or</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Microphone recording */}
        <div className="text-center">
          {recording ? (
            <button
              onClick={stopRecording}
              className="flex items-center gap-2 mx-auto bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-xl transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Stop Recording
            </button>
          ) : (
            <button
              onClick={startRecording}
              className="btn-secondary mx-auto flex items-center gap-2"
            >
              🎤 Record from microphone
            </button>
          )}
        </div>

        {/* Preview */}
        {file && (
          <audio controls src={URL.createObjectURL(file)} className="w-full rounded-lg" />
        )}

        {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={!file || analyzing}
          className="btn-primary w-full"
        >
          {analyzing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analyzing…
            </span>
          ) : (
            '🔍 Analyze Emotion'
          )}
        </button>
      </div>

      <div className="card bg-amber-50 border-amber-100">
        <p className="text-xs text-amber-700">
          <strong>Note:</strong> This tool uses AI to detect emotions from speech and is intended for wellness support only. It is not a medical diagnosis tool.
        </p>
      </div>
    </div>
  );
}
