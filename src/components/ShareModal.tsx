import React, { useState } from 'react';
import { Share2, Copy, Check, QrCode, X, Smartphone, Globe, MessageSquare, Send, Twitter, Facebook } from 'lucide-react';
import { copyToClipboard, generateQRCodeSVG } from '../utils/qr';
import { gamelan } from '../utils/audio';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(true);

  if (!isOpen) return null;

  // Force public preview URL so anyone on any account or device can open it without Google Cloud IAM restrictions
  const PUBLIC_APP_URL = 'https://ais-pre-3nhrvtgvdny6hygdpev32i-606961021964.asia-northeast1.run.app';

  // Check if user is currently inside the private dev editor
  const isDevHost = typeof window !== 'undefined' && window.location.hostname.includes('ais-dev-');

  // Convert current URL: replace ais-dev- with ais-pre-, or use PUBLIC_APP_URL for localhost
  const currentUrl = typeof window !== 'undefined'
    ? (window.location.hostname.includes('localhost')
        ? PUBLIC_APP_URL
        : window.location.href.replace('ais-dev-', 'ais-pre-'))
    : PUBLIC_APP_URL;

  const shareTitle = 'TOPENG - Platform Sastra & Analisis Diskursus Nusantara';
  const shareMessage = `Buka dan telaah wacana publik lewat karya sastra & data empiris di aplikasi TOPENG (Telaah Opini, Penafsiran, Empati, Narasi & Gubahan Sastra):\n${currentUrl}`;

  const handleCopy = async () => {
    gamelan.playBonang(659.25);
    const success = await copyToClipboard(currentUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: 'Telaah Opini, Penafsiran, Empati, Narasi & Gubahan Sastra Nusantara',
          url: currentUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(currentUrl)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto glass-panel-gold rounded-3xl p-6 md:p-8 space-y-6 text-slate-100 shadow-2xl border border-amber-500/40">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900/80 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300 transition-colors"
          aria-label="Tutup modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pr-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider uppercase">
            <Globe className="w-4 h-4 text-amber-400" />
            <span>Akses Terbuka untuk Publik</span>
          </div>
          <h3 className="font-playfair text-2xl font-bold text-gold-gradient">
            Bagikan Website TOPENG
          </h3>
          <p className="text-xs md:text-sm text-slate-300">
            Aplikasi ini dirancang responsif dan dapat langsung dibuka oleh siapa saja di ponsel, tablet, atau komputer tanpa perlu mendaftar atau mengunduh aplikasi tambahan.
          </p>
        </div>

        {/* PENJELASAN PENTING: KENAPA LINK DEV GA BISA DIBUKA DI AKUN LAIN */}
        <div className="bg-gradient-to-r from-amber-950/90 via-[#1e1509] to-amber-950/80 border-2 border-amber-400/60 rounded-2xl p-4 text-xs space-y-2.5 shadow-lg">
          <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
            <span className="p-1 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300">💡</span>
            <span>Solusi: Mengapa Link Editor Tidak Bisa Dibuka Akun Lain?</span>
          </div>
          <p className="leading-relaxed text-slate-200">
            Link di address bar peramban editor Anda (<code className="text-rose-300 bg-black/40 px-1 py-0.5 rounded font-mono text-[11px]">ais-dev-...</code>) adalah lingkungan pengembang pribadi yang dikunci sistem Google Cloud. Orang lain / akun lain otomatis akan ditolak aksesnya.
          </p>
          <div className="p-2.5 bg-black/50 rounded-xl border border-emerald-500/40 flex items-start gap-2 text-emerald-200">
            <span className="text-emerald-400 font-bold shrink-0">✅</span>
            <div className="leading-relaxed">
              <strong>Gunakan Tautan Publik Resmi (<code className="text-emerald-300 font-mono text-[11px]">ais-pre-...</code>) di bawah ini:</strong>
              <div className="text-[11px] text-slate-300 mt-0.5">
                Tautan publik ini <strong>100% BEBAS DIBUKA</strong> oleh siapa saja: akun Google lain, akun anak-anak (&lt;17 thn), Google Family Link, akun Belajar.id, mode Samaran (Incognito), maupun HP tanpa login!
              </div>
            </div>
          </div>
        </div>

        {/* Copy Link Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-amber-300/90 uppercase tracking-wider flex items-center justify-between">
            <span>Tautan Publik (Bisa Dibuka Semua Akun)</span>
            {copied && <span className="text-emerald-400 flex items-center gap-1 text-[11px]"><Check className="w-3.5 h-3.5" /> Tautan Berhasil Disalin!</span>}
          </label>
          <div className="flex items-center gap-2 bg-[#040914] p-2 rounded-2xl border-2 border-amber-500/50">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="bg-transparent text-xs md:text-sm text-emerald-300 w-full px-3 py-1 outline-none font-mono selection:bg-amber-500 selection:text-black font-semibold"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all shrink-0 active:scale-95 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin' : 'Salin Tautan'}</span>
            </button>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Klik "Salin Tautan" lalu kirimkan ke WhatsApp, Telegram, atau browser lain.</span>
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:text-white underline font-medium inline-flex items-center gap-1 shrink-0 ml-2"
            >
              <span>Uji Buka di Tab Baru</span>
              <span className="text-xs">↗</span>
            </a>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Bagikan ke Media Sosial & Grup Diskusi:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp</span>
            </a>

            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-sky-950/60 hover:bg-sky-900 border border-sky-500/40 text-sky-300 text-xs font-semibold transition-all"
            >
              <Send className="w-4 h-4 text-sky-400" />
              <span>Telegram</span>
            </a>

            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-600 text-slate-200 text-xs font-semibold transition-all"
            >
              <Twitter className="w-4 h-4 text-slate-300" />
              <span>X (Twitter)</span>
            </a>

            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-blue-950/60 hover:bg-blue-900 border border-blue-500/40 text-blue-300 text-xs font-semibold transition-all"
            >
              <Facebook className="w-4 h-4 text-blue-400" />
              <span>Facebook</span>
            </a>
          </div>

          {'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full mt-2 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-amber-500/30 text-amber-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>Buka Menu Berbagi Bawaan Perangkat (Native Share)</span>
            </button>
          )}
        </div>

        {/* QR Code Scannable Section */}
        <div className="pt-2 border-t border-amber-500/20 flex flex-col sm:flex-row items-center gap-4 bg-[#060c1d] p-4 rounded-2xl border border-amber-500/20">
          <div className="bg-[#040914] p-2 rounded-xl border border-amber-500/40 shrink-0 shadow-lg">
            <img
              src={generateQRCodeSVG(currentUrl, 130)}
              alt="QR Code Website TOPENG"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg"
              loading="lazy"
            />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-amber-400 text-xs font-bold">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>Pindai Langsung via Ponsel</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Buka kamera HP Anda atau pemindai QR untuk membuka website ini secara instan di browser ponsel Anda tanpa mengetik URL.
            </p>
            <span className="text-[11px] text-amber-300/70 font-mono block">
              Kompatibel dengan Android, iOS, Windows, Mac, & Linux.
            </span>
          </div>
        </div>

        {/* PWA / APK INSTALLATION FOR USERS UNDER 17 */}
        <div className="bg-gradient-to-r from-[#0a1b2a] via-[#101736] to-[#07242c] p-4 rounded-2xl border border-teal-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Smartphone className="w-4 h-4 text-teal-400" />
              <span>Pasang APK / Aplikasi ke Layar Utama HP (&lt;17 Thn)</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
              Aman Pelajar
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Dapat langsung dipasang di ponsel Android anak & pelajar tanpa perlu akun Google Play Store dewasa atau kartu kredit.
          </p>
          <div className="bg-[#040914]/90 p-3 rounded-xl border border-teal-500/20 text-[11px] text-slate-300 space-y-1">
            <div className="font-semibold text-amber-300">Cara Pasang Cepat di Android & Tablet:</div>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px]">
              <li>Buka website ini di Chrome atau browser ponsel Anda.</li>
              <li>Ketuk ikon menu titik tiga (<strong className="text-amber-300">⋮</strong>) di pojok kanan atas layar peramban.</li>
              <li>Pilih menu <strong className="text-teal-300">"Tambahkan ke Layar Utama" (Add to Home screen)</strong> atau <strong className="text-teal-300">"Pasang Aplikasi" (Install App)</strong>.</li>
              <li>Ikon aplikasi <strong>TOPENG</strong> akan langsung terpasang di layar HP seperti aplikasi APK native!</li>
            </ol>
          </div>
        </div>

      </div>
    </div>
  );
};
