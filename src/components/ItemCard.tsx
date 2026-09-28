import React from 'react';
import { Item } from '../types';
import { MapPin, Calendar, Tag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface ItemCardProps {
  item: Item;
  onViewDetails: (item: Item) => void;
  isPotentialMatch?: boolean;
  matchScore?: number;
}

export const ItemCard: React.FC<ItemCardProps> = ({ 
  item, 
  onViewDetails, 
  isPotentialMatch, 
  matchScore 
}) => {
  const isLost = item.type === 'lost';

  // Gentle status colors
  const getStatusBadge = () => {
    switch (item.status) {
      case 'Active':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEF9C3] text-[#713F12] border border-[#FEF08A]">
            Active
          </span>
        );
      case 'Found':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]">
            Found
          </span>
        );
      case 'Claimed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
            Claim Pending
          </span>
        );
      case 'Returned':
      case 'Resolved':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#E2ECE5] text-[#2D5A43] border border-[#C5DDD0]">
            Resolved ✓
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-stone-100 text-stone-700">
            {item.status}
          </span>
        );
    }
  };

  return (
    <div 
      onClick={() => onViewDetails(item)}
      className="group bg-white rounded-2xl border border-[#ECE5D8] hover:border-[#FDE047] shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Image container */}
      <div className="relative h-44 bg-[#F8F5EE] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // graceful fallback placeholder
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Item Type Pill (Lost / Found) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className={`px-2.5 py-1 rounded-xl text-xs font-bold shadow-xs tracking-wide uppercase ${
            isLost 
              ? 'bg-[#FEF2F2]/95 text-[#991B1B] border border-[#FECACA]' 
              : 'bg-[#F0FDF4]/95 text-[#166534] border border-[#BBF7D0]'
          }`}>
            {isLost ? 'Lost Item' : 'Found Item'}
          </span>
        </div>

        {/* Status pill right */}
        <div className="absolute top-3 right-3">
          {getStatusBadge()}
        </div>

        {/* AI Match badge if highlighted */}
        {isPotentialMatch && (
          <div className="absolute bottom-2 left-2 bg-[#FEF08A]/95 text-[#713F12] text-[11px] font-bold px-2 py-0.5 rounded-lg border border-[#FDE047] flex items-center gap-1 shadow-xs">
            <Sparkles className="w-3 h-3 text-[#CA8A04]" />
            {matchScore ? `${matchScore}% Match` : 'Potential Match'}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Color chips */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#FAF5EA] text-[#6E6357] border border-[#EFE8D8]">
              {item.category}
            </span>
            {item.color && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#FAF5EA] text-[#6E6357] border border-[#EFE8D8]">
                {item.color}
              </span>
            )}
            {item.brand && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#FAF5EA] text-[#6E6357] border border-[#EFE8D8]">
                {item.brand}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-[#27221E] text-base leading-snug line-clamp-1 group-hover:text-[#B45309] transition-colors">
            {item.name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-[#6B635B] mt-1.5 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Location & Date Footer */}
        <div className="mt-4 pt-3 border-t border-[#F4EFE6] flex items-center justify-between text-xs text-[#857B72]">
          <div className="flex items-center gap-1 truncate max-w-[140px]" title={item.location}>
            <MapPin className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#A3998E] shrink-0" />
            <span>{item.date}</span>
          </div>
        </div>

        {/* Details CTA */}
        <div className="mt-3 pt-2 flex items-center justify-between">
          <span className="text-[11px] text-[#A3998E]">
            ID: <span className="font-mono text-[#6E6357]">{item.itemId}</span>
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(item);
            }}
            className="text-xs font-bold text-[#854D0E] hover:text-[#713F12] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
