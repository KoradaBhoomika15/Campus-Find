import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Message } from '../types';
import { 
  MessageSquare, 
  Send, 
  User as UserIcon, 
  ShieldCheck, 
  MapPin, 
  CheckCircle2,
  Clock
} from 'lucide-react';

export const MessagesView: React.FC = () => {
  const { currentUser, messages, sendChatMessage, allUsers, setAuthModalOpen, setSelectedItemId } = useApp();

  const [activePartnerId, setActivePartnerId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  if (!currentUser) {
    return (
      <div className="bg-white rounded-3xl p-10 border border-[#EFE8D8] text-center max-w-md mx-auto my-12">
        <h3 className="text-xl font-bold text-[#27221E] font-heading">
          Sign In to Access Messages
        </h3>
        <p className="text-xs text-[#786F66] mt-2 leading-relaxed">
          Log in with your college account to view item inquiries and coordinate handovers.
        </p>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="mt-6 px-6 py-2.5 rounded-2xl bg-[#FEF08A] hover:bg-[#FDE047] text-[#713F12] border border-[#FDE047] text-xs font-bold shadow-xs transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  // Get all conversation partners for current user
  const userMessages = messages.filter(
    m => m.senderId === currentUser.userId || m.receiverId === currentUser.userId
  );

  const partnerIds = Array.from(new Set(userMessages.map(m => 
    m.senderId === currentUser.userId ? m.receiverId : m.senderId
  )));

  const currentPartnerId = activePartnerId || partnerIds[0] || null;
  const currentPartner = allUsers.find(u => u.userId === currentPartnerId);

  // Messages in this active conversation
  const activeConversation = currentPartnerId
    ? userMessages.filter(
        m => (m.senderId === currentPartnerId && m.receiverId === currentUser.userId) ||
             (m.senderId === currentUser.userId && m.receiverId === currentPartnerId)
      ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    : [];

  const latestItemReferenced = activeConversation.find(m => m.itemId)?.itemId;
  const latestItemTitle = activeConversation.find(m => m.itemTitle)?.itemTitle;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !currentPartnerId) return;

    sendChatMessage(currentPartnerId, replyText.trim(), latestItemReferenced, latestItemTitle);
    setReplyText('');
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#27221E] font-heading">
          Campus Messages
        </h1>
        <p className="text-xs sm:text-sm text-[#786F66] mt-1">
          Coordinate verification and pickup directly with fellow students.
        </p>
      </div>

      {partnerIds.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-[#EFE8D8] text-center max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF6EC] text-[#854D0E] flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#27221E]">
            No messages yet
          </h3>
          <p className="text-xs text-[#786F66] mt-1">
            When you contact a user regarding a lost or found report, your conversation will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#EFE8D8] shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[500px]">
          
          {/* Conversation list sidebar */}
          <div className="border-r border-[#F4EFE6] bg-[#FFFDF9] p-3 space-y-2">
            <p className="text-[11px] font-bold text-[#857B72] uppercase tracking-wider px-3 py-1">
              Conversations ({partnerIds.length})
            </p>

            {partnerIds.map(pId => {
              const partnerUser = allUsers.find(u => u.userId === pId);
              const partnerMsgs = userMessages.filter(
                m => (m.senderId === pId && m.receiverId === currentUser.userId) ||
                     (m.senderId === currentUser.userId && m.receiverId === pId)
              );
              const lastMsg = partnerMsgs[partnerMsgs.length - 1];
              const isSelected = pId === currentPartnerId;

              return (
                <div
                  key={pId}
                  onClick={() => setActivePartnerId(pId)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-[#FEF9C3] border border-[#FDE047] shadow-xs'
                      : 'hover:bg-[#FAF6EC] border border-transparent'
                  }`}
                >
                  <img
                    src={partnerUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={partnerUser?.name || 'Student'}
                    className="w-10 h-10 rounded-xl object-cover border border-[#EFE8D8] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#27221E] truncate">
                        {partnerUser?.name || 'Student'}
                      </h4>
                      <span className="text-[10px] text-[#A3998E]">
                        {lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#786F66] truncate mt-0.5">
                      {lastMsg ? lastMsg.text : 'Start chatting...'}
                    </p>
                    {lastMsg?.itemTitle && (
                      <span className="inline-block mt-1 text-[10px] bg-white/80 px-1.5 py-0.2 rounded border border-[#EFE8D8] text-[#854D0E] truncate max-w-full">
                        Re: {lastMsg.itemTitle}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Chat Conversation pane */}
          <div className="md:col-span-2 flex flex-col justify-between bg-white">
            
            {/* Chat header */}
            <div className="p-4 border-b border-[#F4EFE6] flex items-center justify-between bg-[#FFFDF9]">
              <div className="flex items-center gap-3">
                <img
                  src={currentPartner?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={currentPartner?.name}
                  className="w-10 h-10 rounded-xl object-cover border border-[#EFE8D8]"
                />
                <div>
                  <h3 className="text-sm font-bold text-[#27221E]">
                    {currentPartner?.name || 'Fellow Student'}
                  </h3>
                  <p className="text-[11px] text-[#786F66]">
                    {currentPartner?.department} • {currentPartner?.year}
                  </p>
                </div>
              </div>

              {latestItemReferenced && (
                <button
                  onClick={() => setSelectedItemId(latestItemReferenced)}
                  className="text-xs text-[#854D0E] hover:underline font-bold bg-[#FAF6EC] px-3 py-1.5 rounded-xl border border-[#EFE8D8]"
                >
                  View Related Item ({latestItemReferenced})
                </button>
              )}
            </div>

            {/* Chat message bubbles */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[380px] space-y-3.5 flex-1">
              
              {/* Campus Safe Tip */}
              <div className="p-3 bg-[#FAF6EC] rounded-2xl border border-[#EFE8D8] text-[11px] text-[#786F66] flex items-center gap-2 max-w-md mx-auto">
                <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>Tip: Pick a public campus spot (e.g. Library Front Desk or Student Center) to inspect and return items.</span>
              </div>

              {activeConversation.map(msg => {
                const isMe = msg.senderId === currentUser.userId;

                return (
                  <div
                    key={msg.messageId}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-xs sm:max-w-md rounded-2xl p-3.5 text-xs leading-relaxed shadow-xs ${
                        isMe
                          ? 'bg-[#FEF08A] text-[#422006] rounded-br-xs border border-[#FDE047]'
                          : 'bg-[#FAF8F2] text-[#27221E] rounded-bl-xs border border-[#EFE8D8]'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>

                    <span className="text-[10px] text-[#A3998E] mt-1 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Message Reply Input */}
            <form onSubmit={handleSendReply} className="p-4 border-t border-[#F4EFE6] bg-[#FFFDF9] flex items-center gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Message ${currentPartner?.name || 'student'}...`}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#EFE8D8] focus:border-[#FDE047] focus:ring-2 focus:ring-[#FEF9C3] outline-none text-xs text-[#27221E] bg-white"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#FEF08A] hover:bg-[#FDE047] text-[#713F12] border border-[#FDE047] font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Send
              </button>
            </form>

          </div>

        </div>
      )}

    </div>
  );
};
