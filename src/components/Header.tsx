import React, { useState } from 'react';
import { ScanSearch, Layers, BookOpen, Compass, Volume2, VolumeX, Share2, Menu, X, Sparkles, Type, ShieldCheck, User } from 'lucide-react';
import { gamelan } from '../utils/audio';

export type TabId = 'pelacak' | 'refleksi' | 'museum' | 'pendamping';

interface HeaderProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onOpenShare: () => void;
  onOpenAccount: () => void;
  onOpenVoice?: () => void;
  largeText: boolean;
  onToggleLargeText: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenShare,
  onOpenAccount,
  onOpenVoice,
  largeText,
  onToggleLargeText
}) => {
  const [audioActive, setAudioActive] = useState<boolean>(gamelan.getStatus());
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const toggleSound = () => {
    const newState = gamelan.toggleAudio();
    setAudioActive(newState);
  };

  const handleNavClick = (tab: TabId) => {
    gamelan.playBonang(523.25);
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'pelacak' as TabId, label: 'Pelacak Topeng', icon: ScanSearch, sub: 'Dekonstruksi Bias & Empati' },
    { id: 'refleksi' as TabId, label: 'Refleksi Topeng', icon: Layers, sub: 'Data Karhutla 2026 & Simulasi' },
    { id: 'museum' as TabId, label: 'Museum Sastra', icon: BookOpen, sub: 'Peta Suara & Studio Lontar' },
    { id: 'pendamping' as TabId, label: 'Pendamping Bahasa', icon: Compass, sub: 'Kamus Diksi & Pakar Kritis' },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-[#f59e0b]/35 bg-gradient-to-r from-[#170c2e]/95 via-[#0e273a]/95 to-[#083e47]/95 backdrop-blur-xl px-4 lg:px-8 py-3.5 transition-all shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* BRAND & LOGO */}
        <div 
          onClick={() => handleNavClick('pelacak')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#f59e0b] via-[#2dd4bf] to-[#7c3aed] p-0.5 shadow-lg shadow-amber-500/25 group-hover:shadow-teal-400/40 transition-all">
            <div className="w-full h-full bg-[#0a1128] rounded-[14px] flex items-center justify-center">
              <span className="font-cinzel text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#fffbeb] via-[#fde047] to-[#f59e0b]">T</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-cinzel text-xl md:text-2xl font-black tracking-wider text-gold-gradient leading-none">
                TOPENG
              </h1>
              <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono">
                Edisi Nusantara 2026
              </span>
              <span className="hidden md:inline-block text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono">
                Aman &lt;17 Thn
              </span>
            </div>
            <p className="text-[10px] md:text-[11px] text-amber-200/75 tracking-wider uppercase mt-0.5 font-medium">
              Telaah Opini · Penafsiran · Empati · Narasi · Gubahan
            </p>
          </div>
        </div>

        {/* DESKTOP NAVIGATION TABS */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-[#0a1128]/80 rounded-2xl border border-amber-500/30 text-xs font-semibold">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 scale-[1.02]'
                    : 'text-slate-300 hover:text-amber-300 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* UTILITIES: AUDIO TOGGLE, ACCESSIBILITY, SHARE BUTTON */}
        <div className="flex items-center gap-2">
          {/* Audio Gamelan Toggle */}
          <button
            onClick={toggleSound}
            title={audioActive ? 'Gamelan Aktif (Klik untuk mute)' : 'Gamelan Nonaktif (Klik untuk bunyikan)'}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              audioActive
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm shadow-amber-500/20'
                : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
            aria-label="Toggle Audio Gamelan"
          >
            {audioActive ? <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline font-medium text-[11px]">
              {audioActive ? 'Gamelan On' : 'Gamelan Off'}
            </span>
          </button>

          {/* Large text toggle for accessibility */}
          <button
            onClick={onToggleLargeText}
            title={largeText ? 'Kembalikan ukuran teks normal' : 'Perbesar ukuran teks baca'}
            className={`p-2 rounded-xl border transition-all text-xs cursor-pointer ${
              largeText 
                ? 'bg-amber-500/25 border-amber-400 text-amber-300' 
                : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
            aria-label="Ubah ukuran teks"
          >
            <Type className="w-4 h-4" />
          </button>

          {/* VOICE LIVE BUTTON */}
          {onOpenVoice && (
            <button
              onClick={() => {
                gamelan.playBonang(587.33);
                onOpenVoice();
              }}
              title="Percakapan Suara Langsung (Gemini Live Audio)"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-gradient-to-r from-teal-900/80 to-amber-900/80 hover:from-teal-800 hover:to-amber-800 border border-teal-400/40 text-teal-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm group"
            >
              <span className="w-2 h-2 rounded-full bg-teal-400 group-hover:scale-125 animate-ping" />
              <span className="hidden sm:inline">Suara Langsung</span>
            </button>
          )}

          {/* ACCOUNT & SECURITY BUTTON */}
          <button
            onClick={() => {
              gamelan.playBonang(523.25);
              onOpenAccount();
            }}
            title="Keamanan & Setelan Akun"
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900/90 hover:bg-[#0f1c3f] border border-amber-500/35 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Keamanan & Akun</span>
          </button>

          {/* SHARE BUTTON: "Bisa Dibuka Semua Orang" */}
          <button
            onClick={() => {
              gamelan.playBonang(659.25);
              onOpenShare();
            }}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/25 transition-all hover:scale-[1.03] active:scale-95 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span className="font-bold">Bagikan Situs</span>
          </button>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-400 hover:bg-slate-800 transition-colors"
            aria-label="Buka Menu Navigasi"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* MOBILE EXPANDED MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-amber-500/20 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-[#0a1128]/70 text-slate-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isActive ? 'bg-black/20 text-slate-950' : 'bg-slate-900 text-amber-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">{item.label}</div>
                    <div className={`text-[11px] ${isActive ? 'text-slate-900/80' : 'text-slate-400'}`}>{item.sub}</div>
                  </div>
                </div>
              </button>
            );
          })}

          {/* MOBILE ACCOUNT BUTTON */}
          <button
            onClick={() => {
              gamelan.playBonang(523.25);
              onOpenAccount();
              setMobileMenuOpen(false);
            }}
            className="w-full p-3 rounded-2xl flex items-center gap-3 bg-[#0f1c3f] border border-amber-500/40 text-amber-200 text-left font-bold"
          >
            <div className="p-2 rounded-xl bg-slate-900 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm">Keamanan & Setelan Akun</div>
              <div className="text-[11px] text-slate-400">PIN Sastra, 2FA, & Pengaturan Privasi</div>
            </div>
          </button>
        </div>
      )}
    </header>
  );
};
