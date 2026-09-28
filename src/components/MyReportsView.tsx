import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Item, Claim, ItemStatus } from '../types';
import { 
  PlusCircle, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  Eye, 
  HandHelping, 
  ShieldCheck, 
  X, 
  Clock, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';

export const MyReportsView: React.FC = () => {
  const { 
    currentUser, 
    items, 
    claims, 
    deleteItem, 
    markItemStatus, 
    updateClaimStatus,
    updateItem,
    setSelectedItemId, 
    setActiveTab,
    setAuthModalOpen 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'lost' | 'found' | 'claims-received' | 'claims-sent'>('lost');

  // Edit modal state
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editLocation, setEditLocation] = useState('');

  // Claim response note state
  const [rejectingClaimId, setRejectingClaimId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  if (!currentUser) {
    return (
      <div className="bg-white rounded-3xl p-10 border border-[#EFE8D8] text-center max-w-md mx-auto my-12">
        <h3 className="text-xl font-bold text-[#27221E] font-heading">
          Sign In Required
        </h3>
        <p className="text-xs text-[#786F66] mt-2 leading-relaxed">
          Please log in with your college account to view and manage your submitted lost and found reports.
        </p>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="mt-6 px-6 py-2.5 rounded-2xl bg-[#FEF08A] hover:bg-[#FDE047] text-[#713F12] border border-[#FDE047] text-xs font-bold shadow-xs transition-colors"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const myLostItems = items.filter(i => i.userId === currentUser.userId && i.type === 'lost');
  const myFoundItems = items.filter(i => i.userId === currentUser.userId && i.type === 'found');
  
  // Claims received on items user posted
  const claimsReceived = claims.filter(c => c.postOwnerId === currentUser.userId);

  // Claims made by user
  const claimsSent = claims.filter(c => c.claimantId === currentUser.userId);

  const handleOpenEdit = (item: Item) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditDesc(item.description);
    setEditLocation(item.location);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    updateItem(editingItem.itemId, {
      name: editName.trim(),
      description: editDesc.trim(),
      location: editLocation.trim(),
    });
    setEditingItem(null);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#27221E] font-heading">
            My Reports &amp; Claims
          </h1>
          <p className="text-xs sm:text-sm text-[#786F66] mt-1">
            Track your submissions, respond to verification requests, and update item statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('report-lost')}
            className="px-3.5 py-2 rounded-xl bg-[#FEE2E2] hover:bg-[#FECACA] text-[#991B1B] text-xs font-bold border border-[#FECACA] transition-colors"
          >
            + Report Lost
          </button>
          <button
            onClick={() => setActiveTab('report-found')}
            className="px-3.5 py-2 rounded-xl bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#166534] text-xs font-bold border border-[#BBF7D0] transition-colors"
          >
            + Report Found
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#FAF6EC] rounded-2xl border border-[#EFE8D8]">
        <button
          onClick={() => setActiveSubTab('lost')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'lost'
              ? 'bg-white text-[#27221E] shadow-xs'
              : 'text-[#6B635B] hover:text-[#27221E]'
          }`}
        >
          Lost Items ({myLostItems.length})
        </button>

        <button
          onClick={() => setActiveSubTab('found')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'found'
              ? 'bg-white text-[#27221E] shadow-xs'
              : 'text-[#6B635B] hover:text-[#27221E]'
          }`}
        >
          Found Items ({myFoundItems.length})
        </button>

        <button
          onClick={() => setActiveSubTab('claims-received')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeSubTab === 'claims-received'
              ? 'bg-white text-[#27221E] shadow-xs'
              : 'text-[#6B635B] hover:text-[#27221E]'
          }`}
        >
          Claims Received ({claimsReceived.length})
          {claimsReceived.some(c => c.status === 'pending') && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('claims-sent')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'claims-sent'
              ? 'bg-white text-[#27221E] shadow-xs'
              : 'text-[#6B635B] hover:text-[#27221E]'
          }`}
        >
          Claims I Made ({claimsSent.length})
        </button>
      </div>

      {/* TAB 1 & 2: LOST & FOUND ITEMS */}
      {(activeSubTab === 'lost' || activeSubTab === 'found') && (
        <div>
          {((activeSubTab === 'lost' ? myLostItems : myFoundItems).length === 0) ? (
            <div className="bg-white rounded-3xl p-12 border border-[#EFE8D8] text-center max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-[#FAF6EC] text-[#854D0E] flex items-center justify-center mx-auto mb-3">
                <PlusCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#27221E]">
                No {activeSubTab === 'lost' ? 'lost' : 'found'} reports yet
              </h3>
              <p className="text-xs text-[#786F66] mt-1">
                You haven't submitted any {activeSubTab} item reports yet.
              </p>
              <button
                onClick={() => setActiveTab(activeSubTab === 'lost' ? 'report-lost' : 'report-found')}
                className="mt-4 px-5 py-2.5 rounded-xl bg-[#FEF08A] hover:bg-[#FDE047] text-xs font-bold text-[#713F12] border border-[#FDE047]"
              >
                Create {activeSubTab === 'lost' ? 'Lost' : 'Found'} Report
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(activeSubTab === 'lost' ? myLostItems : myFoundItems).map(item => (
                <div
                  key={item.itemId}
                  className="bg-white rounded-2xl border border-[#ECE5D8] hover:border-[#FDE047] p-4 sm:p-5 shadow-xs transition-all flex flex-col justify-between"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 rounded-xl object-cover bg-[#FAF6EC] shrink-0 border border-[#EFE8D8]"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          item.status === 'Active' 
                            ? 'bg-[#FEF9C3] text-[#713F12] border border-[#FEF08A]' 
                            : 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]'
                        }`}>
                          {item.status}
                        </span>
                        <span className="text-[10px] font-mono text-[#857B72]">
                          {item.itemId}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-[#27221E] mt-1.5 truncate">
                        {item.name}
                      </h3>

                      <p className="text-xs text-[#6B635B] mt-1 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="mt-2 flex items-center gap-3 text-[11px] text-[#857B72]">
                        <span className="flex items-center gap-1 truncate max-w-[120px]">
                          <MapPin className="w-3 h-3 text-[#B45309]" />
                          {item.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#A3998E]" />
                          {item.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-4 pt-3 border-t border-[#F4EFE6] flex flex-wrap items-center justify-between gap-2">
                    
                    {/* Status switcher */}
                    <div className="flex items-center gap-1.5">
                      {item.status !== 'Resolved' && (
                        <button
                          onClick={() => markItemStatus(item.itemId, 'Resolved')}
                          className="px-2.5 py-1 rounded-lg bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#166534] text-[11px] font-bold border border-[#BBF7D0] transition-colors"
                        >
                          ✓ Mark Resolved
                        </button>
                      )}
                      {item.type === 'found' && item.status === 'Active' && (
                        <button
                          onClick={() => markItemStatus(item.itemId, 'Returned')}
                          className="px-2.5 py-1 rounded-lg bg-[#FAF5EA] hover:bg-[#FEF9C3] text-[#713F12] text-[11px] font-bold border border-[#EFE8D8] transition-colors"
                        >
                          Mark Returned
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedItemId(item.itemId)}
                        className="p-1.5 text-[#5C5349] hover:bg-[#FAF6EC] rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-[#5C5349] hover:bg-[#FAF6EC] rounded-lg transition-colors"
                        title="Edit Report"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('Delete this report?')) {
                            deleteItem(item.itemId);
                          }
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CLAIMS RECEIVED (Verification Requests) */}
      {activeSubTab === 'claims-received' && (
        <div className="space-y-4">
          {claimsReceived.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-[#EFE8D8] text-center max-w-md mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-[#FAF6EC] text-[#854D0E] flex items-center justify-center mx-auto mb-3">
                <HandHelping className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#27221E]">
                No claims received yet
              </h3>
              <p className="text-xs text-[#786F66] mt-1">
                When students see your found items and claim ownership, their verification requests will appear here for your review.
              </p>
            </div>
          ) : (
            claimsReceived.map(claim => (
              <div
                key={claim.claimId}
                className="bg-white rounded-2xl border border-[#EFE8D8] p-5 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F4EFE6] pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#FAF6EC] text-[#713F12]">
                      Claim for: {claim.itemTitle} ({claim.itemId})
                    </span>
                    <h3 className="font-bold text-sm text-[#27221E] mt-1">
                      Submitted by {claim.claimantName} ({claim.claimantDepartment || 'Campus Student'})
                    </h3>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold self-start uppercase tracking-wider ${
                    claim.status === 'pending'
                      ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                      : claim.status === 'accepted'
                      ? 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {claim.status === 'pending' ? 'Pending Review' : claim.status}
                  </span>
                </div>

                {/* Claim verification questions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#FFFDF9] border border-[#F4EFE6]">
                    <span className="font-bold text-[#857B72] block uppercase tracking-wider text-[10px]">
                      Why they believe this is theirs:
                    </span>
                    <p className="text-[#27221E] mt-1 leading-relaxed">
                      "{claim.reason}"
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FFFDF9] border border-[#F4EFE6]">
                    <span className="font-bold text-[#857B72] block uppercase tracking-wider text-[10px]">
                      Unique Identifying Feature provided:
                    </span>
                    <p className="text-[#27221E] mt-1 leading-relaxed font-medium">
                      "{claim.uniqueFeature}"
                    </p>
                    {claim.contactNumber && (
                      <p className="text-[11px] text-[#854D0E] mt-2">
                        Contact phone: {claim.contactNumber}
                      </p>
                    )}
                  </div>
                </div>

                {claim.responseMessage && (
                  <div className="p-3 bg-[#FAF6EC] rounded-xl text-xs text-[#786F66]">
                    <span className="font-bold text-[#27221E]">Your Note:</span> {claim.responseMessage}
                  </div>
                )}

                {/* Accept / Reject actions */}
                {claim.status === 'pending' && (
                  <div className="pt-2 flex flex-wrap items-center justify-end gap-2.5">
                    <button
                      onClick={() => setRejectingClaimId(claim.claimId)}
                      className="px-4 py-1.5 rounded-xl border border-red-200 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Reject Claim
                    </button>
                    <button
                      onClick={() => updateClaimStatus(claim.claimId, 'accepted')}
                      className="px-4 py-1.5 rounded-xl bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#166534] border border-[#BBF7D0] text-xs font-bold transition-colors"
                    >
                      ✓ Accept &amp; Coordinate Handover
                    </button>
                  </div>
                )}

                {/* Reject note dialog */}
                {rejectingClaimId === claim.claimId && (
                  <div className="p-3.5 bg-red-50 rounded-xl border border-red-200 space-y-2">
                    <label className="block text-xs font-bold text-red-900">
                      Reason for declining (optional note to student):
                    </label>
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="e.g., Description does not match the actual sticker / model"
                      className="w-full px-3 py-1.5 rounded-lg border border-red-300 text-xs bg-white text-[#27221E]"
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setRejectingClaimId(null)}
                        className="px-3 py-1 text-xs text-stone-600 hover:underline"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          updateClaimStatus(claim.claimId, 'rejected', rejectReason);
                          setRejectingClaimId(null);
                          setRejectReason('');
                        }}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                )}

              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 4: CLAIMS I MADE */}
      {activeSubTab === 'claims-sent' && (
        <div className="space-y-4">
          {claimsSent.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-[#EFE8D8] text-center max-w-md mx-auto">
              <h3 className="text-base font-bold text-[#27221E]">
                No claims submitted
              </h3>
              <p className="text-xs text-[#786F66] mt-1">
                When you click "This Might Be Mine" on found items, your pending and verified requests will show up here.
              </p>
            </div>
          ) : (
            claimsSent.map(claim => (
              <div
                key={claim.claimId}
                className="bg-white rounded-2xl border border-[#EFE8D8] p-5 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-[#27221E]">
                      Claim for: {claim.itemTitle}
                    </h3>
                    <p className="text-xs text-[#786F66]">
                      Item ID: <span className="font-mono">{claim.itemId}</span> • Submitted {new Date(claim.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold self-start uppercase tracking-wider ${
                    claim.status === 'pending'
                      ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                      : claim.status === 'accepted'
                      ? 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {claim.status === 'pending' ? 'Awaiting Finder Approval' : claim.status}
                  </span>
                </div>

                <div className="p-3 bg-[#FAF6EC] rounded-xl text-xs space-y-1">
                  <p className="text-[#6B635B]">
                    <strong className="text-[#27221E]">Your Verification Proof:</strong> {claim.uniqueFeature}
                  </p>
                  {claim.responseMessage && (
                    <p className="text-[#854D0E] font-medium pt-1 border-t border-[#EFE8D8] mt-1">
                      Poster note: "{claim.responseMessage}"
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setSelectedItemId(claim.itemId)}
                    className="px-3.5 py-1.5 rounded-xl border border-[#EFE8D8] text-xs font-bold text-[#5C5349] hover:bg-[#FAF6EC]"
                  >
                    View Original Item
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-[#EFE8D8] shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#27221E] font-heading">
                Edit Report ({editingItem.itemId})
              </h3>
              <button onClick={() => setEditingItem(null)} className="p-1 text-[#857B72] hover:text-[#27221E]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#27221E] mb-1">Item Title</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EFE8D8] text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#27221E] mb-1">Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EFE8D8] text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#27221E] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EFE8D8] text-xs"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl border border-[#EFE8D8] text-xs font-bold text-[#5C5349]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FEF08A] hover:bg-[#FDE047] text-[#713F12] border border-[#FDE047] text-xs font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
