import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Item, AIMatchResult } from '../types';
import { aiFindMatches } from '../services/aiService';
import { 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  RefreshCw,
  HandHelping,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';

export const AIMatchesView: React.FC = () => {
  const { 
    currentUser, 
    items, 
    setSelectedItemId, 
    setClaimModalItemId, 
    setContactModalItemId, 
    setAuthModalOpen 
  } = useApp();

  // Active items
  const activeItems = items.filter(i => i.status === 'Active');
  const userItems = currentUser ? activeItems.filter(i => i.userId === currentUser.userId) : [];

  // Currently selected target item to compare against opposite items
  const [selectedTargetId, setSelectedTargetId] = useState<string>(() => {
    return userItems[0]?.itemId || activeItems[0]?.itemId || '';
  });

  const [matches, setMatches] = useState<AIMatchResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);

  const targetItem = items.find(i => i.itemId === selectedTargetId);

  // Run AI matching when target item changes
  const runMatchEngine = async (itemToMatch: Item) => {
    setIsScanning(true);
    setHasScanned(false);

    try {
      const candidates = activeItems.filter(i => i.type !== itemToMatch.type);
      const results = await aiFindMatches(itemToMatch, candidates);
      setMatches(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
      setHasScanned(true);
    }
  };

  useEffect(() => {
    if (targetItem) {
      runMatchEngine(targetItem);
    }
  }, [selectedTargetId]);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#FEF08A] text-[#713F12]">
              <Sparkles className="w-5 h-5 text-[#CA8A04]" />
            </span>
            <h1 className="text-3xl font-extrabold text-[#27221E] font-heading">
              AI Smart Matching
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#786F66] mt-1">
            Intelligent semantic comparison between lost reports and found items across campus.
          </p>
        </div>

        {targetItem && (
          <button
            onClick={() => runMatchEngine(targetItem)}
            disabled={isScanning}
            className="self-start px-4 py-2 rounded-xl bg-white hover:bg-[#FAF6EC] text-[#5C5349] border border-[#EFE8D8] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            Re-scan with Gemini
          </button>
        )}
      </div>

      {/* Target Item Selector Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EFE8D8] shadow-xs">
        <label className="block text-xs font-bold text-[#857B72] uppercase tracking-wider mb-2">
          Select an item to find potential campus matches for:
        </label>
        
        <div className="flex flex-wrap gap-2">
          {activeItems.map(item => {
            const isUserItem = currentUser && item.userId === currentUser.userId;
            const isSelected = item.itemId === selectedTargetId;

            return (
              <button
                key={item.itemId}
                onClick={() => setSelectedTargetId(item.itemId)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#FEF08A] text-[#713F12] border-[#FDE047] shadow-xs scale-102'
                    : 'bg-[#FFFDF9] text-[#5C5349] border-[#EFE8D8] hover:bg-[#FAF6EC]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${item.type === 'lost' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                <span className="truncate max-w-[150px] sm:max-w-[200px]">{item.name}</span>
                {isUserItem && (
                  <span className="text-[10px] bg-[#FEF9C3] text-[#854D0E] px-1 rounded font-medium">
                    Mine
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Target Summary Card */}
      {targetItem && (
        <div className="bg-[#FFFDF5] rounded-3xl p-5 border border-[#FDE047] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={targetItem.image}
              alt={targetItem.name}
              className="w-16 h-16 rounded-xl object-cover border border-[#FDE047] shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  targetItem.type === 'lost'
                    ? 'bg-[#FEE2E2] text-[#991B1B]'
                    : 'bg-[#DCFCE7] text-[#166534]'
                }`}>
                  Target: {targetItem.type === 'lost' ? 'Lost Item' : 'Found Item'}
                </span>
                <span className="text-xs text-[#857B72]">ID: {targetItem.itemId}</span>
              </div>
              <h3 className="font-extrabold text-base text-[#27221E] mt-0.5">
                {targetItem.name}
              </h3>
              <p className="text-xs text-[#6B635B] line-clamp-1">
                {targetItem.description}
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-[#857B72] sm:shrink-0">
            <span className="block font-medium">Location: {targetItem.location}</span>
            <span className="block text-[11px]">Reported: {targetItem.date}</span>
          </div>
        </div>
      )}

      {/* Matching Results List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#27221E] font-heading flex items-center gap-2">
            Possible Matches ({matches.length})
          </h2>
          <span className="text-[11px] text-[#857B72]">
            Targeting candidate {targetItem?.type === 'lost' ? 'found' : 'lost'} records
          </span>
        </div>

        {isScanning ? (
          <div className="bg-white rounded-3xl p-12 border border-[#EFE8D8] text-center max-w-md mx-auto space-y-3">
            <Loader2 className="w-8 h-8 text-[#CA8A04] animate-spin mx-auto" />
            <p className="text-sm font-bold text-[#27221E]">
              Gemini AI is analyzing item attributes...
            </p>
            <p className="text-xs text-[#857B72]">
              Evaluating category compatibility, color, brand, campus location, and description semantics.
            </p>
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-[#EFE8D8] text-center max-w-md mx-auto space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF6EC] text-[#854D0E] flex items-center justify-center mx-auto mb-2">
              <Sparkles className="w-6 h-6 text-[#CA8A04]" />
            </div>
            <h3 className="text-base font-bold text-[#27221E]">
              No high-confidence matches found yet
            </h3>
            <p className="text-xs text-[#786F66] leading-relaxed">
              No reported {targetItem?.type === 'lost' ? 'found' : 'lost'} items currently reach the 50% threshold for {targetItem?.name}. As new reports come in, CampusFind will continue scanning.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map(match => {
              const candidate = items.find(i => i.itemId === match.candidateId);
              if (!candidate) return null;

              return (
                <div
                  key={match.candidateId}
                  className="bg-white rounded-3xl border border-[#ECE5D8] hover:border-[#FDE047] p-5 sm:p-7 shadow-xs hover:shadow-md transition-all space-y-5"
                >
                  
                  {/* Top Match Score Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F4EFE6] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#FEF08A] text-[#713F12] flex items-center justify-center font-black text-lg border border-[#FDE047] shadow-xs">
                        {match.score}%
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-extrabold text-[#27221E] font-heading">
                            Possible Match — {match.score}%
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FEF9C3] text-[#713F12] border border-[#FEF08A]">
                            High Confidence
                          </span>
                        </div>
                        <p className="text-xs text-[#786F66] mt-0.5">
                          {match.explanation}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedItemId(candidate.itemId)}
                        className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAF6EC] text-[#27221E] border border-[#EFE8D8] text-xs font-bold transition-colors cursor-pointer"
                      >
                        Inspect Candidate
                      </button>

                      {candidate.type === 'found' ? (
                        <button
                          onClick={() => {
                            if (!currentUser) setAuthModalOpen(true);
                            else setClaimModalItemId(candidate.itemId);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#FEF08A] hover:bg-[#FDE047] text-[#713F12] border border-[#FDE047] text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <HandHelping className="w-3.5 h-3.5" />
                          This Might Be Mine
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (!currentUser) setAuthModalOpen(true);
                            else setContactModalItemId(candidate.itemId);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#166534] border border-[#BBF7D0] text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Contact Owner
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Side-by-side visual comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Target Item Brief */}
                    {targetItem && (
                      <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#F4EFE6] flex gap-3.5">
                        <img
                          src={targetItem.image}
                          alt={targetItem.name}
                          className="w-20 h-20 rounded-xl object-cover border border-[#EFE8D8] shrink-0"
                        />
                        <div className="text-xs space-y-1 min-w-0">
                          <span className="text-[10px] font-bold text-[#857B72] uppercase tracking-wider block">
                            Your {targetItem.type === 'lost' ? 'Lost' : 'Found'} Item
                          </span>
                          <h4 className="font-bold text-[#27221E] truncate">{targetItem.name}</h4>
                          <p className="text-[#6B635B] line-clamp-2">{targetItem.description}</p>
                          <p className="text-[11px] text-[#A3998E]">{targetItem.location} • {targetItem.color}</p>
                        </div>
                      </div>
                    )}

                    {/* Candidate Item Brief */}
                    <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#EFE8D8] flex gap-3.5">
                      <img
                        src={candidate.image}
                        alt={candidate.name}
                        className="w-20 h-20 rounded-xl object-cover border border-[#EFE8D8] shrink-0"
                      />
                      <div className="text-xs space-y-1 min-w-0">
                        <span className="text-[10px] font-bold text-[#166534] uppercase tracking-wider block">
                          Reported {candidate.type === 'lost' ? 'Lost' : 'Found'} by {candidate.userName}
                        </span>
                        <h4 className="font-bold text-[#27221E] truncate">{candidate.name}</h4>
                        <p className="text-[#6B635B] line-clamp-2">{candidate.description}</p>
                        <p className="text-[11px] text-[#A3998E]">{candidate.location} • {candidate.color}</p>
                      </div>
                    </div>

                  </div>

                  {/* Explicit "Why?" section per Section 15 */}
                  <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FEF08A] space-y-2">
                    <h4 className="text-xs font-bold text-[#713F12] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#CA8A04]" />
                      Why is this considered a match?
                    </h4>
                    
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                      {match.reasons.map((reason, rIdx) => (
                        <li key={rIdx} className="flex items-center gap-2 text-[#452207]">
                          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2 border-t border-[#FEF08A] text-[11px] text-[#786F66] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
                      <span>
                        CampusFind AI provides match suggestions only. Please verify specific details (such as markings or passcodes) prior to handover.
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
