import React from 'react';
import { Share2, BookOpen, Heart, Globe, ExternalLink } from 'lucide-react';
import { TabId } from './Header';

interface FooterProps {
  onTabChange: (tab: TabId) => void;
  onOpenShare: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange, onOpenShare }) => {
  return (
    <footer className="relative z-20 border-t border-amber-500/25 bg-[#040914]/95 text-slate-400 text-xs py-8 px-4 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-amber-500/15">
          
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-lg font-black text-gold-gradient">
                TOPENG
              </span>
              <span className="text-[11px] text-amber-300 font-mono">
                Platform Sastra & Analisis Diskursus Nusantara
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed font-sans">
              Menghubungkan ketajaman analisis dekonstruksi wacana, verifikasi data empiris ilmiah, dan kehangatan empati sastra Indonesia. Terbuka untuk umum, bebas diakses oleh pelajar, pendidik, jurnalis, dan seluruh warga.
            </p>
          </div>

          {/* QUICK LINKS & SHARE */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onTabChange('pelacak')}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-400/50 hover:text-amber-300 transition-colors"
            >
              Pelacak Topeng
            </button>
            <button
              onClick={() => onTabChange('refleksi')}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-400/50 hover:text-amber-300 transition-colors"
            >
              Refleksi Topeng
            </button>
            <button
              onClick={() => onTabChange('museum')}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-400/50 hover:text-amber-300 transition-colors"
            >
              Museum Sastra
            </button>
            <button
              onClick={() => onTabChange('pendamping')}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-400/50 hover:text-amber-300 transition-colors"
            >
              Pendamping Bahasa
            </button>
            <button
              onClick={onOpenShare}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Bagikan Situs</span>
            </button>
          </div>

        </div>

        {/* BOTTOM ATTRIBUTION & CITATIONS */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-[11px] text-slate-500 font-mono">
          <div>
            <p className="text-slate-400">
              Verifikasi Metodologis Data Karhutla Kalteng (SiPongi KLHK & Nusantara Atlas Sentinel-2): Akses per <strong>26 Oktober 2026</strong>.
            </p>
            <p className="text-slate-500 mt-0.5">
              © 2026 Inisiatif Mandiri Sastra & Etika Bahasa Nusantara. Seluruh karya gubahan berlisensi terbuka untuk kemanusiaan.
            </p>
          </div>

          <div className="flex items-center gap-3 text-amber-400/80">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              <span>Akses Publik Bebas Hambatan</span>
            </span>
            <span>·</span>
            <span>Pentatonis Web Audio Synth</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
