
import React from 'react';
import { VoiceMember } from '../types';

interface VoiceStageProps {
  members: VoiceMember[];
  isConnected: boolean;
}

const VoiceStage: React.FC<VoiceStageProps> = ({ members, isConnected }) => {
  if (!isConnected) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="w-24 h-24 bg-[#2B2D31] rounded-full flex items-center justify-center text-[#4E5058] animate-pulse">
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        </div>
        <div className="max-w-md">
            <h2 className="text-2xl font-bold text-white mb-2">Voice Chat is Waiting</h2>
            <p className="text-[#B5BAC1]">Click 'Join Voice' below to start talking with the Gemini AI. You'll enter a real-time voice environment powered by Gemini 2.5 Flash.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {members.map(member => (
          <div key={member.id} className="flex flex-col items-center group">
            <div className={`relative w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center transition-all duration-150 ${member.isSpeaking ? 'ring-4 ring-[#23A559] ring-offset-4 ring-offset-[#313338] scale-105 shadow-[0_0_20px_rgba(35,165,89,0.3)]' : ''}`}>
              <img 
                src={member.avatar} 
                className={`w-full h-full rounded-full bg-[#2B2D31] ${member.isSpeaking ? '' : 'grayscale-[20%]'}`} 
                alt={member.name}
              />
              
              {/* Bot Tag */}
              {member.isBot && (
                <div className="absolute -bottom-2 bg-[#5865F2] text-white text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">
                  Bot
                </div>
              )}

              {/* Mute/Deafen indicators */}
              {(member.isMuted || member.isDeafened) && (
                <div className="absolute top-0 right-0 bg-[#ED4245] w-8 h-8 rounded-full flex items-center justify-center border-4 border-[#313338]">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    {member.isDeafened ? (
                      <path d="M12 3a9 9 0 00-9 9v7c0 1.1.9 2 2 2h4v-8H5v-1c0-3.87 3.13-7 7-7s7 3.13 7 7v1h-4v8h4c1.1 0 2-.9 2-2v-7a9 9 0 00-9-9zm-1 6H9v2h2V9zm4 0h-2v2h2V9z" />
                    ) : (
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                    )}
                  </svg>
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-col items-center">
                <span className={`font-bold text-lg ${member.isSpeaking ? 'text-[#23A559]' : 'text-[#DBDEE1]'}`}>{member.name}</span>
                {member.isSpeaking && (
                    <div className="flex space-x-0.5 mt-1">
                        <div className="w-1 h-3 bg-[#23A559] animate-[bounce_1s_infinite_0.1s] rounded-full" />
                        <div className="w-1 h-4 bg-[#23A559] animate-[bounce_1s_infinite_0.2s] rounded-full" />
                        <div className="w-1 h-3 bg-[#23A559] animate-[bounce_1s_infinite_0.3s] rounded-full" />
                    </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoiceStage;
