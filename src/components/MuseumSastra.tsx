import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, MapPin, Wand2, Download, Printer, Heart, Sparkles, 
  PlusCircle, Check, Music, ChevronLeft, ChevronRight, Play, Pause,
  Scroll, Eye, Compass, Layers, Volume2
} from 'lucide-react';
import { REGIONAL_STORIES, INITIAL_COMMUNITY_KARYA } from '../data/discourseData';
import { RegionalStory, SavedKarya } from '../types';
import { gamelan } from '../utils/audio';

// Unified item type for the traditional lontar scroll carousel
interface LontarItem {
  id: string;
  sourceType: 'regional' | 'community';
  lempirNumber: string;
  title: string;
  author: string;
  origin: string;
  genre: string;
  body: string;
  year?: string;
  soundNote?: string;
  dataFact?: string;
  likes?: number;
}

export const MuseumSastra: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<RegionalStory>(REGIONAL_STORIES[0]);
  const [karyaType, setKaryaType] = useState<'Puisi' | 'Cerpen Mini' | 'Monolog' | 'Surat Warga'>('Puisi');
  const [karyaTitle, setKaryaTitle] = useState<string>('');
  const [karyaBody, setKaryaBody] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [communityWorks, setCommunityWorks] = useState<SavedKarya[]>(INITIAL_COMMUNITY_KARYA);

  // Traditional Lontar Scroll Reader State
  const [currentScrollIndex, setCurrentScrollIndex] = useState<number>(0);
  const [slideDirection, setSlideDirection] = useState<number>(0);
  const [isAutoScroll, setIsAutoScroll] = useState<boolean>(false);
  const [galleryViewMode, setGalleryViewMode] = useState<'scroll' | 'grid'>('scroll');
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load community works from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('topeng_community_karya');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCommunityWorks(parsed);
          }
        }
      } catch {
        // Fallback to initial
      }
    }
  }, []);

  // Combine regional stories and community works into a unified collection of lontar leaves (lempir)
  const allLontarItems: LontarItem[] = [
    ...REGIONAL_STORIES.map((s, idx) => ({
      id: s.id,
      sourceType: 'regional' as const,
      lempirNumber: `Lempir ${toRoman(idx + 1)}`,
      title: s.title,
      author: s.author,
      origin: `${s.region} (${s.province})`,
      genre: s.category,
      body: s.story,
      year: s.year,
      soundNote: s.soundNote,
      dataFact: s.dataFact,
    })),
    ...communityWorks.map((k, idx) => ({
      id: k.id,
      sourceType: 'community' as const,
      lempirNumber: `Lempir ${toRoman(REGIONAL_STORIES.length + idx + 1)}`,
      title: k.title,
      author: k.author,
      origin: 'Koleksi Warga Nusantara',
      genre: k.type,
      body: k.body,
      year: k.timestamp,
      likes: k.likes,
    }))
  ];

  // Helper for Roman numerals in lontar cataloging
  function toRoman(num: number): string {
    const romanMap: { [key: number]: string } = {
      1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V',
      6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X',
      11: 'XI', 12: 'XII', 13: 'XIII', 14: 'XIV', 15: 'XV'
    };
    return romanMap[num] || String(num);
  }

  // Handle scroll slide step
  const handleSlideScroll = (newIndex: number, direction: number) => {
    gamelan.playWoodClack();
    setSlideDirection(direction);
    setCurrentScrollIndex(newIndex);
  };

  const handlePrev = () => {
    const nextIdx = currentScrollIndex === 0 ? allLontarItems.length - 1 : currentScrollIndex - 1;
    handleSlideScroll(nextIdx, -1);
  };

  const handleNext = () => {
    const nextIdx = currentScrollIndex === allLontarItems.length - 1 ? 0 : currentScrollIndex + 1;
    handleSlideScroll(nextIdx, 1);
  };

  // Auto-scroll loop
  useEffect(() => {
    if (isAutoScroll) {
      autoScrollTimerRef.current = setInterval(() => {
        setSlideDirection(1);
        setCurrentScrollIndex((prev) => (prev === allLontarItems.length - 1 ? 0 : prev + 1));
        gamelan.playWoodClack();
      }, 5500);
    } else {
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
    }
    return () => {
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
    };
  }, [isAutoScroll, allLontarItems.length]);

  const toggleAutoScroll = () => {
    gamelan.playBonang(523.25);
    setIsAutoScroll(!isAutoScroll);
  };

  const handleSelectRegion = (story: RegionalStory) => {
    gamelan.playBonang(story.id === 'kalteng' ? 261.63 : story.id === 'riau' ? 329.63 : story.id === 'jabar' ? 392 : 523.25);
    setSelectedRegion(story);

    // Also synchronize current scroll index to this regional story if found
    const targetIdx = allLontarItems.findIndex(item => item.id === story.id);
    if (targetIdx !== -1) {
      setSlideDirection(targetIdx > currentScrollIndex ? 1 : -1);
      setCurrentScrollIndex(targetIdx);
    }
  };

  const handlePromptGenerator = () => {
    gamelan.playBonang(659.25);
    const prompts = [
      `Tuliskan puisi 3 bait tentang selisih angka 202.000 vs 1.920.000 hektare kebakaran dan napas balita di bilik kayu Palangka Raya.`,
      `Buatlah monolog singkat seorang penenun ikat di bukit kapur Sumba yang memandangi keran kering seraya menanti hujan.`,
      `Tuliskan surat terbuka dari pohon sagu purba di pedalaman Papua kepada mesin buldoser yang datang membawa janji modernitas.`,
      `Gubah sebuah cerpen mini tentang dua sahabat: seorang petugas pencatat satelit dan seorang relawan pemadam yang bertemu di tengah kabut pekat.`
    ];
    const picked = prompts[Math.floor(Math.random() * prompts.length)];
    setKaryaTitle(`Refleksi: ${picked.substring(0, 32)}...`);
    setKaryaBody(`${picked}\n\n[Mulai rangkai larik atau narasi Anda di sini...]`);
  };

  const charCount = karyaBody.length;
  const wordCount = karyaBody.trim() ? karyaBody.trim().split(/\s+/).length : 0;

  const handleSaveToGallery = () => {
    if (!karyaBody.trim()) {
      alert('Mohon tuliskan isi karya sastra Anda terlebih dahulu.');
      return;
    }
    gamelan.playGong(261.63);

    const newKarya: SavedKarya = {
      id: `karya-${Date.now()}`,
      title: karyaTitle.trim() || `Karya Tanpa Judul (${karyaType})`,
      type: karyaType,
      body: karyaBody,
      author: 'Penulis Warga Nusantara',
      timestamp: 'Hari Ini',
      likes: 1
    };

    const updated = [newKarya, ...communityWorks];
    setCommunityWorks(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('topeng_community_karya', JSON.stringify(updated));
    }

    setSavedSuccess(true);
    // Automatically transition to the newly saved lontar leaf
    setSlideDirection(1);
    setCurrentScrollIndex(REGIONAL_STORIES.length); // Index of first community work in unified list

    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportTxt = () => {
    const filename = (karyaTitle.trim() || 'Karya_Sastra_TOPENG').replace(/\s+/g, '_');
    const content = `TOPENG - PLATFORM SASTRA & DISKURSUS NUSANTARA\n` +
      `Judul: ${karyaTitle || 'Tanpa Judul'}\n` +
      `Jenis: ${karyaType}\n` +
      `Tanggal: ${new Date().toLocaleDateString('id-ID')}\n` +
      `--------------------------------------------------\n\n` +
      `${karyaBody}\n\n` +
      `--------------------------------------------------\n` +
      `Dibuat di Studio Gubahan TOPENG (https://ais-pre-3nhrvtgvdny6hygdpev32i-606961021964.asia-northeast1.run.app)\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleLike = (id: string) => {
    gamelan.playBonang(783.99);
    const updated = communityWorks.map(item => {
      if (item.id === id) {
        return { ...item, likes: item.likes + 1 };
      }
      return item;
    });
    setCommunityWorks(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('topeng_community_karya', JSON.stringify(updated));
    }
  };

  // Slide Animation Variants for Lontar Scroll
  const lontarVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 320 : -320,
      opacity: 0,
      scale: 0.96,
      rotateY: direction > 0 ? 12 : -12,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        x: { type: 'spring' as const, stiffness: 260, damping: 28 },
        opacity: { duration: 0.35 },
        scale: { duration: 0.35 }
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -320 : 320,
      opacity: 0,
      scale: 0.96,
      rotateY: direction > 0 ? -12 : 12,
      transition: {
        x: { type: 'spring' as const, stiffness: 260, damping: 28 },
        opacity: { duration: 0.25 }
      }
    })
  };

  const currentItem = allLontarItems[currentScrollIndex] || allLontarItems[0];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* HEADER BANNER */}
      <div className="glass-panel-gold rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="max-w-4xl space-y-3 relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <span className="font-bold uppercase tracking-wider">Pilar III</span>
            <span aria-hidden="true">·</span>
            <span>Museum Sastra Warga & Peta Suara Lintas Daerah</span>
          </div>
          <h2 className="font-playfair text-2xl md:text-4xl font-bold text-gold-gradient">
            Museum Sastra & Peta Suara Nusantara
          </h2>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Rasakan pengalaman membaca sastra tradisional lewat <strong>Gulungan Lontar Interaktif</strong>. Jelajahi arsip suara kejujuran warga dan gubah karya Anda sendiri di Studio Kertas Lontar Nusantara.
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* FEATURE: INTERACTIVE TRADITIONAL LONTAR SCROLL READER   */}
      {/* ======================================================== */}
      <section className="glass-panel-gold rounded-3xl p-6 md:p-8 space-y-6 overflow-hidden relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-amber-500/30 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Scroll className="w-5 h-5 text-amber-400" />
              <h3 className="font-playfair font-bold text-xl md:text-2xl text-gold-gradient">
                Gulungan Lontar Tradisional (Scroll Interaktif)
              </h3>
            </div>
            <p className="text-xs text-amber-200/80">
              Geser lembaran (*lempir*) lontar secara horizontal untuk menelusuri untaian kesaksian sastrawi Nusantara
            </p>
          </div>

          {/* PLAY/PAUSE AUTO SCROLL & STEP COUNTER */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleAutoScroll}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isAutoScroll
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/25'
                  : 'bg-[#040914] text-amber-300 border-amber-500/40 hover:bg-amber-500/20'
              }`}
            >
              {isAutoScroll ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoScroll ? 'Jeda Gulungan' : 'Gulung Otomatis'}</span>
            </button>

            <span className="text-xs font-mono font-bold text-amber-400 bg-[#040914] px-3 py-1.5 rounded-xl border border-amber-500/30">
              {currentScrollIndex + 1} / {allLontarItems.length}
            </span>
          </div>
        </div>

        {/* PHYSICAL SCROLL ROLLER CONTAINER WITH SLIDING CONTENT */}
        <div className="relative py-4 px-2 md:px-6">
          
          {/* LEFT WOODEN SPINDLE ROLLER */}
          <div className="absolute left-0 top-0 bottom-0 w-4 md:w-6 lontar-wooden-roller rounded-full z-20 flex flex-col justify-between items-center py-2 shadow-2xl pointer-events-none">
            <div className="w-6 md:w-8 h-3 rounded-sm bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700 shadow border border-amber-900" />
            <div className="w-1.5 h-full bg-amber-400/20" />
            <div className="w-6 md:w-8 h-3 rounded-sm bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700 shadow border border-amber-900" />
          </div>

          {/* RIGHT WOODEN SPINDLE ROLLER */}
          <div className="absolute right-0 top-0 bottom-0 w-4 md:w-6 lontar-wooden-roller rounded-full z-20 flex flex-col justify-between items-center py-2 shadow-2xl pointer-events-none">
            <div className="w-6 md:w-8 h-3 rounded-sm bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700 shadow border border-amber-900" />
            <div className="w-1.5 h-full bg-amber-400/20" />
            <div className="w-6 md:w-8 h-3 rounded-sm bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700 shadow border border-amber-900" />
          </div>

          {/* SLIDING LONTAR LEAF RIBBON (PALM-LEAF PARCHMENT) */}
          <div className="relative overflow-hidden mx-3 md:mx-6 rounded-2xl lontar-scroll-strip p-5 md:p-8 min-h-[360px] md:min-h-[380px] flex flex-col justify-between shadow-2xl border-l border-r border-amber-800/40">
            
            {/* TRADITIONAL LONTAR HOLE & STRING BINDING (CAKRUK) */}
            <div className="absolute left-6 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full bg-[#3d2314] border border-[#a16207] shadow-inner flex items-center justify-center opacity-85 pointer-events-none hidden sm:flex">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-200" />
            </div>

            <div className="absolute right-6 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full bg-[#3d2314] border border-[#a16207] shadow-inner flex items-center justify-center opacity-85 pointer-events-none hidden sm:flex">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-200" />
            </div>

            {/* ANIMATED SLIDE CONTAINER */}
            <AnimatePresence initial={false} custom={slideDirection} mode="wait">
              <motion.div
                key={currentItem.id + currentScrollIndex}
                custom={slideDirection}
                variants={lontarVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -40) handleNext();
                  if (info.offset.x > 40) handlePrev();
                }}
                className="space-y-5 px-2 sm:px-8 cursor-grab active:cursor-grabbing select-none"
              >
                {/* LONTAR METADATA HEADER */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/30 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded bg-amber-500/20 text-white border border-amber-400/40 shadow-sm">
                      {currentItem.lempirNumber}
                    </span>
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">
                      {currentItem.origin}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-white bg-white/10 px-2.5 py-0.5 rounded border border-white/20">
                    {currentItem.genre} {currentItem.year ? `· ${currentItem.year}` : ''}
                  </span>
                </div>

                {/* TITLE & CITIZEN BODY (PURE WHITE TEXT) */}
                <div className="space-y-3">
                  <h4 className="font-playfair text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight drop-shadow-md">
                    {currentItem.title}
                  </h4>

                  <blockquote className="font-serif italic text-base sm:text-lg md:text-xl text-white leading-relaxed whitespace-pre-line pl-3 border-l-2 border-amber-400">
                    "{currentItem.body}"
                  </blockquote>
                </div>

                {/* AUTHOR & ANCIENT DATA FOOTNOTE */}
                <div className="pt-3 border-t border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-white font-serif">
                  <div>
                    <span className="font-bold text-amber-300">Gubahan:</span> <span className="text-white font-medium">{currentItem.author}</span>
                  </div>

                  {currentItem.soundNote && (
                    <div className="flex items-center gap-1.5 text-white font-sans text-[11px]">
                      <Volume2 className="w-3.5 h-3.5 text-teal-300" />
                      <span className="text-white">{currentItem.soundNote}</span>
                    </div>
                  )}

                  {currentItem.likes !== undefined && (
                    <div className="flex items-center gap-1 text-white font-mono font-bold bg-white/10 px-2 py-0.5 rounded border border-white/20">
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-400" />
                      <span className="text-white">{currentItem.likes} apresiasi</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* TOUCH DRAG & SWIPE PROMPT */}
            <div className="text-center pt-2">
              <span className="text-xs text-white font-mono tracking-wider uppercase font-semibold drop-shadow-sm">
                ✦ Geser ke kiri / kanan atau gunakan tombol untuk membuka lembaran lontar berikutnya ✦
              </span>
            </div>
          </div>

          {/* SLIDE CONTROLS (WOODEN SCROLL BUTTONS) */}
          <div className="flex items-center justify-between mt-4 px-2">
            <button
              onClick={handlePrev}
              className="px-4 py-2 rounded-xl bg-[#0f1c3f] hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Gulung Mundur</span>
            </button>

            {/* MINI SLAT THUMBNAIL INDICATORS */}
            <div className="hidden sm:flex items-center gap-1.5">
              {allLontarItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSlideScroll(idx, idx > currentScrollIndex ? 1 : -1)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentScrollIndex === idx
                      ? 'w-6 bg-amber-400 shadow-sm shadow-amber-400'
                      : 'w-2 bg-slate-700 hover:bg-amber-400/50'
                  }`}
                  title={`Buka Lempir ${toRoman(idx + 1)}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-[#0f1c3f] hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <span>Gulung Maju</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 2: MAP & REGIONAL STORY DISPLAY                  */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* INTERACTIVE MAP CONTAINER (LEFT 5 COLS) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-playfair font-bold text-lg text-amber-200 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-400" />
              <span>Peta Suara Lintas Daerah</span>
            </h3>
            <span className="text-xs text-amber-400/80 font-mono">5 Wilayah Perekaman</span>
          </div>
          <p className="text-xs text-slate-400">
            Klik titik kepulauan untuk menyelaraskan gulungan lontar ke rekaman wilayah tersebut:
          </p>

          {/* STYLIZED ARCHIPELAGO MAP */}
          <div className="relative w-full h-64 bg-[#0a1128] rounded-2xl border border-amber-500/30 p-2 overflow-hidden flex items-center justify-center">
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Stylized Archipelago SVG Silhouette */}
            <svg className="w-full h-full opacity-35" viewBox="0 0 500 220" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Sumatra */}
              <path d="M40 70 L90 35 L120 70 L95 125 L60 145 Z" fill="#0d9488" stroke="#f59e0b" strokeWidth="1" />
              {/* Java */}
              <path d="M125 155 L210 160 L240 168 L170 172 Z" fill="#0d9488" stroke="#f59e0b" strokeWidth="1" />
              {/* Kalimantan */}
              <path d="M165 75 L230 50 L250 110 L195 125 L165 105 Z" fill="#0d9488" stroke="#f59e0b" strokeWidth="1" />
              {/* Sulawesi */}
              <path d="M285 70 L320 60 L315 110 L335 125 L300 135 L290 100 Z" fill="#0d9488" stroke="#f59e0b" strokeWidth="1" />
              {/* Nusa Tenggara */}
              <path d="M260 170 L350 178 L340 185 L260 178 Z" fill="#0d9488" stroke="#f59e0b" strokeWidth="1" />
              {/* Papua */}
              <path d="M380 90 L460 80 L480 135 L425 145 L385 130 Z" fill="#0d9488" stroke="#f59e0b" strokeWidth="1" />
            </svg>

            {/* PINS */}
            {REGIONAL_STORIES.map((s) => {
              const isSelected = selectedRegion.id === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelectRegion(s)}
                  style={{ left: `${s.coordinates.x}%`, top: `${s.coordinates.y}%` }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-1.5 cursor-pointer z-10 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 scale-110 shadow-amber-500/50 ring-2 ring-white'
                      : 'bg-[#0f1c3f]/90 text-amber-200 border border-amber-500/40 hover:scale-105 hover:bg-amber-500/20'
                  }`}
                  title={s.title}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-mono">{s.region.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* ACTIVE REGIONAL DISPLAY CARD WITH SLIDE TRANSITION */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedRegion.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-[#040914]/90 p-5 rounded-2xl border border-amber-500/30 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/20 pb-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {selectedRegion.region} ({selectedRegion.province})
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {selectedRegion.year} · {selectedRegion.category}
                </span>
              </div>

              <h4 className="font-playfair font-bold text-slate-100 text-base">
                "{selectedRegion.title}"
              </h4>

              <p className="text-xs text-slate-200 font-serif italic leading-relaxed">
                "{selectedRegion.story}"
              </p>

              <div className="pt-2 border-t border-slate-800 text-[11px] space-y-1">
                <div className="flex items-center gap-1.5 text-sky-400">
                  <Music className="w-3.5 h-3.5" />
                  <span>Tekstur Suara: {selectedRegion.soundNote}</span>
                </div>
                <p className="text-slate-400">
                  <strong className="text-slate-300">Fakta Empiris:</strong> {selectedRegion.dataFact}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* STUDIO GUBAHAN SASTRA (RIGHT 7 COLS) */}
        <div className="lg:col-span-7 lontar-parchment rounded-3xl p-6 md:p-8 space-y-5 flex flex-col justify-between border-2 border-amber-500/40">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/30 pb-4">
              <div>
                <h3 className="font-playfair font-bold text-xl text-white">
                  Studio Gubahan Sastra (Kertas Lontar)
                </h3>
                <p className="text-xs text-slate-200 font-serif">
                  Wadah bebas merangkai empati, kritik wacana, dan kesaksian batin
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={karyaType}
                  onChange={(e) => setKaryaType(e.target.value as any)}
                  className="bg-[#040914] border border-amber-500/40 text-white text-xs rounded-xl px-3 py-1.5 font-bold focus:outline-none cursor-pointer"
                >
                  <option value="Puisi">Puisi</option>
                  <option value="Cerpen Mini">Cerpen Mini</option>
                  <option value="Monolog">Monolog</option>
                  <option value="Surat Warga">Surat Warga</option>
                </select>

                <button
                  onClick={handlePromptGenerator}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow cursor-pointer active:scale-95"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Inspirasi Prompt</span>
                </button>
              </div>
            </div>

            {/* TITLE & BODY */}
            <input
              type="text"
              value={karyaTitle}
              onChange={(e) => setKaryaTitle(e.target.value)}
              placeholder="Judul Karya Sastra Anda..."
              className="w-full bg-[#040914]/90 border border-amber-500/40 rounded-xl p-3 text-white font-playfair font-bold text-base focus:outline-none focus:border-amber-400 placeholder-slate-400 shadow-inner"
            />

            <textarea
              rows={8}
              value={karyaBody}
              onChange={(e) => setKaryaBody(e.target.value)}
              placeholder="Tuliskan bait puisi, narasi cerpen, surat warga, atau monolog reflektif Anda di sini..."
              className="w-full bg-[#040914]/90 border border-amber-500/40 rounded-xl p-4 text-white font-serif text-sm leading-relaxed focus:outline-none focus:border-amber-400 resize-none placeholder-slate-400 shadow-inner"
            />
          </div>

          {/* ACTIONS & EXPORTS */}
          <div className="pt-3 border-t border-amber-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-white font-serif font-medium">
              {charCount} Karakter · {wordCount} Kata
            </span>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExportTxt}
                className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-amber-500/40 cursor-pointer"
                title="Unduh berkas TXT"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Unduh .TXT</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-amber-500/40 cursor-pointer"
                title="Cetak atau simpan sebagai PDF"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>Cetak / PDF</span>
              </button>

              <button
                onClick={handleSaveToGallery}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
              >
                {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-950 font-black" /> : <PlusCircle className="w-3.5 h-3.5" />}
                <span>{savedSuccess ? 'Tersimpan di Galeri!' : 'Simpan ke Galeri'}</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* SECTION 3: COMMUNITY ARCHIVE WITH SLIDE & GRID VIEW      */}
      {/* ======================================================== */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
          <div>
            <h3 className="font-playfair font-bold text-xl text-gold-gradient flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>Arsip Galeri Sastra Warga Nusantara</span>
            </h3>
            <p className="text-xs text-slate-400">
              Kumpulan gubahan yang tersimpan oleh pembaca dan penulis wacana publik
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle: Slide Ribbon vs Grid */}
            <div className="flex bg-[#040914] p-1 rounded-xl border border-amber-500/30 text-xs">
              <button
                onClick={() => {
                  gamelan.playWoodClack();
                  setGalleryViewMode('scroll');
                }}
                className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  galleryViewMode === 'scroll'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-amber-300'
                }`}
              >
                <Scroll className="w-3.5 h-3.5" />
                <span>Gulungan Geser</span>
              </button>

              <button
                onClick={() => {
                  gamelan.playWoodClack();
                  setGalleryViewMode('grid');
                }}
                className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  galleryViewMode === 'grid'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-amber-300'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Hamparan Kotak</span>
              </button>
            </div>

            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
              {communityWorks.length} Karya
            </span>
          </div>
        </div>

        {/* MODE 1: HORIZONTAL SCROLL / SLIDE CAROUSEL */}
        {galleryViewMode === 'scroll' ? (
          <div className="relative">
            <div className="overflow-x-auto pb-4 pt-1 flex gap-5 no-scrollbar scroll-smooth snap-x snap-mandatory">
              {communityWorks.map((item, idx) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="min-w-[280px] sm:min-w-[340px] max-w-[340px] snap-center lontar-parchment rounded-2xl p-5 border border-amber-500/40 flex flex-col justify-between space-y-4 shadow-xl shrink-0"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-white/90 font-mono border-b border-amber-500/30 pb-1.5">
                      <span className="uppercase font-bold tracking-wider text-amber-300">{item.type}</span>
                      <span>Lempir {toRoman(idx + 1)} · {item.timestamp}</span>
                    </div>

                    <h4 className="font-playfair font-bold text-white text-base leading-snug">
                      {item.title}
                    </h4>

                    <p className="text-xs text-white/95 font-serif leading-relaxed line-clamp-6 whitespace-pre-line italic">
                      "{item.body}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-amber-500/30 flex items-center justify-between text-xs text-white">
                    <span className="text-[11px] italic truncate max-w-[150px] text-white">Oleh: {item.author}</span>
                    <button
                      onClick={() => handleLike(item.id)}
                      className="flex items-center gap-1.5 text-white hover:text-rose-300 transition-colors cursor-pointer active:scale-125 bg-white/10 px-2 py-0.5 rounded border border-white/20"
                      title="Apresiasi karya ini"
                    >
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-400" />
                      <span className="font-mono text-[11px] font-bold text-white">{item.likes}</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center pt-2">
              <span className="text-[11px] text-slate-400 font-mono">
                ← Gulir mendatar (scroll horizontal) untuk menelusuri lembaran lontar karya warga →
              </span>
            </div>
          </div>
        ) : (
          /* MODE 2: GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {communityWorks.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
                className="bg-[#040914] rounded-2xl p-5 border border-amber-500/25 flex flex-col justify-between space-y-4 hover:border-amber-400 transition-all group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-amber-300/80 font-mono">
                    <span className="uppercase tracking-wider">{item.type}</span>
                    <span>{item.timestamp}</span>
                  </div>

                  <h4 className="font-playfair font-bold text-slate-100 text-base group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-300 font-serif leading-relaxed line-clamp-5 whitespace-pre-line italic">
                    "{item.body}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[11px] italic truncate max-w-[140px]">Oleh: {item.author}</span>
                  <button
                    onClick={() => handleLike(item.id)}
                    className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer active:scale-125"
                    title="Apresiasi karya ini"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-500/30" />
                    <span className="font-mono text-[11px]">{item.likes}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
