import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "@/context/NotificationContext";

interface VoiceSearchProps {
  onSearchResult: (query: string) => void;
  onClose?: () => void;
  isOpen?: boolean;
}

// Speech recognition types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const VoiceSearch = ({ onSearchResult, onClose, isOpen = false }: VoiceSearchProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const recognitionRef = useRef<any>(null);
  const { showError, showInfo } = useNotifications();

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        showInfo("Voice Search", "Listening... Say something like 'search for mascara'");
      };

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            setConfidence(event.results[i][0].confidence);
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          processVoiceCommand(finalTranscript, event.results[0][0].confidence);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        let errorMessage = "Something went wrong with voice recognition";
        switch (event.error) {
          case 'network':
            errorMessage = "Network error occurred";
            break;
          case 'not-allowed':
            errorMessage = "Microphone access denied. Please allow microphone access.";
            break;
          case 'no-speech':
            errorMessage = "No speech detected. Please try again.";
            break;
          case 'audio-capture':
            errorMessage = "No microphone found or microphone is being used by another app";
            break;
        }
        
        showError("Voice Search Error", errorMessage);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [showError, showInfo]);

  const processVoiceCommand = (command: string, confidence: number) => {
    const lowerCommand = command.toLowerCase().trim();
    
    // Extract search terms from voice command
    let searchQuery = '';
    
    // Common voice search patterns
    const searchPatterns = [
      /(?:search for|find|look for|show me) (.+)/i,
      /(.+) (?:products|items)/i,
      /i want (.+)/i,
      /(.+)/i // Fallback - use the entire command
    ];

    for (const pattern of searchPatterns) {
      const match = lowerCommand.match(pattern);
      if (match && match[1]) {
        searchQuery = match[1].trim();
        break;
      }
    }

    // Clean up the search query
    searchQuery = searchQuery
      .replace(/\b(please|for me|some|any)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (searchQuery) {
      onSearchResult(searchQuery);
      setTranscript(`Searching for: ${searchQuery}`);
      
      if (confidence > 0.7) {
        showInfo("Voice Search", `Searching for "${searchQuery}" (${Math.round(confidence * 100)}% confidence)`);
      } else {
        showInfo("Voice Search", `Searching for "${searchQuery}" (Low confidence - you may want to try again)`);
      }
      
      // Auto close after a delay
      setTimeout(() => {
        onClose?.();
      }, 1500);
    } else {
      showError("Voice Search", "Couldn't understand the command. Try saying 'search for mascara' or 'find lipstick'");
    }
  };

  const startListening = () => {
    if (!isSupported) {
      showError("Voice Search", "Voice search is not supported in this browser");
      return;
    }

    if (recognitionRef.current && !isListening) {
      setTranscript("");
      setConfidence(0);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceButtonClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
            className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full mx-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              Voice Search
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Say something like "search for mascara" or "find lipstick"
            </p>

            {/* Voice Animation */}
            <div className="flex justify-center mb-6">
              <motion.div
                animate={isListening ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                transition={{ repeat: isListening ? Infinity : 0, duration: 1 }}
                className={`
                  w-24 h-24 rounded-full flex items-center justify-center
                  ${isListening 
                    ? 'bg-red-500 shadow-lg shadow-red-500/30' 
                    : 'bg-primary'
                  }
                `}
              >
                <Button
                  onClick={handleVoiceButtonClick}
                  disabled={!isSupported}
                  className="w-full h-full rounded-full bg-transparent hover:bg-transparent border-none p-0"
                >
                  {isListening ? (
                    <MicOff className="w-8 h-8 text-white" />
                  ) : (
                    <Mic className="w-8 h-8 text-white" />
                  )}
                </Button>
              </motion.div>
            </div>

            {/* Status */}
            <div className="mb-6 min-h-[3rem]">
              {isListening && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center space-x-2 text-red-500"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="font-medium">Listening...</span>
                </motion.div>
              )}
              
              {transcript && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2"
                >
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    "{transcript}"
                  </p>
                  {confidence > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      Confidence: {Math.round(confidence * 100)}%
                    </p>
                  )}
                </motion.div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {!isSupported ? (
                <p className="text-red-500 text-sm">
                  Voice search is not supported in this browser
                </p>
              ) : (
                <div className="flex space-x-3">
                  <Button
                    onClick={handleVoiceButtonClick}
                    className={`flex-1 py-3 rounded-2xl font-semibold ${
                      isListening 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-primary hover:bg-primary/90 text-white'
                    }`}
                  >
                    {isListening ? 'Stop Listening' : 'Start Voice Search'}
                  </Button>
                  
                  <Button
                    onClick={() => speakText("Say search for the product you want to find")}
                    variant="outline"
                    className="p-3 rounded-2xl"
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full py-3 rounded-2xl"
              >
                Close
              </Button>
            </div>

            {/* Help Text */}
            <div className="mt-4 text-xs text-gray-500">
              <p>Example commands:</p>
              <p>"Search for mascara", "Find red lipstick", "Show me perfumes"</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceSearch;

// Hook for voice search functionality
export function useVoiceSearch() {
  const [isOpen, setIsOpen] = useState(false);

  const openVoiceSearch = () => setIsOpen(true);
  const closeVoiceSearch = () => setIsOpen(false);

  return {
    isOpen,
    openVoiceSearch,
    closeVoiceSearch,
  };
}
