import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, Loader } from 'lucide-react';
import { useSpeechSynthesis, useSpeechRecognition } from 'react-speech-kit';
import { aiService } from '../../services/aiService';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

const VoiceAssistant: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const { speak, cancel, speaking } = useSpeechSynthesis();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processVoiceInput(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processVoiceInput = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // Process voice query with AI service
      const response = await aiService.processVoiceQuery(audioBlob, i18n.language);
      
      // Add user message (placeholder since we don't have transcription yet)
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: 'Voice query processed',
        timestamp: new Date()
      };

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage, assistantMessage]);

      // Convert response to speech if audio is enabled
      if (audioEnabled) {
        const audioUrl = await aiService.textToSpeech(response, i18n.language);
        assistantMessage.audioUrl = audioUrl;
        
        // Play the audio
        const audio = new Audio(audioUrl);
        audio.play();
      }
    } catch (error) {
      console.error('Error processing voice input:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: 'Sorry, I couldn\'t process your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-green-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center">
            <MessageCircle className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-bold">AI Voice Assistant</h2>
          </div>
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-2 rounded-full hover:bg-green-600 transition-colors"
          >
            {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Start a conversation by pressing the microphone button</p>
              <p className="text-sm mt-2">Ask about crop diseases, market prices, or government schemes</p>
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
                  <span className="text-xs opacity-75">{formatTime(message.timestamp)}</span>
                  {message.audioUrl && (
                    <button
                      onClick={() => playAudio(message.audioUrl!)}
                      className="ml-2 p-1 rounded hover:bg-gray-200 transition-colors"
                    >
                      <Volume2 className="h-3 w-3" />
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
                  <span className="text-sm">Processing your request...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Voice Input Controls */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-center">
            <button
              onClick={isRecording ? stopRecording : startRecording}
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
            {isRecording ? 'Recording... Tap to stop' : 'Tap to start recording'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Quick questions you can ask:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'What disease does my crop have?',
              'Current wheat prices',
              'Government schemes for farmers',
              'Weather forecast'
            ].map((question, index) => (
              <button
                key={index}
                className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:bg-gray-100 transition-colors"
                onClick={() => {
                  // For demo purposes, add as user message
                  const message: Message = {
                    id: Date.now().toString(),
                    type: 'user',
                    content: question,
                    timestamp: new Date()
                  };
                  setMessages(prev => [...prev, message]);
                }}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;