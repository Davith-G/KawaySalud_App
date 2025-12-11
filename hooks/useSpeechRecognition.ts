
import { useState, useEffect, useCallback, useContext } from 'react';
import { LanguageContext } from '../App';

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: (event: Event) => void;
  onend: (event: Event) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { language } = useContext(LanguageContext);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false; // Stop after one sentence for simple input
      recognitionInstance.interimResults = true; // Show results as they speak

      recognitionInstance.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
             setTranscript(finalTranscript);
        }
      };

      recognitionInstance.onerror = (event: any) => {
        // Silently handle 'no-speech' (timeout due to silence)
        if (event.error === 'no-speech') {
            setIsListening(false);
            return;
        }

        console.error("Speech recognition error", event.error);
        
        if (event.error === 'not-allowed') {
            setError("Permiso de micrófono denegado. Por favor habilítalo en la configuración.");
            alert("Permiso de micrófono denegado. Por favor habilita el micrófono para usar esta función.");
        } else {
            setError(`Error de voz: ${event.error}`);
        }
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  // Update language when app language changes
  useEffect(() => {
      if (recognition) {
          // Map app languages to BCP 47 tags
          // 'es' -> 'es-ES' (or es-419 for Latin America)
          // 'en' -> 'en-US'
          // 'qu' -> 'qu-EC' (Kichwa Ecuador)
          switch(language) {
              case 'es': recognition.lang = 'es-EC'; break;
              case 'en': recognition.lang = 'en-US'; break;
              case 'qu': recognition.lang = 'qu-EC'; break; // Browser support varies
              default: recognition.lang = 'es-EC';
          }
      }
  }, [language, recognition]);

  const startListening = useCallback(() => {
    setTranscript('');
    setError(null);
    if (recognition) {
      try {
        recognition.start();
      } catch (e) {
        console.error(e);
      }
    } else {
        alert("Tu navegador no soporta reconocimiento de voz.");
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
  }, [recognition]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    error,
    hasSupport: !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  };
};
