import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, Sparkles, X, ChevronRight, BookOpen, Volume2, 
  HelpCircle, Feather, Compass, Send, Mic, Radio, Loader2, VolumeX, RefreshCw 
} from 'lucide-react';
import { TabId } from './Header';
import { gamelan } from '../utils/audio';
import { sendChatMessage, speakText, stopSpeaking, ChatMessage } from '../services/geminiService';

interface PemanduBatikProps {
  activeTab: TabId;
  onNavigateTab: (tab: TabId) => void;
  onOpenVoice?: () => void;
}

const WEJANGAN_LIST = [
  {
    quote: "Ajining diri dumunung ing lathi, ajining raga saka busana.",
    meaning: "Kehormatan seseorang terpancar dari kejujuran tutur katanya, dan martabat diri terjaga dari keluhuran pekertinya.",
    source: "Falsafah Budaya Jawa Nusantara",
  },
  {
    quote: "Bahasa yang menutup-nutupi penderitaan adalah bahasa yang telah kehilangan jiwanya.",
    meaning: "Ketika kata-kata hanya dipakai mempercantik citra di atas penderitaan rakyat, sastra harus menjadi cermin pembuka topeng.",
    source: "Refleksi Etika Bahasa TOPENG",
  },
  {
    quote: "Urip iku urup, urap, lan nguripi sesami.",
    meaning: "Hidup itu menyala, berbagi cahaya, dan memberi kehidupan bagi sekeliling kita.",
    source: "Kearifan Leluhur",
  },
  {
    quote: "Bumi tidak pernah berdusta tentang rasa sakitnya; hanya manusia yang kerap memanipulasi kata.",
    meaning: "Asap, kekeringan, dan banjir adalah bahasa alam yang menuntut ketulusan tindakan nyata, bukan sekadar eufemisme.",
    source: "Pujangga Rimba",
  },
];

export const PemanduBatik: React.FC<PemanduBatikProps> = ({ 
  activeTab, 
  onNavigateTab,
  onOpenVoice 
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [activeMode, setActiveMode] = useState<'panduan' | 'wejangan' | 'chat'>('chat');
  const [wejanganIndex, setWejanganIndex] = useState<number>(0);

  // Chatbot State (Gemini 3.8 Flash)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: 'Rahayu, Sahabat Budaya! Saya Pemandu Sastra Nusantara berbasis Gemini AI. Tanyakan apa saja seputar telaah wacana, kritik sastra, padanan diksi Nusantara, atau mintalah saya menelaah suatu klaim berita.',
      time: 'Terkini',
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isBotThinking, setIsBotThinking] = useState<boolean>(false);
  const [playingAudioIndex, setPlayingAudioIndex] = useState<number | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat thread to bottom on new messages
  useEffect(() => {
    if (activeMode === 'chat' && chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isBotThinking, activeMode]);

  // Tab-specific guidance
  const getTabGuide = (tab: TabId) => {
    switch (tab) {
      case 'pelacak':
        return {
          title: 'Panduan Pelacak Topeng',
          greeting: 'Rahayu, Sahabat Budaya! Di sinilah kita membedah topeng bahasa.',
          tip: "Coba pilih 'Contoh 1 (Karhutla)' atau tempelkan klaim berita yang Anda ragukan. Gunakan fitur 'Verifikasi Google Search' untuk memvalidasi fakta secara langsung!",
          actionText: 'Uji Kacamata Empati & Auto-Debiaser untuk melihat sisi manusiawi di baliknya.',
        };
      case 'refleksi':
        return {
          title: 'Panduan Refleksi Topeng',
          greeting: 'Mari singkap tabir jurang narasi vs angka empiris nyata.',
          tip: "Geser tombol lapisan '1. Kataku', '2. Angkaku', dan '3. Cerminku' untuk melihat disparitas data Karhutla Kalteng 2026 (+850% selisih). Lalu uji peran Anda dalam Simulasi Narasi Publik!",
          actionText: 'Pilihan kata yang Anda buat akan langsung memengaruhi tingkat kepanikan dan kepercayaan publik.',
        };
      case 'museum':
        return {
          title: 'Panduan Museum Sastra',
          greeting: 'Selamat datang di persemayaman suara nurani Nusantara.',
          tip: 'Geser gulungan lontar tradisional secara horizontal atau klik pin pulau pada peta. Di Studio Gubahan Kertas Lontar sebelah kanan, tuangkanlah rasa empati Anda menjadi puisi atau surat warga.',
          actionText: "Gunakan 'Inspirasi Prompt' bila Anda memerlukan percikan ide menulis.",
        };
      case 'pendamping':
        return {
          title: 'Panduan Pendamping Bahasa',
          greeting: 'Mari perkaya tulisan kita dengan keindahan diksi tanah air.',
          tip: "Gantikan istilah birokrasi yang dingin ('deforestasi', 'anomali') dengan padanan sastra puitis Nusantara ('luka belantara', 'amuk musim'). Anda juga dapat berdiskusi langsung di kotak Konsultasi Pakar Bahasa.",
          actionText: 'Tuliskan satu draf kalimat Anda untuk mendapatkan telaah rasa dari pakar.',
        };
    }
  };

  const guide = getTabGuide(activeTab);

  const handleNextWejangan = () => {
    gamelan.playWoodClack();
    setWejanganIndex(prev => (prev + 1) % WEJANGAN_LIST.length);
  };

  const handleToggleOpen = () => {
    gamelan.playWoodClack();
    setIsOpen(!isOpen);
  };

  // Submit message to Gemini 3.8 Flash Chatbot
  const handleSendChat = async (overridePrompt?: string) => {
    const textToSend = overridePrompt || chatInput;
    if (!textToSend.trim() || isBotThinking) return;

    gamelan.playBonang(523.25);
    const userMsg: ChatMessage = {
      role: 'user',
      content: textToSend.trim(),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    const newThread = [...chatMessages, userMsg];
    setChatMessages(newThread);
    setChatInput('');
    setIsBotThinking(true);

    try {
      const reply = await sendChatMessage(newThread);
      gamelan.playBonang(659.25);
      setChatMessages(prev => [
        ...prev,
        {
          role: 'model',
          content: reply,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setChatMessages(prev => [
        ...prev,
        {
          role: 'model',
          content: 'Mohon maaf, saat ini sedang terjadi kendala sambungan ke nalar pujangga. Silakan coba lagi sejenak.',
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsBotThinking(false);
    }
  };

  // Speak bot response using Gemini TTS
  const handleSpeakBotReply = async (text: string, index: number) => {
    if (playingAudioIndex === index) {
      stopSpeaking();
      setPlayingAudioIndex(null);
      return;
    }

    gamelan.playWoodClack();
    setPlayingAudioIndex(index);
    try {
      await speakText(text);
    } finally {
      setPlayingAudioIndex(null);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none">
      {/* GUIDE AVATAR ICON BUTTON (WHEN MINIMIZED) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onClick={handleToggleOpen}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-700 shadow-2xl border-2 border-amber-300 flex items-center gap-2 group cursor-pointer"
            title="Buka Pemandu Sastra AI"
          >
            <div className="relative w-14 h-14 rounded-full overflow-hidden bg-[#0a1128] border border-amber-400/50 flex items-center justify-center shadow-inner">
              <svg viewBox="0 0 100 100" className="w-12 h-12">
                <path d="M28 35 Q50 15 72 35 Q80 48 70 52 Q50 48 30 52 Q20 48 28 35 Z" fill="#451a03" />
                <path d="M30 38 Q50 25 70 38" stroke="#f59e0b" strokeWidth="3" strokeDasharray="3 2" />
                <circle cx="73" cy="46" r="4" fill="#78350f" />
                <ellipse cx="50" cy="52" rx="18" ry="16" fill="#fcd34d" />
                <path d="M42 50 Q45 48 48 50" stroke="#451a03" strokeWidth="2" fill="none" />
                <path d="M52 50 Q55 48 58 50" stroke="#451a03" strokeWidth="2" fill="none" />
                <path d="M46 58 Q50 62 54 58" stroke="#78350f" strokeWidth="2" fill="none" />
                <path d="M44 56 Q50 54 56 56" stroke="#451a03" strokeWidth="1.5" fill="none" />
                <path d="M25 68 Q50 62 75 68 L85 100 L15 100 Z" fill="#78350f" />
                <path d="M30 72 L45 98 M40 70 L55 98 M50 70 L65 98 M60 72 L75 98" stroke="#fcd34d" strokeWidth="2.5" />
                <path d="M50 64 L50 98" stroke="#d97706" strokeWidth="3" />
              </svg>
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-black animate-pulse" />
            </div>

            <div className="hidden sm:flex flex-col text-left pr-3">
              <span className="text-[11px] font-bold text-slate-950 font-serif leading-tight">
                Pemandu Sastra
              </span>
              <span className="text-[9px] text-amber-950/80 font-mono flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-900" />
                Gemini AI Chat
              </span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* EXPANDED DIALOGUE & CHAT CARD */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 30 }}
            transition={{ type: 'spring', stiffness: 280, damping: 25 }}
            className="w-[320px] sm:w-[410px] glass-panel-gold rounded-3xl p-4 shadow-2xl border-2 border-amber-500/50 space-y-3 relative flex flex-col max-h-[82vh]"
          >
            {/* TOP HEADER */}
            <div className="flex items-center justify-between border-b border-amber-500/25 pb-2.5">
              <div className="flex items-center gap-2.5">
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                  className="w-10 h-10 rounded-2xl bg-[#0a1128] border-2 border-amber-400 p-0.5 flex items-center justify-center shadow-lg relative shrink-0 overflow-hidden"
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                      <linearGradient id="batikGold2" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#b45309" />
                      </linearGradient>
                    </defs>
                    <path d="M26 36 Q50 16 74 36 Q82 48 72 52 Q50 48 28 52 Q18 48 26 36 Z" fill="#3b1704" />
                    <path d="M30 40 Q50 28 70 40" stroke="url(#batikGold2)" strokeWidth="3" strokeDasharray="3 2" />
                    <circle cx="74" cy="48" r="4.5" fill="#78350f" />
                    <ellipse cx="50" cy="54" rx="18" ry="16" fill="#fde68a" />
                    <circle cx="43" cy="51" r="5" stroke="#78350f" strokeWidth="1.8" fill="none" />
                    <circle cx="57" cy="51" r="5" stroke="#78350f" strokeWidth="1.8" fill="none" />
                    <circle cx="43" cy="51" r="1.5" fill="#451a03" />
                    <circle cx="57" cy="51" r="1.5" fill="#451a03" />
                    <path d="M46 61 Q50 64 54 61" stroke="#92400e" strokeWidth="1.8" fill="none" />
                    <path d="M22 70 Q50 64 78 70 L90 100 L10 100 Z" fill="#451a03" />
                    <path d="M25 76 L42 98 M35 74 L52 98 M45 74 L62 98 M55 74 L72 98 M65 76 L82 98" stroke="#f59e0b" strokeWidth="2.5" />
                  </svg>
                </motion.div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-playfair font-bold text-sm text-gold-gradient leading-tight">
                      Pemandu Sastra
                    </h4>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Gemini 3.8
                    </span>
                  </div>
                  <p className="text-[10px] text-amber-200/75 font-serif">
                    Penuntun Bahasa & Nalar Kritis Nusantara
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Voice Live Trigger */}
                {onOpenVoice && (
                  <button
                    onClick={() => {
                      gamelan.playBonang(587.33);
                      onOpenVoice();
                    }}
                    title="Buka Percakapan Suara Langsung"
                    className="p-1.5 rounded-lg bg-teal-900/60 hover:bg-teal-800 text-teal-300 border border-teal-500/30 cursor-pointer transition-colors"
                  >
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                  </button>
                )}
                {/* Close Button */}
                <button
                  onClick={handleToggleOpen}
                  className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                  aria-label="Tutup Pemandu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* TAB SELECTOR: CHAT AI / PETUNJUK RUANG / WEJANGAN */}
            <div className="flex bg-[#040914] p-1 rounded-xl border border-amber-500/25 text-[11px] font-semibold gap-1">
              <button
                onClick={() => {
                  gamelan.playWoodClack();
                  setActiveMode('chat');
                }}
                className={`flex-1 py-1 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  activeMode === 'chat'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-amber-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Tanya AI</span>
              </button>
              <button
                onClick={() => {
                  gamelan.playWoodClack();
                  setActiveMode('panduan');
                }}
                className={`flex-1 py-1 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  activeMode === 'panduan'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-amber-200'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Panduan</span>
              </button>
              <button
                onClick={() => {
                  gamelan.playWoodClack();
                  setActiveMode('wejangan');
                }}
                className={`flex-1 py-1 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  activeMode === 'wejangan'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-amber-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Wejangan</span>
              </button>
            </div>

            {/* MODE 1: CHAT AI PEMANDU SASTRA (GEMINI 3.8 FLASH) */}
            {activeMode === 'chat' && (
              <div className="flex flex-col flex-1 min-h-[260px] max-h-[380px] space-y-2">
                {/* Chat Scroll Thread */}
                <div
                  ref={chatScrollRef}
                  className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs select-text"
                >
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
                        {msg.role === 'user' ? (
                          <span>Anda</span>
                        ) : (
                          <div className="flex items-center gap-1 text-amber-300 font-semibold">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>Pemandu Sastra</span>
                          </div>
                        )}
                        <span>· {msg.time}</span>
                      </div>
                      <div
                        className={`max-w-[90%] rounded-2xl px-3 py-2 leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-amber-500/25 border border-amber-500/40 text-amber-100 rounded-br-none'
                            : 'bg-[#0a1128]/95 border border-amber-500/20 text-slate-200 rounded-bl-none shadow-sm'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>

                        {/* Audio Speak button for model replies */}
                        {msg.role === 'model' && (
                          <div className="mt-1.5 pt-1.5 border-t border-slate-700/50 flex justify-end">
                            <button
                              onClick={() => handleSpeakBotReply(msg.content, i)}
                              className="text-[10px] text-amber-400 hover:text-amber-200 flex items-center gap-1 cursor-pointer transition-colors"
                              title="Dengarkan pembacaan suara lisan"
                            >
                              {playingAudioIndex === i ? (
                                <>
                                  <VolumeX className="w-3 h-3 text-rose-400 animate-pulse" />
                                  <span className="text-rose-300">Hentikan Suara</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3 h-3" />
                                  <span>Dengarkan Suara</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isBotThinking && (
                    <div className="flex items-center gap-2 text-xs text-amber-300 italic py-1">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      <span>Pemandu Sastra sedang merangkai telaah...</span>
                    </div>
                  )}
                </div>

                {/* Quick Prompts */}
                <div className="flex items-center gap-1 overflow-x-auto py-1 text-[10px]">
                  {[
                    'Bedah eufemisme Karhutla',
                    'Cari padanan diksi "optimalisasi"',
                    'Buat larik puisi empati warga',
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendChat(p)}
                      disabled={isBotThinking}
                      className="shrink-0 px-2 py-1 rounded-full bg-slate-800/80 hover:bg-amber-950/80 text-amber-200/90 border border-slate-700 hover:border-amber-500/40 cursor-pointer transition-colors disabled:opacity-50"
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {/* Input Form */}
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleSendChat();
                  }}
                  className="flex items-center gap-1.5 pt-1 border-t border-amber-500/20"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Tanyakan analisis wacana atau diksi..."
                    disabled={isBotThinking}
                    className="flex-1 bg-slate-900/90 border border-amber-500/30 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || isBotThinking}
                    className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 disabled:opacity-40 cursor-pointer transition-transform active:scale-95 shadow"
                    title="Kirim pesan"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

            {/* MODE 2: PANDUAN RUANG */}
            {activeMode === 'panduan' && (
              <div className="space-y-3 text-xs leading-relaxed font-sans">
                <div className="bg-[#0a1128]/80 p-3.5 rounded-2xl border border-amber-500/20 space-y-2">
                  <span className="text-[11px] font-bold text-amber-400 block font-mono">
                    {guide.greeting}
                  </span>
                  <p className="text-slate-200">{guide.tip}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-200/90 flex items-start gap-2">
                  <Feather className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{guide.actionText}</span>
                </div>
              </div>
            )}

            {/* MODE 3: WEJANGAN SASTRA */}
            {activeMode === 'wejangan' && (
              <div className="space-y-3 text-xs leading-relaxed">
                <div className="lontar-parchment p-4 rounded-2xl border border-amber-500/40 space-y-2 shadow-inner">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block font-mono">
                    ✦ Butir Kebijaksanaan Luhur ✦
                  </span>
                  <blockquote className="font-playfair text-sm text-white font-bold italic leading-snug">
                    "{WEJANGAN_LIST[wejanganIndex].quote}"
                  </blockquote>
                  <p className="text-[11px] text-white/95 font-serif leading-relaxed">
                    {WEJANGAN_LIST[wejanganIndex].meaning}
                  </p>
                  <span className="text-[10px] text-slate-300 block italic font-serif pt-1 border-t border-amber-500/30">
                    — {WEJANGAN_LIST[wejanganIndex].source}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleSpeakBotReply(WEJANGAN_LIST[wejanganIndex].meaning, 999)}
                    className="text-amber-400 hover:text-amber-200 text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Lantunkan</span>
                  </button>
                  <button
                    onClick={handleNextWejangan}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow active:scale-95 cursor-pointer"
                  >
                    <span>Wejangan Lainnya</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* QUICK JUMP SHORTCUTS */}
            <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between text-[11px] text-slate-400">
              <span>Lompat ke Ruang:</span>
              <div className="flex items-center gap-1">
                {(['pelacak', 'refleksi', 'museum', 'pendamping'] as TabId[]).map(tab => (
                  <button
                    key={tab}
                    onClick={() => {
                      gamelan.playBonang(587.33);
                      onNavigateTab(tab);
                    }}
                    className={`px-2 py-0.5 rounded uppercase font-mono text-[10px] transition-all cursor-pointer ${
                      activeTab === tab
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-300 hover:text-amber-300'
                    }`}
                  >
                    {tab.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
