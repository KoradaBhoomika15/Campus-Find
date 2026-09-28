import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  PlusCircle, 
  Sparkles, 
  MessageSquare, 
  Bell, 
  User as UserIcon, 
  Menu, 
  X, 
  CheckCircle2, 
  Layers,
  LogOut,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    activeTab, 
    setActiveTab, 
    notifications, 
    markNotificationAsRead,
    markAllNotificationsRead,
    setSelectedItemId,
    setAuthModalOpen,
    setAuthModalMode,
    logout,
    messages,
    setIsChatbotOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => currentUser && n.userId === currentUser.userId && !n.read);
  const unreadCount = unreadNotifs.length;

  const userMessages = messages.filter(m => currentUser && m.receiverId === currentUser.userId);

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/90 backdrop-blur-md border-b border-[#EFE8D8] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => { setActiveTab('home'); setSelectedItemId(null); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FEF08A] border border-[#FDE047] flex items-center justify-center text-[#372F24] shadow-xs group-hover:scale-105 transition-transform">
              <span className="text-xl font-bold font-heading">CF</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-[#2B241D] font-heading">
                  Campus<span className="text-[#CA8A04]">Find</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-[#FEF9C3] text-[#854D0E] border border-[#FEF08A]">
                  College Portal
                </span>
              </div>
              <p className="text-[11px] text-[#786F66] hidden sm:block font-medium">
                Find what you lost. Return what you found.
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => { setActiveTab('home'); setSelectedItemId(null); }}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'home'
                  ? 'bg-[#FEF9C3] text-[#713F12] font-semibold shadow-xs'
                  : 'text-[#5C5349] hover:text-[#2B241D] hover:bg-[#FAF4E6]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => { setActiveTab('browse'); setSelectedItemId(null); }}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'browse'
                  ? 'bg-[#FEF9C3] text-[#713F12] font-semibold shadow-xs'
                  : 'text-[#5C5349] hover:text-[#2B241D] hover:bg-[#FAF4E6]'
              }`}
            >
              <Search className="w-4 h-4 text-[#854D0E]" />
              Browse
            </button>
            <button
              onClick={() => { setActiveTab('report-lost'); setSelectedItemId(null); }}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'report-lost'
                  ? 'bg-[#FEE2E2] text-[#991B1B] font-semibold shadow-xs'
                  : 'text-[#5C5349] hover:text-[#2B241D] hover:bg-[#FAF4E6]'
              }`}
            >
              Report Lost
            </button>
            <button
              onClick={() => { setActiveTab('report-found'); setSelectedItemId(null); }}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'report-found'
                  ? 'bg-[#DCFCE7] text-[#166534] font-semibold shadow-xs'
                  : 'text-[#5C5349] hover:text-[#2B241D] hover:bg-[#FAF4E6]'
              }`}
            >
              Report Found
            </button>
            <button
              onClick={() => { setActiveTab('my-reports'); setSelectedItemId(null); }}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'my-reports'
                  ? 'bg-[#FEF9C3] text-[#713F12] font-semibold shadow-xs'
                  : 'text-[#5C5349] hover:text-[#2B241D] hover:bg-[#FAF4E6]'
              }`}
            >
              My Reports
            </button>
            <button
              onClick={() => { setActiveTab('matches'); setSelectedItemId(null); }}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'matches'
                  ? 'bg-[#FEF08A] text-[#713F12] font-semibold shadow-xs'
                  : 'text-[#5C5349] hover:text-[#2B241D] hover:bg-[#FAF4E6]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#CA8A04] animate-pulse" />
              Matches
            </button>
            <button
              onClick={() => { setActiveTab('messages'); setSelectedItemId(null); }}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'messages'
                  ? 'bg-[#FEF9C3] text-[#713F12] font-semibold shadow-xs'
                  : 'text-[#5C5349] hover:text-[#2B241D] hover:bg-[#FAF4E6]'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-[#854D0E]" />
              Messages
            </button>
            <button
              onClick={() => setIsChatbotOpen(true)}
              className="px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 bg-[#FEF08A]/70 hover:bg-[#FEF08A] text-[#713F12] border border-[#FDE047] shadow-2xs"
              title="Open n8n Campus Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B45309]" />
              AI Assistant
            </button>
          </nav>

          {/* Right actions: Notifications & User Profile */}
          <div className="flex items-center gap-2">
            
            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 rounded-xl text-[#5C5349] hover:text-[#2B241D] hover:bg-[#FAF4E6] relative transition-colors"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#EF4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#EFE8D8] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-[#F4EFE6] flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#2B241D]">Notifications</h4>
                      <p className="text-[11px] text-[#857B72]">Updates regarding your reports & claims</p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-[#854D0E] hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto divide-y divide-[#F8F5EE]">
                    {notifications.filter(n => currentUser && n.userId === currentUser.userId).length === 0 ? (
                      <div className="py-8 text-center text-[#857B72] text-xs">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications
                        .filter(n => currentUser && n.userId === currentUser.userId)
                        .map(n => (
                          <div
                            key={n.notificationId}
                            onClick={() => {
                              markNotificationAsRead(n.notificationId);
                              if (n.itemId) {
                                setSelectedItemId(n.itemId);
                                setActiveTab('browse');
                              } else if (n.type === 'message_received') {
                                setActiveTab('messages');
                              } else if (n.claimId) {
                                setActiveTab('my-reports');
                              }
                              setNotifDropdownOpen(false);
                            }}
                            className={`p-3 hover:bg-[#FAF7EE] cursor-pointer transition-colors flex items-start gap-2.5 ${
                              !n.read ? 'bg-[#FFFDF5]' : ''
                            }`}
                          >
                            <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${!n.read ? 'bg-[#EAB308]' : 'bg-transparent'}`} />
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-[#2B241D] leading-tight">{n.title}</p>
                              <p className="text-xs text-[#6B635B] mt-0.5 leading-normal">{n.message}</p>
                              <span className="text-[10px] text-[#A3998E] mt-1 block">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Auth State */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl border border-[#EFE8D8] bg-[#FFFBEB] hover:bg-[#FEF9C3] transition-colors"
                >
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-[#2B241D] truncate max-w-[110px]">{currentUser.name}</p>
                    <p className="text-[10px] text-[#854D0E] font-medium truncate max-w-[110px]">{currentUser.department}</p>
                  </div>
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-lg object-cover border border-[#FDE047]"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-[#857B72]" />
                </button>

                {/* User menu dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#EFE8D8] py-2 z-50">
                    <div className="px-4 py-2 border-b border-[#F4EFE6]">
                      <p className="text-xs font-bold text-[#2B241D]">{currentUser.name}</p>
                      <p className="text-[11px] text-[#786F66] truncate">{currentUser.email}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-[10px] bg-[#FEF9C3] text-[#713F12] px-1.5 py-0.5 rounded font-medium">
                          {currentUser.year}
                        </span>
                        <span className="text-[10px] text-[#857B72]">
                          {currentUser.department}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => { setActiveTab('profile'); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-[#372F24] hover:bg-[#FAF7EE] flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-[#854D0E]" />
                      My Student Profile
                    </button>
                    <button
                      onClick={() => { setActiveTab('my-reports'); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-[#372F24] hover:bg-[#FAF7EE] flex items-center gap-2"
                    >
                      <Layers className="w-4 h-4 text-[#854D0E]" />
                      Manage My Reports
                    </button>
                    <div className="border-t border-[#F4EFE6] my-1" />
                    <button
                      onClick={() => { logout(); setUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setAuthModalMode('login'); setAuthModalOpen(true); }}
                  className="px-3 py-1.5 text-xs font-semibold text-[#5C5349] hover:text-[#2B241D] hover:bg-[#FAF4E6] rounded-lg transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => { setAuthModalMode('signup'); setAuthModalOpen(true); }}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-[#FEF08A] hover:bg-[#FDE047] text-[#713F12] border border-[#FDE047] rounded-xl shadow-xs transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-lg text-[#5C5349] hover:bg-[#FAF4E6]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#EFE8D8] bg-[#FFFDF9] px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <button
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); setSelectedItemId(null); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'home' ? 'bg-[#FEF9C3] text-[#713F12]' : 'text-[#5C5349]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => { setActiveTab('browse'); setMobileMenuOpen(false); setSelectedItemId(null); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'browse' ? 'bg-[#FEF9C3] text-[#713F12]' : 'text-[#5C5349]'
            }`}
          >
            Browse Lost &amp; Found
          </button>
          <button
            onClick={() => { setActiveTab('report-lost'); setMobileMenuOpen(false); setSelectedItemId(null); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'report-lost' ? 'bg-[#FEE2E2] text-[#991B1B]' : 'text-[#5C5349]'
            }`}
          >
            Report Lost Item
          </button>
          <button
            onClick={() => { setActiveTab('report-found'); setMobileMenuOpen(false); setSelectedItemId(null); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'report-found' ? 'bg-[#DCFCE7] text-[#166534]' : 'text-[#5C5349]'
            }`}
          >
            Report Found Item
          </button>
          <button
            onClick={() => { setActiveTab('my-reports'); setMobileMenuOpen(false); setSelectedItemId(null); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'my-reports' ? 'bg-[#FEF9C3] text-[#713F12]' : 'text-[#5C5349]'
            }`}
          >
            My Reports
          </button>
          <button
            onClick={() => { setActiveTab('matches'); setMobileMenuOpen(false); setSelectedItemId(null); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
              activeTab === 'matches' ? 'bg-[#FEF08A] text-[#713F12]' : 'text-[#5C5349]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#CA8A04]" />
              AI Matches
            </span>
            <span className="text-[10px] bg-[#FEF9C3] text-[#713F12] px-2 py-0.5 rounded-full font-bold">New</span>
          </button>
          <button
            onClick={() => { setActiveTab('messages'); setMobileMenuOpen(false); setSelectedItemId(null); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'messages' ? 'bg-[#FEF9C3] text-[#713F12]' : 'text-[#5C5349]'
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => { setIsChatbotOpen(true); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-[#713F12] bg-[#FEF08A]/70 flex items-center justify-between"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#B45309]" />
              AI Assistant (n8n)
            </span>
            <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">Online</span>
          </button>
          <button
            onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); setSelectedItemId(null); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'profile' ? 'bg-[#FEF9C3] text-[#713F12]' : 'text-[#5C5349]'
            }`}
          >
            Profile &amp; Settings
          </button>
        </div>
      )}
    </header>
  );
};
