import React, { useState } from 'react';
import { Compass, Book, Search, MessageSquare, Send, Sparkles, Plus, Check, Filter, Lightbulb, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { NUSANTARA_LEXICON } from '../data/discourseData';
import { LexiconItem } from '../types';
import { gamelan } from '../utils/audio';
import { sendChatMessage, speakText, stopSpeaking } from '../services/geminiService';

export const PendampingBahasa: React.FC = () => {
  const [lexiconList, setLexiconList] = useState<LexiconItem[]>(NUSANTARA_LEXICON);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // Suggestion Form State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newBirokratis, setNewBirokratis] = useState<string>('');
  const [newPoetic, setNewPoetic] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'Lingkungan' | 'Kebijakan' | 'Sosial' | 'Iklim' | 'Bencana'>('Lingkungan');
  const [newExample, setNewExample] = useState<string>('');
  const [addSuccess, setAddSuccess] = useState<boolean>(false);

  // Chat Consultation State
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'expert'; text: string; time: string }>>([
    {
      sender: 'expert',
      text: 'Salam takzim. Saya adalah pendamping sastra dan telaah wacana Anda. Tuliskan satu kalimat, judul berita, atau draf kritik sosial yang sedang Anda susun. Mari kita telaah bobot nuraninya dan perkaya dengan metafora puitis Nusantara.',
      time: 'Baru Saja'
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isConsulting, setIsConsulting] = useState<boolean>(false);
  const [playingSpeechIndex, setPlayingSpeechIndex] = useState<number | null>(null);

  const filteredLexicon = lexiconList.filter((item) => {
    const matchQuery =
      item.bureaucraticTerm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.poeticEquivalents.some(p => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.exampleSentence.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    return matchQuery && matchCategory;
  });

  const handleAddNewTerm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBirokratis.trim() || !newPoetic.trim()) return;

    gamelan.playGong(261.63);
    const newItem: LexiconItem = {
      id: `lex-${Date.now()}`,
      bureaucraticTerm: newBirokratis.trim(),
      poeticEquivalents: newPoetic.split(',').map(s => s.trim()),
      category: newCategory,
      exampleSentence: newExample.trim() || `Di balik istilah ${newBirokratis}, ada napas rakyat yang mengharapkan kejujuran.`,
      etymologyNote: 'Diusulkan oleh pembaca TOPENG untuk memperkaya khazanah kata.'
    };

    setLexiconList([newItem, ...lexiconList]);
    setNewBirokratis('');
    setNewPoetic('');
    setNewExample('');
    setAddSuccess(true);
    setTimeout(() => {
      setAddSuccess(false);
      setShowAddModal(false);
    }, 1500);
  };

  const handleSendMessage = async () => {
    const query = chatInput.trim();
    if (!query || isConsulting) return;

    gamelan.playBonang(523.25);
    const userMsg = {
      sender: 'user' as const,
      text: query,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setChatInput('');
    setIsConsulting(true);

    try {
      // Map to Gemini chat history format
      const chatHistory = updated.map(m => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        content: m.text,
      }));

      const reply = await sendChatMessage(
        chatHistory,
        'Anda adalah Pakar Telaah Wacana & Kurator Sastra Nusantara di platform TOPENG. ' +
        'Berikan kritik konstruktif terhadap kalimat/wacana pengguna, soroti bias tersembunyi bila ada, ' +
        'dan berikan 2-3 alternatif gubahan sastra puitis bertumpu pada empati kemanusiaan serta alam Nusantara. ' +
        'Gunakan Bahasa Indonesia yang elegan, hangat, dan berwawasan tinggi.'
      );

      gamelan.playBonang(659.25);
      setMessages(prev => [
        ...prev,
        {
          sender: 'expert' as const,
          text: reply,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.warn('Falling back to local expert critique:', err);
      // Graceful fallback
      gamelan.playBonang(659.25);
      setMessages(prev => [
        ...prev,
        {
          sender: 'expert' as const,
          text: `Draf kalimat "${query.substring(0, 35)}..." memiliki dasar pemikiran yang kuat. Untuk mempertegas daya gedornya, singkirkan kata pasif yang menyamarkan subjek pelaku. Hadirkan citraan inderawi alam—tanah, angin, atau getaran suara—agar pembaca ikut merasakan kegelisahan moral yang Anda bawa.`,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsConsulting(false);
    }
  };

  const handleSpeakExpert = async (text: string, idx: number) => {
    if (playingSpeechIndex === idx) {
      stopSpeaking();
      setPlayingSpeechIndex(null);
      return;
    }
    gamelan.playWoodClack();
    setPlayingSpeechIndex(idx);
    try {
      await speakText(text);
    } finally {
      setPlayingSpeechIndex(null);
    }
  };

  const handlePresetChat = (promptText: string) => {
    setChatInput(promptText);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* HEADER BANNER */}
      <div className="glass-panel-gold rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="max-w-4xl space-y-3 relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <span className="font-bold uppercase tracking-wider">Pilar IV</span>
            <span aria-hidden="true">·</span>
            <span>Kamus Diksi Nusantara & Konsultasi Pakar Bahasa</span>
          </div>
          <h2 className="font-playfair text-2xl md:text-4xl font-bold text-gold-gradient">
            Pendamping Bahasa & Kamus Diksi Nusantara
          </h2>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Jembatani diksi teknis-birokratis yang dingin dan kaku dengan kekayaan kosakata sastra Nusantara yang sarat empati. Uji draf argumen Anda bersama pakar telaah wacana interaktif.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* KAMUS DIKSI NUSANTARA (LEFT 7 COLS) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/25 pb-4">
            <div>
              <h3 className="font-playfair font-bold text-lg text-amber-200 flex items-center gap-2">
                <Book className="w-5 h-5 text-amber-400" />
                <span>Kamus Padanan Diksi Sastra</span>
              </h3>
              <p className="text-xs text-slate-400">
                Transformasi Diksi: Teknis Birokratis &rarr; Sastra Nusantara Humanis
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Usulkan Padanan</span>
            </button>
          </div>

          {/* SEARCH & CATEGORY FILTERS */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-amber-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari istilah (misal: 'deforestasi', 'anomali', 'bara', 'mitigasi')..."
                className="w-full bg-[#040914] border border-amber-500/30 rounded-2xl pl-11 pr-4 py-3 text-slate-200 text-xs md:text-sm focus:outline-none focus:border-amber-400 transition-all font-sans"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-400 text-[11px] mr-1">Kategori:</span>
              {['Semua', 'Lingkungan', 'Kebijakan', 'Sosial', 'Iklim', 'Bencana'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-amber-500/25 border border-amber-400 text-amber-300 font-bold'
                      : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* LEXICON LIST */}
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-2">
            {filteredLexicon.map((item) => (
              <div
                key={item.id}
                className="bg-[#0f1c3f]/80 p-4 rounded-2xl border border-amber-500/20 space-y-2.5 hover:border-amber-400/50 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider font-mono">
                    Istilah Birokratis: "{item.bureaucraticTerm}"
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono">
                    {item.category}
                  </span>
                </div>

                <div className="text-sm font-playfair text-amber-200 font-bold">
                  Padanan Sastra Nusantara:{' '}
                  <span className="text-gold-gradient">
                    {item.poeticEquivalents.map(eq => `"${eq}"`).join(' / ')}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-serif italic leading-relaxed bg-[#040914] p-3 rounded-xl border border-slate-800">
                  <strong className="text-slate-400 not-italic">Contoh dalam Kalimat:</strong> "{item.exampleSentence}"
                </p>

                {item.etymologyNote && (
                  <p className="text-[11px] text-slate-400 leading-normal">
                    <span className="text-amber-400/90 font-medium">Nilai Filosofis:</span> {item.etymologyNote}
                  </p>
                )}
              </div>
            ))}

            {filteredLexicon.length === 0 && (
              <div className="text-center py-10 text-xs text-slate-400 italic">
                Tidak ditemukan padanan kata yang cocok. Klik tombol "Usulkan Padanan" untuk menambahkannya!
              </div>
            )}
          </div>
        </div>

        {/* CONSULTATION SIMULATOR (RIGHT 5 COLS) */}
        <div className="lg:col-span-5 glass-panel-gold rounded-3xl p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 border-b border-amber-500/25 pb-3">
              <MessageSquare className="w-6 h-6 text-amber-400" />
              <div>
                <h3 className="font-playfair font-bold text-lg text-gold-gradient">
                  Konsultasi Pakar Bahasa & Sastra
                </h3>
                <p className="text-xs text-amber-200/70">
                  Telaah Kritis, Penebalan Empati, & Pengayaan Metafora
                </p>
              </div>
            </div>

            {/* QUICK PRESET PROMPTS */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-amber-300/80 font-mono block">
                Pertanyaan Cepat Rekomendasi:
              </span>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <button
                  onClick={() => handlePresetChat('Bagaimana cara menulis tentang krisis air tanpa terkesan hanya meratap mengeluh?')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-amber-200 transition-all text-left"
                >
                  Krisis Air & Martabat
                </button>
                <button
                  onClick={() => handlePresetChat('Bagaimana menggubah kalimat rilis pemerintah soal kebakaran agar berpihak pada balita?')}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-amber-200 transition-all text-left"
                >
                  Asap Karhutla & Balita
                </button>
              </div>
            </div>

            {/* CHAT LOG */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl space-y-1 ${
                    m.sender === 'user'
                      ? 'bg-amber-500/20 border border-amber-500/40 text-slate-100 ml-6 text-right'
                      : 'bg-[#0f1c3f] border border-amber-500/25 text-slate-200 mr-6 text-left font-serif leading-relaxed'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono opacity-70 mb-0.5">
                    <span className="font-bold text-amber-400">
                      {m.sender === 'user' ? 'Gagasan Anda' : 'Pakar Telaah Wacana'}
                    </span>
                    <span>{m.time}</span>
                  </div>
                  <p className="whitespace-pre-line">{m.text}</p>

                  {m.sender === 'expert' && (
                    <div className="pt-1.5 border-t border-slate-700/50 flex justify-end">
                      <button
                        onClick={() => handleSpeakExpert(m.text, idx)}
                        className="text-[10px] text-amber-400 hover:text-amber-200 flex items-center gap-1 cursor-pointer transition-colors"
                        title="Dengarkan pembacaan lisan"
                      >
                        {playingSpeechIndex === idx ? (
                          <>
                            <VolumeX className="w-3 h-3 text-rose-400 animate-pulse" />
                            <span className="text-rose-300">Hentikan</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span>Dengarkan</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {isConsulting && (
                <div className="flex items-center gap-2 text-xs text-amber-300 italic p-2 bg-[#0a1128] rounded-xl border border-amber-500/20">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>Pakar Sastra Gemini sedang merangkai telaah kritis...</span>
                </div>
              )}
            </div>
          </div>

          {/* CHAT INPUT FORM */}
          <div className="pt-3 border-t border-amber-500/25 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isConsulting}
              placeholder="Ketik kalimat atau draf wacana Anda..."
              className="w-full bg-[#040914] border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400 font-sans disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={!chatInput.trim() || isConsulting}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shrink-0 shadow-md disabled:opacity-40"
            >
              {isConsulting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Kirim</span>
            </button>
          </div>
        </div>

      </div>

      {/* ADD NEW PAIR MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel-gold rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-5 text-slate-100 shadow-2xl border border-amber-500/40">
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
              <h3 className="font-playfair font-bold text-xl text-gold-gradient">
                Usulkan Padanan Diksi Sastra
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewTerm} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-amber-300 uppercase tracking-wider block">
                  Istilah Teknis / Birokratis:
                </label>
                <input
                  type="text"
                  required
                  value={newBirokratis}
                  onChange={(e) => setNewBirokratis(e.target.value)}
                  placeholder="Misal: Penertiban Bantaran, Reklamasi, dll"
                  className="w-full bg-[#040914] border border-amber-500/30 rounded-xl p-2.5 text-slate-200 outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-amber-300 uppercase tracking-wider block">
                  Padanan Puitis Nusantara (Pisahkan koma):
                </label>
                <input
                  type="text"
                  required
                  value={newPoetic}
                  onChange={(e) => setNewPoetic(e.target.value)}
                  placeholder="Misal: Penggusuran Sukma, Pagar Air Mata"
                  className="w-full bg-[#040914] border border-amber-500/30 rounded-xl p-2.5 text-slate-200 outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-amber-300 uppercase tracking-wider block">
                  Kategori Wacana:
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-[#040914] border border-amber-500/30 rounded-xl p-2.5 text-slate-200 outline-none focus:border-amber-400"
                >
                  <option value="Lingkungan">Lingkungan</option>
                  <option value="Kebijakan">Kebijakan</option>
                  <option value="Sosial">Sosial</option>
                  <option value="Iklim">Iklim</option>
                  <option value="Bencana">Bencana</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-amber-300 uppercase tracking-wider block">
                  Contoh Kalimat Sastra:
                </label>
                <textarea
                  rows={3}
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  placeholder="Tuliskan contoh kalimat yang menghidupkan rasa kemanusiaan..."
                  className="w-full bg-[#040914] border border-amber-500/30 rounded-xl p-2.5 text-slate-200 outline-none focus:border-amber-400 resize-none font-serif"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5"
                >
                  {addSuccess ? <Check className="w-4 h-4 text-emerald-950" /> : <Plus className="w-4 h-4" />}
                  <span>{addSuccess ? 'Tersimpan!' : 'Tambahkan ke Kamus'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
