
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#313338]">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className="flex space-x-4 group hover:bg-[#2E3035] -mx-4 px-4 py-1 transition-colors">
            <img 
              src={msg.isBot ? 'https://picsum.photos/seed/gemini/200' : 'https://picsum.photos/seed/user/200'} 
              className="w-10 h-10 rounded-full bg-[#2B2D31] shrink-0 mt-1" 
              alt="avatar"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline space-x-2">
                <span className={`font-medium ${msg.isBot ? 'text-[#5865F2] hover:underline cursor-pointer' : 'text-white'}`}>
                  {msg.sender}
                </span>
                {msg.isBot && <span className="bg-[#5865F2] text-white text-[10px] px-1 rounded font-bold uppercase py-0.5">Bot</span>}
                <span className="text-xs text-[#949BA4]">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="text-[#DBDEE1] whitespace-pre-wrap leading-relaxed break-words">
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="px-4 pb-6 pt-2 shrink-0">
        <form onSubmit={handleSubmit} className="relative">
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Message #general"
            className="w-full bg-[#383A40] text-[#DBDEE1] placeholder-[#949BA4] rounded-lg px-4 py-3 focus:outline-none focus:ring-0 text-[15px]"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-3 text-[#B5BAC1]">
            <svg className="w-6 h-6 hover:text-[#DBDEE1] cursor-pointer" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;
