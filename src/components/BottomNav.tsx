import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Search, PlusCircle, Sparkles, User as UserIcon, Bot } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setSelectedItemId, setIsChatbotOpen } = useApp();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-t border-[#EFE8D8] py-1.5 px-3 shadow-lg">
      <div className="flex items-center justify-around">
        
        <button
          onClick={() => { setActiveTab('home'); setSelectedItemId(null); }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'home'
              ? 'text-[#713F12] font-bold'
              : 'text-[#857B72]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        <button
          onClick={() => { setActiveTab('browse'); setSelectedItemId(null); }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'browse'
              ? 'text-[#713F12] font-bold'
              : 'text-[#857B72]'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Browse</span>
        </button>

        <button
          onClick={() => { setActiveTab('report-lost'); setSelectedItemId(null); }}
          className="flex flex-col items-center py-0.5 px-3 rounded-2xl bg-[#FEF08A] text-[#713F12] border border-[#FDE047] shadow-xs active:scale-95 transition-transform"
        >
          <PlusCircle className="w-5 h-5 text-[#854D0E]" />
          <span className="text-[10px] font-bold mt-0.5">Report</span>
        </button>

        <button
          onClick={() => { setActiveTab('matches'); setSelectedItemId(null); }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'matches'
              ? 'text-[#713F12] font-bold'
              : 'text-[#857B72]'
          }`}
        >
          <Sparkles className="w-5 h-5 text-[#CA8A04]" />
          <span className="text-[10px] mt-0.5">Matches</span>
        </button>

        <button
          onClick={() => setIsChatbotOpen(true)}
          className="flex flex-col items-center py-1 px-2 rounded-xl text-[#857B72] hover:text-[#713F12] transition-all"
        >
          <Bot className="w-5 h-5 text-[#B45309]" />
          <span className="text-[10px] mt-0.5">AI Chat</span>
        </button>

        <button
          onClick={() => { setActiveTab('profile'); setSelectedItemId(null); }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'profile'
              ? 'text-[#713F12] font-bold'
              : 'text-[#857B72]'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Profile</span>
        </button>

      </div>
    </div>
  );
};
