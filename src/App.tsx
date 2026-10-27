/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, TabId } from './components/Header';
import { PelacakTopeng } from './components/PelacakTopeng';
import { RefleksiTopeng } from './components/RefleksiTopeng';
import { MuseumSastra } from './components/MuseumSastra';
import { PendampingBahasa } from './components/PendampingBahasa';
import { Footer } from './components/Footer';
import { ShareModal } from './components/ShareModal';
import { AccountSettingsModal } from './components/AccountSettingsModal';
import { HeroFeatureDeck } from './components/HeroFeatureDeck';
import { PemanduBatik } from './components/PemanduBatik';
import { KertasSastraAnimasi } from './components/KertasSastraAnimasi';
import { VoiceLiveModal } from './components/VoiceLiveModal';
import { Share2, Globe, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('pelacak');
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(true);
  const [largeText, setLargeText] = useState<boolean>(false);

  // Read URL query param to deep-link tabs if provided (e.g. ?tab=refleksi)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as TabId;
      if (tabParam && ['pelacak', 'refleksi', 'museum', 'pendamping'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between relative bg-bhineka-radial text-slate-100 selection:bg-amber-500 selection:text-slate-950 ${largeText ? 'text-lg' : ''}`}>
      
      {/* BACKGROUND GRAPHICS: MAHA REMBULAN, GARUDA EMAS & OMBAK MEGA MENDUNG */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Glowing Rembulan Celestial Halo */}
        <div className="absolute -top-32 -right-32 w-96 h-96 md:w-[650px] md:h-[650px] rounded-full bg-gradient-to-br from-amber-200/20 via-amber-400/15 to-transparent glow-rembulan blur-3xl" />
        <div className="absolute top-16 right-16 w-56 h-56 md:w-80 md:h-80 rounded-full border border-amber-400/30 opacity-25 celestial-glow" />

        {/* Garuda Phoenix Emas SVG Motif */}
        <div className="absolute top-20 left-8 md:left-20 opacity-25 hidden md:block">
          <svg width="150" height="150" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 10 L60 35 L85 20 L70 45 L95 60 L68 65 L75 90 L50 72 L25 90 L32 65 L5 60 L30 45 L15 20 L40 35 Z" fill="url(#garudaGoldApp)" />
            <defs>
              <linearGradient id="garudaGoldApp" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFF59D" />
                <stop offset="0.5" stopColor="#F59E0B" />
                <stop offset="1" stopColor="#D97706" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Cosmic Star, Embers & Teal Auroras */}
        <div className="absolute top-1/4 left-1/3 w-2.5 h-2.5 rounded-full bg-amber-300 opacity-70 animate-ping" />
        <div className="absolute top-2/3 right-1/4 w-3.5 h-3.5 rounded-full bg-teal-300 opacity-60 animate-pulse" />
        <div className="absolute bottom-1/3 left-10 w-2 h-2 rounded-full bg-rose-400 opacity-75" />

        {/* Ombak Samudra Wave Graphic (Teal & Golden Foams) */}
        <div className="absolute bottom-0 inset-x-0 h-44 opacity-25 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="#0d9488" fillOpacity="0.65" d="M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,213.3C672,224,768,192,864,165.3C960,139,1056,117,1152,128C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
            <path fill="#f59e0b" fillOpacity="0.35" d="M0,96L48,112C96,128,192,160,288,154.7C384,149,480,107,576,112C672,117,768,171,864,181.3C960,192,1056,160,1152,144C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
        </div>
      </div>

      {/* HEADER WITH REAL-TIME AUDIO & PUBLIC SHARE BUTTON */}
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenShare={() => setIsShareModalOpen(true)}
        onOpenAccount={() => setIsAccountModalOpen(true)}
        onOpenVoice={() => setIsVoiceModalOpen(true)}
        largeText={largeText}
        onToggleLargeText={() => setLargeText(!largeText)}
      />

      {/* PUBLIC BANNER CALLOUT FOR SHARING & ACCOUNT */}
      <aside className="relative z-20 bg-gradient-to-r from-amber-950/80 via-[#101736]/90 to-teal-950/80 border-b border-amber-500/40 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-amber-200 flex-wrap">
            <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              <strong>Platform Sastra Nusantara:</strong> Terbuka untuk umum & bebas dibuka semua akun.
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
              ✓ Ramah Pelajar & Akun &lt;17 Tahun (Family Link & Belajar.id)
            </span>
            {typeof window !== 'undefined' && window.location.hostname.includes('ais-dev-') && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                ⚠️ Tips: Mau bagikan ke akun lain? Gunakan tombol "Bagikan Tautan Publik" di sebelah kanan
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className="text-teal-300 hover:text-white font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>Suara Langsung</span>
            </button>
            <span className="text-amber-500/40">|</span>
            <button
              onClick={() => setIsAccountModalOpen(true)}
              className="text-amber-300 hover:text-white font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>Keamanan & Akun</span>
            </button>
            <span className="text-amber-500/40">|</span>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-white border border-amber-500/40 font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Bagikan Tautan Publik & QR</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-6 flex-grow w-full space-y-8">
        
        {/* TAMPILKAN 4 FITUR UTAMA DI BAGIAN ATAS DENGAN WARNA BHINEKA TUNGGAL RUPA */}
        <HeroFeatureDeck
          activeTab={activeTab}
          onSelectTab={handleTabChange}
          onOpenShare={() => setIsShareModalOpen(true)}
          onOpenVoice={() => setIsVoiceModalOpen(true)}
        />

        {/* ACTIVE WORKSPACE ANCHOR & WORKSPACE VIEW */}
        <div id="main-workspace" className="pt-2">
          {activeTab === 'pelacak' && <PelacakTopeng />}
          {activeTab === 'refleksi' && <RefleksiTopeng onSwitchToMuseum={() => handleTabChange('museum')} />}
          {activeTab === 'museum' && <MuseumSastra />}
          {activeTab === 'pendamping' && <PendampingBahasa />}
        </div>

      </main>

      {/* FOOTER */}
      <Footer
        onTabChange={handleTabChange}
        onOpenShare={() => setIsShareModalOpen(true)}
      />

      {/* FLOATING LITERARY MANUSCRIPT SHEETS ANIMATION */}
      <KertasSastraAnimasi />

      {/* INTERACTIVE CULTURAL PEMANDU SASTRA COMPONENT */}
      {showGuide && (
        <PemanduBatik
          activeTab={activeTab}
          onNavigateTab={handleTabChange}
          onOpenVoice={() => setIsVoiceModalOpen(true)}
        />
      )}

      {/* SHARE MODAL WITH QR & DIRECT LINKS */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* ACCOUNT SECURITY & SETTINGS MODAL */}
      <AccountSettingsModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        showGuide={showGuide}
        onToggleGuide={setShowGuide}
      />

      {/* REAL-TIME VOICE CONVERSATION MODAL (GEMINI LIVE & TTS) */}
      <VoiceLiveModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />

    </div>
  );
}
