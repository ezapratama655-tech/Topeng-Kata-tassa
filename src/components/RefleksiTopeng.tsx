import React, { useState } from 'react';
import { Layers, CheckCircle2, Radar, Flame, Gamepad2, ArrowRight, ShieldCheck, AlertCircle, BarChart3, HelpCircle } from 'lucide-react';
import { DATA_KARHUTLA_2026 } from '../data/discourseData';
import { gamelan } from '../utils/audio';

interface RefleksiTopengProps {
  onSwitchToMuseum: () => void;
}

export const RefleksiTopeng: React.FC<RefleksiTopengProps> = ({ onSwitchToMuseum }) => {
  const [activeLayer, setActiveLayer] = useState<1 | 2 | 3>(1);
  const [simulationChoice, setSimulationChoice] = useState<'eufemisme' | 'sensasi' | 'transparan' | 'sastra' | null>(null);

  const handleLayerSelect = (layer: 1 | 2 | 3) => {
    gamelan.playBonang(layer === 1 ? 392 : layer === 2 ? 440 : 523.25);
    setActiveLayer(layer);
  };

  const handleSimulation = (type: 'eufemisme' | 'sensasi' | 'transparan' | 'sastra') => {
    gamelan.playBonang(587.33);
    setSimulationChoice(type);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* HEADER BANNER */}
      <div className="glass-panel-gold rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="max-w-4xl space-y-3 relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-rose-400">
            <span className="font-bold uppercase tracking-wider">Pilar II</span>
            <span aria-hidden="true">·</span>
            <span>Verifikasi Data Empiris & Simulasi Narasi Publik</span>
          </div>
          <h2 className="font-playfair text-2xl md:text-4xl font-bold text-gold-gradient">
            Refleksi Topeng: Karhutla Kalteng 2026 & Simulasi Narasi
          </h2>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Menyingkap jurang (*gap*) antara kata-kata retorika, angka empiris ilmiah, dan kenyataan hidup warga melalui studi kasus Karhutla Kalimantan Tengah 2026. Uji pula keputusan berbahasa Anda dalam Simulasi Narasi Publik interaktif.
          </p>
        </div>
      </div>

      {/* 3D DEPTH LAYER MECHANISM */}
      <div className="glass-panel rounded-3xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-amber-500/25 pb-4">
          <div>
            <h3 className="font-playfair font-bold text-xl text-gold-gradient flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>Mekanisme Geser Lapisan Persepsi (3D Depth)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Pilih lapisan untuk mengamati pergeseran dari retorika resmi ke data empiris dan realitas sastrawi
            </p>
          </div>
          
          {/* LAYER SELECTOR TABS */}
          <div className="flex bg-[#040914] rounded-2xl p-1.5 border border-amber-500/30 text-xs">
            <button
              onClick={() => handleLayerSelect(1)}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                activeLayer === 1
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-amber-300'
              }`}
            >
              1. Kataku (Narasi)
            </button>
            <button
              onClick={() => handleLayerSelect(2)}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                activeLayer === 2
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-amber-300'
              }`}
            >
              2. Angkaku (Data +850%)
            </button>
            <button
              onClick={() => handleLayerSelect(3)}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                activeLayer === 3
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-amber-300'
              }`}
            >
              3. Cerminku (Sastra)
            </button>
          </div>
        </div>

        {/* LAYER CONTENT PANELS */}
        <div className="min-h-[280px]">
          
          {/* LAYER 1: KATAKU */}
          {activeLayer === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-[#0f1c3f]/80 border border-amber-500/30 rounded-2xl p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Framing Narasi Resmi / Rilis Media 2026
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Sumber: Pernyataan Otoritas & Agregasi Media
                  </span>
                </div>

                <h4 className="font-playfair text-xl md:text-2xl font-bold text-slate-100 leading-snug">
                  "Penanganan Karhutla Kalteng Berjalan Optimal dan Terkendali; Sebaran Titik Panas Merupakan Siklus Cuaca Fluktuatif"
                </h4>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Pihak otoritas menyatakan bahwa patroli udara dan darat telah menjinakkan sebagian besar titik api. Narasi mengenai kerusakan jutaan hektare di media sosial dikategorikan sebagai klaim non-resmi yang dapat menimbulkan kecemasan yang tidak berdasar di tengah stabilitas investasi wilayah.
                </p>

                <div className="p-4 bg-[#040914] rounded-xl border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed italic space-y-1">
                  <div className="font-bold text-amber-400 not-italic flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>Ciri Topeng Diksi Lapisan Ini:</span>
                  </div>
                  <p>
                    Istilah teknis seperti <em>"fluktuasi siklus"</em> dan <em>"terkendali"</em> berfungsi sebagai tabir eufemistis yang menenangkan persepsi publik, namun mengabaikan kepulan asap beracun yang menyiksa warga di daerah pinggiran sungai.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* LAYER 2: ANGKAKU (DATA EMPIRIS KOMPARATIF 2026) */}
          {activeLayer === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-[#040914]/90 border border-amber-500/40 rounded-2xl p-6 space-y-5">
                
                {/* MATRIX HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-amber-500/20 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                        Matriks Audit Data Empiris Karhutla Kalteng
                      </span>
                      <span className="text-xs text-slate-400">
                        Akses Verifikasi: <strong className="text-amber-400">{DATA_KARHUTLA_2026.dateVerified}</strong>
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Perbandingan metodologi penghitungan luas lahan terbakar antara instrumen kementerian dan satelit radar internasional.
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/60 border border-rose-500/40 px-3 py-1 rounded-lg inline-block">
                      Disparitas Metodologi: +{DATA_KARHUTLA_2026.deltaPercent}% Delta
                    </span>
                  </div>
                </div>

                {/* SIDE BY SIDE METRICS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* SIPONGI KLHK */}
                  <div className="bg-[#0f1c3f] p-5 rounded-2xl border border-sky-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                        Data SiPongi (KLHK)
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-sky-400" />
                    </div>
                    <div>
                      <div className="text-3xl font-black font-cinzel text-slate-100">
                        ~202.000 <span className="text-sm font-sans font-normal text-slate-300">Hektare</span>
                      </div>
                      <span className="text-[11px] text-sky-300/80 font-mono">
                        Periode: Januari – Agustus 2026
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {DATA_KARHUTLA_2026.sources[0].methodology}
                    </p>
                    <div className="text-[11px] bg-[#040914] p-2.5 rounded-xl border border-sky-500/20 text-slate-300 italic">
                      "{DATA_KARHUTLA_2026.sources[0].framingText}"
                    </div>
                  </div>

                  {/* NUSANTARA ATLAS */}
                  <div className="bg-[#0f1c3f] p-5 rounded-2xl border border-rose-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                        Satelit Nusantara Atlas
                      </span>
                      <Radar className="w-4 h-4 text-rose-400 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-3xl font-black font-cinzel text-rose-400">
                        ~1.920.000 <span className="text-sm font-sans font-normal text-slate-300">Hektare</span>
                      </div>
                      <span className="text-[11px] text-rose-300/80 font-mono">
                        Akumulasi s.d. Akhir September 2026
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {DATA_KARHUTLA_2026.sources[1].methodology}
                    </p>
                    <div className="text-[11px] bg-[#040914] p-2.5 rounded-xl border border-rose-500/20 text-slate-300 italic">
                      "{DATA_KARHUTLA_2026.sources[1].framingText}"
                    </div>
                  </div>

                </div>

                {/* GRAPHICAL COMPARISON BAR */}
                <div className="bg-[#040914] p-4 rounded-xl border border-amber-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                    <span>Visualisasi Rasio Luas:</span>
                    <span>1 : 9.5 (Rasio Selisih)</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-24 text-[11px] text-sky-400 font-medium">SiPongi:</span>
                      <div className="flex-1 bg-slate-900 h-3 rounded-full overflow-hidden">
                        <div className="bg-sky-400 h-full rounded-full" style={{ width: '10.5%' }} />
                      </div>
                      <span className="w-16 text-right font-mono text-[11px]">202k ha</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-24 text-[11px] text-rose-400 font-medium">N. Atlas:</span>
                      <div className="flex-1 bg-slate-900 h-3 rounded-full overflow-hidden">
                        <div className="bg-rose-500 h-full rounded-full" style={{ width: '100%' }} />
                      </div>
                      <span className="w-16 text-right font-mono text-[11px]">1.920k ha</span>
                    </div>
                  </div>
                </div>

                {/* PHILOSOPHICAL NOTE */}
                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 leading-relaxed space-y-1">
                  <strong className="text-amber-400 flex items-center gap-1.5 font-bold">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <span>Catatan Metodologis & Pesan Moral:</span>
                  </strong>
                  <p>{DATA_KARHUTLA_2026.philosophicalNote}</p>
                </div>
              </div>
            </div>
          )}

          {/* LAYER 3: CERMINKU */}
          {activeLayer === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="lontar-parchment rounded-2xl p-6 md:p-8 space-y-4 border border-amber-500/40">
                <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Cermin Warga · Monolog Kabut Palangka Raya
                  </span>
                  <span className="text-xs font-serif italic text-white/90">
                    Karya: Sapto, Relawan & Warga Bantaran Kahayan
                  </span>
                </div>

                <blockquote className="font-serif italic text-sm md:text-base text-white leading-relaxed">
                  "Di koran ibu kota mereka asyik bertengkar tentang angka hektare. Ada pejabat yang bilang puluhan ribu, ada peneliti yang bersikeras jutaan. Tapi di dalam kamar tidur anakku yang berusia empat tahun, angka-angka itu tidak ada artinya. Yang ada hanya tabung oksigen sewaan yang mendesis lemah dan dadanya yang naik-turun menahan perih. Asap gambut tidak pernah membawa kartu pers atau membaca metodologi satelit; ia masuk lewat sela dinding kayu kami dan merampas senyum anak-anak kami."
                </blockquote>

                <div className="flex items-center justify-between pt-3 border-t border-amber-500/30 text-xs">
                  <span className="text-white/80 font-serif">
                    Arsip Suara Warga Kalimantan Tengah 2026
                  </span>
                  <button
                    onClick={onSwitchToMuseum}
                    className="font-bold text-amber-300 hover:text-amber-200 underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Jelajahi Museum Sastra Lengkap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* INTERACTIVE NARRATIVE ROLEPLAY SIMULATION */}
      <div className="glass-panel-gold rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-amber-500/25 pb-4">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-playfair font-bold text-xl text-gold-gradient">
              Simulasi Narasi Publik (Roleplay Keputusan Berbahasa)
            </h3>
            <p className="text-xs text-amber-200/70">
              Peran Anda: Juru Bicara Komunikasi Publik / Redaktur Utama Berita Nasional
            </p>
          </div>
        </div>

        <div className="space-y-2 text-xs md:text-sm text-slate-300">
          <p className="leading-relaxed">
            <strong className="text-amber-300">Skenario Lapangan:</strong> Citra satelit mendeteksi lonjakan tajam titik api di gambut Kalimantan Tengah. Udara mulai menguning dan rumah sakit daerah melaporkan antrean balita dengan infeksi saluran pernapasan. Bagaimanakah Anda merumuskan tajuk berita atau rilis resmi ke ruang publik?
          </p>
        </div>

        {/* 4 CHOICES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* CHOICE 1: EUFEMISME */}
          <button
            onClick={() => handleSimulation('eufemisme')}
            className={`p-4 rounded-2xl text-left space-y-2.5 transition-all border cursor-pointer ${
              simulationChoice === 'eufemisme'
                ? 'bg-[#0f1c3f] border-amber-400 ring-2 ring-amber-400/30'
                : 'bg-[#040914] border-amber-500/20 hover:border-amber-400/60'
            }`}
          >
            <span className="text-xs font-bold text-amber-400 block uppercase tracking-wider">
              Pilihan A: Eufemisme Kaku
            </span>
            <p className="text-xs text-slate-200 font-serif italic">
              "Kondisi Cuaca Kalteng Memasuki Penyesuaian Siklus Musiman; Situasi Tetap Terkendali dan Terkoordinasi"
            </p>
            <span className="text-[11px] text-slate-400 block">
              Gaya birokrasi konvensional, meredam kekhawatiran.
            </span>
          </button>

          {/* CHOICE 2: SENSASIONAL */}
          <button
            onClick={() => handleSimulation('sensasi')}
            className={`p-4 rounded-2xl text-left space-y-2.5 transition-all border cursor-pointer ${
              simulationChoice === 'sensasi'
                ? 'bg-[#0f1c3f] border-rose-400 ring-2 ring-rose-400/30'
                : 'bg-[#040914] border-rose-500/20 hover:border-rose-400/60'
            }`}
          >
            <span className="text-xs font-bold text-rose-400 block uppercase tracking-wider">
              Pilihan B: Sensasional Bombastis
            </span>
            <p className="text-xs text-slate-200 font-serif italic">
              "Kalteng Membara Hebat! Jutaan Hektare Hancur Lebur, Pemerintah Dituduh Lumpuh Total!"
            </p>
            <span className="text-[11px] text-slate-400 block">
              Clickbait ekstrem, memantik amarah dan histeria massa.
            </span>
          </button>

          {/* CHOICE 3: TRANSPARAN & EMPATIS */}
          <button
            onClick={() => handleSimulation('transparan')}
            className={`p-4 rounded-2xl text-left space-y-2.5 transition-all border cursor-pointer ${
              simulationChoice === 'transparan'
                ? 'bg-[#0f1c3f] border-emerald-400 ring-2 ring-emerald-400/30'
                : 'bg-[#040914] border-emerald-500/20 hover:border-emerald-400/60'
            }`}
          >
            <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wider">
              Pilihan C: Transparan & Empatis
            </span>
            <p className="text-xs text-slate-200 font-serif italic">
              "Lonjakan Titik Api Kalteng Capai Luas Kritis; Posko Kesehatan & Evakuasi Mandiri Diaktifkan"
            </p>
            <span className="text-[11px] text-slate-400 block">
              Faktual, berbasis data ganda, memprioritaskan keselamatan jiwa.
            </span>
          </button>

          {/* CHOICE 4: SASTRA EMPATI */}
          <button
            onClick={() => handleSimulation('sastra')}
            className={`p-4 rounded-2xl text-left space-y-2.5 transition-all border cursor-pointer ${
              simulationChoice === 'sastra'
                ? 'bg-[#0f1c3f] border-sky-400 ring-2 ring-sky-400/30'
                : 'bg-[#040914] border-sky-500/20 hover:border-sky-400/60'
            }`}
          >
            <span className="text-xs font-bold text-sky-400 block uppercase tracking-wider">
              Pilihan D: Sastra Reflektif
            </span>
            <p className="text-xs text-slate-200 font-serif italic">
              "Langit Gambut Menyerukan Kejujuran: Saatnya Menghentikan Retorika dan Melindungi Napas Rakyat"
            </p>
            <span className="text-[11px] text-slate-400 block">
              Menggugah nurani publik dan pengambil keputusan.
            </span>
          </button>

        </div>

        {/* SIMULATION FEEDBACK DISPLAY */}
        {simulationChoice && (
          <div className="p-5 rounded-2xl bg-[#0a1128] border border-amber-500/30 space-y-4 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>Indikator Dampak Sosial Pilihan Anda:</span>
              </span>
              <span className="text-xs font-mono text-slate-400">
                Respon Simulasi Wacana Publik
              </span>
            </div>

            {/* METRICS METERS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-[#040914] p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block">Indeks Kepercayaan:</span>
                <span className={`text-base font-bold font-mono ${
                  simulationChoice === 'transparan' ? 'text-emerald-400' :
                  simulationChoice === 'sastra' ? 'text-sky-400' :
                  simulationChoice === 'eufemisme' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {simulationChoice === 'transparan' ? '92%' :
                   simulationChoice === 'sastra' ? '86%' :
                   simulationChoice === 'eufemisme' ? '38%' : '25%'}
                </span>
              </div>

              <div className="bg-[#040914] p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block">Tingkat Kepanikan Warga:</span>
                <span className={`text-base font-bold font-mono ${
                  simulationChoice === 'sensasi' ? 'text-rose-400' :
                  simulationChoice === 'eufemisme' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {simulationChoice === 'sensasi' ? 'Sangat Tinggi (Chaos)' :
                   simulationChoice === 'eufemisme' ? 'Rendah (Palsu/Bumerang)' : 'Terkontrol & Siaga'}
                </span>
              </div>

              <div className="bg-[#040914] p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block">Integritas Informasi:</span>
                <span className={`text-base font-bold font-mono ${
                  simulationChoice === 'transparan' ? 'text-emerald-400' :
                  simulationChoice === 'sastra' ? 'text-sky-400' :
                  simulationChoice === 'eufemisme' ? 'text-rose-400' : 'text-amber-400'
                }`}>
                  {simulationChoice === 'transparan' ? '96%' :
                   simulationChoice === 'sastra' ? '90%' :
                   simulationChoice === 'eufemisme' ? '30%' : '35%'}
                </span>
              </div>
            </div>

            {/* LONG TERM SUMMARY */}
            <div className="text-xs md:text-sm text-slate-200 leading-relaxed font-sans bg-[#040914]/80 p-4 rounded-xl border border-amber-500/20">
              {simulationChoice === 'eufemisme' && (
                <p>
                  <strong>Konsekuensi:</strong> Awalnya publik tampak tenang, tetapi ketika asap pekat sampai ke ruang kelas dan bandara ditutup, masyarakat merasa dibohongi. Kepercayaan terhadap rilis resmi runtuh dan memicu krisis legitimasi yang berkepanjangan.
                </p>
              )}
              {simulationChoice === 'sensasi' && (
                <p>
                  <strong>Konsekuensi:</strong> Terjadi kepanikan pembelian masker N95 secara liar, hoaks penjarahan menyebar tanpa kontrol, dan perdebatan politik saling menyalahkan mendominasi linimasa alih-alih tindakan gotong royong pemadaman api.
                </p>
              )}
              {simulationChoice === 'transparan' && (
                <p>
                  <strong>Konsekuensi:</strong> Masyarakat menerima informasi secara dewasa. Transparansi gap data antara kementerian dan satelit mendorong sinergi sukarelawan, bantuan masker respiratorik terkirim tepat sasaran, dan mitigasi berjalan tanpa prasangka.
                </p>
              )}
              {simulationChoice === 'sastra' && (
                <p>
                  <strong>Konsekuensi:</strong> Narasi sastrawi berhasil memecah kebuntuan polarisasi. Para pejabat dan jurnalis tersentuh secara moral, mengalihkan fokus dari adu gengsi data menuju empati nyata bagi pemulihan kesehatan warga dan keselamatan rimba.
                </p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  gamelan.playWoodClack();
                  setSimulationChoice(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-amber-500 text-slate-300 hover:text-slate-950 font-bold text-xs border border-amber-500/30 transition-all cursor-pointer"
              >
                Reset & Coba Pilihan Lainnya
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
