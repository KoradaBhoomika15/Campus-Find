import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ItemType, Category, CampusLocation } from '../types';
import { PRESET_IMAGES } from '../data/mockData';
import { aiCategorizeItem, aiEnhanceDescription } from '../services/aiService';
import { 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Tag, 
  AlertCircle,
  HelpCircle,
  Image as ImageIcon,
  ArrowLeft,
  Loader2
} from 'lucide-react';

interface ReportFormProps {
  type: ItemType;
  onCancel?: () => void;
  onSuccess?: (itemId: string) => void;
}

const CATEGORIES: Category[] = [
  'Electronics',
  'Bags',
  'Wallets',
  'ID Cards',
  'Keys',
  'Books',
  'Clothing',
  'Accessories',
  'Other',
];

const LOCATIONS: CampusLocation[] = [
  'Library',
  'Cafeteria',
  'Hostel',
  'Classroom',
  'Laboratory',
  'Parking',
  'Auditorium',
  'Sports Ground',
  'Main Gate',
  'Student Center',
  'Other',
];

export const ReportForm: React.FC<ReportFormProps> = ({ type, onCancel, onSuccess }) => {
  const { addItem, currentUser, setAuthModalOpen } = useApp();

  const isLost = type === 'lost';

  // Form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('Electronics');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const [brand, setBrand] = useState('');
  const [location, setLocation] = useState<CampusLocation>('Library');
  const [specificLocation, setSpecificLocation] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [additionalDetails, setAdditionalDetails] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedItemId, setSubmittedItemId] = useState<string | null>(null);
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [isEnhancingDesc, setIsEnhancingDesc] = useState(false);
  const [aiNotice, setAiNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Trigger AI auto-categorization
  const handleAutoCategorize = async () => {
    if (!name.trim()) {
      setErrorMessage('Please enter an item name or quick phrase first (e.g. "black samsung phone" or "blue hydro flask")');
      return;
    }
    setErrorMessage(null);
    setIsCategorizing(true);
    setAiNotice(null);

    try {
      const result = await aiCategorizeItem(name);
      if (result.category && CATEGORIES.includes(result.category as Category)) {
        setCategory(result.category as Category);
      }
      if (result.color && !color) {
        setColor(result.color);
      }
      if (result.brand && !brand) {
        setBrand(result.brand);
      }
      if (result.suggestedName) {
        setName(result.suggestedName);
      }
      setAiNotice('✨ AI auto-suggested Category, Brand, and Color! You can modify any field before submitting.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsCategorizing(false);
    }
  };

  // Trigger AI description polish
  const handleEnhanceDescription = async () => {
    if (!name.trim()) {
      setErrorMessage('Please enter an item name first');
      return;
    }
    setErrorMessage(null);
    setIsEnhancingDesc(true);

    try {
      const enhanced = await aiEnhanceDescription(name, category, description, type);
      setDescription(enhanced);
      setAiNotice('✨ AI enhanced your description to be clear and helpful while keeping sensitive details safe.');
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancingDesc(false);
    }
  };

  // Handle local file upload preview as data URL
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (typeof uploadEvent.target?.result === 'string') {
          setImage(uploadEvent.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    if (!name.trim()) {
      setErrorMessage('Item Name is required');
      return;
    }

    if (!description.trim()) {
      setErrorMessage('Description is required');
      return;
    }

    if (!color.trim()) {
      setErrorMessage('Item Color is required (e.g., Black, Blue, Silver)');
      return;
    }

    setIsSubmitting(true);

    try {
      const newId = addItem({
        type,
        name: name.trim(),
        category,
        description: description.trim(),
        color: color.trim(),
        brand: brand.trim() || undefined,
        location,
        specificLocation: specificLocation.trim() || undefined,
        date,
        image: image || PRESET_IMAGES[0].url,
        additionalDetails: additionalDetails.trim() || undefined,
      });

      setSubmittedItemId(newId);
      if (onSuccess) {
        onSuccess(newId);
      }
    } catch (err) {
      setErrorMessage('Failed to report item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success Confirmation Screen
  if (submittedItemId) {
    return (
      <div className="max-w-2xl mx-auto my-8 p-8 bg-white border border-[#EFE8D8] rounded-3xl shadow-md text-center animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-[#DCFCE7] text-[#166534] mx-auto flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-[#166534] bg-[#DCFCE7] px-3 py-1 rounded-full border border-[#BBF7D0]">
          Report Created
        </span>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#27221E] font-heading mt-3">
          {isLost ? 'Lost item reported successfully!' : 'Found item reported successfully!'}
        </h2>

        <p className="text-sm text-[#6B635B] mt-2 max-w-md mx-auto">
          Your campus report is now live. Other students can browse it, and our AI will continuously scan for potential matches.
        </p>

        <div className="mt-6 p-4 rounded-2xl bg-[#FAF6EC] border border-[#EFE8D8] max-w-sm mx-auto">
          <p className="text-xs text-[#857B72]">Official Reference ID</p>
          <p className="text-2xl font-mono font-bold text-[#713F12] tracking-wider mt-0.5">
            {submittedItemId}
          </p>
          <p className="text-[11px] text-[#A3998E] mt-1">Keep this ID if contacting Campus Security or Helpdesk</p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              setSubmittedItemId(null);
              setName('');
              setDescription('');
              setColor('');
              setBrand('');
              setSpecificLocation('');
              setAdditionalDetails('');
            }}
            className="px-5 py-2.5 rounded-xl border border-[#EFE8D8] bg-white hover:bg-[#FAF6EC] text-xs font-bold text-[#5C5349] transition-colors"
          >
            Submit Another Report
          </button>

          <button
            onClick={() => {
              if (onCancel) onCancel();
            }}
            className="px-6 py-2.5 rounded-xl bg-[#FEF08A] hover:bg-[#FDE047] text-xs font-bold text-[#713F12] border border-[#FDE047] shadow-xs transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-6 p-6 sm:p-10 bg-white border border-[#EFE8D8] rounded-3xl shadow-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              isLost 
                ? 'bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]' 
                : 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]'
            }`}>
              {isLost ? 'Lost Item Report' : 'Found Item Report'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#27221E] font-heading mt-2">
            {isLost ? 'Report a Lost Item' : 'Report a Found Item'}
          </h2>
          <p className="text-xs sm:text-sm text-[#786F66] mt-1">
            {isLost
              ? 'Provide clear details so anyone who finds your item can identify and return it to you.'
              : 'Help return this item to its rightful student owner by reporting where and when you found it.'}
          </p>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 rounded-xl text-[#786F66] hover:bg-[#FAF6EC] transition-colors"
            title="Cancel"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* AI banner alert */}
      {aiNotice && (
        <div className="mb-6 p-3.5 rounded-xl bg-[#FEF9C3] border border-[#FDE047] text-[#713F12] text-xs flex items-center justify-between gap-2 animate-in fade-in">
          <span>{aiNotice}</span>
          <button 
            type="button" 
            onClick={() => setAiNotice(null)} 
            className="text-[11px] underline font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Item Name with AI auto-fill trigger */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-[#27221E] uppercase tracking-wider">
              Item Name <span className="text-red-500">*</span>
            </label>
            
            <button
              type="button"
              onClick={handleAutoCategorize}
              disabled={isCategorizing || !name.trim()}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#854D0E] hover:text-[#713F12] bg-[#FEF9C3] hover:bg-[#FEF08A] px-2.5 py-1 rounded-lg border border-[#FDE047] transition-all disabled:opacity-50 cursor-pointer"
            >
              {isCategorizing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#CA8A04]" />
                  AI Auto-Fill Details
                </>
              )}
            </button>
          </div>
          
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={isLost ? "e.g., Black Samsung Galaxy S23, Blue Hydro Flask" : "e.g., Apple AirPods Case, Brown Leather Wallet"}
            className="w-full px-4 py-2.5 rounded-xl border border-[#EFE8D8] focus:border-[#FDE047] focus:ring-2 focus:ring-[#FEF9C3] outline-none text-sm text-[#27221E] placeholder:text-[#A3998E] bg-[#FFFDF9]"
            required
          />
          <p className="text-[11px] text-[#857B72] mt-1">
            Tip: Type a name and click "AI Auto-Fill Details" to automatically detect category, brand, and color.
          </p>
        </div>

        {/* Category & Color row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#27221E] uppercase tracking-wider mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EFE8D8] focus:border-[#FDE047] focus:ring-2 focus:ring-[#FEF9C3] outline-none text-sm text-[#27221E] bg-[#FFFDF9]"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#27221E] uppercase tracking-wider mb-1.5">
              Color <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="e.g., Black, Navy Blue, Silver, Brown"
              className="w-full px-4 py-2.5 rounded-xl border border-[#EFE8D8] focus:border-[#FDE047] focus:ring-2 focus:ring-[#FEF9C3] outline-none text-sm text-[#27221E] placeholder:text-[#A3998E] bg-[#FFFDF9]"
              required
            />
          </div>
        </div>

        {/* Brand (optional) */}
        <div>
          <label className="block text-xs font-bold text-[#27221E] uppercase tracking-wider mb-1.5">
            Brand <span className="text-[#857B72] font-normal lowercase">(optional)</span>
          </label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g., Apple, Samsung, Nike, Fossil, The North Face"
            className="w-full px-4 py-2.5 rounded-xl border border-[#EFE8D8] focus:border-[#FDE047] focus:ring-2 focus:ring-[#FEF9C3] outline-none text-sm text-[#27221E] placeholder:text-[#A3998E] bg-[#FFFDF9]"
          />
        </div>

        {/* Location & Specific Location row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#27221E] uppercase tracking-wider mb-1.5">
              {isLost ? 'Location Lost' : 'Location Found'} <span className="text-red-500">*</span>
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value as CampusLocation)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EFE8D8] focus:border-[#FDE047] focus:ring-2 focus:ring-[#FEF9C3] outline-none text-sm text-[#27221E] bg-[#FFFDF9]"
            >
              {LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#27221E] uppercase tracking-wider mb-1.5">
              {isLost ? 'Date Lost' : 'Date Found'} <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EFE8D8] focus:border-[#FDE047] focus:ring-2 focus:ring-[#FEF9C3] outline-none text-sm text-[#27221E] bg-[#FFFDF9]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#27221E] uppercase tracking-wider mb-1.5">
            Specific Area / Landmark <span className="text-[#857B72] font-normal lowercase">(optional)</span>
          </label>
          <input
            type="text"
            value={specificLocation}
            onChange={(e) => setSpecificLocation(e.target.value)}
            placeholder="e.g., 2nd Floor Quiet Study Cubicle #14, Cafeteria Booth near juice counter"
            className="w-full px-4 py-2.5 rounded-xl border border-[#EFE8D8] focus:border-[#FDE047] focus:ring-2 focus:ring-[#FEF9C3] outline-none text-sm text-[#27221E] placeholder:text-[#A3998E] bg-[#FFFDF9]"
          />
        </div>

        {/* Description & AI Enhance button */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-[#27221E] uppercase tracking-wider">
              Description <span className="text-red-500">*</span>
            </label>

            <button
              type="button"
              onClick={handleEnhanceDescription}
              disabled={isEnhancingDesc || !name.trim()}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#854D0E] hover:text-[#713F12] bg-[#FAF5EA] hover:bg-[#FEF9C3] px-2.5 py-1 rounded-lg border border-[#EFE8D8] transition-all disabled:opacity-50 cursor-pointer"
            >
              {isEnhancingDesc ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#CA8A04]" />
                  Improve Description with AI
                </>
              )}
            </button>
          </div>

          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the item clearly: material, stickers, scratches, condition..."
            className="w-full px-4 py-2.5 rounded-xl border border-[#EFE8D8] focus:border-[#FDE047] focus:ring-2 focus:ring-[#FEF9C3] outline-none text-sm text-[#27221E] placeholder:text-[#A3998E] bg-[#FFFDF9]"
            required
          />
        </div>

        {/* Additional Details (Private verification or notes) */}
        <div>
          <label className="block text-xs font-bold text-[#27221E] uppercase tracking-wider mb-1.5">
            Additional Details / Identifying Notes <span className="text-[#857B72] font-normal lowercase">(optional)</span>
          </label>
          <input
            type="text"
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            placeholder={isLost ? "e.g., Has a small dent on left corner, lock screen is a space photo" : "e.g., Safely kept at Library helpdesk until verified"}
            className="w-full px-4 py-2.5 rounded-xl border border-[#EFE8D8] focus:border-[#FDE047] focus:ring-2 focus:ring-[#FEF9C3] outline-none text-sm text-[#27221E] placeholder:text-[#A3998E] bg-[#FFFDF9]"
          />
        </div>

        {/* Image Selection / Upload */}
        <div>
          <label className="block text-xs font-bold text-[#27221E] uppercase tracking-wider mb-2">
            Item Photo / Reference Image
          </label>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            {/* Image Preview */}
            <div className="w-32 h-32 rounded-2xl border border-[#EFE8D8] overflow-hidden bg-[#FAF6EC] shrink-0 relative shadow-inner">
              <img
                src={image}
                alt="Item preview"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Presets & custom upload */}
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-xs text-[#6B635B] font-medium mb-1.5">
                  Select a campus preset or upload an image:
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 border border-[#F4EFE6] rounded-xl bg-[#FFFDF9]">
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setImage(preset.url)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                        image === preset.url
                          ? 'bg-[#FEF08A] text-[#713F12] border-[#FDE047] font-bold'
                          : 'bg-white text-[#6B635B] border-[#EFE8D8] hover:bg-[#FAF6EC]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload file or enter image URL */}
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF5EA] hover:bg-[#FEF9C3] text-xs font-bold text-[#713F12] border border-[#EFE8D8] transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] text-[#A3998E]">or paste image URL:</span>
              </div>

              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-3 py-1.5 rounded-lg border border-[#EFE8D8] text-xs text-[#27221E] bg-[#FFFDF9]"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-[#F4EFE6] flex items-center justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl border border-[#EFE8D8] bg-white hover:bg-[#FAF6EC] text-xs font-bold text-[#5C5349] transition-colors"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-7 py-3 rounded-2xl text-sm font-bold text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 ${
              isLost
                ? 'bg-[#EF4444] hover:bg-[#DC2626]'
                : 'bg-[#16A34A] hover:bg-[#15803D]'
            } disabled:opacity-50`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting Report...
              </>
            ) : isLost ? (
              'Submit Lost Item'
            ) : (
              'Submit Found Item'
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
