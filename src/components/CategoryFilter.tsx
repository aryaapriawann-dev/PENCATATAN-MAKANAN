import React from 'react';
import { Utensils, Coffee, Cookie, Sparkles, LayoutGrid, Flame, Star, Wallet } from 'lucide-react';
import { FoodCategory } from '../types';

interface CategoryFilterProps {
  selectedCategory: FoodCategory;
  onSelectCategory: (cat: FoodCategory) => void;
  activeFilter: 'all' | 'popular' | 'spicy' | 'budget';
  onSelectFilter: (filter: 'all' | 'popular' | 'spicy' | 'budget') => void;
  counts: Record<FoodCategory, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  activeFilter,
  onSelectFilter,
  counts,
}) => {
  const categories: { id: FoodCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'semua', label: 'Semua Menu', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'makanan', label: 'Makanan Utama', icon: <Utensils className="w-4 h-4" /> },
    { id: 'minuman', label: 'Minuman Segar', icon: <Coffee className="w-4 h-4" /> },
    { id: 'snack', label: 'Cemilan & Kudapan', icon: <Cookie className="w-4 h-4" /> },
    { id: 'paket', label: 'Paket Hemat', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-4 px-4 sm:px-6 lg:px-8 mb-6">
      {/* Primary Category Segmented Control */}
      <div className="flex items-center gap-1.5 p-1.5 bg-stone-200/70 rounded-xl overflow-x-auto scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <span className={isActive ? 'text-amber-600' : 'text-stone-500'}>{cat.icon}</span>
              <span>{cat.label}</span>
              <span
                className={`text-[11px] font-mono px-1.5 py-0.2 rounded-md ${
                  isActive ? 'bg-amber-100 text-amber-800' : 'bg-stone-300/60 text-stone-600'
                }`}
              >
                {counts[cat.id]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Secondary Fast Filter Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-stone-500 font-medium hidden sm:inline">Filter Cepat:</span>
          
          <button
            onClick={() => onSelectFilter('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300'
            }`}
          >
            Semua
          </button>

          <button
            onClick={() => onSelectFilter('popular')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeFilter === 'popular'
                ? 'bg-amber-600 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Terlaris & Favorit</span>
          </button>

          <button
            onClick={() => onSelectFilter('spicy')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeFilter === 'spicy'
                ? 'bg-rose-600 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>Pedas Mantap</span>
          </button>

          <button
            onClick={() => onSelectFilter('budget')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeFilter === 'budget'
                ? 'bg-emerald-700 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Di Bawah Rp 25rb</span>
          </button>
        </div>
      </div>
    </div>
  );
};
