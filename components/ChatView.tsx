import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { sendMessageStream } from '../services/geminiService';

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "Alli Puncha. Soy Yachak, tu asistente de salud. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre dolores, plantas medicinales o dónde encontrar un médico.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    // Create a placeholder for the bot response
    const botMsgId = (Date.now() + 1).toString();
    const botMsgPlaceholder: Message = {
      id: botMsgId,
      text: '',
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMsgPlaceholder]);

    try {
      const stream = await sendMessageStream(userMsg.text);
      
      let fullText = '';
      for await (const chunk of stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          fullText += chunkText;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === botMsgId ? { ...msg, text: fullText } : msg
            )
          );
        }
      }
    } catch (error) {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === botMsgId ? { ...msg, text: "Disculpa, tuve un problema al pensar. Por favor intenta de nuevo." } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-600 p-4 text-white shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold">Yachak AI</h2>
            <p className="text-xs text-emerald-100">Asistente Comunitario</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 no-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none'
                  : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
              }`}
            >
               {/* Use Markdown rendering if possible, but simple whitespace pre-wrap for now */}
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
              <span className={`text-[10px] block mt-1 ${msg.sender === 'user' ? 'text-emerald-200' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 flex space-x-2 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s'}}></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="absolute bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent">
        <div className="bg-white rounded-full shadow-lg border border-gray-200 flex items-center p-1 pr-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu consulta aquí..."
            className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className={`p-3 rounded-full transition-colors ${
              !inputValue.trim() || isLoading 
                ? 'bg-gray-100 text-gray-400' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
