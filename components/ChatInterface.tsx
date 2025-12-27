
import React, { useState, useRef, useEffect } from 'react';
import { getHealthAdvice, analyzeHealthImage } from '../services/geminiService';
import { Message, Language } from '../types';
import { LANGUAGE_OPTIONS } from '../constants';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am HealthGuard AI. How can I help you today? You can ask me about symptoms, disease prevention, or vaccination schedules. I support English, Hindi, and Marathi.',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const response = await getHealthAdvice(input, language);
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response || "I'm sorry, I couldn't understand that.",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = (event.target?.result as string).split(',')[1];
      const imageUrl = event.target?.result as string;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: 'Analyzed health image upload',
        type: 'image',
        imageUrl: imageUrl,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);

      const response = await analyzeHealthImage(base64, "What can you see in this health-related image? Is it a prescription or a symptom like a rash? Please provide guidance on what to do next without a medical diagnosis.");
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || "I could not analyze this image.",
        timestamp: new Date(),
      }]);
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const toggleRecording = () => {
    // Note: In a real app, we'd use the Gemini Live API hook here for real-time interaction.
    // For this demo, we'll simulate voice activation toggle.
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate speech to text completion
      setTimeout(() => {
        setIsRecording(false);
        setInput("How can I prevent Malaria?");
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="bg-emerald-600 p-4 text-white flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
            🤖
          </div>
          <div>
            <h2 className="font-bold">HealthGuard Chat</h2>
            <div className="flex items-center text-xs opacity-80">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span> Online
            </div>
          </div>
        </div>
        <select 
          className="bg-emerald-700 text-xs text-white border-none rounded p-1 focus:ring-0"
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
        >
          {LANGUAGE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
              }`}
            >
              {msg.type === 'image' && msg.imageUrl && (
                <img src={msg.imageUrl} alt="Health focus" className="rounded-lg mb-2 max-h-48 w-full object-cover" />
              )}
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </div>
              <div className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-white/70' : 'text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSend} className="flex items-center space-x-2">
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-500 hover:text-emerald-600 transition-colors"
            title="Upload Health Image"
          >
            📷
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileUpload}
          />
          <button 
            type="button" 
            onClick={toggleRecording}
            className={`p-2 transition-colors rounded-full ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-slate-500 hover:text-emerald-600'}`}
            title="Voice Interaction"
          >
            🎤
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your health question..."
            className="flex-1 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
        <div className="mt-2 text-[10px] text-center text-slate-400">
          Powered by HealthGuard AI • Accurate Information for All
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
