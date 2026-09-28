import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Item, Category, CampusLocation, ItemType } from '../types';
import { ItemCard } from './ItemCard';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  X, 
  RotateCcw,
  Tag,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

const CATEGORIES: ('All' | Category)[] = [
  'All',
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

const LOCATIONS: ('All' | CampusLocation)[] = [
  'All',
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

export const BrowsePage: React.FC = () => {
  const { items, setSelectedItemId } = useApp();

  const [typeFilter, setTypeFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | Category>('All');
  const [selectedLocation, setSelectedLocation] = useState<'All' | CampusLocation>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('All');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Counts
  const lostCount = items.filter(i => i.type === 'lost').length;
  const foundCount = items.filter(i => i.type === 'found').length;

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Type filter (Lost / Found / All)
      if (typeFilter !== 'all' && item.type !== typeFilter) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Location filter
      if (selectedLocation !== 'All' && item.location !== selectedLocation) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'All' && item.status !== selectedStatus) {
        return false;
      }

      // Date filter (e.g. past 24h, past week, past month)
      if (selectedDateFilter !== 'All') {
        const itemDate = new Date(item.date).getTime();
        const now = new Date().getTime();
        const diffDays = (now - itemDate) / (1000 * 3600 * 24);
        if (selectedDateFilter === 'today' && diffDays > 1.5) return false;
        if (selectedDateFilter === 'week' && diffDays > 7.5) return false;
        if (selectedDateFilter === 'month' && diffDays > 30.5) return false;
      }

      // Search query filter (search by item name, category, color, brand, location, description)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        const matchesColor = item.color.toLowerCase().includes(q);
        const matchesBrand = item.brand ? item.brand.toLowerCase().includes(q) : false;
        const matchesLocation = item.location.toLowerCase().includes(q) || (item.specificLocation ? item.specificLocation.toLowerCase().includes(q) : false);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesId = item.itemId.toLowerCase().includes(q);

        if (!matchesName && !matchesCategory && !matchesColor && !matchesBrand && !matchesLocation && !matchesDesc && !matchesId) {
          return false;
        }
      }

      return true;
    });
  }, [items, typeFilter, selectedCategory, selectedLocation, selectedStatus, selectedDateFilter, searchQuery]);

  const resetFilters = () => {
    setTypeFilter('all');
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLocation('All');
    setSelectedStatus('All');
    setSelectedDateFilter('All');
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'All' || selectedLocation !== 'All' || selectedStatus !== 'All' || selectedDateFilter !== 'All' || typeFilter !== 'all';

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header and Title */}
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-[#27221E] font-heading">
          Browse Lost &amp; Found
        </h1>
        <p className="text-xs sm:text-sm text-[#786F66] mt-1">
          Search items reported across campus buildings, laboratories, and student common spaces.
        </p>
      </div>

      {/* Main Search Bar & Quick Tabs */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#EFE8D8] shadow-xs space-y-4">
        
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 text-[#854D0E] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for an item... (e.g. 'black wallet', 'iPhone', 'blue bottle', 'library')"
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-[#EFE8D8] focus:border-[#FDE047] focus:ring-2 focus:ring-[#FEF9C3] outline-none text-sm text-[#27221E] placeholder:text-[#A3998E] bg-[#FFFDF9]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#A3998E] hover:text-[#27221E]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tab Switcher & Filter toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          
          {/* Lost / Found / All Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#FAF6EC] rounded-2xl border border-[#EFE8D8]">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                typeFilter === 'all'
                  ? 'bg-white text-[#27221E] shadow-xs'
                  : 'text-[#6B635B] hover:text-[#27221E]'
              }`}
            >
              All Items ({items.length})
            </button>

            <button
              onClick={() => setTypeFilter('lost')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                typeFilter === 'lost'
                  ? 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA] shadow-xs'
                  : 'text-[#6B635B] hover:text-[#991B1B]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
              Lost Items ({lostCount})
            </button>

            <button
              onClick={() => setTypeFilter('found')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                typeFilter === 'found'
                  ? 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] shadow-xs'
                  : 'text-[#6B635B] hover:text-[#166534]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              Found Items ({foundCount})
            </button>
          </div>

          {/* Quick Filter toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                showFilterDrawer || hasActiveFilters
                  ? 'bg-[#FEF9C3] text-[#713F12] border-[#FDE047]'
                  : 'bg-white text-[#5C5349] border-[#EFE8D8] hover:bg-[#FAF6EC]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#854D0E]" />
              Filters {hasActiveFilters && '• Active'}
            </button>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="p-2 text-[#857B72] hover:text-[#27221E] hover:bg-[#FAF6EC] rounded-xl transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

        {/* Expandable Filter Controls */}
        {showFilterDrawer && (
          <div className="pt-4 border-t border-[#F4EFE6] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in duration-150">
            
            {/* Category dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-[#857B72] uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#EFE8D8] text-xs text-[#27221E] bg-[#FFFDF9] outline-none"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Location dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-[#857B72] uppercase tracking-wider mb-1">
                Campus Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#EFE8D8] text-xs text-[#27221E] bg-[#FFFDF9] outline-none"
              >
                {LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Date filter */}
            <div>
              <label className="block text-[11px] font-bold text-[#857B72] uppercase tracking-wider mb-1">
                Timeframe
              </label>
              <select
                value={selectedDateFilter}
                onChange={(e) => setSelectedDateFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EFE8D8] text-xs text-[#27221E] bg-[#FFFDF9] outline-none"
              >
                <option value="All">All Time</option>
                <option value="today">Past 24 Hours</option>
                <option value="week">Past 7 Days</option>
                <option value="month">Past 30 Days</option>
              </select>
            </div>

            {/* Status filter */}
            <div>
              <label className="block text-[11px] font-bold text-[#857B72] uppercase tracking-wider mb-1">
                Report Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EFE8D8] text-xs text-[#27221E] bg-[#FFFDF9] outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active Only</option>
                <option value="Claimed">Claimed</option>
                <option value="Returned">Returned / Resolved</option>
              </select>
            </div>

          </div>
        )}

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-semibold text-[#857B72]">
          Showing <span className="text-[#27221E] font-bold">{filteredItems.length}</span> matching item{filteredItems.length === 1 ? '' : 's'}
        </p>
      </div>

      {/* Grid of Items */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-[#EFE8D8] text-center max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF6EC] text-[#854D0E] flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#27221E]">No items found</h3>
          <p className="text-xs text-[#786F66] mt-1 max-w-xs mx-auto">
            We couldn't find any campus records matching your search query or filters.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-[#FEF08A] hover:bg-[#FDE047] text-xs font-bold text-[#713F12] border border-[#FDE047] transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map(item => (
            <ItemCard
              key={item.itemId}
              item={item}
              onViewDetails={(selected) => setSelectedItemId(selected.itemId)}
            />
          ))}
        </div>
      )}

    </div>
  );
};
