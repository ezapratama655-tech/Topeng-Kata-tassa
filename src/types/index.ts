export interface DiscoursePreset {
  id: string;
  title: string;
  category: string;
  text: string;
  source: string;
  detectedBias: {
    absoluteWords: string[];
    polarizingLabels: string[];
    euphemisms: string[];
    passiveDeflection: string[];
  };
  clarityScore: number;
  debiasedText: {
    jernih: string;
    sastra: string;
    jurnalisme: string;
  };
  empathyPerspectives: {
    warga: string;
    ahli: string;
    sastra: string;
  };
}

export interface LexiconItem {
  id: string;
  bureaucraticTerm: string;
  poeticEquivalents: string[];
  category: 'Lingkungan' | 'Kebijakan' | 'Sosial' | 'Iklim' | 'Bencana';
  exampleSentence: string;
  etymologyNote?: string;
}

export interface RegionalStory {
  id: string;
  region: string;
  province: string;
  coordinates: { x: number; y: number }; // percentage for map pin
  title: string;
  author: string;
  year: string;
  category: string;
  story: string;
  soundNote: string;
  dataFact: string;
}

export interface SavedKarya {
  id: string;
  title: string;
  type: 'Puisi' | 'Cerpen Mini' | 'Monolog' | 'Surat Warga';
  body: string;
  author: string;
  timestamp: string;
  likes: number;
}
