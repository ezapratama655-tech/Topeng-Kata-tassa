import { DiscoursePreset, LexiconItem, RegionalStory, SavedKarya } from '../types';

export const DISCOURSE_PRESETS: DiscoursePreset[] = [
  {
    id: 'karhutla-kalteng-2026',
    title: 'Karhutla Kalteng 2026 (Klaim Kontrol)',
    category: 'Kebakaran Hutan & Iklim',
    source: 'Rilis Narasi Otoritas & Agregasi Media 2026',
    text: 'Semua kabar soal kebakaran hutan di Kalimantan Tengah itu pasti hoaks buatan pihak luar yang ingin menjatuhkan stabilitas! Situasi lapangan sepenuhnya terkendali tanpa ada anomali yang membahayakan.',
    detectedBias: {
      absoluteWords: ['Semua', 'pasti', 'sepenuhnya', 'tanpa ada'],
      polarizingLabels: ['hoaks', 'pihak luar', 'menjatuhkan stabilitas'],
      euphemisms: ['anomali'],
      passiveDeflection: ['dikendalikan', 'tidak membahayakan']
    },
    clarityScore: 32,
    debiasedText: {
      jernih: 'Laporan sebaran titik panas di Kalimantan Tengah sedang diverifikasi secara berkala dengan membandingkan data satelit dan pengecekan lapangan tim gabungan.',
      sastra: 'Ketika rimba Kalimantan memerah oleh bara, kata-kata yang menyangkal kepulan asap tak sanggup melapangkan dada anak-anak yang terbatuk di balik dinding kayu.',
      jurnalisme: 'Sebaran titik panas terdeteksi di sejumlah kabupaten Kalteng; tim darurat patroli Manggala Agni dan sukarelawan terus mengupayakan pemadaman di lahan gambut.'
    },
    empathyPerspectives: {
      warga: 'Bagi kami warga Palangka Raya dan pedalaman Sungai Kahayan, asap ini bukan istilah di podium atau perdebatan angka. Asap ini adalah sesak napas anak-anak balita kami setiap subuh.',
      ahli: 'Data sensor MODIS dan Sentinel mencatat titik pantau gambut dalam dengan indikasi api bawah tanah (smoldering fire) yang membutuhkan pasokan air bertekanan tinggi, bukan sekadar pemadaman vegetasi permukaan.',
      sastra: 'Bila bahasa kita hanya dipakai untuk menutup-nutupi bara, kepada siapa tanah gambut yang hangus akan mengadukan rasa perihnya?'
    }
  },
  {
    id: 'krisis-air-jabar',
    title: 'Krisis Air Baku Jawa Barat',
    category: 'Sumber Daya Air & Sanitasi',
    source: 'Wacana Birokrasi Perkotaan',
    text: 'Keluhan warga mengenai defisit air bersih adalah narasi provokatif yang dilebih-lebihkan. Perusahaan selalu menjamin pasokan stabil melalui normalisasi debit fluktuatif.',
    detectedBias: {
      absoluteWords: ['selalu', 'semua'],
      polarizingLabels: ['narasi provokatif', 'dilebih-lebihkan'],
      euphemisms: ['defisit air bersih', 'normalisasi debit fluktuatif'],
      passiveDeflection: ['dijamin pasokan']
    },
    clarityScore: 38,
    debiasedText: {
      jernih: 'Debit air baku di beberapa penampungan mengalami penurunan 40% akibat musim kemarau panjang, sehingga distribusi bergilir diterapkan selama perbaikan jaringan pipa.',
      sastra: 'Ember-ember kosong berderet di sepanjang lorong kampung sebelum fajar menyingsing, menanti setetes kejujuran dari keran yang lama membisu.',
      jurnalisme: 'Ribuan warga di pinggiran kota antre mendapatkan air tangki bantuan menyusul penurunan drastis volume waduk penyuplai utama.'
    },
    empathyPerspectives: {
      warga: 'Kami harus terjaga pukul 2 pagi demi satu ember air keruh. Mengatakan keluhan kami provokatif adalah melukai martabat orang kecil yang cuma ingin mandi dan beribadah dengan layak.',
      ahli: 'Penurunan infiltrasi air tanah akibat alih fungsi hulu Citarum mempercepat penurunan cadangan akuifer dangkal hingga 2,4 meter dalam lima tahun terakhir.',
      sastra: 'Sungai yang dahulu mengalirkan dongeng masa kecil kini tersendat oleh beton, dan kita menamai dahaga anak-anak dengan kata "efisiensi".'
    }
  },
  {
    id: 'alih-lahan-pangan',
    title: 'Food Estate & Lahan Gambut',
    category: 'Kedaulatan Pangan & Ekologi',
    source: 'Rapat Koordinasi & Debat Publik',
    text: 'Proyek lumbung pangan tidak mungkin gagal. Kritikus yang menuduh terjadi degradasi gambut hanyalah kelompok pesimis anti-kemajuan yang menolak kedaulatan bangsa.',
    detectedBias: {
      absoluteWords: ['tidak mungkin', 'seluruhnya'],
      polarizingLabels: ['anti-kemajuan', 'kelompok pesimis', 'menolak kedaulatan'],
      euphemisms: ['optimalisasi ruang non-produktif'],
      passiveDeflection: ['dicanangkan']
    },
    clarityScore: 35,
    debiasedText: {
      jernih: 'Program intensifikasi pertanian di lahan gambut menghadapi tantangan kesuburan tanah bersulfat masam, yang membutuhkan penyesuaian varietas padi dan kearifan bertani lokal.',
      sastra: 'Tanah gambut yang ribuan tahun menjaga kelembaban bumi dicangkul tergesa-gesa; padi yang dipaksakan tumbuh meranggas sebelum sempat menyapa panen.',
      jurnalisme: 'Evaluasi independen menunjukkan sebagian petak cetak sawah baru tergenang air masam, sementara petani adat Dayak meminta pelibatan pola tanam rotasi tradisional.'
    },
    empathyPerspectives: {
      warga: 'Hutan tempat kami mencari madu sialang dan rotan kini dibuldoser. Kami tak menolak makan, tapi kami tahu tanah ini marah bila dipaksa menumbuhkan apa yang bukan kodratnya.',
      ahli: 'Lapisan pirit (FeS2) pada kedalaman 60 cm di bawah gambut akan teroksidasi saat kanalisasi dibuka liar, menghasilkan asam sulfat yang meracuni akar tanaman pangan.',
      sastra: 'Apakah kedaulatan harus ditebus dengan membungkam lumbung-lumbung kenangan leluhur yang telah menghidupi generasi demi generasi?'
    }
  }
];

export const DATA_KARHUTLA_2026 = {
  title: 'Audit Komparatif Karhutla Kalimantan Tengah 2026',
  dateVerified: '26 Oktober 2026',
  summary: 'Perbandingan metodologis antara data resmi kementerian dan observasi satelit independen menunjukkan disparitas hingga +850% selisih cakupan area terbakar.',
  sources: [
    {
      name: 'SiPongi (Kementerian Lingkungan Hidup & Kehutanan)',
      coverageHectares: 202000,
      period: 'Januari – Agustus 2026',
      methodology: 'Ground-truthing patroli Manggala Agni, hotspot sensor SNPP/VIIRS confidence level tinggi (>80%), dan validasi batas konsesi kehutanan resmi.',
      color: '#38bdf8',
      framingText: 'Area terbakar terkonsentrasi pada semak belukar non-kawasan konservasi inti; kebakaran pada lahan gambut teratasi berkat water bombing berkala.'
    },
    {
      name: 'Nusantara Atlas / Citra Radar Satelit Radar Sentinel-2 & Planet Labs',
      coverageHectares: 1920000,
      period: 'Akumulasi hingga akhir September 2026',
      methodology: 'Normalized Burn Ratio (NBR) berbasis radar tembus awan/asap (SAR Sentinel-1 & Sentinel-2 optical), mencakup kebakaran bawah tanah (smoldering peatland) dan area gambut pedalaman tanpa patroli jalan darat.',
      color: '#ef4444',
      framingText: 'Kerusakan ekologis gambut dalam di eks-PLG dan koridor habitat orangutan telah mencapai skala keparahan darurat trans-wilayah dengan emisi karbon masif.'
    }
  ],
  deltaPercent: 850,
  philosophicalNote: 'Disparitas angka ini bukan sekadar perdebatan teknis satelit vs patroli jalan setapak. Setiap 100.000 hektare yang luput dari rekaman statistik adalah puluhan ribu keluarga yang tidak menerima masker respiratorik, ratusan sekolah dasar yang tetap dipaksa buka di bawah kabut berbahaya, dan jutaan satwa rimba yang punah dalam senyap.'
};

export const NUSANTARA_LEXICON: LexiconItem[] = [
  {
    id: 'lex-1',
    bureaucraticTerm: 'Deforestasi',
    poeticEquivalents: ['Luka Belantara', 'Penebasan Rimba', 'Robeknya Kanopi Hijau'],
    category: 'Lingkungan',
    exampleSentence: 'Bukan sekadar angka deforestasi di tabel kalkulator, tetapi luka belantara yang memutus kidung satwa rimba.',
    etymologyNote: 'Menghidupkan kembali pemaknaan bahwa hutan adalah makhluk hidup bernyawa dalam kosmologi Nusantara.'
  },
  {
    id: 'lex-2',
    bureaucraticTerm: 'Anomali Cuaca',
    poeticEquivalents: ['Amuk Musim', 'Cuaca Merajang', 'Langit yang Meradang'],
    category: 'Iklim',
    exampleSentence: 'Amuk musim membuat langit enggan menurunkan butir hujan di tanah yang kian meranggas.',
    etymologyNote: 'Mengubah kesan "kesalahan teknis" menjadi kesadaran akan ketidakseimbangan ekologis yang dirasakan tubuh.'
  },
  {
    id: 'lex-3',
    bureaucraticTerm: 'Fluktuasi Hotspot',
    poeticEquivalents: ['Pasang Surut Bara', 'Kobar Nyala', 'Jejak Titik Api'],
    category: 'Bencana',
    exampleSentence: 'Pasang surut bara di dada gambut tak pernah padam hanya oleh pidato di ruang berhawa dingin.',
    etymologyNote: 'Menggantikan kata pinjaman teknis asing (hotspot) dengan kosakata rasa Nusantara (bara, abu, pijar).'
  },
  {
    id: 'lex-4',
    bureaucraticTerm: 'Relokasi Warga',
    poeticEquivalents: ['Tercabut dari Tanah Leluhur', 'Pengasingan Sukma', 'Perpindahan Air Mata'],
    category: 'Sosial',
    exampleSentence: 'Bagi masyarakat adat, relokasi bukan sekadar pindah alamat, melainkan tercabut dari pusara tanah leluhur.',
    etymologyNote: 'Menyoroti ikatan spiritual masyarakat adat terhadap tanah ulayat yang kerap diabaikan kalkulasi ganti rugi meter persegi.'
  },
  {
    id: 'lex-5',
    bureaucraticTerm: 'Mitigasi Bencana',
    poeticEquivalents: ['Pagar Perlindungan', 'Tenggang Rasa Terhadap Alam', 'Ikhtiar Penjagaan Diri'],
    category: 'Bencana',
    exampleSentence: 'Mitigasi sejati bermula dari tenggang rasa kita terhadap alam sebelum bencana datang mengetuk pintu.',
    etymologyNote: 'Menghubungkan sains kebencanaan modern dengan kearifan lokal seperti pranata mangsa dan nyabuk gunung.'
  },
  {
    id: 'lex-6',
    bureaucraticTerm: 'Penyesuaian Tarif',
    poeticEquivalents: ['Penyempitan Ruang Nafkah', 'Pemberatan Pikulan Dapur', 'Mengetatkan Sabuk Pinggang'],
    category: 'Kebijakan',
    exampleSentence: 'Eufemisme penyesuaian tarif selalu berujung pada makin beratnya pikulan dapur para buruh harian.',
    etymologyNote: 'Membongkar topeng retorika fiskal yang menyamarkan kenaikan beban ekonomi rakyat miskin.'
  },
  {
    id: 'lex-7',
    bureaucraticTerm: 'Degradasi Lahan',
    poeticEquivalents: ['Tanah yang Menua dan Kurus', 'Kematian Rahim Bumi', 'Tanah Mengering'],
    category: 'Lingkungan',
    exampleSentence: 'Degradasi lahan adalah kematian perlahan bagi rahim bumi yang selama ini menyusui tanaman.',
    etymologyNote: 'Mengembalikan metafora Ibu Bumi (Pertiwi) yang menyuburkan dan memberi kehidupan.'
  },
  {
    id: 'lex-8',
    bureaucraticTerm: 'Toleransi Risiko',
    poeticEquivalents: ['Batas Kepasrahan Manusia', 'Menakar Kesabaran Nyawa', 'Pertaruhan Nasib'],
    category: 'Kebijakan',
    exampleSentence: 'Jangan menakar toleransi risiko dengan membiarkan anak-anak sekolah menghirup racun polutan.',
    etymologyNote: 'Mengingatkan bahwa angka probabilitas statistik melibatkan nyawa manusia nyata.'
  }
];

export const REGIONAL_STORIES: RegionalStory[] = [
  {
    id: 'kalteng',
    region: 'Kalimantan Tengah',
    province: 'Palangka Raya & Kapuas',
    coordinates: { x: 44, y: 52 },
    title: 'Monolog di Bawah Payung Kuning Pekat',
    author: 'Sapto Hardianto (Relawan Damkar Mandiri)',
    year: '2026',
    category: 'Gambut & Rimba',
    story: 'Di koran nasional, mereka asyik bertengkar tentang apakah luas kebakaran 200 ribu atau hampir dua juta hektare. Tapi di dalam kamar tidur anakku yang baru berusia empat tahun, angka-angka itu tidak berguna. Yang ada cuma desis tabung oksigen sewaan dan dadanya yang naik-turun menahan perih. Asap gambut tidak pernah membawa paspor atau membaca rilis resmi pemerintah; ia merembes lewat ventilasi kamar, menyusup ke selimut, dan menagih napas kami.',
    soundNote: 'Gong Rendah & Tiupan Suling Sunyi (Pelog)',
    dataFact: '202.000 ha (KLHK) vs 1.920.000 ha (Nusantara Atlas). ISPU Palangka Raya melampaui 450 ppm pada puncak krisis.'
  },
  {
    id: 'riau',
    region: 'Riau & Semenanjung Kampar',
    province: 'Riau',
    coordinates: { x: 22, y: 38 },
    title: 'Gambut yang Menyimpan Api di Dadanya',
    author: 'Nurhafizah (Penyair Pesisir Indragiri)',
    year: '2025',
    category: 'Kanalisasi & Kebun',
    story: 'Kanal-kanal dalam itu dikeruk untuk membuang air, agar sawit bisa tegak berdiri. Tapi ketika kemarau tiba, tanah ini seperti spons yang diperas sampai kering kerontang. Sekali ada puntung rokok jatuh, api menjalar sepuluh meter di bawah tanah selama berbulan-bulan. Kita berjalan di atas tanah yang dingin di luar, tapi mendidih di dalamnya.',
    soundNote: 'Gamelan Slendro Berdentang Cepat',
    dataFact: 'Lebih dari 40% kubah gambut Kampar terkanalisasi, menurunkan kelembaban alami tanah hingga batas rawan kobaran api.'
  },
  {
    id: 'jabar',
    region: 'Jawa Barat & Hulu Citarum',
    province: 'Bandung & Majalengka',
    coordinates: { x: 35, y: 72 },
    title: 'Jeritan Keran yang Menghembuskan Angin',
    author: 'Cecep Mulyana (Warga Pinggiran Cekungan Bandung)',
    year: '2026',
    category: 'Air Bersih & Agraria',
    story: 'Dahulu mata air di lereng bukit mengalir jernih sampai ke empang warga. Sekarang bukit-bukit itu dicukur jadi deretan vila dan lapangan golf berpagar kawat duri. Keran pipa kami lebih sering berbunyi mendesis seperti ular daripada mengucurkan air. Kata orang pintar di dinas, ini namanya "efisiensi pasokan". Tapi mengapa rumput di lapangan golf sana selalu hijau royo-royo sementara sawah kami retak seperti telapak kaki pemulung?',
    soundNote: 'Alunan Saron & Degung Sunda Bernada Melankolis',
    dataFact: 'Penurunan akuifer air tanah Bandung mencapai 4,2 meter per dekade; 68% industri mengambil air tanah dalam tanpa izin meteran.'
  },
  {
    id: 'papua',
    region: 'Papua Selatan & Boven Digoel',
    province: 'Papua Selatan',
    coordinates: { x: 88, y: 65 },
    title: 'Ketika Pohon Sagu Kami Dinamai Komoditas',
    author: 'Yulianus Kaize (Tokoh Adat Mandobo)',
    year: '2025',
    category: 'Hutan Adat & Pangan',
    story: 'Bagi kami suku Mandobo dan Marind, dusun sagu adalah ibu kandung. Di sanalah anak-anak kami diberi nama, di sanalah ulat sagu dan ikan gabus hidup berdampingan. Lalu datang orang berpakaian rapi membawa peta besar penuh garis buatan tangan mereka di Jakarta. Pohon-pohon sagu kami digusur traktor dalam satu malam untuk proyek tebu raksasa. Mereka bilang demi pangan nusantara, padahal kami sendiri sekarang harus membeli beras raskin impor berbau apek.',
    soundNote: 'Tabuhan Tifa & Desau Angin Hutan Hujan',
    dataFact: 'Rencana konversi lebih dari 1 juta hektare bentang alam Merauke & Boven Digoel untuk cetak sawah dan perkebunan tebu skala nasional.'
  },
  {
    id: 'ntt',
    region: 'Nusa Tenggara Timur (Sumba & Timor)',
    province: 'NTT',
    coordinates: { x: 62, y: 84 },
    title: 'Gemerincing Kaleng Bekas di Padang Savana',
    author: 'Maria Barek (Penenun Ikat Sumba Timur)',
    year: '2026',
    category: 'Kekeringan Ekstrem',
    story: 'Anak-anak perempuan kami memikul jeriken lima belas liter menaiki bukit kapur yang memantulkan terik matahari. Kami menenun motif buaya dan kuda nil bukan sekadar hiasan turis, tapi doa memohon air. Setiap kali janji pipanisasi diumumkan di baliho pemilu, kami hanya tersenyum getir. Kaleng bekas di gerobak kami berbunyi nyaring di jalan berbatu, mengiringi dahaga yang tak kunjung padam.',
    soundNote: 'Petikan Sasando & Chime Gamelan Halus',
    dataFact: 'Periode hari tanpa hujan (HTH) di Sumba Timur mencapai lebih dari 145 hari berturut-turut pada musim kemarau 2026.'
  }
];

export const INITIAL_COMMUNITY_KARYA: SavedKarya[] = [
  {
    id: 'karya-init-1',
    title: 'Surat Kepada Pengukur Angka',
    type: 'Puisi',
    author: 'Sekar Langit, Penulis Palangka Raya',
    timestamp: '25 Oktober 2026',
    likes: 42,
    body: `Tuan pengukur angka di ruang pendingin udara,
Kertasmu mencatat dua ratus ribu hektare dengan rapi,
Sementara burung tingang menjatuhkan bulu terbakar di sungai kami.

Bila matamu hanya memandang grafik dan persentase,
Kemarilah ke serambi rumahku sejenak saja:
Hirup abu ini ke dalam paru-parumu yang wangi,
Dan hitung kembali berapa harga napas seorang anak tani.`
  },
  {
    id: 'karya-init-2',
    title: 'Topeng Birokrasi di Hulu Kali',
    type: 'Monolog',
    author: 'Bagas Wicaksana, Yogyakarta',
    timestamp: '24 Oktober 2026',
    likes: 29,
    body: `Kalian menyebutnya 'penataan bantaran'. Sungguh kata yang anggun, bukan? 'Penataan'. Seolah-olah rumah-rumah bambu kami ini hanya taplak meja yang miring dan perlu dirapikan dengan setrikaan besi. Padahal yang kalian geser dengan ekskavator itu bukan sekadar dinding tripleks, tapi urat nadi tempat tiga generasi kami belajar mencintai tanah air ini.`
  },
  {
    id: 'karya-init-3',
    title: 'Surat Terbuka untuk Redaktur Bahasa',
    type: 'Surat Warga',
    author: 'Dewi Sartika Putri, Riau',
    timestamp: '22 Oktober 2026',
    likes: 37,
    body: `Kepada Yang Terhormat Pengelola Berita,
Tolong jangan gunakan kata "anomali" lagi bila Anda hendak memberitakan desa kami yang terkepung asap. Gunakanlah kata "kelalaian", gunakanlah kata "keserakahan", atau tuliskan saja bahwa langit kami sudah mati. Sebab bahasa yang terlalu sopan kepada kejahatan ekologis adalah pembunuhan perlahan terhadap kesadaran kemanusiaan kita.`
  }
];
