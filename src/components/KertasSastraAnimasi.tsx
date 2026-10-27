import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, BookOpen, Feather, Wind } from 'lucide-react';
import { gamelan } from '../utils/audio';

interface FloatingLeaf {
  id: number;
  initX: number; // percentage across screen
  initDelay: number;
  duration: number;
  size: number;
  rotation: number;
  quote: {
    text: string;
    author: string;
    source: string;
  };
}

const LITERARY_QUOTES = [
  {
    text: "Bila kita tak mampu melahirkan kata yang membebaskan, setidaknya janganlah merajut kata yang membelenggu kejujuran.",
    author: "Pramoedya Ananta Toer",
    source: "Catatan Kemanusiaan"
  },
  {
    text: "Hujan bulan Juni tak pernah meneteskan air mata sia-sia di atas tanah yang haus akan kejujuran.",
    author: "Sapardi Djoko Damono",
    source: "Kidung Penghayatan"
  },
  {
    text: "Aku ingin mencintaimu dengan sederhana: dengan kata yang tak sempat diucapkan kayu kepada api yang menjadikannya abu.",
    author: "Sapardi Djoko Damono",
    source: "Sajak Keheningan"
  },
  {
    text: "Nasib terbaik adalah tidak pernah dilahirkan, kedua dilahirkan tapi mati muda, dan tersial adalah berumur panjang di bawah topeng dusta.",
    author: "Soe Hok Gie",
    source: "Catatan Harian Seorang Demonstran"
  },
  {
    text: "Bahasa adalah rumah keberadaan; di sanalah martabat manusia diuji dan dimuliakan.",
    author: "Falsafah Nusantara",
    source: "Serat Tat Twam Asi"
  },
  {
    text: "Bumi ini cukup untuk tujuh generasi manusia, namun tak akan pernah cukup bagi keserakahan satu orang penguasa.",
    author: "Mahatma Gandhi (Dikutip Sastrawan Indonesia)",
    source: "Suara Ekologi"
  }
];

export const KertasSastraAnimasi: React.FC = () => {
  const [leaves, setLeaves] = useState<FloatingLeaf[]>([]);
  const [activeQuote, setActiveQuote] = useState<{ text: string; author: string; source: string } | null>(null);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  // Generate a set of gracefully floating manuscript leaves
  useEffect(() => {
    const generated: FloatingLeaf[] = [
      {
        id: 1,
        initX: 8,
        initDelay: 0,
        duration: 22,
        size: 34,
        rotation: 14,
        quote: LITERARY_QUOTES[0]
      },
      {
        id: 2,
        initX: 28,
        initDelay: 5,
        duration: 26,
        size: 28,
        rotation: -22,
        quote: LITERARY_QUOTES[1]
      },
      {
        id: 3,
        initX: 52,
        initDelay: 11,
        duration: 24,
        size: 36,
        rotation: 30,
        quote: LITERARY_QUOTES[2]
      },
      {
        id: 4,
        initX: 74,
        initDelay: 3,
        duration: 28,
        size: 30,
        rotation: -15,
        quote: LITERARY_QUOTES[3]
      },
      {
        id: 5,
        initX: 90,
        initDelay: 8,
        duration: 25,
        size: 32,
        rotation: 18,
        quote: LITERARY_QUOTES[4]
      }
    ];
    setLeaves(generated);
  }, []);

  const handleCatchLeaf = (quote: { text: string; author: string; source: string }) => {
    gamelan.playBonang(659.25);
    setActiveQuote(quote);
  };

  if (!isEnabled) {
    return (
      <button
        onClick={() => setIsEnabled(true)}
        className="fixed bottom-5 left-5 z-30 p-2 rounded-xl bg-[#040914]/80 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-1.5 hover:bg-amber-500/20 transition-all opacity-60 hover:opacity-100"
        title="Nyalakan Efek Kertas Sastra Melayang"
      >
        <Wind className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Nyalakan Kertas Sastra</span>
      </button>
    );
  }

  return (
    <>
      {/* FLOATING LITERARY MANUSCRIPTS IN BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden" aria-hidden="true">
        {leaves.map((leaf) => (
          <motion.div
            key={leaf.id}
            initial={{ y: '110vh', x: `${leaf.initX}vw`, rotate: leaf.rotation, opacity: 0 }}
            animate={{
              y: '-20vh',
              x: [
                `${leaf.initX}vw`,
                `${leaf.initX + (leaf.id % 2 === 0 ? 4 : -4)}vw`,
                `${leaf.initX}vw`,
                `${leaf.initX + (leaf.id % 2 === 0 ? -3 : 3)}vw`,
                `${leaf.initX}vw`
              ],
              rotate: [leaf.rotation, leaf.rotation + 25, leaf.rotation - 20, leaf.rotation],
              opacity: [0, 0.45, 0.65, 0.45, 0]
            }}
            transition={{
              duration: leaf.duration,
              repeat: Infinity,
              delay: leaf.initDelay,
              ease: "easeInOut"
            }}
            style={{ width: leaf.size, height: leaf.size * 1.35 }}
            className="absolute pointer-events-auto cursor-pointer group"
            onClick={() => handleCatchLeaf(leaf.quote)}
            title="Tangkap lembaran kertas sastra ini untuk membaca petikan mutiara!"
          >
            {/* MINI HANDCRAFTED PARCHMENT SHEET SVG */}
            <div className="w-full h-full lontar-parchment rounded shadow-md border border-amber-700/50 p-1 flex flex-col justify-between transform transition-transform group-hover:scale-125 group-hover:shadow-amber-500/50">
              <div className="w-full h-0.5 bg-amber-900/40 rounded-full" />
              <div className="space-y-0.5">
                <div className="w-3/4 h-0.5 bg-amber-900/30 rounded-full" />
                <div className="w-full h-0.5 bg-amber-900/25 rounded-full" />
                <div className="w-2/3 h-0.5 bg-amber-900/30 rounded-full" />
              </div>
              <div className="flex justify-end">
                <Feather className="w-2 h-2 text-amber-800 opacity-60" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* POPUP CARD WHEN USER CATCHES A FLOATING LEAF */}
      <AnimatePresence>
        {activeQuote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: -3 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotate: 3 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative w-full max-w-md lontar-parchment rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl border-2 border-amber-500/40"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveQuote(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Tutup Kutipan"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase tracking-widest border-b border-amber-500/30 pb-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Petikan Kertas Sastra Tertangkap</span>
              </div>

              <blockquote className="font-playfair text-base sm:text-lg text-white font-bold italic leading-relaxed pt-1">
                "{activeQuote.text}"
              </blockquote>

              <div className="pt-3 border-t border-amber-500/30 flex items-center justify-between text-xs text-white font-serif">
                <span className="font-bold text-amber-300">— {activeQuote.author}</span>
                <span className="text-[11px] italic text-slate-200">({activeQuote.source})</span>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => setActiveQuote(null)}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
                >
                  Lepaskan Kembali ke Semilir Angin
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
