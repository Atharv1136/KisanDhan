import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, Loader, Camera, SwitchCamera, Languages, Play, Pause } from 'lucide-react';
import Webcam from 'react-webcam';
import { geminiService } from '../../services/geminiService';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  audioUrl?: string;
  language?: string;
}

const VoiceAssistant: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('hi'); // Default to Hindi
  const [showCamera, setShowCamera] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const webcamRef = useRef<Webcam>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const languages = [
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' }
  ];

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = getLanguageCode(selectedLanguage);
    }

    // Initialize Speech Synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
    };
  }, [selectedLanguage]);

  const getLanguageCode = (lang: string) => {
    const langMap: { [key: string]: string } = {
      'hi': 'hi-IN',
      'en': 'en-US',
      'kn': 'kn-IN',
      'te': 'te-IN',
      'ta': 'ta-IN',
      'mr': 'mr-IN'
    };
    return langMap[lang] || 'hi-IN';
  };

  const getLanguageName = (code: string) => {
    const lang = languages.find(l => l.code === code);
    return lang ? lang.name : 'हिंदी';
  };

  const startVoiceRecording = async () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    setIsRecording(true);
    setIsProcessing(false);

    recognitionRef.current.lang = getLanguageCode(selectedLanguage);
    
    recognitionRef.current.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      await processVoiceQuery(transcript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      addMessage('assistant', 'Sorry, I couldn\'t understand. Please try again.', selectedLanguage);
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current.start();
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const processVoiceQuery = async (transcript: string) => {
    setIsProcessing(true);
    
    try {
      // Add user message
      addMessage('user', transcript, selectedLanguage);

      // Get AI response based on language
      const response = await getAIResponse(transcript, selectedLanguage);
      
      // Add assistant response
      const assistantMessage = addMessage('assistant', response, selectedLanguage);

      // Convert response to speech if audio is enabled
      if (audioEnabled) {
        await speakText(response, selectedLanguage, assistantMessage.id);
      }
    } catch (error) {
      console.error('Error processing voice query:', error);
      const errorMessage = getErrorMessage(selectedLanguage);
      addMessage('assistant', errorMessage, selectedLanguage);
    } finally {
      setIsProcessing(false);
    }
  };

  const getAIResponse = async (query: string, language: string): Promise<string> => {
    const languagePrompts = {
      'hi': `आप एक कृषि विशेषज्ञ हैं। इस प्रश्न का उत्तर हिंदी में दें: "${query}". भारतीय किसानों के लिए व्यावहारिक सलाह दें।`,
      'en': `You are an agricultural expert. Answer this question in English: "${query}". Provide practical advice for Indian farmers.`,
      'kn': `ನೀವು ಕೃಷಿ ತಜ್ಞರು. ಈ ಪ್ರಶ್ನೆಗೆ ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ: "${query}". ಭಾರತೀಯ ರೈತರಿಗೆ ಪ್ರಾಯೋಗಿಕ ಸಲಹೆ ನೀಡಿ।`,
      'te': `మీరు వ్యవసాయ నిపుణులు. ఈ ప్రశ్నకు తెలుగులో సమాధానం ఇవ్వండి: "${query}". భారతీయ రైతులకు ఆచరణాత్మక సలహా ఇవ్వండి।`,
      'ta': `நீங்கள் ஒரு விவசாய நிபுணர். இந்த கேள்விக்கு தமிழில் பதிலளிக்கவும்: "${query}". இந்திய விவசாயிகளுக்கு நடைமுறை ஆலோசனை வழங்கவும்।`,
      'mr': `तुम्ही कृषी तज्ञ आहात. या प्रश्नाचे उत्तर मराठीत द्या: "${query}". भारतीय शेतकऱ्यांसाठी व्यावहारिक सल्ला द्या।`
    };

    const prompt = languagePrompts[language as keyof typeof languagePrompts] || languagePrompts['hi'];
    return await geminiService.getCropAdvice(prompt);
  };

  const getErrorMessage = (language: string): string => {
    const errorMessages = {
      'hi': 'क्षमा करें, मैं आपकी बात समझ नहीं पाया। कृपया फिर से कोशिश करें।',
      'en': 'Sorry, I couldn\'t understand. Please try again.',
      'kn': 'ಕ್ಷಮಿಸಿ, ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
      'te': 'క్షమించండి, నాకు అర్థం కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.',
      'ta': 'மன்னிக்கவும், எனக்கு புரியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.',
      'mr': 'क्षमस्व, मला समजले नाही. कृपया पुन्हा प्रयत्न करा.'
    };
    return errorMessages[language as keyof typeof errorMessages] || errorMessages['hi'];
  };

  const speakText = async (text: string, language: string, messageId: string) => {
    if (!synthRef.current || !audioEnabled) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getLanguageCode(language);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsPlaying(messageId);
    };

    utterance.onend = () => {
      setIsPlaying(null);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsPlaying(null);
    };

    // Get available voices for the language
    const voices = synthRef.current.getVoices();
    const languageVoice = voices.find(voice => 
      voice.lang.startsWith(language === 'kn' ? 'kn' : language === 'te' ? 'te' : language === 'ta' ? 'ta' : language === 'mr' ? 'mr' : language === 'hi' ? 'hi' : 'en')
    );
    
    if (languageVoice) {
      utterance.voice = languageVoice;
    }

    synthRef.current.speak(utterance);
  };

  const addMessage = (type: 'user' | 'assistant', content: string, language: string): Message => {
    const message: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      language
    };

    setMessages(prev => [...prev, message]);
    return message;
  };

  const playMessage = (messageId: string, content: string, language: string) => {
    if (isPlaying === messageId) {
      synthRef.current?.cancel();
      setIsPlaying(null);
    } else {
      speakText(content, language, messageId);
    }
  };

  const capturePhoto = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      try {
        setIsProcessing(true);
        
        // Convert base64 to file
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        const file = new File([blob], 'crop-photo.jpg', { type: 'image/jpeg' });
        
        // Analyze with Gemini
        const analysisResult = await geminiService.analyzeCropDisease(file);
        
        // Create response message in selected language
        const responseText = formatDiseaseResponse(analysisResult, selectedLanguage);
        addMessage('assistant', responseText, selectedLanguage);
        
        // Speak the response
        if (audioEnabled) {
          await speakText(responseText, selectedLanguage, Date.now().toString());
        }
        
        setShowCamera(false);
      } catch (error) {
        console.error('Error analyzing crop photo:', error);
        const errorMessage = getErrorMessage(selectedLanguage);
        addMessage('assistant', errorMessage, selectedLanguage);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const formatDiseaseResponse = (result: any, language: string): string => {
    const responses = {
      'hi': `आपकी फसल में ${result.hindiName || result.disease} रोग का पता चला है। गंभीरता: ${result.severity}। उपचार: ${result.treatment?.[0] || 'स्थानीय कृषि विशेषज्ञ से सलाह लें'}।`,
      'en': `Your crop has ${result.disease}. Severity: ${result.severity}. Treatment: ${result.treatment?.[0] || 'Consult local agricultural expert'}.`,
      'kn': `ನಿಮ್ಮ ಬೆಳೆಯಲ್ಲಿ ${result.disease} ರೋಗ ಕಂಡುಬಂದಿದೆ. ತೀವ್ರತೆ: ${result.severity}. ಚಿಕಿತ್ಸೆ: ${result.treatment?.[0] || 'ಸ್ಥಳೀಯ ಕೃಷಿ ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಿ'}.`,
      'te': `మీ పంటలో ${result.disease} వ్యాధి కనుగొనబడింది. తీవ్రత: ${result.severity}. చికిత్ స: ${result.treatment?.[0] || 'స్థానిక వ్యవసాయ నిపుణులను సంప్రదించండి'}.`,
      'ta': `உங்கள் பயிரில் ${result.disease} நோய் கண்டறியப்பட்டது. தீவிரம்: ${result.severity}. சிகிச்சை: ${result.treatment?.[0] || 'உள்ளூர் விவசாய நிபுணரை அணுகவும்'}.`,
      'mr': `तुमच्या पिकात ${result.disease} रोग आढळला आहे. तीव्रता: ${result.severity}. उपचार: ${result.treatment?.[0] || 'स्थानिक कृषी तज्ञांचा सल्ला घ्या'}.`
    };
    
    return responses[language as keyof typeof responses] || responses['hi'];
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[700px] flex flex-col">
        {/* Header */}
        <div className="bg-green-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center">
            <MessageCircle className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-bold">AI Voice Assistant</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="p-2 rounded-full hover:bg-green-600 transition-colors"
            >
              {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setShowCamera(true)}
              className="p-2 rounded-full hover:bg-green-600 transition-colors"
              title="Crop Disease Detection"
            >
              <Camera className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Language Selection */}
        <div className="bg-green-50 p-4 border-b">
          <div className="flex items-center mb-2">
            <Languages className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Select Language / भाषा चुनें</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedLanguage === lang.code
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-green-100 border border-gray-300'
                }`}
              >
                {lang.flag} {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="mb-2">Start speaking in {getLanguageName(selectedLanguage)}</p>
              <p className="text-sm">{getLanguageName(selectedLanguage)} में बोलना शुरू करें</p>
              <div className="mt-4 text-xs text-gray-400">
                <p>Ask about: crop diseases, market prices, farming tips</p>
                <p>पूछें: फसल रोग, बाजार भाव, खेती की सलाह</p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs opacity-75">
                    {formatTime(message.timestamp)} • {getLanguageName(message.language || selectedLanguage)}
                  </span>
                  {message.type === 'assistant' && audioEnabled && (
                    <button
                      onClick={() => playMessage(message.id, message.content, message.language || selectedLanguage)}
                      className="ml-2 p-1 rounded hover:bg-gray-200 transition-colors"
                    >
                      {isPlaying === message.id ? (
                        <Pause className="h-3 w-3" />
                      ) : (
                        <Play className="h-3 w-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                <div className="flex items-center">
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm">Processing in {getLanguageName(selectedLanguage)}...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Voice Input Controls */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-center">
            <button
              onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
              disabled={isProcessing}
              className={`p-4 rounded-full transition-all duration-200 ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                  : 'bg-green-600 hover:bg-green-700'
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isRecording ? (
                <MicOff className="h-8 w-8 text-white" />
              ) : (
                <Mic className="h-8 w-8 text-white" />
              )}
            </button>
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">
            {isRecording 
              ? `Recording in ${getLanguageName(selectedLanguage)}... Tap to stop`
              : `Tap to speak in ${getLanguageName(selectedLanguage)}`
            }
          </p>
        </div>

        {/* Quick Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Quick questions / त्वरित प्रश्न:</p>
          <div className="flex flex-wrap gap-2">
            {[
              { en: 'What disease does my crop have?', hi: 'मेरी फसल में कौन सा रोग है?' },
              { en: 'Current wheat prices', hi: 'गेहूं का वर्तमान भाव' },
              { en: 'Government schemes for farmers', hi: 'किसानों के लिए सरकारी योजनाएं' },
              { en: 'Weather forecast', hi: 'मौसम की जानकारी' }
            ].map((question, index) => (
              <button
                key={index}
                className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:bg-gray-100 transition-colors"
                onClick={() => {
                  const text = selectedLanguage === 'hi' ? question.hi : question.en;
                  processVoiceQuery(text);
                }}
              >
                {selectedLanguage === 'hi' ? question.hi : question.en}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Crop Disease Detection</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={switchCamera}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                  title="Switch Camera"
                >
                  <SwitchCamera className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowCamera(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: facingMode
              }}
              className="w-full rounded-lg mb-4"
            />
            
            <div className="flex justify-between">
              <button
                onClick={() => setShowCamera(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={capturePhoto}
                disabled={isProcessing}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {isProcessing ? 'Analyzing...' : 'Capture & Analyze'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;