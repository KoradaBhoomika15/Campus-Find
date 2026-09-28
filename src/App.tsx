/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BrowsePage } from './components/BrowsePage';
import { ReportForm } from './components/ReportForm';
import { MyReportsView } from './components/MyReportsView';
import { AIMatchesView } from './components/AIMatchesView';
import { MessagesView } from './components/MessagesView';
import { ProfileView } from './components/ProfileView';
import { ItemDetailsModal } from './components/ItemDetailsModal';
import { ClaimModal } from './components/ClaimModal';
import { ContactModal } from './components/ContactModal';
import { AuthModal } from './components/AuthModal';
import { BottomNav } from './components/BottomNav';
import { ShieldCheck, Heart, Sparkles, MapPin, Phone } from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    selectedItemId, 
    setSelectedItemId, 
    claimModalItemId, 
    setClaimModalItemId, 
    contactModalItemId, 
    setContactModalItemId 
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F2] text-[#27221E] selection:bg-[#FEF08A] selection:text-[#713F12]">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 md:pb-12">
        {activeTab === 'home' && <HeroSection />}
        
        {activeTab === 'browse' && <BrowsePage />}
        
        {activeTab === 'report-lost' && (
          <ReportForm
            type="lost"
            onCancel={() => setActiveTab('home')}
            onSuccess={() => {}}
          />
        )}
        
        {activeTab === 'report-found' && (
          <ReportForm
            type="found"
            onCancel={() => setActiveTab('home')}
            onSuccess={() => {}}
          />
        )}
        
        {activeTab === 'my-reports' && <MyReportsView />}
        
        {activeTab === 'matches' && <AIMatchesView />}
        
        {activeTab === 'messages' && <MessagesView />}
        
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Modals */}
      {selectedItemId && (
        <ItemDetailsModal
          itemId={selectedItemId}
          onClose={() => setSelectedItemId(null)}
        />
      )}

      {claimModalItemId && (
        <ClaimModal
          itemId={claimModalItemId}
          onClose={() => setClaimModalItemId(null)}
        />
      )}

      {contactModalItemId && (
        <ContactModal
          itemId={contactModalItemId}
          onClose={() => setContactModalItemId(null)}
        />
      )}

      <AuthModal />

      {/* Bottom mobile navigation */}
      <BottomNav />

      {/* Footer */}
      <footer className="hidden md:block bg-[#FFFDF9] border-t border-[#EFE8D8] py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FEF08A] border border-[#FDE047] flex items-center justify-center font-bold text-xs text-[#372F24]">
                CF
              </div>
              <div>
                <p className="text-xs font-bold text-[#27221E]">
                  CampusFind – College Lost &amp; Found
                </p>
                <p className="text-[11px] text-[#786F66]">
                  “Find what you lost. Return what you found.”
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-[#786F66]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                Campus Safety Protocol Verified
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#B45309]" />
                Main Drop-off: Library Front Desk
              </span>
            </div>

            <p className="text-[11px] text-[#A3998E]">
              Built for campus students • {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
