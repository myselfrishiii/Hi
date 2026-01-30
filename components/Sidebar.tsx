
import React from 'react';

const Sidebar: React.FC = () => {
  const servers = [
    { id: 1, name: 'Home', initial: 'H', color: 'bg-[#5865F2]' },
    { id: 2, name: 'AI Lab', initial: 'A', color: 'bg-[#2B2D31]' },
    { id: 3, name: 'Gaming', initial: 'G', color: 'bg-[#2B2D31]' },
  ];

  return (
    <div className="w-[72px] bg-[#1E1F22] flex flex-col items-center py-3 space-y-2">
      {/* Discord Icon */}
      <div className="w-12 h-12 bg-[#5865F2] rounded-[16px] flex items-center justify-center text-white cursor-pointer hover:rounded-[12px] transition-all duration-200">
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.27 4.51a10.02 10.02 0 00-4.11-1.27l-.19.41a13.3 13.3 0 00-3.94 0l-.19-.41a10.02 10.02 0 00-4.11 1.27s-3.4 6.1-3.4 13.52a10.15 10.15 0 005.11 2.58l1.01-1.33c-1.63-.49-3.21-1.33-4.52-2.5l.38-.21c3.15 1.58 6.64 1.58 9.79 0l.38.21c-1.31 1.17-2.89 2.01-4.52 2.5l1.01 1.33a10.15 10.15 0 005.11-2.58c0-7.42-3.4-13.52-3.4-13.52zM8.52 14.91c-.69 0-1.25-.61-1.25-1.35s.55-1.35 1.25-1.35 1.25.61 1.25 1.35-.56 1.35-1.25 1.35zm6.96 0c-.69 0-1.25-.61-1.25-1.35s.55-1.35 1.25-1.35 1.25.61 1.25 1.35-.56 1.35-1.25 1.35z" />
        </svg>
      </div>

      <div className="w-8 h-[2px] bg-[#35363C] rounded-full mx-auto" />

      {servers.map(server => (
        <div 
          key={server.id} 
          className={`w-12 h-12 ${server.color} rounded-[24px] flex items-center justify-center text-white font-medium cursor-pointer hover:rounded-[16px] transition-all duration-200 group relative`}
        >
          <div className="absolute left-0 w-1 h-0 bg-white rounded-r-full group-hover:h-5 transition-all duration-200" />
          {server.initial}
        </div>
      ))}

      <div className="w-12 h-12 bg-[#2B2D31] rounded-[24px] flex items-center justify-center text-[#23A559] cursor-pointer hover:rounded-[16px] hover:bg-[#23A559] hover:text-white transition-all duration-200">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
      </div>
    </div>
  );
};

export default Sidebar;
