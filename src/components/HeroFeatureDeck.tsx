import React from 'react';
import { motion } from 'motion/react';
import { 
  ScanSearch, Layers, BookOpen, Compass, Sparkles, ArrowRight, 
  Scroll, Globe, Waves, Flame, Award, Heart
} from 'lucide-react';
import { TabId } from './Header';
import { gamelan } from '../utils/audio';

interface HeroFeatureDeckProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  onOpenShare: () => void;
  onOpenVoice?: () => void;
}

export const HeroFeatureDeck: React.FC<HeroFeatureDeckProps> = ({
  activeTab,
  onSelectTab,
  onOpenShare,
  onOpenVoice
}) => {
  const mainFeatures = [
    {
      id: 'pelacak' as TabId,
      number: 'PILAR I',
      title: 'Pelacak Topeng & Kacamata Empati',
      subtitle: 'Dekonstruksi Bias & Tiga Kacamata Rasa',
      description: 'Bedah kata mutlak, label sepihak, dan eufemisme birokrasi. Pantulkan ke 3 sudut pandang empati manusiawi (Warga, Peneliti, & Sastra).',
      icon: ScanSearch,
      cardGradient: 'from-[#0b3842] via-[#105361] to-[#07242c]',
      borderStyle: 'border-[#2dd4bf]/60 hover:border-[#5eead4]',
      glowShadow: 'shadow-[0_10px_30px_rgba(20,184,166,0.25)] hover:shadow-[0_15px_40px_rgba(45,212,191,0.4)]',
      badgeText: 'Netralitas 0–100%',
      badgeBg: 'bg-[#0d9488]/25 text-[#5eead4] border-[#14b8a6]/50',
      accentColor: 'text-[#2dd4bf]',
      iconBg: 'bg-[#14b8a6]/20 border-[#2dd4bf]/40',
      actionText: 'Mulai Dekonstruksi'
    },
    {
      id: 'refleksi' as TabId,
      number: 'PILAR II',
      title: 'Refleksi Topeng & Simulasi Narasi',
      subtitle: 'Audit Karhutla 2026 (+850% Delta) & Roleplay',
      description: 'Uji disparitas data empiris SiPongi (~202k ha) vs Satelit Radar Nusantara Atlas (~1.920k ha). Rasakan dampak pilihan narasi Anda terhadap kepanikan publik.',
      icon: Layers,
      cardGradient: 'from-[#421429] via-[#5c1c38] to-[#240a17]',
      borderStyle: 'border-[#fb7185]/60 hover:border-[#fda4af]',
      glowShadow: 'shadow-[0_10px_30px_rgba(244,63,94,0.25)] hover:shadow-[0_15px_40px_rgba(251,113,133,0.4)]',
      badgeText: 'Audit Empiris 2026',
      badgeBg: 'bg-[#e11d48]/25 text-[#fda4af] border-[#f43f5e]/50',
      accentColor: 'text-[#fb7185]',
      iconBg: 'bg-[#f43f5e]/20 border-[#fb7185]/40',
      actionText: 'Uji Simulasi Narasi'
    },
    {
      id: 'museum' as TabId,
      number: 'PILAR III',
      title: 'Museum Sastra & Gulungan Lontar',
      subtitle: 'Naskah Lontar Geser & Peta 5 Pulau',
      description: 'Jelajahi gulungan lontar tradisional berselancar horizontal dengan audio gamelan. Simak suara warga dan gubah karya di Studio Kertas Lontar.',
      icon: BookOpen,
      cardGradient: 'from-[#422206] via-[#5e3209] to-[#261303]',
      borderStyle: 'border-[#f59e0b]/70 hover:border-[#fde047]',
      glowShadow: 'shadow-[0_10px_30px_rgba(245,158,11,0.25)] hover:shadow-[0_15px_40px_rgba(251,191,36,0.45)]',
      badgeText: 'Lontar Slide Reader',
      badgeBg: 'bg-[#d97706]/25 text-[#fde047] border-[#f59e0b]/50',
      accentColor: 'text-[#fcd34d]',
      iconBg: 'bg-[#f59e0b]/20 border-[#fcd34d]/40',
      actionText: 'Buka Gulungan Lontar'
    },
    {
      id: 'pendamping' as TabId,
      number: 'PILAR IV',
      title: 'Pendamping Bahasa & Kamus Diksi',
      subtitle: 'Padanan Puitis Nusantara & Pakar Kritis',
      description: 'Transformasikan istilah birokrasi yang beku menjadi ungkapan sastrawi yang bernyawa. Uji draf kalimat Anda bersama pakar telaah wacana.',
      icon: Compass,
      cardGradient: 'from-[#22134a] via-[#351b6e] to-[#140b2e]',
      borderStyle: 'border-[#a855f7]/60 hover:border-[#c084fc]',
      glowShadow: 'shadow-[0_10px_30px_rgba(168,85,247,0.25)] hover:shadow-[0_15px_40px_rgba(192,132,252,0.4)]',
      badgeText: 'Kamus Diksi Puitis',
      badgeBg: 'bg-[#9333ea]/25 text-[#e9d5ff] border-[#a855f7]/50',
      accentColor: 'text-[#c084fc]',
      iconBg: 'bg-[#9333ea]/20 border-[#c084fc]/40',
      actionText: 'Konsultasi Bahasa'
    }
  ];

  const handleCardClick = (id: TabId) => {
    gamelan.playBonang(id === 'pelacak' ? 523.25 : id === 'refleksi' ? 587.33 : id === 'museum' ? 659.25 : 783.99);
    onSelectTab(id);
    const element = document.getElementById(`tab-${id}`) || document.getElementById('main-workspace');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-6 pt-1 pb-4">
      
      {/* ======================================================== */}
      {/* TOP HERO BANNER: WARNA AUTENTIK NUSANTARA               */}
      {/* (Maha Rembulan Emas, Ombak Samudra Toska, Lembayung Senja) */}
      {/* ======================================================== */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-[#f59e0b]/50 shadow-[0_20px_60px_rgba(15,23,42,0.8)] bg-gradient-to-br from-[#1d1038] via-[#0e273a] to-[#08424d] p-6 sm:p-8 md:p-10">
        
        {/* CELESTIAL BACKGROUND HALOS (Emas Rembulan & Toska Ombak) */}
        <div className="absolute -top-20 -right-20 w-80 h-80 md:w-[480px] md:h-[480px] rounded-full bg-gradient-to-br from-[#fef08a]/25 via-[#f59e0b]/20 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-20 w-80 h-80 md:w-[460px] md:h-[460px] rounded-full bg-gradient-to-tr from-[#14b8a6]/25 via-[#0d9488]/15 to-transparent blur-3xl pointer-events-none" />
        
        {/* STYLIZED OCEAN WAVE & MOUNTAIN RIDGE SILHOUETTE SVG */}
        <div className="absolute right-0 bottom-0 top-0 w-full md:w-1/2 opacity-20 pointer-events-none overflow-hidden flex items-end justify-end">
          <svg className="w-full h-full max-h-72" viewBox="0 0 600 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Mountain Crests (Lembayung) */}
            <path d="M150 300 L260 120 L350 220 L440 90 L560 300 Z" fill="#7c3aed" fillOpacity="0.4" />
            {/* Golden Moon Halo */}
            <circle cx="440" cy="90" r="70" fill="#fde047" fillOpacity="0.35" />
            {/* Foamy Sea Wave (Toska Samudra) */}
            <path d="M0 300 Q150 180 300 240 T600 210 L600 300 Z" fill="#0d9488" fillOpacity="0.6" />
            <path d="M50 300 Q200 210 350 260 T600 230 L600 300 Z" fill="#2dd4bf" fillOpacity="0.4" />
            <path d="M100 300 Q220 230 400 270 T600 250 L600 300 Z" fill="#fef08a" fillOpacity="0.3" />
          </svg>
        </div>

        {/* HERO CONTENT */}
        <div className="relative z-10 space-y-5 max-w-4xl text-left">
          
          {/* CULTURAL HARMONY BADGE */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#f59e0b]/25 via-[#14b8a6]/25 to-[#9333ea]/25 border border-[#f59e0b]/50 text-[#fef08a] text-xs font-semibold shadow-sm">
            <Sparkles className="w-4 h-4 text-[#fde047] animate-pulse" />
            <span className="font-serif tracking-widest uppercase">Harmoni Warna Sastra & Jiwa Nusantara</span>
          </div>

          {/* MAIN HEADLINE */}
          <div className="space-y-2">
            <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#fffbeb] via-[#fef08a] to-[#f59e0b] leading-tight drop-shadow-sm">
              TOPENG
            </h1>
            <p className="font-playfair text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#5eead4] via-[#2dd4bf] to-[#38bdf8] leading-snug">
              Menyingkap Wacana, Memuliakan Empati
            </p>
          </div>

          {/* POETIC MOTTO FROM ARTWORK CONCEPT */}
          <blockquote className="font-serif italic text-xs sm:text-sm md:text-base text-slate-100 leading-relaxed border-l-4 border-[#f59e0b] pl-4 bg-black/35 py-2.5 rounded-r-2xl max-w-3xl">
            "Bermacam-macam suku bangsa dan bahasa, kekayaan alam dan keanekaragaman hayati, lautan serta daratan, menjadi satu dalam cermin nurani sastra."
          </blockquote>

          {/* PALETTE STRIP PILLS (Toska Samudra · Emas Rembulan · Merah Koral · Lembayung Malam) */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#0c4a56]/80 border border-[#2dd4bf]/40 text-[#5eead4] font-medium shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2dd4bf] shadow-sm shadow-[#2dd4bf]" />
              <span>Samudra Toska</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#422206]/80 border border-[#f59e0b]/40 text-[#fde047] font-medium shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#fde047] shadow-sm shadow-[#fde047]" />
              <span>Emas Rembulan</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#421429]/80 border border-[#fb7185]/40 text-[#fda4af] font-medium shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e] shadow-sm shadow-[#f43f5e]" />
              <span>Koral Garuda</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#22134a]/80 border border-[#c084fc]/40 text-[#e9d5ff] font-medium shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c084fc] shadow-sm shadow-[#c084fc]" />
              <span>Lembayung Malam</span>
            </div>
          </div>

          {/* FAST ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => handleCardClick('pelacak')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#d97706] hover:from-[#fde047] hover:to-[#f59e0b] text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#f59e0b]/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ScanSearch className="w-4 h-4" />
              <span>Mulai Dekonstruksi Wacana</span>
            </button>

            <button
              onClick={() => handleCardClick('museum')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0d9488] to-[#14b8a6] hover:from-[#14b8a6] hover:to-[#2dd4bf] text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#0d9488]/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Scroll className="w-4 h-4" />
              <span>Buka Gulungan Lontar</span>
            </button>

            {onOpenVoice && (
              <button
                onClick={() => {
                  gamelan.playBonang(587.33);
                  onOpenVoice();
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#9333ea] hover:from-[#9333ea] hover:to-[#a855f7] text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#7c3aed]/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>Suara Langsung Gemini Live</span>
              </button>
            )}

            <button
              onClick={onOpenShare}
              className="px-4 py-2.5 rounded-xl bg-[#091b29]/80 hover:bg-[#102a3d] border border-[#f59e0b]/40 text-[#fde047] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Bagikan Situs</span>
            </button>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 4 CORE MAIN FEATURES DECK (TAMPILKAN DI BAGIAN ATAS)      */}
      {/* DENGAN WARNA SAMUDRA TOSKA, EMAS, KORAL, & LEMBAYUNG    */}
      {/* ======================================================== */}
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div>
            <h2 className="font-playfair font-bold text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#fffbeb] via-[#fde047] to-[#f59e0b] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#fde047]" />
              <span>Empat Fitur Utama Platform TOPENG</span>
            </h2>
            <p className="text-xs text-slate-300">
              Pilih salah satu fitur di bawah untuk langsung membuka ruang eksplorasi:
            </p>
          </div>

          <span className="text-[11px] font-mono text-[#fde047] bg-[#f59e0b]/15 px-3 py-1 rounded-full border border-[#f59e0b]/40 shadow-sm">
            ✦ Klik Kartu untuk Membuka Fitur ✦
          </span>
        </div>

        {/* 4 CARDS GRID WITH RICH HARMONIOUS PALETTES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mainFeatures.map((feat) => {
            const Icon = feat.icon;
            const isCurrentActive = activeTab === feat.id;

            return (
              <motion.div
                key={feat.id}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCardClick(feat.id)}
                className={`relative rounded-3xl p-5 sm:p-6 border-2 transition-all cursor-pointer flex flex-col justify-between overflow-hidden group ${feat.glowShadow} ${
                  isCurrentActive
                    ? `bg-gradient-to-br ${feat.cardGradient} border-[#fde047] ring-2 ring-[#fde047]/60 scale-[1.02]`
                    : `bg-gradient-to-br ${feat.cardGradient} ${feat.borderStyle}`
                }`}
              >
                {/* ACTIVE TOP GLOWING STRIP */}
                {isCurrentActive && (
                  <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#fde047] via-[#2dd4bf] to-[#f59e0b] animate-pulse" />
                )}

                {/* BACKGROUND WATERMARK ICON */}
                <Icon className="absolute -right-3 -bottom-3 w-28 h-28 text-white/5 pointer-events-none group-hover:scale-110 transition-transform duration-500" />

                <div className="space-y-3.5 relative z-10">
                  {/* TOP TAGS & NUMBER */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-black text-[#fde047] tracking-wider">
                      {feat.number}
                    </span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${feat.badgeBg}`}>
                      {feat.badgeText}
                    </span>
                  </div>

                  {/* ICON & TITLE */}
                  <div className="space-y-1.5">
                    <div className={`w-11 h-11 rounded-2xl ${feat.iconBg} border flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform`}>
                      <Icon className={`w-5 h-5 ${feat.accentColor}`} />
                    </div>

                    <h3 className="font-playfair font-bold text-base md:text-lg text-slate-100 group-hover:text-[#fde047] transition-colors leading-snug pt-1">
                      {feat.title}
                    </h3>

                    <span className={`text-[11px] font-medium block ${feat.accentColor}`}>
                      {feat.subtitle}
                    </span>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-xs text-slate-200 font-sans leading-relaxed line-clamp-3">
                    {feat.description}
                  </p>
                </div>

                {/* BOTTOM ACTION BUTTON */}
                <div className="pt-4 border-t border-white/15 flex items-center justify-between text-xs font-bold text-[#fde047] group-hover:text-white transition-colors relative z-10 mt-4">
                  <span className="text-[11px] font-mono">{feat.actionText}</span>
                  <div className="flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                    <span>Buka Ruang</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
