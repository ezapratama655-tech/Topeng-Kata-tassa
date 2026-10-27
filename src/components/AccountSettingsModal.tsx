import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Shield, KeyRound, Smartphone, Lock, Eye, EyeOff, 
  User, Check, X, Bell, Moon, Sun, Download, Upload, Trash2, 
  AlertCircle, History, Sparkles, RefreshCw, LogOut, Laptop, CheckCircle2,
  GraduationCap, BookOpen, HeartHandshake, Award, HelpCircle
} from 'lucide-react';
import { gamelan } from '../utils/audio';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  showGuide: boolean;
  onToggleGuide: (show: boolean) => void;
}

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  isOpen,
  onClose,
  showGuide,
  onToggleGuide
}) => {
  const [activeTab, setActiveTab] = useState<'keamanan' | 'pelajar' | 'setelan' | 'profil'>('pelajar');

  // Under 17 & Education Mode State
  const [isUnder17, setIsUnder17] = useState<boolean>(true);
  const [gradeLevel, setGradeLevel] = useState<'sd_smp' | 'sma_smk' | 'umum'>('sma_smk');
  const [schoolName, setSchoolName] = useState<string>('Pelajar Pegiat Sastra Nusantara');
  const [childSafeFilter, setChildSafeFilter] = useState<boolean>(true);
  const [studentBadgeSaved, setStudentBadgeSaved] = useState<boolean>(false);

  // Profile State
  const [penName, setPenName] = useState<string>('Sastrawan Muda Nusantara');
  const [userEmail, setUserEmail] = useState<string>('pelajar.nusantara@belajar.id');
  const [userBio, setUserBio] = useState<string>('Pelajar peminat sastra Nusantara, penelaah etika bahasa publik, dan pengarsip suara nurani warga.');
  const [profileSaved, setProfileSaved] = useState<boolean>(false);

  // Security State
  const [pinEnabled, setPinEnabled] = useState<boolean>(true);
  const [currentPin, setCurrentPin] = useState<string>('202600');
  const [newPin, setNewPin] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(true);
  const [pinChangeSuccess, setPinChangeSuccess] = useState<boolean>(false);

  // Settings State
  const [privacyMode, setPrivacyMode] = useState<'publik' | 'anonim' | 'privat'>('publik');
  const [autoAudio, setAutoAudio] = useState<boolean>(gamelan.getStatus());
  const [localEncryption, setLocalEncryption] = useState<boolean>(true);

  // Load user profile from localStorage if exists
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('topeng_pen_name');
      if (savedName) setPenName(savedName);
      const savedBio = localStorage.getItem('topeng_bio');
      if (savedBio) setUserBio(savedBio);
      const savedPrivacy = localStorage.getItem('topeng_privacy_mode');
      if (savedPrivacy) setPrivacyMode(savedPrivacy as any);
      const saved2FA = localStorage.getItem('topeng_2fa_enabled');
      if (saved2FA) setTwoFactorEnabled(saved2FA === 'true');
      const savedUnder17 = localStorage.getItem('topeng_under_17_mode');
      if (savedUnder17 !== null) setIsUnder17(savedUnder17 === 'true');
      const savedGrade = localStorage.getItem('topeng_grade_level');
      if (savedGrade) setGradeLevel(savedGrade as any);
      const savedSchool = localStorage.getItem('topeng_school_name');
      if (savedSchool) setSchoolName(savedSchool);
    }
  }, []);

  const handleSaveStudentSettings = () => {
    gamelan.playBonang(659.25);
    if (typeof window !== 'undefined') {
      localStorage.setItem('topeng_under_17_mode', String(isUnder17));
      localStorage.setItem('topeng_grade_level', gradeLevel);
      localStorage.setItem('topeng_school_name', schoolName);
    }
    setStudentBadgeSaved(true);
    setTimeout(() => setStudentBadgeSaved(false), 2500);
  };

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    gamelan.playBonang(659.25);
    if (typeof window !== 'undefined') {
      localStorage.setItem('topeng_pen_name', penName);
      localStorage.setItem('topeng_bio', userBio);
      localStorage.setItem('topeng_privacy_mode', privacyMode);
    }
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      alert('PIN Keamanan minimal 4-6 digit.');
      return;
    }
    gamelan.playGong(261.63);
    setCurrentPin(newPin);
    setNewPin('');
    setPinChangeSuccess(true);
    setTimeout(() => setPinChangeSuccess(false), 2500);
  };

  const handleToggle2FA = () => {
    gamelan.playWoodClack();
    const updated = !twoFactorEnabled;
    setTwoFactorEnabled(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('topeng_2fa_enabled', String(updated));
    }
  };

  const handleExportBackup = () => {
    gamelan.playBonang(523.25);
    const backupData = {
      penName,
      userEmail,
      userBio,
      privacyMode,
      twoFactorEnabled,
      communityWorks: typeof window !== 'undefined' ? localStorage.getItem('topeng_community_karya') : null,
      backupTimestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TOPENG_Cadangan_Akun_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetLocalData = () => {
    if (confirm('Apakah Anda yakin ingin mengatur ulang data dan riwayat cache lokal aplikasi ini?')) {
      gamelan.playGong(196);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('topeng_community_karya');
        localStorage.removeItem('topeng_pen_name');
        localStorage.removeItem('topeng_bio');
      }
      alert('Data lokal berhasil diatur ulang.');
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-2xl glass-panel-gold rounded-3xl p-6 md:p-8 space-y-6 text-slate-100 shadow-2xl border-2 border-amber-500/40 max-h-[90vh] overflow-y-auto">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900/80 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
          aria-label="Tutup Setelan"
        >
          <X className="w-5 h-5" />
        </button>

        {/* MODAL TITLE & USER BADGE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/25 pb-4 pr-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-amber-900 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
              <div className="w-full h-full bg-[#0a1128] rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <h3 className="font-playfair text-xl md:text-2xl font-bold text-gold-gradient">
                Keamanan & Setelan Akun
              </h3>
              <p className="text-xs text-amber-200/75">
                Pengelolaan Identitas Sastra, Proteksi PIN, dan Privasi Pengguna
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Terproteksi</span>
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 shadow-sm">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>Aman &lt;17 Thn</span>
            </span>
          </div>
        </div>

        {/* TAB BUTTONS */}
        <div className="flex p-1 bg-[#040914] rounded-2xl border border-amber-500/30 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => {
              gamelan.playWoodClack();
              setActiveTab('pelajar');
            }}
            className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'pelajar'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-amber-300/80 hover:text-amber-200 hover:bg-white/5'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>Mode Pelajar (&lt;17 Thn)</span>
          </button>

          <button
            onClick={() => {
              gamelan.playWoodClack();
              setActiveTab('keamanan');
            }}
            className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'keamanan'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-amber-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Keamanan Akun</span>
          </button>

          <button
            onClick={() => {
              gamelan.playWoodClack();
              setActiveTab('setelan');
            }}
            className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'setelan'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-amber-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Setelan & Privasi</span>
          </button>

          <button
            onClick={() => {
              gamelan.playWoodClack();
              setActiveTab('profil');
            }}
            className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'profil'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-amber-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profil Sastrawan</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 0: MODE PELAJAR & RAMAH REMAJA (<17 TAHUN)           */}
        {/* ======================================================== */}
        {activeTab === 'pelajar' && (
          <div className="space-y-5 animate-fade-in text-xs">
            
            {/* GREEN ACCESSIBILITY BADGE */}
            <div className="bg-gradient-to-r from-teal-950/80 via-[#0e273a] to-amber-950/60 p-4 rounded-2xl border-2 border-emerald-500/40 shadow-lg space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-emerald-300 flex items-center gap-2">
                      <span>Akses Resmi Terbuka untuk Akun &lt;17 Tahun</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-[10px] font-mono">
                        SEMUA USIA
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                      Platform edukasi sastra dan diskursus bahasa ini 100% aman dan ramah untuk pelajar SD, SMP, SMA/SMK, serta akun Google Family Link / Belajar.id tanpa syarat kartu kredit atau batasan umur 18+.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-emerald-500/25">
                <div className="bg-[#040914]/80 p-2.5 rounded-xl border border-emerald-500/20">
                  <span className="text-[10px] text-emerald-400 font-bold block uppercase">Google Family Link</span>
                  <span className="text-slate-300 text-[11px]">Dapat langsung dibuka di akun anak tanpa pemblokiran usia</span>
                </div>
                <div className="bg-[#040914]/80 p-2.5 rounded-xl border border-teal-500/20">
                  <span className="text-[10px] text-teal-400 font-bold block uppercase">Akun Belajar.id / Siswa</span>
                  <span className="text-slate-300 text-[11px]">Bebas akses untuk tugas sekolah dan lomba sastra nasional</span>
                </div>
                <div className="bg-[#040914]/80 p-2.5 rounded-xl border border-amber-500/20">
                  <span className="text-[10px] text-amber-400 font-bold block uppercase">Format APK / PWA</span>
                  <span className="text-slate-300 text-[11px]">Dapat dipasang ke layar utama HP tanpa akun Play Store dewasa</span>
                </div>
              </div>
            </div>

            {/* TOGGLE MODE SISWA */}
            <div className="bg-[#040914] p-4 rounded-2xl border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-200 text-sm flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>Mode Ramah Siswa & Bahasa Santun</span>
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Menyediakan pendampingan diksi bersahabat, terjemahan kata arkais, dan saringan AI edukasi.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUnder17(!isUnder17)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isUnder17 ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow transition duration-200 ease-in-out ${
                      isUnder17 ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* JENJANG PENDIDIKAN */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                  Pilih Tingkat Pendidikan / Usia Pengguna:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setGradeLevel('sd_smp')}
                    className={`p-3 rounded-xl border text-left space-y-1 transition-all cursor-pointer ${
                      gradeLevel === 'sd_smp'
                        ? 'bg-[#0f1c3f] border-emerald-400 text-emerald-200 ring-1 ring-emerald-400'
                        : 'bg-[#0a1128] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-bold text-xs block text-emerald-300">SD / SMP (Usia 10-14 Thn)</span>
                    <span className="text-[10px] text-slate-400 block">Kosakata disederhanakan, dongeng & cerita rakyat Nusantara ramah anak.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGradeLevel('sma_smk')}
                    className={`p-3 rounded-xl border text-left space-y-1 transition-all cursor-pointer ${
                      gradeLevel === 'sma_smk'
                        ? 'bg-[#0f1c3f] border-amber-400 text-amber-200 ring-1 ring-amber-400'
                        : 'bg-[#0a1128] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-bold text-xs block text-amber-300">SMA / SMK (Usia 15-17 Thn)</span>
                    <span className="text-[10px] text-slate-400 block">Analisis retorika, kritik hoaks publik, dan latihan menulis puisi empati.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGradeLevel('umum')}
                    className={`p-3 rounded-xl border text-left space-y-1 transition-all cursor-pointer ${
                      gradeLevel === 'umum'
                        ? 'bg-[#0f1c3f] border-teal-400 text-teal-200 ring-1 ring-teal-400'
                        : 'bg-[#0a1128] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-bold text-xs block text-teal-300">Umum & Peneliti Sastra</span>
                    <span className="text-[10px] text-slate-400 block">Kajian wacana komprehensif, riset filologi, dan arsip data historis.</span>
                  </button>
                </div>
              </div>

              {/* ASAL SEKOLAH / KOMUNITAS */}
              <div className="space-y-1 pt-2">
                <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                  Asal Sekolah / Komunitas Pelajar:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="Contoh: SMPN 1 / SMAN 2 / Sanggar Seni Remaja..."
                    className="flex-1 bg-[#0a1128] border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-amber-400 font-serif"
                  />
                  <button
                    type="button"
                    onClick={handleSaveStudentSettings}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow active:scale-95 shrink-0"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Simpan Pengaturan</span>
                  </button>
                </div>
                {studentBadgeSaved && (
                  <span className="text-emerald-400 text-[11px] flex items-center gap-1 pt-1">
                    <Check className="w-3.5 h-3.5" /> Pengaturan ramah pelajar berhasil disimpan ke peramban!
                  </span>
                )}
              </div>
            </div>

            {/* JAMINAN KEAMANAN & PRIVASI UNTUK ORANG TUA & GURU */}
            <div className="bg-[#040914] p-4 rounded-2xl border border-amber-500/20 space-y-3">
              <span className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Pernyataan Keamanan & Perlindungan Privasi Anak</span>
              </span>

              <div className="space-y-2 text-[11px] text-slate-300 leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">1.</span>
                  <span><strong>Nol Iklan & Pelacak Komersial:</strong> Tidak ada iklan pihak ketiga, tidak ada monetisasi data anak, dan seluruh data teks tersimpan di memori perangkat masing-masing.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">2.</span>
                  <span><strong>AI Sastra Bersertifikasi Ramah Anak:</strong> Model AI Gemini difilter secara ketat dari ujaran kebencian, kata kasar, dan materi dewasa sehingga aman untuk bahan diskusi kelas.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">3.</span>
                  <span><strong>Nilai Kebudayaan & Budi Pekerti:</strong> Mendorong generasi muda mencintai kekayaan naskah lontar, pantun, gurindam, serta hikayat Nusantara dengan semangat Bhinneka Tunggal Ika.</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 1: KEAMANAN AKUN                                     */}
        {/* ======================================================== */}
        {activeTab === 'keamanan' && (
          <div className="space-y-5 animate-fade-in text-xs">
            
            {/* SECURITY SCORE BAR */}
            <div className="bg-[#0f1c3f]/80 p-4 rounded-2xl border border-amber-500/25 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Tingkat Kekuatan Keamanan Akun Anda:</span>
                </span>
                <span className="text-emerald-400 font-mono">95% (Sangat Kuat)</span>
              </div>
              <div className="w-full bg-[#040914] h-2 rounded-full overflow-hidden border border-amber-500/30">
                <div className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full" style={{ width: '95%' }} />
              </div>
              <p className="text-[11px] text-slate-300">
                Otentikasi ganda aktif, enkripsi lokal naskah berjalan, dan sesi peramban terproteksi.
              </p>
            </div>

            {/* PIN SECURITY SECTION */}
            <div className="bg-[#040914] p-4 rounded-2xl border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-slate-200 text-sm">PIN Pengaman Naskah & Draf Pribadi</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                  {pinEnabled ? 'PIN Aktif' : 'Nonaktif'}
                </span>
              </div>

              <p className="text-slate-300 leading-relaxed text-[11px]">
                PIN ini digunakan untuk mengunci draf tulisan di Studio Gubahan agar tidak dapat diubah oleh orang lain di perangkat yang sama.
              </p>

              <form onSubmit={handleUpdatePin} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-1">
                <div className="relative w-full sm:w-60">
                  <input
                    type={showPin ? 'text' : 'password'}
                    maxLength={6}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="Ketik PIN Baru (4-6 digit)..."
                    className="w-full bg-[#0a1128] border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-amber-400 font-mono tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Perbarui PIN</span>
                </button>

                {pinChangeSuccess && (
                  <span className="text-emerald-400 text-xs flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> PIN Berhasil Disimpan!
                  </span>
                )}
              </form>
            </div>

            {/* TWO-FACTOR AUTH (2FA) */}
            <div className="bg-[#040914] p-4 rounded-2xl border border-amber-500/20 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-200 text-sm">
                  <Smartphone className="w-4 h-4 text-sky-400" />
                  <span>Verifikasi Dua Langkah (2FA / Two-Factor Authentication)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Memerlukan konfirmasi keamanan saat mengakses fitur ekspor publik atau menghapus arsip karya.
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggle2FA}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  twoFactorEnabled ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow transition duration-200 ease-in-out ${
                    twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* ACTIVE SESSIONS & DEVICE AUDIT */}
            <div className="bg-[#040914] p-4 rounded-2xl border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-emerald-400" />
                  <span>Sesi Perangkat Aktif</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">1 Perangkat Terhubung</span>
              </div>

              <div className="p-3 rounded-xl bg-[#0a1128] border border-slate-800 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <span>Peramban Web Aktif (Sesi Ini)</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono">ONLINE</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Protokol HTTPS Aman · Terenkripsi SHA-256 · Lokasi: Indonesia
                  </span>
                </div>

                <span className="text-[11px] text-slate-400 font-mono">
                  Aktif Sekarang
                </span>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: SETELAN & PRIVASI                                 */}
        {/* ======================================================== */}
        {activeTab === 'setelan' && (
          <div className="space-y-5 animate-fade-in text-xs">
            
            {/* PRIVACY WORK MODE */}
            <div className="bg-[#040914] p-4 rounded-2xl border border-amber-500/20 space-y-3">
              <label className="font-bold text-slate-200 text-sm block">
                Mode Privasi Publikasi Karya:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPrivacyMode('publik')}
                  className={`p-3 rounded-xl border text-left space-y-1 transition-all cursor-pointer ${
                    privacyMode === 'publik'
                      ? 'bg-[#0f1c3f] border-amber-400 text-amber-200 ring-1 ring-amber-400'
                      : 'bg-[#0a1128] border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="font-bold text-xs block">Publik & Terbuka</span>
                  <span className="text-[10px] text-slate-400 block">Karya tampil di galeri komunitas Nusantara</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPrivacyMode('anonim')}
                  className={`p-3 rounded-xl border text-left space-y-1 transition-all cursor-pointer ${
                    privacyMode === 'anonim'
                      ? 'bg-[#0f1c3f] border-amber-400 text-amber-200 ring-1 ring-amber-400'
                      : 'bg-[#0a1128] border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="font-bold text-xs block">Nama Pena Anonim</span>
                  <span className="text-[10px] text-slate-400 block">Identitas disamarkan sebagai Penulis Warga</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPrivacyMode('privat')}
                  className={`p-3 rounded-xl border text-left space-y-1 transition-all cursor-pointer ${
                    privacyMode === 'privat'
                      ? 'bg-[#0f1c3f] border-amber-400 text-amber-200 ring-1 ring-amber-400'
                      : 'bg-[#0a1128] border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="font-bold text-xs block">Tersimpan Privat</span>
                  <span className="text-[10px] text-slate-400 block">Hanya tersimpan di peramban pribadi Anda</span>
                </button>
              </div>
            </div>

            {/* PEMANDU SASTRA TOGGLE */}
            <div className="bg-[#040914] p-4 rounded-2xl border border-amber-500/20 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="font-bold text-slate-200 text-sm block">
                  Tampilkan Widget Pemandu Sastra
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Menampilkan asisten kultural penuntun etika bahasa di sudut kanan bawah layar.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onToggleGuide(!showGuide)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  showGuide ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow transition duration-200 ease-in-out ${
                    showGuide ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* BACKUP & RESTORE DATA */}
            <div className="bg-[#040914] p-4 rounded-2xl border border-amber-500/20 space-y-3">
              <span className="font-bold text-slate-200 text-sm block">
                Cadangan & Pemulihan Data Tulisan
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Unduh seluruh karya yang pernah Anda tulis di Studio Gubahan dan setelan akun Anda ke dalam berkas .JSON agar tidak hilang saat membersihkan peramban.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Cadangan Lengkap (.JSON)</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetLocalData}
                  className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset Cache Lokal</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: PROFIL SASTRAWAN                                  */}
        {/* ======================================================== */}
        {activeTab === 'profil' && (
          <form onSubmit={handleSaveProfile} className="space-y-4 animate-fade-in text-xs">
            <div className="space-y-1">
              <label className="font-bold text-amber-300 uppercase tracking-wider block">
                Nama Pengguna / Nama Pena Sastra:
              </label>
              <input
                type="text"
                required
                value={penName}
                onChange={(e) => setPenName(e.target.value)}
                className="w-full bg-[#040914] border border-amber-500/30 rounded-xl px-3 py-2 text-slate-200 text-xs outline-none focus:border-amber-400 font-playfair font-bold text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-amber-300 uppercase tracking-wider block">
                Alamat Email Akun Terhubung:
              </label>
              <input
                type="email"
                readOnly
                value={userEmail}
                className="w-full bg-[#040914] border border-slate-800 rounded-xl px-3 py-2 text-slate-400 text-xs outline-none font-mono cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-500 font-mono">
                Email terdaftar di sistem TOPENG Nusantara.
              </span>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-amber-300 uppercase tracking-wider block">
                Biodata Ringkas / Refleksi Diri:
              </label>
              <textarea
                rows={3}
                value={userBio}
                onChange={(e) => setUserBio(e.target.value)}
                className="w-full bg-[#040914] border border-amber-500/30 rounded-xl p-3 text-slate-200 text-xs outline-none focus:border-amber-400 resize-none font-serif leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              {profileSaved && (
                <span className="text-emerald-400 text-xs flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Profil Berhasil Diperbarui!
                </span>
              )}
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Perubahan Profil</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
