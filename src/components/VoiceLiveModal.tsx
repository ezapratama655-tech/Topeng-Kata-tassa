import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Volume2, VolumeX, X, Sparkles, Radio, MessageSquare, AlertCircle } from 'lucide-react';
import { gamelan } from '../utils/audio';
import { speakText, stopSpeaking } from '../services/geminiService';

interface VoiceLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceLiveModal: React.FC<VoiceLiveModalProps> = ({ isOpen, onClose }) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [voiceStatus, setVoiceStatus] = useState<string>('Siap terhubung ke Pemandu Sastra');
  const [transcript, setTranscript] = useState<string>('');
  const [history, setHistory] = useState<Array<{ sender: 'user' | 'pemandu'; text: string }>>([
    {
      sender: 'pemandu',
      text: 'Rahayu. Saya Pemandu Sastra Nusantara. Suara Anda adalah getaran kejujuran. Bicaralah, mari kita telaah wacana atau gubah kata bersama.',
    },
  ]);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [selectedVoice, setSelectedVoice] = useState<string>('Kore');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [audioVolume, setAudioVolume] = useState<number>(0);

  // Initialize Speech Recognition for web browser if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'id-ID';

        recognition.onstart = () => {
          setIsListening(true);
          setVoiceStatus('Mendengarkan suara Anda...');
          setErrorMessage(null);
        };

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcriptText = event.results[current][0].transcript;
          setTranscript(transcriptText);

          if (event.results[current].isFinal) {
            handleProcessVoiceInput(transcriptText);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setErrorMessage('Izin mikrofon tidak diberikan. Silakan aktifkan mikrofon di peramban.');
          } else {
            setVoiceStatus('Siap mendengarkan kembali.');
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Handle processing voice input and responding via Gemini TTS
  const handleProcessVoiceInput = async (spokenText: string) => {
    if (!spokenText.trim()) return;

    gamelan.playBonang(587.33);
    const userItem = { sender: 'user' as const, text: spokenText };
    setHistory(prev => [...prev, userItem]);
    setVoiceStatus('Pemandu Sastra sedang merenungkan jawaban...');
    setIsConnecting(true);

    try {
      // Call Gemini 3.8 Flash Chat endpoint via backend
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...history.map(h => ({ role: h.sender === 'pemandu' ? 'model' : 'user', content: h.text })),
            { role: 'user', content: spokenText },
          ],
          systemInstruction:
            'Anda adalah Pemandu Sastra Nusantara TOPENG dalam percakapan suara interaktif. ' +
            'Jawablah dalam 1 hingga 3 kalimat yang padat, berwibawa, sarat empati kebudayaan, puitis namun lugas, dan nyaman didengar secara lisan. ' +
            'Gunakan Bahasa Indonesia yang menyejukkan hati dan membuka kesadaran kritis.',
        }),
      });

      const data = await res.json();
      const reply = data.reply || 'Kata-kata Anda menggetarkan nurani bumi Nusantara.';

      const pemanduItem = { sender: 'pemandu' as const, text: reply };
      setHistory(prev => [...prev, pemanduItem]);
      setTranscript('');
      setIsConnecting(false);

      // Play vocal speech using Gemini TTS
      setIsSpeaking(true);
      setVoiceStatus('Pemandu Sastra sedang bertutur...');
      gamelan.playBonang(659.25);

      await speakText(reply, selectedVoice);
      setIsSpeaking(false);
      setVoiceStatus('Siap mendengarkan kembali. Klik mikrofon untuk bersuara.');
    } catch (err: any) {
      console.error('Error handling voice:', err);
      setIsConnecting(false);
      setIsSpeaking(false);
      setErrorMessage(err.message || 'Gagal memproses suara. Pastikan server aktif.');
      setVoiceStatus('Terjadi kendala.');
    }
  };

  const toggleListening = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setVoiceStatus('Mikrofon dihentikan.');
    } else {
      gamelan.playWoodClack();
      setTranscript('');
      setErrorMessage(null);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // If already started or browser state issue, restart
          recognitionRef.current.stop();
          setTimeout(() => recognitionRef.current?.start(), 150);
        }
      } else {
        // Fallback for browsers without Web Speech API
        const sampleQuery = prompt(
          'Peramban belum mendukung pengenalan suara otomatis langsung. Masukkan teks ucapan Anda di sini:',
          'Ki Pemandu, bagaimana membongkar eufemisme di berita bencana?'
        );
        if (sampleQuery) {
          handleProcessVoiceInput(sampleQuery);
        }
      }
    }
  };

  const handleStopAll = () => {
    stopSpeaking();
    setIsSpeaking(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsListening(false);
    onClose();
  };

  const handlePromptPreset = (promptText: string) => {
    handleProcessVoiceInput(promptText);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#090d1f] border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="p-5 border-b border-amber-500/30 bg-gradient-to-r from-amber-950/60 via-[#101736] to-teal-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-lg border border-amber-300">
              <Radio className="w-5 h-5 text-slate-950 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-playfair text-amber-200">
                  Percakapan Suara Langsung
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  Gemini Live & TTS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Dialog interaktif lisan bersama Pemandu Sastra Nusantara
              </p>
            </div>
          </div>

          <button
            onClick={handleStopAll}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* VOICE VISUALIZER & STATUS */}
        <div className="p-6 flex flex-col items-center justify-center bg-gradient-to-b from-[#0c132c] to-[#070b1a] relative border-b border-slate-800">
          
          {/* Animated Halo Rings */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Outer Pulsing Wave */}
            <motion.div
              animate={{
                scale: isListening ? [1, 1.35, 1] : isSpeaking ? [1, 1.25, 1] : 1,
                opacity: isListening ? [0.4, 0.9, 0.4] : isSpeaking ? [0.3, 0.8, 0.3] : 0.2,
              }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className={`absolute inset-0 rounded-full blur-md ${
                isListening
                  ? 'bg-gradient-to-tr from-rose-500 to-amber-400'
                  : isSpeaking
                  ? 'bg-gradient-to-tr from-teal-400 to-amber-300'
                  : 'bg-slate-700/30'
              }`}
            />

            {/* Middle Celestial Ring */}
            <div className="absolute inset-2 rounded-full border border-amber-400/30 animate-spin-slow" />

            {/* Core Interactive Mic Button */}
            <button
              onClick={toggleListening}
              className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all transform cursor-pointer ${
                isListening
                  ? 'bg-gradient-to-br from-rose-600 to-amber-600 text-white shadow-rose-500/50 scale-105 ring-4 ring-rose-400/50'
                  : isSpeaking
                  ? 'bg-gradient-to-br from-teal-500 to-amber-500 text-slate-950 shadow-teal-500/50 ring-4 ring-teal-300/50'
                  : 'bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 hover:scale-105 shadow-amber-500/30'
              }`}
              title={isListening ? 'Hentikan mikrofon' : 'Mulai berbicara'}
            >
              {isListening ? (
                <>
                  <MicOff className="w-8 h-8 animate-bounce" />
                  <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">Hening</span>
                </>
              ) : isSpeaking ? (
                <>
                  <Volume2 className="w-8 h-8 animate-pulse" />
                  <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">Bertutur</span>
                </>
              ) : (
                <>
                  <Mic className="w-8 h-8" />
                  <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">Bicara</span>
                </>
              )}
            </button>
          </div>

          {/* Status Label */}
          <div className="mt-4 text-center">
            <p className={`text-sm font-medium ${isListening ? 'text-rose-300' : isSpeaking ? 'text-teal-300' : 'text-amber-300'}`}>
              {voiceStatus}
            </p>
            {transcript && (
              <p className="mt-2 text-xs italic text-slate-300 bg-slate-900/80 px-4 py-1.5 rounded-full border border-amber-500/20 max-w-md line-clamp-2">
                "{transcript}"
              </p>
            )}
            {errorMessage && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-400 bg-rose-950/60 px-3 py-1 rounded-full border border-rose-500/40">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Voice Character Selection */}
          <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
            <span>Pilihan Suara Pemandu:</span>
            <div className="flex gap-1.5">
              {[
                { id: 'Kore', label: 'Kore (Hangat-Tenang)' },
                { id: 'Puck', label: 'Puck (Lugas-Kritis)' },
                { id: 'Fenrir', label: 'Fenrir (Wibawa-Kuat)' },
              ].map(v => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVoice(v.id)}
                  className={`px-2.5 py-1 rounded-lg border text-xs cursor-pointer transition-colors ${
                    selectedVoice === v.id
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* DIALOGUE TRANSCRIPT THREAD */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-60 bg-[#070b18]">
          {history.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${item.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="text-[10px] font-mono text-slate-400 mb-1 flex items-center gap-1">
                {item.sender === 'user' ? (
                  <span>Anda (Suara Lisan)</span>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span className="text-amber-300 font-bold">Pemandu Sastra</span>
                  </>
                )}
              </div>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  item.sender === 'user'
                    ? 'bg-amber-600/30 text-amber-100 border border-amber-500/40 rounded-br-none'
                    : 'bg-[#101736] text-slate-200 border border-slate-700/80 rounded-bl-none'
                }`}
              >
                {item.text}
              </div>
            </div>
          ))}
        </div>

        {/* QUICK TOPIC PROMPTS */}
        <div className="p-3 bg-[#0a0f24] border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 shrink-0 font-medium">Topik Suara Cepat:</span>
          {[
            'Ki, apa arti di balik eufemisme Karhutla?',
            'Bimbing saya menulis puisi empati nelayan pesisir',
            'Bagaimana cara membedah janji manis pidato?',
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handlePromptPreset(prompt)}
              disabled={isConnecting || isListening || isSpeaking}
              className="shrink-0 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-amber-950/70 text-slate-300 hover:text-amber-200 border border-slate-700/60 hover:border-amber-500/50 cursor-pointer transition-colors disabled:opacity-50"
            >
              "{prompt}"
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
