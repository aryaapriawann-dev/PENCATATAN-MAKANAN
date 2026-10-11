import React, { useState } from 'react';
import { X, Star, Clock, Plus, Minus, ShoppingBag, Flame } from 'lucide-react';
import { MenuItem, PortionOption, AddOnOption } from '../types';
import { formatRupiah } from '../utils/formatters';

interface MenuItemModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (
    item: MenuItem,
    quantity: number,
    portion?: PortionOption,
    spice?: string,
    addOns?: AddOnOption[],
    notes?: string
  ) => void;
}

export const MenuItemModal: React.FC<MenuItemModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedPortion, setSelectedPortion] = useState<PortionOption | undefined>(
    item.portionOptions ? item.portionOptions[0] : undefined
  );
  const [selectedSpice, setSelectedSpice] = useState<string | undefined>(
    item.spiceLevels ? item.spiceLevels[0] : undefined
  );
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnOption[]>([]);
  const [notes, setNotes] = useState<string>('');

  const toggleAddOn = (addon: AddOnOption) => {
    if (selectedAddOns.some((a) => a.id === addon.id)) {
      setSelectedAddOns(selectedAddOns.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddOns([...selectedAddOns, addon]);
    }
  };

  // Calculate unit price based on options
  const basePrice = item.price;
  const portionExtra = selectedPortion ? selectedPortion.extraPrice : 0;
  const addOnsTotal = selectedAddOns.reduce((sum, curr) => sum + curr.price, 0);
  const unitPrice = basePrice + portionExtra + addOnsTotal;
  const totalPrice = unitPrice * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddToCart(
      item,
      quantity,
      selectedPortion,
      selectedSpice,
      selectedAddOns,
      notes.trim() ? notes.trim() : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-stone-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with image */}
        <div className="relative h-48 sm:h-56 bg-stone-100 overflow-hidden shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-stone-900/60 text-white hover:bg-stone-900 transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-medium">
            <div className="flex items-center gap-2 bg-stone-950/70 backdrop-blur-md px-2.5 py-1 rounded-md">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{item.rating.toFixed(1)} ({item.reviewsCount} ulasan)</span>
              <span>·</span>
              <Clock className="w-3.5 h-3.5" />
              <span>{item.prepTime}</span>
            </div>
            {item.spicyLevel !== undefined && item.spicyLevel > 0 && (
              <div className="bg-rose-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-rose-200 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span>Pedas {item.spicyLevel}/3</span>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable details */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
          <div>
            <h2 className="text-xl font-bold text-stone-900">{item.name}</h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Pilihan Porsi */}
          {item.portionOptions && item.portionOptions.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Pilih Ukuran / Porsi
              </label>
              <div className="space-y-1.5">
                {item.portionOptions.map((portion) => (
                  <label
                    key={portion.name}
                    className={`flex items-center justify-between p-3 rounded-lg border text-sm cursor-pointer transition-all ${
                      selectedPortion?.name === portion.name
                        ? 'border-amber-600 bg-amber-50/70 text-amber-950 font-medium'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="portion"
                        checked={selectedPortion?.name === portion.name}
                        onChange={() => setSelectedPortion(portion)}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>{portion.name}</span>
                    </div>
                    <span className="text-xs text-stone-500">
                      {portion.extraPrice > 0 ? `+${formatRupiah(portion.extraPrice)}` : 'Termasuk'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Tingkat Kepedasan */}
          {item.spiceLevels && item.spiceLevels.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Tingkat Kepedasan
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.spiceLevels.map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setSelectedSpice(lvl)}
                    className={`p-2.5 rounded-lg border text-xs font-semibold text-left transition-all ${
                      selectedSpice === lvl
                        ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-xs'
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tambahan / Add-ons */}
          {item.addOns && item.addOns.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Menu Tambahan (Opsional)
                </label>
                <span className="text-[11px] text-stone-400">Bisa pilih lebih dari satu</span>
              </div>
              <div className="space-y-1.5">
                {item.addOns.map((addon) => {
                  const isChecked = selectedAddOns.some((a) => a.id === addon.id);
                  return (
                    <label
                      key={addon.id}
                      className={`flex items-center justify-between p-3 rounded-lg border text-sm cursor-pointer transition-all ${
                        isChecked
                          ? 'border-amber-600 bg-amber-50/50 text-amber-950 font-medium'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleAddOn(addon)}
                          className="rounded text-amber-600 focus:ring-amber-500"
                        />
                        <span>{addon.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-stone-600">
                        +{formatRupiah(addon.price)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Catatan untuk Dapur */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Catatan Khusus Pesanan
            </label>
            <input
              type="text"
              placeholder="Contoh: Kuah dipisah, tidak pakai daun bawang, es sedikit..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:border-amber-500 focus:outline-none"
              maxLength={100}
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-4">
            {/* Quantity Stepper */}
            <div className="flex items-center border border-stone-200 rounded-lg p-1 bg-stone-50">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1.5 rounded-md hover:bg-stone-200 text-stone-700 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-3 text-sm font-bold text-stone-900 min-w-8 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="p-1.5 rounded-md hover:bg-stone-200 text-stone-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to cart button with price */}
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-xl font-bold text-sm flex items-center justify-between shadow-md transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Tambah Pesanan</span>
              </div>
              <span>{formatRupiah(totalPrice)}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
