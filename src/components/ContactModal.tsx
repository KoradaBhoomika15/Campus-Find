import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, MessageSquare, Send, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

interface ContactModalProps {
  itemId: string;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ itemId, onClose }) => {
  const { items, sendChatMessage, currentUser, setActiveTab } = useApp();

  const item = items.find(i => i.itemId === itemId);

  const defaultMsg = item?.type === 'lost'
    ? `Hi ${item?.userName}, I believe I found your lost ${item?.name} around campus! Let's arrange a safe handover.`
    : `Hi ${item?.userName}, regarding the ${item?.name} you found: I think it might belong to me.`;

  const [messageText, setMessageText] = useState(defaultMsg);
  const [sent, setSent] = useState(false);

  if (!item || !currentUser) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    sendChatMessage(item.userId, messageText.trim(), item.itemId, item.name);
    setSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full border border-[#EFE8D8] shadow-2xl p-6 sm:p-8 relative animate-in zoom-in-95 duration-150 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#786F66] hover:bg-[#FAF6EC] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {sent ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#DCFCE7] text-[#166534] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#27221E] font-heading">
              Message Delivered!
            </h3>
            <p className="text-xs text-[#6B635B] max-w-sm mx-auto leading-relaxed">
              Your message was sent to <strong>{item.userName}</strong>. You can view all replies in the Messages tab.
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => {
                  onClose();
                  setActiveTab('messages');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#FEF08A] hover:bg-[#FDE047] text-[#713F12] border border-[#FDE047] text-xs font-bold transition-colors cursor-pointer"
              >
                Go to Messages
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#EFE8D8] text-xs font-bold text-[#5C5349] hover:bg-[#FAF6EC] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FEF9C3] text-[#713F12] flex items-center justify-center border border-[#FEF08A] shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-[#27221E] font-heading">
                  Contact {item.userName}
                </h3>
                <p className="text-xs text-[#786F66]">
                  Regarding: <span className="font-bold text-[#27221E]">{item.name}</span> ({item.itemId})
                </p>
              </div>
            </div>

            {/* Safety guidelines banner */}
            <div className="mb-4 p-3 bg-[#FAF6EC] rounded-2xl border border-[#EFE8D8] text-[11px] text-[#6B635B] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
              <span>
                <strong>Campus Safe Exchange Tip:</strong> Agree to meet in public campus zones like the Library Front Desk, Student Center, or Campus Security Office.
              </span>
            </div>

            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#27221E] uppercase tracking-wider mb-1.5">
                  Your Message
                </label>
                <textarea
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message to coordinate..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EFE8D8] focus:border-[#FDE047] focus:ring-2 focus:ring-[#FEF9C3] outline-none text-xs text-[#27221E] bg-[#FFFDF9]"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-[#EFE8D8] text-xs font-bold text-[#5C5349] hover:bg-[#FAF6EC] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#FEF08A] hover:bg-[#FDE047] text-[#713F12] border border-[#FDE047] text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send Message
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
