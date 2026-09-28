import React from 'react';
import { useApp } from '../context/AppContext';
import { ItemCard } from './ItemCard';
import { 
  Search, 
  PlusCircle, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  ArrowRight, 
  HelpCircle, 
  Layers, 
  CheckCircle2, 
  MessageSquare,
  FileText,
  Bot
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { 
    currentUser, 
    items, 
    setActiveTab, 
    setSelectedItemId,
    setIsChatbotOpen
  } = useApp();

  const recentItems = items.slice(0, 6);

  // If user is logged in, find potential matches for their active reports
  const userItems = currentUser ? items.filter(i => i.userId === currentUser.userId && i.status === 'Active') : [];
  const possibleMatches = userItems.length > 0
    ? items.filter(other => 
        other.userId !== currentUser?.userId && 
        other.status === 'Active' &&
        userItems.some(uItem => uItem.type !== other.type && uItem.category === other.category)
      ).slice(0, 3)
    : [];

  return (
    <div className="space-y-12 pb-16">
      
      {/* If logged in: User Dashboard Hero */}
      {currentUser ? (
        <section className="bg-gradient-to-b from-[#FFFDF5] to-[#FAF6EC] border border-[#EFE8D8] rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF9C3] text-[#713F12] text-xs font-bold border border-[#FEF08A] mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Campus Lost &amp; Found Active Hub
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#27221E] font-heading tracking-tight">
              Welcome back, {currentUser.name} 👋
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#6B635B] max-w-2xl leading-relaxed">
              Find what you lost. Return what you found. Manage your campus reports, check verification claims, or discover smart matches.
            </p>

            {/* Quick Action Cards Grid (per section 4) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              
              <div
                onClick={() => setActiveTab('report-lost')}
                className="group p-5 bg-white rounded-2xl border border-[#FEE2E2] hover:border-[#F87171] shadow-xs hover:shadow-md cursor-pointer transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#27221E]">Report Lost Item</h3>
                <p className="text-xs text-[#786F66] mt-1 leading-normal">
                  "I lost something on campus."
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#DC2626] mt-3 group-hover:translate-x-1 transition-transform">
                  Create report <ArrowRight className="w-3 h-3" />
                </span>
              </div>

              <div
                onClick={() => setActiveTab('report-found')}
                className="group p-5 bg-white rounded-2xl border border-[#DCFCE7] hover:border-[#4ADE80] shadow-xs hover:shadow-md cursor-pointer transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#27221E]">Report Found Item</h3>
                <p className="text-xs text-[#786F66] mt-1 leading-normal">
                  "I found something on campus."
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16A34A] mt-3 group-hover:translate-x-1 transition-transform">
                  Turn in item <ArrowRight className="w-3 h-3" />
                </span>
              </div>

              <div
                onClick={() => setActiveTab('browse')}
                className="group p-5 bg-white rounded-2xl border border-[#EFE8D8] hover:border-[#FDE047] shadow-xs hover:shadow-md cursor-pointer transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FEF9C3] text-[#854D0E] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#27221E]">Browse Items</h3>
                <p className="text-xs text-[#786F66] mt-1 leading-normal">
                  "Search lost and found items."
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#854D0E] mt-3 group-hover:translate-x-1 transition-transform">
                  Explore catalogue <ArrowRight className="w-3 h-3" />
                </span>
              </div>

              <div
                onClick={() => setActiveTab('my-reports')}
                className="group p-5 bg-white rounded-2xl border border-[#EFE8D8] hover:border-[#FDE047] shadow-xs hover:shadow-md cursor-pointer transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FAF5EA] text-[#6E6357] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#27221E]">My Reports</h3>
                <p className="text-xs text-[#786F66] mt-1 leading-normal">
                  "Manage your submitted reports."
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#6E6357] mt-3 group-hover:translate-x-1 transition-transform">
                  View submissions <ArrowRight className="w-3 h-3" />
                </span>
              </div>

            </div>
          </div>
        </section>
      ) : (
        /* Landing Page Hero (Section 2) */
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#FFFDF5] via-[#FAF6EC] to-[#FAF8F2] border border-[#EFE8D8] p-8 sm:p-14 text-center shadow-xs">
          
          {/* Subtle background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FEF9C3]/50 rounded-full blur-3xl pointer-events-none -z-0" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF08A] text-[#713F12] text-xs font-bold border border-[#FDE047] mb-6 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#CA8A04]" />
              Official Campus Belongings Network
            </span>

            <h1 className="text-4xl sm:text-6xl font-black text-[#27221E] font-heading tracking-tight leading-tight">
              Campus<span className="text-[#CA8A04]">Find</span>
            </h1>

            <p className="mt-3 text-xl sm:text-2xl font-bold text-[#4A4036] font-heading">
              “Find what you lost. Return what you found.”
            </p>

            <p className="mt-4 text-base sm:text-lg text-[#6B635B] max-w-xl mx-auto leading-relaxed">
              A simple and trusted way for students to report, search, and recover lost belongings around campus.
            </p>

            {/* Hero Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setActiveTab('report-lost')}
                className="px-6 py-3.5 rounded-2xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 transform active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                Report Lost Item
              </button>

              <button
                onClick={() => setActiveTab('report-found')}
                className="px-6 py-3.5 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 transform active:scale-95"
              >
                <ShieldCheck className="w-4 h-4" />
                Report Found Item
              </button>

              <button
                onClick={() => setActiveTab('browse')}
                className="px-6 py-3.5 rounded-2xl bg-[#FEF08A] hover:bg-[#FDE047] text-[#713F12] border border-[#FDE047] font-bold text-sm shadow-xs hover:shadow-md transition-all flex items-center gap-2 transform active:scale-95"
              >
                <Search className="w-4 h-4 text-[#854D0E]" />
                Browse Items
              </button>

              <button
                onClick={() => setIsChatbotOpen(true)}
                className="px-5 py-3.5 rounded-2xl bg-[#FFFDF9] hover:bg-[#FAF4E6] text-[#713F12] border border-[#E8DEC9] font-bold text-sm shadow-xs hover:shadow-md transition-all flex items-center gap-2 transform active:scale-95"
              >
                <Bot className="w-4 h-4 text-[#CA8A04]" />
                Ask n8n Assistant
              </button>
            </div>

            {/* Campus stats indicator */}
            <div className="mt-10 pt-6 border-t border-[#EFE8D8] grid grid-cols-3 gap-4 text-center max-w-lg mx-auto">
              <div>
                <p className="text-xl sm:text-2xl font-black text-[#27221E] font-heading">{items.length}</p>
                <p className="text-[11px] font-semibold text-[#857B72] uppercase tracking-wider">Reports Active</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-[#16A34A] font-heading">88%</p>
                <p className="text-[11px] font-semibold text-[#857B72] uppercase tracking-wider">Recovery Rate</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-[#CA8A04] font-heading">24 hrs</p>
                <p className="text-[11px] font-semibold text-[#857B72] uppercase tracking-wider">Avg Return Time</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Possible Matches Teaser (Section 4) */}
      {currentUser && possibleMatches.length > 0 && (
        <section className="bg-[#FFFDF5] border border-[#FDE047] rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#CA8A04]" />
                <h2 className="text-xl font-bold text-[#27221E] font-heading">
                  Possible Matches Detected for You
                </h2>
              </div>
              <p className="text-xs text-[#786F66] mt-1">
                Our smart matching engine identified items that look similar to your active reports.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('matches')}
              className="text-xs font-bold text-[#854D0E] hover:text-[#713F12] flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FEF9C3] hover:bg-[#FEF08A] transition-colors"
            >
              View All Match Comparisons
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {possibleMatches.map(item => (
              <ItemCard
                key={item.itemId}
                item={item}
                isPotentialMatch={true}
                matchScore={91}
                onViewDetails={(selected) => setSelectedItemId(selected.itemId)}
              />
            ))}
          </div>
        </section>
      )}

      {/* How It Works Section (Section 2) */}
      <section className="py-4">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#27221E] font-heading">
            How It Works
          </h2>
          <p className="text-xs sm:text-sm text-[#786F66] mt-1.5">
            Four easy steps designed to get lost belongings back into rightful hands safely.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-white border border-[#EFE8D8] shadow-xs relative">
            <span className="w-7 h-7 rounded-xl bg-[#FEF08A] text-[#713F12] font-black text-xs flex items-center justify-center mb-3">
              1
            </span>
            <h3 className="font-bold text-sm text-[#27221E]">1. Report</h3>
            <p className="text-xs text-[#6B635B] mt-1 leading-relaxed">
              Post details of your lost or found item. AI auto-categorizes and formats your description.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#EFE8D8] shadow-xs relative">
            <span className="w-7 h-7 rounded-xl bg-[#FEF08A] text-[#713F12] font-black text-xs flex items-center justify-center mb-3">
              2
            </span>
            <h3 className="font-bold text-sm text-[#27221E]">2. Search</h3>
            <p className="text-xs text-[#6B635B] mt-1 leading-relaxed">
              Browse campus listings filtered by category, campus building, date, or color.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#EFE8D8] shadow-xs relative">
            <span className="w-7 h-7 rounded-xl bg-[#FEF08A] text-[#713F12] font-black text-xs flex items-center justify-center mb-3">
              3
            </span>
            <h3 className="font-bold text-sm text-[#27221E]">3. Connect</h3>
            <p className="text-xs text-[#6B635B] mt-1 leading-relaxed">
              Submit a secure verification claim with unique identifiable features to the poster.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#EFE8D8] shadow-xs relative">
            <span className="w-7 h-7 rounded-xl bg-[#FEF08A] text-[#713F12] font-black text-xs flex items-center justify-center mb-3">
              4
            </span>
            <h3 className="font-bold text-sm text-[#27221E]">4. Recover</h3>
            <p className="text-xs text-[#6B635B] mt-1 leading-relaxed">
              Meet at a verified campus location (e.g. Library front desk) and mark the item resolved!
            </p>
          </div>

        </div>
      </section>

      {/* Recent Items Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#27221E] font-heading">
              Recently Reported Items
            </h2>
            <p className="text-xs text-[#786F66]">
              Browse the latest lost and found submissions across campus.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('browse')}
            className="text-xs font-bold text-[#854D0E] hover:text-[#713F12] flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF5EA] hover:bg-[#FEF9C3] transition-colors"
          >
            View All ({items.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentItems.map(item => (
            <ItemCard
              key={item.itemId}
              item={item}
              onViewDetails={(selected) => setSelectedItemId(selected.itemId)}
            />
          ))}
        </div>
      </section>

    </div>
  );
};
