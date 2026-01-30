
import React from 'react';

interface ChannelSidebarProps {
  activeTab: 'text' | 'voice';
  onTabChange: (tab: 'text' | 'voice') => void;
  isVoiceConnected: boolean;
}

const ChannelSidebar: React.FC<ChannelSidebarProps> = ({ activeTab, onTabChange, isVoiceConnected }) => {
  return (
    <div className="w-60 bg-[#2B2D31] flex flex-col h-full shrink-0">
      <div className="h-12 px-4 flex items-center shadow-sm border-b border-[#1E1F22] hover:bg-[#35373C] cursor-pointer transition-colors">
        <span className="font-bold text-white flex-1 truncate">Gemini AI Server</span>
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <div className="flex-1 overflow-y-auto pt-4 px-2 space-y-4">
        <div>
          <div className="flex items-center px-2 mb-1 group cursor-pointer text-[#80848E] hover:text-[#DBDEE1]">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
            <span className="text-[12px] font-bold uppercase tracking-wider">Text Channels</span>
          </div>
          <div className="space-y-[2px]">
            <ChannelItem 
              icon="#" 
              name="general" 
              active={activeTab === 'text'} 
              onClick={() => onTabChange('text')} 
            />
          </div>
        </div>

        <div>
          <div className="flex items-center px-2 mb-1 group cursor-pointer text-[#80848E] hover:text-[#DBDEE1]">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
            <span className="text-[12px] font-bold uppercase tracking-wider">Voice Channels</span>
          </div>
          <div className="space-y-[2px]">
            <ChannelItem 
              icon="V" 
              name="General Voice" 
              active={activeTab === 'voice'} 
              onClick={() => onTabChange('voice')}
              isStreaming={isVoiceConnected}
            />
          </div>
        </div>
      </div>

      <div className="h-[52px] bg-[#232428] px-2 flex items-center space-x-2">
        <div className="relative">
          <img src="https://picsum.photos/seed/user/40" className="w-8 h-8 rounded-full" alt="avatar" />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#23A559] border-[3px] border-[#232428] rounded-full" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-white truncate leading-tight">User_Name</div>
          <div className="text-[12px] text-[#B5BAC1] truncate leading-tight">#1337</div>
        </div>
        <div className="flex items-center space-x-1">
          <div className="p-1.5 hover:bg-[#3F4147] rounded cursor-pointer text-[#B5BAC1]"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg></div>
          <div className="p-1.5 hover:bg-[#3F4147] rounded cursor-pointer text-[#B5BAC1]"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87a.49.49 0 00.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 00-.12-.61l-2.03-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg></div>
        </div>
      </div>
    </div>
  );
};

const ChannelItem: React.FC<{ icon: string; name: string; active?: boolean; onClick: () => void; isStreaming?: boolean }> = ({ icon, name, active, onClick, isStreaming }) => (
  <div 
    onClick={onClick}
    className={`flex items-center px-2 py-1.5 rounded group cursor-pointer ${active ? 'bg-[#3F4147] text-white' : 'text-[#80848E] hover:bg-[#35373C] hover:text-[#DBDEE1]'}`}
  >
    <span className="mr-2">
      {icon === '#' ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M5.88 4.12L13.76 12l-7.88 7.88L4.47 18.47 10.94 12 4.47 5.53zM14.59 16.59L19.17 12l-4.58-4.59L16 6l6 6-6 6z"/></svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L4 9v12h16V9l-8-6zm0 14.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
      )}
    </span>
    <span className="font-medium truncate flex-1">{name}</span>
    {isStreaming && <div className="w-2 h-2 bg-[#ED4245] rounded-full animate-pulse mr-1" />}
  </div>
);

export default ChannelSidebar;
