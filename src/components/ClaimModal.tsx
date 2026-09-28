import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, HandHelping, ShieldAlert, CheckCircle2, Lock, AlertCircle } from 'lucide-react';

interface ClaimModalProps {
  itemId: string;
  onClose: () => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({ itemId, onClose }) => {
  const { items, submitClaim, currentUser } = useApp();

  const item = items.find(i => i.itemId === itemId);

  const [reason, setReason] = useState('');
  const [uniqueFeature, setUniqueFeature] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!reason.trim()) {
      setErrorMessage('Please state why you believe this item is yours.');
      return;
    }

    if (!uniqueFeature.trim()) {
      setErrorMessage('Please describe at least one unique identifying feature.');
      return;
    }

    setIsSubmitting(true);

    try {
      submitClaim({
        itemId: item.itemId,
        reason: reason.trim(),
        uniqueFeature: uniqueFeature.trim(),
        contactNumber: contactNumber.trim() || undefined,
      });
      setSuccess(true);
    } catch (err) {
      setErrorMessage('Failed to submit claim request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full border border-[#EFE8D8] p-8 text-center shadow-xl animate-in zoom-in-95 duration-150">
          <div className="w-16 h-16 rounded-2xl bg-[#DCFCE7] text-[#166534] flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-extrabold text-[#27221E] font-heading">
            Claim Request Sent!
          </h3>

          <p className="text-xs text-[#6B635B] mt-2 leading-relaxed">
            Your verification claim for <strong>"{item.name}"</strong> has been sent to <strong>{item.userName}</strong>.
          </p>

          <div className="mt-4 p-3.5 bg-[#FAF6EC] rounded-2xl border border-[#EFE8D8] text-[11px] text-[#786F66] text-left space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#854D0E]">
              <ShieldAlert className="w-3.5 h-3.5" />
              What happens next?
            </div>
            <p>
              The person who found the item will manually review your identifying feature. Once accepted, you can coordinate safe pickup on campus.
            </p>
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full py-3 rounded-2xl bg-[#FEF08A] hover:bg-[#FDE047] text-[#713F12] border border-[#FDE047] font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full border border-[#EFE8D8] shadow-2xl p-6 sm:p-8 relative animate-in zoom-in-95 duration-150 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#786F66] hover:bg-[#FAF6EC] transition-colors cursor-pointer"
          title="Cancel"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#FEF08A] text-[#713F12] flex items-center justify-center border border-[#FDE047] shadow-xs shrink-0">
            <HandHelping className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#27221E] font-heading">
              This Might Be Mine
            </h3>
            <p className="text-xs text-[#786F66] mt-0.5">
              Submit a verification claim for "{item.name}"
            </p>
          </div>
        </div>

        {/* Safety Note per Requirement 10 */}
        <div className="mb-5 p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#FDE047] text-xs text-[#713F12] flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-[#CA8A04] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Manual Verification Required:</span> Ownership is not automatically declared. The finder ({item.userName}) must review your identifying details before accepting.
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Question 1: Why do you think this is your item? */}
          <div>
            <label className="block text-xs font-bold text-[#27221E] uppercase tracking-wider mb-1.5">
              Why do you think this is your item? <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., I misplaced my wallet yesterday at the Sports Ground bleachers after basketball practice."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EFE8D8] focus:border-[#FDE047] focus:ring-2 focus:ring-[#FEF9C3] outline-none text-xs text-[#27221E] placeholder:text-[#A3998E] bg-[#FFFDF9]"
              required
            />
          </div>

          {/* Question 2: Describe one unique identifying feature */}
          <div>
            <label className="block text-xs font-bold text-[#27221E] uppercase tracking-wider mb-1.5">
              Describe one unique identifying feature <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={uniqueFeature}
              onChange={(e) => setUniqueFeature(e.target.value)}
              placeholder="e.g., A scratch near the camera lens, specific stickers on the case, student ID card inside with my name, or wallpaper description."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EFE8D8] focus:border-[#FDE047] focus:ring-2 focus:ring-[#FEF9C3] outline-none text-xs text-[#27221E] placeholder:text-[#A3998E] bg-[#FFFDF9]"
              required
            />
            <p className="text-[11px] text-[#857B72] mt-1">
              Do not share secret PINs, bank passwords, or sensitive credentials.
            </p>
          </div>

          {/* Optional contact number */}
          <div>
            <label className="block text-xs font-bold text-[#27221E] uppercase tracking-wider mb-1.5">
              Contact Phone / WhatsApp <span className="text-[#857B72] font-normal lowercase">(optional)</span>
            </label>
            <input
              type="tel"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-3.5 py-2 rounded-xl border border-[#EFE8D8] focus:border-[#FDE047] focus:ring-2 focus:ring-[#FEF9C3] outline-none text-xs text-[#27221E] placeholder:text-[#A3998E] bg-[#FFFDF9]"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#F4EFE6] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#EFE8D8] text-xs font-bold text-[#5C5349] hover:bg-[#FAF6EC] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#FEF08A] hover:bg-[#FDE047] text-[#713F12] border border-[#FDE047] text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <HandHelping className="w-3.5 h-3.5" />
              {isSubmitting ? 'Sending Request...' : 'Send Claim Request'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
