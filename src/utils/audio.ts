import { RegionalLanguage } from '../types';

// Speech synthesis mapping
const LANG_LOCALE_MAP: Record<RegionalLanguage | string, string> = {
  Tamil: 'ta-IN',
  Kannada: 'kn-IN',
  Telugu: 'te-IN',
  Hindi: 'hi-IN',
  Marathi: 'mr-IN',
  Bengali: 'bn-IN',
  Malayalam: 'ml-IN',
  English: 'en-IN',
};

// Play audio via Gemini backend or browser speech synthesis
export async function speakText(
  text: string,
  language: RegionalLanguage | string = 'Tamil',
  onStart?: () => void,
  onEnd?: () => void
): Promise<void> {
  if (!text || typeof window === 'undefined') return;

  onStart?.();

  // Try server-side Gemini TTS first
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice: 'Kore' }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.audioBase64) {
        await playBase64Pcm(data.audioBase64, 24000);
        onEnd?.();
        return;
      }
    }
  } catch (err) {
    // Graceful fallback to browser speech synthesis
  }

  // Browser SpeechSynthesis fallback
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const targetLocale = LANG_LOCALE_MAP[language] || 'ta-IN';
    utterance.lang = targetLocale;
    utterance.rate = 0.9; // slightly slower for language learners

    // Try finding matching voice
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang.startsWith(targetLocale.split('-')[0]));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      onEnd?.();
    };

    utterance.onerror = () => {
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
    return;
  }

  onEnd?.();
}

// Convert Base64 PCM 24kHz to AudioBuffer and play via Web Audio API
export async function playBase64Pcm(base64: string, sampleRate = 24000): Promise<void> {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const pcm16 = new Int16Array(bytes.buffer);
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
    sampleRate,
  });

  const buffer = audioCtx.createBuffer(1, pcm16.length, sampleRate);
  const channelData = buffer.getChannelData(0);

  for (let i = 0; i < pcm16.length; i++) {
    channelData[i] = pcm16[i] / 32768.0;
  }

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);

  return new Promise((resolve) => {
    source.onended = () => {
      audioCtx.close();
      resolve();
    };
    source.start();
  });
}

// Speech recognition helper
export interface SpeechRecognitionController {
  start: () => void;
  stop: () => void;
  isSupported: boolean;
}

export function createSpeechRecognizer(
  language: RegionalLanguage | string = 'Tamil',
  onResult: (transcript: string, isFinal: boolean) => void,
  onError?: (error: string) => void,
  onEnd?: () => void
): SpeechRecognitionController {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return {
      start: () => onError?.('Speech recognition is not supported in this browser. Please use text input.'),
      stop: () => {},
      isSupported: false,
    };
  }

  const recognition = new SpeechRecognition();
  const locale = LANG_LOCALE_MAP[language] || 'ta-IN';
  recognition.lang = locale;
  recognition.continuous = false;
  recognition.interimResults = true;

  recognition.onresult = (event: any) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    if (finalTranscript) {
      onResult(finalTranscript.trim(), true);
    } else if (interimTranscript) {
      onResult(interimTranscript.trim(), false);
    }
  };

  recognition.onerror = (event: any) => {
    console.warn('Speech recognition event error:', event.error);
    onError?.(event.error);
  };

  recognition.onend = () => {
    onEnd?.();
  };

  return {
    start: () => {
      try {
        recognition.start();
      } catch (e: any) {
        console.warn('Recognition start issue:', e?.message);
      }
    },
    stop: () => {
      try {
        recognition.stop();
      } catch (e: any) {
        // ignore
      }
    },
    isSupported: true,
  };
}
