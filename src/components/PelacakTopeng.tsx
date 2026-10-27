import React, { useState } from 'react';
import { 
  FileSearch, Sparkles, AlertTriangle, ShieldAlert, Copy, Check, 
  Users, Microscope, HeartHandshake, RefreshCw, Feather, BookMarked,
  Eye, EyeOff, ArrowRightLeft, Send, Sparkle, Globe, Search, ExternalLink, Loader2
} from 'lucide-react';
import { DISCOURSE_PRESETS } from '../data/discourseData';
import { DiscoursePreset } from '../types';
import { gamelan } from '../utils/audio';
import { copyToClipboard } from '../utils/qr';
import { verifyWithGoogleSearch, GroundingSearchResult } from '../services/geminiService';

export const PelacakTopeng: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(DISCOURSE_PRESETS[0].id);
  const [inputText, setInputText] = useState<string>(DISCOURSE_PRESETS[0].text);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [debiasMode, setDebiasMode] = useState<'jernih' | 'sastra' | 'jurnalisme'>('jernih');
  const [copied, setCopied] = useState<boolean>(false);
  const [activePersp, setActivePersp] = useState<'warga' | 'ahli' | 'sastra'>('warga');
  const [showHighlightOverlay, setShowHighlightOverlay] = useState<boolean>(true);

  // Google Search Grounding State
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [groundingResult, setGroundingResult] = useState<GroundingSearchResult | null>(null);
  const [groundingError, setGroundingError] = useState<string | null>(null);

  // Deconstruct analysis state
  const currentPreset = DISCOURSE_PRESETS.find(p => p.id === selectedPresetId) || DISCOURSE_PRESETS[0];

  const handleVerifyWithGoogleSearch = async () => {
    const textToVerify = inputText.trim();
    if (!textToVerify || isVerifying) return;

    gamelan.playBonang(659.25);
    setIsVerifying(true);
    setGroundingError(null);

    try {
      const result = await verifyWithGoogleSearch(textToVerify);
      setGroundingResult(result);
      gamelan.playBonang(523.25);
    } catch (err: any) {
      console.error('Grounding verification error:', err);
      setGroundingError(err.message || 'Gagal mengambil data verifikasi Google Search.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSelectPreset = (preset: DiscoursePreset) => {
    gamelan.playBonang(587.33);
    setSelectedPresetId(preset.id);
    setInputText(preset.text);
    setIsCustom(false);
  };

  // Dynamic analysis function
  const analyzeDiscourse = (text: string) => {
    const lower = text.toLowerCase();
    const absoluteKeywords = ['semua', 'pasti', 'selalu', 'tidak mungkin', 'mutlak', 'harus', 'seluruh', 'tanpa ada'];
    const polarizingKeywords = ['hoaks', 'provokatif', 'asing', 'anti-kemajuan', 'fiktif', 'pesimis', 'menjatuhkan', 'bohong', 'tuduhan'];
    const euphemismKeywords = ['anomali', 'fluktuasi', 'optimalisasi', 'penyesuaian', 'normalisasi', 'defisit', 'penataan'];

    const detectedAbs = absoluteKeywords.filter(k => lower.includes(k));
    const detectedPol = polarizingKeywords.filter(k => lower.includes(k));
    const detectedEuph = euphemismKeywords.filter(k => lower.includes(k));

    let score = 90;
    score -= detectedAbs.length * 15;
    score -= detectedPol.length * 20;
    score -= detectedEuph.length * 10;
    if (score < 15) score = 15;
    if (score > 95) score = 95;

    return {
      score,
      detectedAbs,
      detectedPol,
      detectedEuph
    };
  };

  const analysis = isCustom ? analyzeDiscourse(inputText) : {
    score: currentPreset.clarityScore,
    detectedAbs: currentPreset.detectedBias.absoluteWords,
    detectedPol: currentPreset.detectedBias.polarizingLabels,
    detectedEuph: currentPreset.detectedBias.euphemisms
  };

  const debiasedOutput = isCustom
    ? {
        jernih: inputText.replace(/semua|pasti|hoaks|bohong|fiktif|anti-kemajuan/gi, "pernyataan terkait hal ini sedang diverifikasi secara proporsional berdasarkan data faktual"),
        sastra: `Di balik susunan kalimat "${inputText.substring(0, 40)}...", ada derita manusia nyata yang tidak boleh diredam oleh sekadar retorika.`,
        jurnalisme: `Pihak terkait dan masyarakat mengonfirmasi perlunya pengecekan silang terhadap pernyataan: "${inputText.substring(0, 50)}..."`
      }
    : currentPreset.debiasedText;

  const empathyOutput = isCustom
    ? {
        warga: `Bagi warga di akar rumput, perdebatan atas kata-kata ini berdampak langsung pada kehidupan harian, hak dasar, dan martabat keluarga kami.`,
        ahli: `Kajian metodologis independen perlu dilakukan untuk memisahkan antara klaim retoris dengan indikator empiris terukur di lapangan.`,
        sastra: `Ketika bahasa kehilangan kelembutan untuk mendengar yang tertindas, saat itulah sastra harus hadir menyalakan lentera kejujuran.`
      }
    : currentPreset.empathyPerspectives;

  const handleCopyDebiased = async () => {
    gamelan.playBonang(659.25);
    const success = await copyToClipboard(debiasedOutput[debiasMode]);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Render text with interactive colored word highlights
  const renderHighlightedText = (text: string) => {
    if (!text) return null;
    const tokens = text.split(/(\s+)/);
    const absList = analysis.detectedAbs.map(w => w.toLowerCase());
    const polList = analysis.detectedPol.map(w => w.toLowerCase());
    const euphList = analysis.detectedEuph.map(w => w.toLowerCase());

    return tokens.map((tok, i) => {
      const clean = tok.toLowerCase().replace(/[^a-z0-9-]/gi, '');
      const isAbs = absList.includes(clean);
      const isPol = polList.includes(clean);
      const isEuph = euphList.includes(clean);

      if (isAbs) {
        return (
          <span key={i} className="bg-rose-500/30 text-rose-300 font-bold px-1 py-0.5 rounded border border-rose-500/60 shadow-sm" title="Kata Absolut / Klaim Mutlak">
            {tok}
          </span>
        );
      }
      if (isPol) {
        return (
          <span key={i} className="bg-amber-500/30 text-amber-300 font-bold px-1 py-0.5 rounded border border-amber-500/60 shadow-sm" title="Labeling / Prasangka">
            {tok}
          </span>
        );
      }
      if (isEuph) {
        return (
          <span key={i} className="bg-sky-500/30 text-sky-300 font-bold px-1 py-0.5 rounded border border-sky-500/60 shadow-sm" title="Eufemisme Birokrasi">
            {tok}
          </span>
        );
      }
      return tok;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* HEADER BANNER */}
      <div className="glass-panel-gold rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#ffd700_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <span className="font-bold uppercase tracking-wider">Pilar I</span>
            <span aria-hidden="true">·</span>
            <span>Dekonstruksi Wacana & Kacamata Empati</span>
          </div>
          <h2 className="font-playfair text-2xl md:text-4xl font-bold text-gold-gradient">
            Pelacak Topeng & Kacamata Empati
          </h2>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Bedah klaim mutlak, label polarizing, dan kata-kata bertopeng di ruang publik. Ubah diksi yang kaku dan penuh prasangka menjadi cermin refleksi sastrawi bertumpu pada empati manusiawi.
          </p>
        </div>
      </div>

      {/* PRESETS SELECTION */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-amber-300">
          <BookMarked className="w-4 h-4 text-amber-400" />
          <span>Pilih Studi Kasus Nyata:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {DISCOURSE_PRESETS.map((p) => {
            const isSelected = !isCustom && selectedPresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-[#0f1c3f]/80 text-amber-200 border border-amber-500/30 hover:bg-amber-500/20'
                }`}
              >
                {p.title}
              </button>
            );
          })}
          <button
            onClick={() => {
              setIsCustom(true);
              setInputText('');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isCustom
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 border border-slate-700 hover:text-slate-200'
            }`}
          >
            + Tulis Wacana Bebas
          </button>
        </div>
      </div>

      {/* MAIN SCANNER WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* INPUT & PARSER AREA (LEFT 7 COLS) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-playfair font-bold text-lg text-amber-200 flex items-center gap-2">
              <FileSearch className="w-5 h-5 text-amber-400" />
              <span>Input Wacana Publik / Klaim Media</span>
            </h3>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHighlightOverlay(!showHighlightOverlay)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all cursor-pointer ${
                  showHighlightOverlay
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {showHighlightOverlay ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{showHighlightOverlay ? 'Sorot Topeng On' : 'Sorot Topeng Off'}</span>
              </button>
              <span className="text-[11px] text-slate-400 font-mono">
                {inputText.length} Karakter
              </span>
            </div>
          </div>

          {/* TEXT AREA */}
          <div className="relative">
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setIsCustom(true);
              }}
              placeholder="Tempelkan atau ketikkan wacana, rilis pers, berita, atau cuitan yang ingin didekonstruksi..."
              className="w-full bg-[#040914]/90 border border-amber-500/30 rounded-2xl p-4 text-slate-100 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all resize-none leading-relaxed font-sans placeholder:text-slate-500"
            />
          </div>

          {/* INTERACTIVE HIGHLIGHT INSPECTOR BOX */}
          {showHighlightOverlay && inputText.trim() && (
            <div className="bg-[#060c1d] p-3.5 rounded-xl border border-amber-500/20 text-xs leading-relaxed space-y-1.5 animate-fade-in">
              <span className="text-[10px] uppercase font-mono font-bold text-amber-400 flex items-center gap-1">
                <Sparkle className="w-3 h-3 text-amber-400" />
                <span>Peta Kata Bertopeng dalam Teks Anda:</span>
              </span>
              <p className="text-slate-200 font-serif leading-relaxed">
                {renderHighlightedText(inputText)}
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Mendeteksi kata absolut, eufemisme birokrasi, dan label prasangka.</span>
            </div>
            <button
              onClick={() => {
                gamelan.playBonang(659.25);
                setIsCustom(true);
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Perbarui Analisis</span>
            </button>
          </div>

          {/* DETECTED BIAS BREAKDOWN */}
          <div className="pt-4 border-t border-amber-500/20 space-y-4">
            
            {/* SCORE GAUGE */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="uppercase tracking-wider text-amber-300">
                  Indeks Kejernihan & Netralitas Bahasa
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                  analysis.score >= 70 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                    : analysis.score >= 45 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {analysis.score}% / 100%
                </span>
              </div>
              <div className="w-full bg-[#040914] h-2.5 rounded-full overflow-hidden border border-amber-500/25 p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    analysis.score >= 70
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : analysis.score >= 45
                        ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                        : 'bg-gradient-to-r from-rose-600 via-amber-500 to-rose-400'
                  }`}
                  style={{ width: `${analysis.score}%` }}
                />
              </div>
            </div>

            {/* TAGS */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Indikator Topeng Diksi Terdeteksi:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                {analysis.detectedAbs.length > 0 && analysis.detectedAbs.map((w, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-200 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Absolut: "{w}"</span>
                  </span>
                ))}

                {analysis.detectedPol.length > 0 && analysis.detectedPol.map((w, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-200 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    <span>Labeling: "{w}"</span>
                  </span>
                ))}

                {analysis.detectedEuph.length > 0 && analysis.detectedEuph.map((w, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-sky-950/60 border border-sky-500/40 text-sky-200 flex items-center gap-1.5">
                    <Feather className="w-3.5 h-3.5 text-sky-400" />
                    <span>Eufemisme: "{w}"</span>
                  </span>
                ))}

                {analysis.detectedAbs.length === 0 && analysis.detectedPol.length === 0 && analysis.detectedEuph.length === 0 && (
                  <span className="text-xs text-slate-400 italic">
                    Teks ini menggunakan diksi yang relatif bersih dari klaim sepihak ekstrem.
                  </span>
                )}
              </div>
            </div>

            {/* AUTO DEBIASER SECTION */}
            <div className="bg-[#0f1c3f]/70 rounded-2xl p-4 border border-teal-500/30 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-teal-500/20 pb-2">
                <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                  Hasil Rekonstruksi Auto-Debiaser:
                </span>
                <div className="flex bg-[#040914] p-0.5 rounded-lg border border-teal-500/30 text-[11px]">
                  <button
                    onClick={() => setDebiasMode('jernih')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      debiasMode === 'jernih' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Bahasa Jernih
                  </button>
                  <button
                    onClick={() => setDebiasMode('sastra')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      debiasMode === 'sastra' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Bahasa Sastra
                  </button>
                  <button
                    onClick={() => setDebiasMode('jurnalisme')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      debiasMode === 'jurnalisme' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Jurnalisme Warga
                  </button>
                </div>
              </div>

              <p className="text-xs md:text-sm text-slate-100 italic leading-relaxed font-serif">
                "{debiasedOutput[debiasMode]}"
              </p>

              <div className="flex justify-end gap-2">
                <button
                  onClick={handleCopyDebiased}
                  className="px-3.5 py-1.5 rounded-lg bg-[#1f6a78] hover:bg-[#0d9488] text-amber-100 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-amber-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Teks Tersalin!' : 'Salin Rekonstruksi'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* KACAMATA EMPATI LITERARY REFLECTION (RIGHT 5 COLS) */}
        <div className="lg:col-span-5 glass-panel-gold rounded-3xl p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 border-b border-amber-500/30 pb-3">
              <HeartHandshake className="w-6 h-6 text-amber-400" />
              <div>
                <h3 className="font-playfair font-bold text-lg text-gold-gradient">
                  Engine Kacamata Empati
                </h3>
                <p className="text-xs text-amber-200/70">
                  Memantulkan 3 Sudut Pandang Manusiawi Nusantara
                </p>
              </div>
            </div>

            {/* TAB SELECTOR FOR PERSPECTIVES */}
            <div className="flex p-1 bg-[#040914] rounded-xl border border-amber-500/30 text-xs">
              <button
                onClick={() => {
                  gamelan.playBonang(440);
                  setActivePersp('warga');
                }}
                className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1 transition-all ${
                  activePersp === 'warga' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Warga</span>
              </button>
              <button
                onClick={() => {
                  gamelan.playBonang(493.88);
                  setActivePersp('ahli');
                }}
                className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1 transition-all ${
                  activePersp === 'ahli' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Microscope className="w-3.5 h-3.5" />
                <span>Peneliti</span>
              </button>
              <button
                onClick={() => {
                  gamelan.playBonang(523.25);
                  setActivePersp('sastra');
                }}
                className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1 transition-all ${
                  activePersp === 'sastra' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Refleksi</span>
              </button>
            </div>

            {/* ACTIVE CARD DISPLAY */}
            <div className="bg-[#040914]/90 border border-amber-500/30 rounded-2xl p-5 space-y-3 shadow-inner">
              <div className="flex items-center gap-2">
                {activePersp === 'warga' && (
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-amber-400" />
                    <span>SUARA WARGA TERDAMPAK</span>
                  </span>
                )}
                {activePersp === 'ahli' && (
                  <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                    <Microscope className="w-4 h-4 text-sky-400" />
                    <span>PERSPEKTIF PENELITI & METODOLOGI</span>
                  </span>
                )}
                {activePersp === 'sastra' && (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>PERTANYAAN SASTRAWI NUSANTARA</span>
                  </span>
                )}
              </div>

              <blockquote className="text-xs md:text-sm text-slate-200 font-serif italic leading-relaxed">
                "{empathyOutput[activePersp]}"
              </blockquote>
            </div>

            {/* MINI VIEW OF ALL THREE */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] text-amber-200/60 uppercase tracking-wider font-mono block">
                Ikhtisar Semua Kacamata:
              </span>
              <div className="text-[11px] space-y-1.5 text-slate-300">
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">Warga:</span>
                  <span className="line-clamp-2">{empathyOutput.warga}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2">
                  <span className="text-sky-400 font-bold shrink-0">Ahli:</span>
                  <span className="line-clamp-2">{empathyOutput.ahli}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">Sastra:</span>
                  <span className="line-clamp-2">{empathyOutput.sastra}</span>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-amber-500/20 text-center">
            <p className="text-[11px] text-amber-200/70 italic font-serif">
              "Sastra hadir bukan untuk menghakimi topeng, melainkan menyalakan cermin kejujuran nurani kita."
            </p>
          </div>
        </div>

      </div>

      {/* GOOGLE SEARCH GROUNDING VERIFIER (GEMINI 3.8 FLASH) */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border-2 border-teal-500/40 relative overflow-hidden space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-teal-500/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-amber-500 p-0.5 shadow-lg">
              <div className="w-full h-full bg-[#0a1128] rounded-[14px] flex items-center justify-center">
                <Globe className="w-6 h-6 text-teal-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-playfair text-lg md:text-xl font-bold text-teal-200">
                  Verifikasi Fakta Terkini dengan Google Search
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  Gemini 3.8 Flash Grounding
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Pengecekan silang wacana terhadap berita dan data empiris langsung dari Google Search.
              </p>
            </div>
          </div>

          <button
            onClick={handleVerifyWithGoogleSearch}
            disabled={isVerifying || !inputText.trim()}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-400 to-amber-500 hover:from-teal-400 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/25 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Memverifikasi Fakta...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Verifikasi Teks Ini Sekarang</span>
              </>
            )}
          </button>
        </div>

        {/* Grounding Error Display */}
        {groundingError && (
          <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{groundingError}</span>
          </div>
        )}

        {/* Grounding Result Display */}
        {groundingResult && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-5 rounded-2xl bg-[#081226] border border-teal-500/30 space-y-3">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block font-mono">
                ✦ Hasil Analisis Grounding Google Search ✦
              </span>
              <div className="text-xs md:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                {groundingResult.text}
              </div>
            </div>

            {/* Verified Web Sources Cards */}
            {groundingResult.sources.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block font-mono">
                  Sumber Web Rujukan Terverifikasi ({groundingResult.sources.length}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {groundingResult.sources.map((src, i) => (
                    <a
                      key={i}
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-slate-900/90 hover:bg-[#10243e] border border-teal-500/30 hover:border-amber-400/60 transition-all group flex flex-col justify-between gap-1.5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-200 line-clamp-2">
                          {src.title || 'Sumber Informasi'}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-teal-400 group-hover:text-amber-300 shrink-0 mt-0.5" />
                      </div>
                      <span className="text-[10px] text-teal-400/80 font-mono truncate">
                        {src.uri.replace(/^https?:\/\//, '')}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
