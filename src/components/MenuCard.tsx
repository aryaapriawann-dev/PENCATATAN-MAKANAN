import React from 'react';
import { Star, Clock, Plus, Flame, SlidersHorizontal } from 'lucide-react';
import { MenuItem } from '../types';
import { formatRupiah } from '../utils/formatters';

interface MenuCardProps {
  item: MenuItem;
  onQuickAdd: (item: MenuItem) => void;
  onOpenDetails: (item: MenuItem) => void;
  cartQuantity: number;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  item,
  onQuickAdd,
  onOpenDetails,
  cartQuantity,
}) => {
  return (
    <div className="group bg-white rounded-xl border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      {/* Food Image with Hover Effect */}
      <div
        onClick={() => onOpenDetails(item)}
        className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden cursor-pointer"
      >
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Floating Best Seller text or discount */}
        {item.originalPrice && (
          <div className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-xs">
            Diskon {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
          </div>
        )}

        {item.isBestSeller && !item.originalPrice && (
          <div className="absolute top-2.5 left-2.5 bg-amber-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-xs">
            Terlaris
          </div>
        )}

        {/* Spicy indicator */}
        {item.spicyLevel !== undefined && item.spicyLevel > 0 && (
          <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
            <Flame className="w-3 h-3 text-red-400" />
            <span>{'🌶️'.repeat(item.spicyLevel)}</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Rating, reviews, prep time (unboxed text separators per design constitution) */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5">
            <div className="flex items-center gap-1 text-amber-600 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{item.rating.toFixed(1)}</span>
            </div>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{item.reviewsCount} ulasan</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <div className="flex items-center gap-1 text-stone-500">
              <Clock className="w-3 h-3 text-stone-400" />
              <span>{item.prepTime}</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onOpenDetails(item)}
            className="font-bold text-base text-stone-900 group-hover:text-amber-700 transition-colors cursor-pointer leading-snug line-clamp-1"
          >
            {item.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Price & Action row */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-base sm:text-lg text-stone-900">
                {formatRupiah(item.price)}
              </span>
              {item.originalPrice && (
                <span className="text-xs text-stone-400 line-through">
                  {formatRupiah(item.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Customization Options button if menu has options */}
            {(item.portionOptions || item.spiceLevels || item.addOns) && (
              <button
                onClick={() => onOpenDetails(item)}
                title="Pilihan porsi, bumbu & tambahan"
                className="p-2 text-stone-600 hover:text-amber-700 hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors text-xs flex items-center gap-1"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pilihan</span>
              </button>
            )}

            {/* Quick Add Button */}
            <button
              onClick={() => onQuickAdd(item)}
              className="flex items-center gap-1 px-3 py-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-semibold text-xs rounded-lg transition-all shadow-xs active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{cartQuantity > 0 ? `Tambah (${cartQuantity})` : 'Pesan'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
