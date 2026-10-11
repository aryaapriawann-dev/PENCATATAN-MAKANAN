import React from 'react';
import { ShoppingBag, UtensilsCrossed, Clock, History, Search } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenHistory: () => void;
  orderHistoryCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenHistory,
  orderHistoryCount,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-600/20">
              <UtensilsCrossed className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-stone-900">
                  Selera<span className="text-amber-600">Nusantara</span>
                </span>
                <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Restoran Buka" />
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                <span className="text-emerald-700 font-semibold">Buka 09.00 - 22.00 WIB</span>
                <span className="text-stone-300">·</span>
                <span className="flex items-center gap-1 text-stone-500">
                  <Clock className="w-3 h-3 text-amber-600" /> Estimasi 15-25 mnt
                </span>
              </div>
            </div>
          </div>

          {/* Search bar (Center for desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Cari nasi goreng, rendang, es cendol..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-stone-100 hover:bg-stone-150 focus:bg-white text-sm text-stone-800 placeholder-stone-400 rounded-lg border border-transparent focus:border-amber-500 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
                >
                  Batal
                </button>
              )}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Order History */}
            <button
              onClick={onOpenHistory}
              title="Lihat Riwayat Pesanan"
              className="relative p-2.5 sm:px-3 sm:py-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-stone-200"
            >
              <History className="w-5 h-5 text-stone-600" />
              <span className="hidden sm:inline">Riwayat</span>
              {orderHistoryCount > 0 && (
                <span className="w-5 h-5 bg-stone-800 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                  {orderHistoryCount}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-sm shadow-sm transition-all active:scale-[0.98]"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-amber-700 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-[11px] text-amber-100 uppercase tracking-wider font-medium">Keranjang</span>
                <span className="text-xs font-bold">{cartTotal > 0 ? formatRupiah(cartTotal) : '0 Item'}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Cari makanan atau minuman..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-100 focus:bg-white text-sm text-stone-800 placeholder-stone-400 rounded-lg border border-stone-200 focus:border-amber-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
              >
                Hapus
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
