import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Item, ItemStatus } from '../types';
import { 
  X, 
  MapPin, 
  Calendar, 
  Tag, 
  ShieldCheck, 
  User as UserIcon, 
  MessageSquare, 
  HandHelping, 
  CheckCircle2, 
  Trash2, 
  AlertCircle,
  Sparkles,
  Share2,
  Lock
} from 'lucide-react';

interface ItemDetailsModalProps {
  itemId: string;
  onClose: () => void;
}

export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({ itemId, onClose }) => {
  const { 
    items, 
    currentUser, 
    markItemStatus, 
    deleteItem, 
    setClaimModalItemId, 
    setContactModalItemId, 
    setAuthModalOpen,
    setActiveTab,
    claims
  } = useApp();

  const item = items.find(i => i.itemId === itemId);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!item) return null;

  const isOwner = currentUser && currentUser.userId === item.userId;
  const isLost = item.type === 'lost';

  // Check if current user already submitted a claim for this item
  const existingClaim = currentUser ? claims.find(c => c.itemId === item.itemId && c.claimantId === currentUser.userId) : null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleClaimClick = () => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    setClaimModalItemId(item.itemId);
  };

  const handleContactClick = () => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    setContactModalItemId(item.itemId);
  };

  const handleStatusChange = (newStatus: ItemStatus) => {
    markItemStatus(item.itemId, newStatus);
    setStatusMenuOpen(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to remove this campus report? This cannot be undone.')) {
      deleteItem(item.itemId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full border border-[#EFE8D8] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-150 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 text-[#372F24] hover:bg-white shadow-md transition-all cursor-pointer"
          title="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero image with status overlay */}
        <div className="relative h-64 sm:h-80 bg-[#FAF6EC] overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=600&q=80';
            }}
          />

          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-xl text-xs font-bold shadow-md uppercase tracking-wider ${
              isLost 
                ? 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]' 
                : 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]'
            }`}>
              {isLost ? 'Lost Item' : 'Found Item'}
            </span>

            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-[#FEF9C3] text-[#713F12] border border-[#FEF08A] shadow-md">
              Status: {item.status}
            </span>
          </div>

          <div className="absolute bottom-3 right-3">
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-black/60 text-white backdrop-blur-xs">
              ID: {item.itemId}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Header Title & Tags */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#FAF5EA] text-[#6E6357] border border-[#EFE8D8]">
                {item.category}
              </span>
              {item.color && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#FAF5EA] text-[#6E6357] border border-[#EFE8D8]">
                  Color: {item.color}
                </span>
              )}
              {item.brand && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#FAF5EA] text-[#6E6357] border border-[#EFE8D8]">
                  Brand: {item.brand}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#27221E] font-heading">
              {item.name}
            </h2>
          </div>

          {/* Description */}
          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#F4EFE6]">
            <h4 className="text-xs font-bold text-[#857B72] uppercase tracking-wider mb-1">
              Description
            </h4>
            <p className="text-sm text-[#372F24] leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
            {item.additionalDetails && (
              <div className="mt-3 pt-3 border-t border-[#F4EFE6]">
                <p className="text-xs font-semibold text-[#854D0E]">
                  Identifying Notes:
                </p>
                <p className="text-xs text-[#6B635B] mt-0.5">
                  {item.additionalDetails}
                </p>
              </div>
            )}
          </div>

          {/* Location & Dates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#FAF6EC] border border-[#EFE8D8] flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#27221E] block">
                  {isLost ? 'Misplaced At' : 'Discovered At'}
                </span>
                <span className="text-[#6B635B] font-medium block">
                  {item.location}
                </span>
                {item.specificLocation && (
                  <span className="text-[11px] text-[#857B72] block mt-0.5">
                    ({item.specificLocation})
                  </span>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF6EC] border border-[#EFE8D8] flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#27221E] block">
                  {isLost ? 'Date Lost' : 'Date Found'}
                </span>
                <span className="text-[#6B635B] font-medium block">
                  {item.date}
                </span>
                <span className="text-[11px] text-[#857B72] block mt-0.5">
                  Reported {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Safe Poster Information */}
          <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#EFE8D8] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FEF08A] text-[#713F12] flex items-center justify-center font-bold text-sm border border-[#FDE047]">
                {item.userName.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-[#27221E]">
                  Posted by {isOwner ? `${item.userName} (You)` : item.userName}
                </p>
                <p className="text-[11px] text-[#786F66]">
                  {item.userDepartment || 'Campus Student'} • Verified College Member
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[#857B72]">
              <Lock className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Contact Protected</span>
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="pt-2 border-t border-[#F4EFE6] flex flex-wrap items-center justify-between gap-3">
            
            {/* Share / Copy reference */}
            <button
              onClick={handleShare}
              className="px-3.5 py-2 rounded-xl border border-[#EFE8D8] text-xs font-semibold text-[#6B635B] hover:bg-[#FAF6EC] transition-colors flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copiedLink ? 'Link Copied!' : 'Share'}
            </button>

            {/* If Owner: Status & Delete controls */}
            {isOwner ? (
              <div className="flex items-center gap-2">
                
                {/* Resolve status dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setStatusMenuOpen(!statusMenuOpen)}
                    className="px-4 py-2 rounded-xl bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#166534] border border-[#BBF7D0] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Mark Status ({item.status})
                  </button>

                  {statusMenuOpen && (
                    <div className="absolute right-0 bottom-full mb-2 w-44 bg-white rounded-xl shadow-xl border border-[#EFE8D8] py-1.5 z-20">
                      <button
                        onClick={() => handleStatusChange('Active')}
                        className="w-full text-left px-3 py-1.5 text-xs text-[#27221E] hover:bg-[#FAF6EC]"
                      >
                        Set to Active
                      </button>
                      {isLost ? (
                        <>
                          <button
                            onClick={() => handleStatusChange('Found')}
                            className="w-full text-left px-3 py-1.5 text-xs text-[#166534] hover:bg-emerald-50 font-medium"
                          >
                            Mark as Found
                          </button>
                          <button
                            onClick={() => handleStatusChange('Resolved')}
                            className="w-full text-left px-3 py-1.5 text-xs text-[#166534] hover:bg-emerald-50 font-bold"
                          >
                            Mark as Resolved
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStatusChange('Claimed')}
                            className="w-full text-left px-3 py-1.5 text-xs text-[#B45309] hover:bg-amber-50 font-medium"
                          >
                            Mark as Claimed
                          </button>
                          <button
                            onClick={() => handleStatusChange('Returned')}
                            className="w-full text-left px-3 py-1.5 text-xs text-[#166534] hover:bg-emerald-50 font-bold"
                          >
                            Mark as Returned
                          </button>
                          <button
                            onClick={() => handleStatusChange('Resolved')}
                            className="w-full text-left px-3 py-1.5 text-xs text-[#166534] hover:bg-emerald-50 font-bold"
                          >
                            Mark as Resolved
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleDelete}
                  className="p-2 rounded-xl text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                  title="Delete this report"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* If NOT owner: Claim & Contact Buttons */
              <div className="flex flex-wrap items-center gap-2.5">
                
                {/* Found Item Flow -> "This Might Be Mine" */}
                {!isLost && (
                  <button
                    onClick={handleClaimClick}
                    disabled={item.status === 'Resolved' || item.status === 'Returned'}
                    className="px-4 py-2.5 rounded-xl bg-[#FEF08A] hover:bg-[#FDE047] text-[#713F12] border border-[#FDE047] text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <HandHelping className="w-4 h-4 text-[#854D0E]" />
                    {existingClaim ? 'Claim Submitted (Pending)' : 'This Might Be Mine'}
                  </button>
                )}

                {/* Lost Item Flow -> "I Found This Item" */}
                {isLost && (
                  <button
                    onClick={handleContactClick}
                    disabled={item.status === 'Resolved'}
                    className="px-4 py-2.5 rounded-xl bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#166534] border border-[#BBF7D0] text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#166534]" />
                    I Found This Item
                  </button>
                )}

                {/* Contact User Button */}
                <button
                  onClick={handleContactClick}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF6EC] text-[#27221E] border border-[#EFE8D8] text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-[#854D0E]" />
                  Contact User
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
