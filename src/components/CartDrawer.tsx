import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag, Utensils } from 'lucide-react';
import { CartItem, OrderType } from '../types';
import { formatRupiah } from '../utils/formatters';
import { VOUCHERS } from '../data/menuData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartId: string, quantity: number) => void;
  onRemoveItem: (cartId: string) => void;
  orderType: OrderType;
  onChangeOrderType: (type: OrderType) => void;
  voucherCode: string;
  onApplyVoucher: (code: string) => void;
  onRemoveVoucher: () => void;
  discountAmount: number;
  deliveryFee: number;
  serviceFee: number;
  subtotal: number;
  totalAmount: number;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  orderType,
  onChangeOrderType,
  voucherCode,
  onApplyVoucher,
  onRemoveVoucher,
  discountAmount,
  deliveryFee,
  serviceFee,
  subtotal,
  totalAmount,
  onProceedToCheckout,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    const found = VOUCHERS.find((v) => v.code === code);
    if (!found) {
      setPromoError('Kode promo tidak valid atau telah berakhir.');
      return;
    }
    if (subtotal < (found.minOrder || 0)) {
      setPromoError(`Minimal pesanan untuk kode ini adalah ${formatRupiah(found.minOrder || 0)}.`);
      return;
    }

    onApplyVoucher(code);
    setPromoInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity animate-fadeIn"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200 animate-slideLeft">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base sm:text-lg text-stone-900 leading-tight">
                  Keranjang Pesanan
                </h2>
                <p className="text-xs text-stone-500">
                  {items.reduce((s, i) => s + i.quantity, 0)} porsi makanan & minuman
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Order Type Toggle in Cart */}
          <div className="p-3 bg-stone-100/80 border-b border-stone-200">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5 px-1">
              Pilihan Layanan
            </span>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-200/60 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => onChangeOrderType('dine-in')}
                className={`py-1.5 px-2 rounded-md transition-all text-center ${
                  orderType === 'dine-in'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🍽️ Dine-In
              </button>
              <button
                type="button"
                onClick={() => onChangeOrderType('takeaway')}
                className={`py-1.5 px-2 rounded-md transition-all text-center ${
                  orderType === 'takeaway'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🥡 Bungkus
              </button>
              <button
                type="button"
                onClick={() => onChangeOrderType('delivery')}
                className={`py-1.5 px-2 rounded-md transition-all text-center ${
                  orderType === 'delivery'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🛵 Delivery
              </button>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-300">
                  <Utensils className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-bold text-stone-700 text-sm">Keranjang Belanja Masih Kosong</p>
                  <p className="text-xs text-stone-400 mt-1 max-w-xs">
                    Yuk pilih menu nusantara lezat di katalog dan nikmati hidangan hangat hari ini!
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Mulai Pesan Menu
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.cartId} className="pt-3.5 first:pt-0 flex gap-3 items-start">
                  {/* Thumbnail */}
                  <img
                    src={item.menuItem.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover shrink-0 border border-stone-200"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-sm text-stone-900 leading-snug line-clamp-1">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.cartId)}
                        className="text-stone-400 hover:text-rose-600 p-1 -mr-1 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Customization details */}
                    <div className="text-[11px] text-stone-500 mt-0.5 space-y-0.5">
                      {item.selectedPortion && item.selectedPortion.name !== 'Porsi Reguler' && (
                        <div>• Porsi: {item.selectedPortion.name}</div>
                      )}
                      {item.selectedSpice && <div>• Tingkat: {item.selectedSpice}</div>}
                      {item.selectedAddOns.length > 0 && (
                        <div>• Ekstra: {item.selectedAddOns.map((a) => a.name).join(', ')}</div>
                      )}
                      {item.notes && (
                        <div className="text-amber-800 italic">"Catatan: {item.notes}"</div>
                      )}
                    </div>

                    {/* Quantity Stepper & Price Row */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.cartId, item.quantity - 1)}
                          className="p-1 hover:bg-stone-200 text-stone-600 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-stone-800 min-w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
                          className="p-1 hover:bg-stone-200 text-stone-600 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-extrabold text-sm text-stone-900">
                        {formatRupiah(item.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer calculation & checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/80 space-y-3 shrink-0">
              {/* Promo Voucher Form */}
              <div>
                {voucherCode ? (
                  <div className="flex items-center justify-between p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-xs">
                    <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
                      <Tag className="w-3.5 h-3.5 text-amber-600" />
                      <span>Voucher {voucherCode} aktif</span>
                    </div>
                    <button
                      onClick={onRemoveVoucher}
                      className="text-stone-500 hover:text-rose-600 font-medium text-xs underline"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                      <input
                        type="text"
                        placeholder="Masukkan kode promo (DISKON20)"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg focus:border-amber-500 focus:outline-none uppercase font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      Gunakan
                    </button>
                  </form>
                )}
                {promoError && (
                  <p className="text-[11px] text-rose-600 mt-1 pl-1 font-medium">{promoError}</p>
                )}
              </div>

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal Pesanan</span>
                  <span className="font-medium text-stone-900">{formatRupiah(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Diskon Promo</span>
                    <span>-{formatRupiah(discountAmount)}</span>
                  </div>
                )}

                {orderType === 'delivery' && (
                  <div className="flex justify-between">
                    <span>Ongkos Kirim (Flat)</span>
                    <span className="font-medium text-stone-900">{formatRupiah(deliveryFee)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Biaya Layanan & Pengemasan</span>
                  <span className="font-medium text-stone-900">{formatRupiah(serviceFee)}</span>
                </div>

                <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-extrabold text-stone-900">
                  <span>Total Pembayaran</span>
                  <span className="text-amber-700 text-base">{formatRupiah(totalAmount)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
              >
                <span>Lanjut ke Formulir Pesanan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
