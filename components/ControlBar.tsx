import React from 'react';
import { ConnectionStatus } from '../types';

interface ControlBarProps {
  status: ConnectionStatus;
  onConnect: () => void;
  onDisconnect: () => void;
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
  isDeafened: boolean;
  setIsDeafened: (val: boolean) => void;
  showVoiceControls?: boolean;
}

const ControlBar: React.FC<ControlBarProps> = ({ 
  status, 
  onConnect, 
  onDisconnect, 
  isMuted, 
  setIsMuted, 
  isDeafened, 
  setIsDeafened,
  showVoiceControls = true
}) => {
  const isConnected = status === ConnectionStatus.CONNECTED;
  const isConnecting = status === ConnectionStatus.CONNECTING;

  if (!showVoiceControls && !isConnected && !isConnecting) return null;

  return (
    <div className="h-20 bg-[#232428] border-t border-[#1E1F22] flex items-center justify-between px-6 z-10 shrink-0">
      <div className="flex flex-col">
        <div className="flex items-center space-x-1.5">
           <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-[#23A559]' : (status === ConnectionStatus.ERROR ? 'bg-[#ED4245]' : 'bg-[#80848E]')}`} />
           <span className={`text-sm font-bold ${isConnected ? 'text-[#23A559]' : 'text-[#DBDEE1]'}`}>
             {isConnected ? 'Voice Connected' : (isConnecting ? 'Connecting...' : (status === ConnectionStatus.ERROR ? 'Connection Error' : 'Voice Disconnected'))}
           </span>
        </div>
        <span className="text-xs text-[#B5BAC1]">General / GeminiCord</span>
      </div>

      <div className="flex items-center space-x-4">
        {!isConnected ? (
          <button 
            onClick={onConnect}
            disabled={isConnecting}
            className={`flex items-center space-x-2 px-8 py-2.5 rounded-[3px] bg-[#23A559] hover:bg-[#1A8344] text-white font-medium transition-colors disabled:opacity-50`}
          >
            {isConnecting ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
            )}
            <span>Join Voice</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2">
             <CircleButton active={isMuted} onClick={() => setIsMuted(!isMuted)} icon="mic" />
             <CircleButton active={isDeafened} onClick={() => setIsDeafened(!isDeafened)} icon="headphones" />
             <button onClick={onDisconnect} className="bg-[#ED4245] hover:bg-[#A12D2F] text-white p-2.5 rounded-full transition-colors group relative">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 12.59c.39.39.39 1.02 0 1.41s-1.02.39-1.41 0L10 14l-2 2-1.41-1.41L8.59 12 6.59 10 8 8.59l2 2 2-2 1.41 1.41L11.41 12l2 2z"/></svg>
             </button>
          </div>
        )}
      </div>

      <div className="hidden md:flex items-center space-x-4">
        <div className="flex items-center space-x-1 p-1 hover:bg-[#35373C] rounded transition-colors cursor-pointer text-[#B5BAC1]">
           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
           <span className="text-xs font-bold uppercase">Activity</span>
        </div>
      </div>
    </div>
  );
};

// CircleButton component with fixed icon paths and corrected JSX syntax
const CircleButton: React.FC<{ active: boolean; onClick: () => void; icon: string }> = ({ active, onClick, icon }) => (
  <button 
    onClick={onClick}
    className={`p-2.5 rounded-full transition-colors relative group ${active ? 'bg-[#ED4245] text-white' : 'bg-[#313338] text-[#B5BAC1] hover:bg-[#3F4147] hover:text-[#DBDEE1]'}`}
  >
    {icon === 'mic' ? (
       <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
         {active ? (
           <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.17l5.98 6zm-1.15 1.15L5.12 3.61 3.71 5.02l2.09 2.09V11c0 2.84 2 5.21 4.69 5.82L10.5 21h3l-.33-1.32 3.81 3.81 1.41-1.41-4.56-4.56-1.02-1.02zM10.12 12l-.12-.12V11c0-.55.45-1 1-1h.12l-1 1z"/>
         ) : (
           <React.Fragment>
             <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
             <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
           </React.Fragment>
         )}
       </svg>
    ) : (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          {active ? (
            <path d="M12 3a9 9 0 00-9 9v7c0 1.1.9 2 2 2h4v-8H5v-1c0-3.87 3.13-7 7-7s7 3.13 7 7v1h-4v8h4c1.1 0 2-.9 2-2v-7a9 9 0 00-9-9zM7 13v5H5v-5h2zm12 5h-2v-5h2v5z M3.41 1.59L2 3l20 20 1.41-1.41z" />
          ) : (
            <path d="M12 3a9 9 0 00-9 9v7c0 1.1.9 2 2 2h4v-8H5v-1c0-3.87 3.13-7 7-7s7 3.13 7 7v1h-4v8h4c1.1 0 2-.9 2-2v-7a9 9 0 00-9-9z"/>
          )}
        </svg>
    )}
  </button>
);

export default ControlBar;