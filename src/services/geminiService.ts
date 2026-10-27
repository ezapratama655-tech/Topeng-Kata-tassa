/**
 * Gemini Service for TOPENG
 * Client calls server-side proxy endpoints (/api/*)
 * No API keys are ever stored or used on the client.
 */

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  time?: string;
  hasAudio?: boolean;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface GroundingSearchResult {
  text: string;
  sources: GroundingSource[];
  searchQueries?: string[];
}

/**
 * Send chat message to Gemini 3.8 Flash multi-turn chatbot
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  systemInstruction?: string
): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      systemInstruction,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Gagal menghubungi server (${res.status})`);
  }

  const data = await res.json();
  return data.reply;
}

/**
 * Verify claims with Google Search Grounding (gemini-3.8-flash)
 */
export async function verifyWithGoogleSearch(query: string): Promise<GroundingSearchResult> {
  const res = await fetch('/api/grounding-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Gagal memverifikasi via Google Search (${res.status})`);
  }

  const data = await res.json();
  return {
    text: data.text,
    sources: data.sources || [],
    searchQueries: data.searchQueries || [],
  };
}

/**
 * Fast Debias using gemini-3.1-flash-lite
 */
export async function requestFastDebias(text: string): Promise<string> {
  const res = await fetch('/api/fast-debias', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Gagal melakukan telaah cepat (${res.status})`);
  }

  const data = await res.json();
  return data.result;
}

/**
 * Synthesize speech audio using gemini-3.8-flash-lite-tts
 */
let currentAudioElement: HTMLAudioElement | null = null;

export async function speakText(text: string, voice: string = 'Kore'): Promise<void> {
  try {
    if (currentAudioElement) {
      currentAudioElement.pause();
      currentAudioElement = null;
    }

    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Gagal menghasilkan suara');
    }

    const data = await res.json();
    if (!data.audioBase64) return;

    const audioUrl = `data:audio/wav;base64,${data.audioBase64}`;
    const audio = new Audio(audioUrl);
    currentAudioElement = audio;
    await audio.play();
  } catch (err) {
    console.warn('Audio playback error, falling back to Web Speech API if supported:', err);
    // Graceful fallback to browser speech synthesis if offline/error
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.slice(0, 300));
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  }
}

export function stopSpeaking(): void {
  if (currentAudioElement) {
    currentAudioElement.pause();
    currentAudioElement = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
