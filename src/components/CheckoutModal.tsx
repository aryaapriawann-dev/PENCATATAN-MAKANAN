import React, { useState } from 'react';
import { X, CheckCircle2, QrCode, Banknote, Building2, Smartphone, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { CartItem, OrderType, PaymentMethod, Order } from '../types';
import { formatRupiah, generateOrderId } from '../utils/formatters';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  orderType: OrderType;
  onChangeOrderType: (t: OrderType) => void;
  subtotal: number;
  discount: number;
  discountCode?: string;
  deliveryFee: number;
  serviceFee: number;
  totalAmount: number;
  onOrderCreated: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  orderType,
  onChangeOrderType,
  subtotal,
  discount,
  discountCode,
  deliveryFee,
  serviceFee,
  totalAmount,
  onOrderCreated,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tableNumber, setTableNumber] = useState('04');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [errorMessage, setErrorMessage] = useState('');

  const tableOptions = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', 'VIP-1', 'VIP-2'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('Silakan masukkan nama lengkap pemesan.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 8) {
      setErrorMessage('Silakan masukkan nomor WhatsApp yang aktif untuk konfirmasi.');
      return;
    }
    if (orderType === 'dine-in' && !tableNumber) {
      setErrorMessage('Silakan pilih nomor meja Anda.');
      return;
    }
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setErrorMessage('Silakan isi alamat lengkap untuk pengantaran.');
      return;
    }

    const newOrder: Order = {
      id: generateOrderId(),
      createdAt: new Date().toISOString(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      orderType,
      tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
      deliveryNotes: orderType === 'delivery' ? deliveryNotes.trim() : undefined,
      items,
      subtotal,
      discount,
      discountCode,
      deliveryFee: orderType === 'delivery' ? deliveryFee : 0,
      serviceFee,
      totalAmount,
      paymentMethod,
      status: 'diterima',
      estimatedMinutes: orderType === 'delivery' ? 35 : 20,
    };

    onOrderCreated(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col border border-stone-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900">Formulir Pemesanan Makanan</h2>
            <p className="text-xs text-stone-500 mt-0.5">Lengkapi data agar pesanan dapat segera diproses kasir & dapur</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-semibold">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Section 1: Customer Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <span>1. Data Pemesan</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nomor WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 081234567890"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Order Type & Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              2. Tipe Pesanan
            </h3>

            <div className="grid grid-cols-3 gap-2 p-1 bg-stone-100 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => onChangeOrderType('dine-in')}
                className={`py-2 px-2 rounded-lg transition-all text-center ${
                  orderType === 'dine-in'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                🍽️ Makan di Meja
              </button>
              <button
                type="button"
                onClick={() => onChangeOrderType('takeaway')}
                className={`py-2 px-2 rounded-lg transition-all text-center ${
                  orderType === 'takeaway'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                🥡 Bawa Pulang
              </button>
              <button
                type="button"
                onClick={() => onChangeOrderType('delivery')}
                className={`py-2 px-2 rounded-lg transition-all text-center ${
                  orderType === 'delivery'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                🛵 Antar ke Alamat
              </button>
            </div>

            {/* Dynamic fields based on Order Type */}
            {orderType === 'dine-in' && (
              <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/70 space-y-2">
                <label className="block text-xs font-bold text-amber-950">
                  Pilih Nomor Meja Anda:
                </label>
                <div className="grid grid-cols-6 gap-1.5">
                  {tableOptions.map((tbl) => (
                    <button
                      type="button"
                      key={tbl}
                      onClick={() => setTableNumber(tbl)}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        tableNumber === tbl
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-amber-400'
                      }`}
                    >
                      {tbl}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-stone-500">
                  *Makanan akan langsung diantarkan oleh pelayan ke meja yang dipilih.
                </p>
              </div>
            )}

            {orderType === 'takeaway' && (
              <div className="p-3.5 bg-stone-100 rounded-xl text-xs text-stone-600 space-y-1">
                <p className="font-semibold text-stone-800">
                  🥡 Pesanan akan dibungkus rapat dan higienis.
                </p>
                <p>
                  Estimasi siap ambil dalam <strong>15 - 20 menit</strong>. Sebutkan ID Pesanan saat mengambil di loket kasir.
                </p>
              </div>
            )}

            {orderType === 'delivery' && (
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span>Alamat Pengantaran</span>
                </div>
                <div>
                  <textarea
                    rows={2}
                    required
                    placeholder="Contoh: Jl. Melati No. 14, RT 02/05, Kebayoran Baru, Jakarta Selatan"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Patokan alamat / catatan untuk kurir (misal: Pagar hitam samping masjid)"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Payment Method */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              3. Metode Pembayaran
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label
                className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'qris'
                    ? 'border-amber-600 bg-amber-50/70'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'qris'}
                  onChange={() => setPaymentMethod('qris')}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <QrCode className="w-5 h-5 text-amber-600 shrink-0" />
                <div className="text-left">
                  <span className="block text-xs font-bold text-stone-900">QRIS (Semua Bank / E-Wallet)</span>
                  <span className="text-[11px] text-stone-500">Scan instan via GoPay, BCA, Ovo, Dana</span>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-amber-600 bg-amber-50/70'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cash'}
                  onChange={() => setPaymentMethod('cash')}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <Banknote className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-left">
                  <span className="block text-xs font-bold text-stone-900">
                    {orderType === 'delivery' ? 'COD (Bayar di Tempat)' : 'Bayar di Kasir'}
                  </span>
                  <span className="text-[11px] text-stone-500">Tunai langsung ke kasir / kurir</span>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'transfer'
                    ? 'border-amber-600 bg-amber-50/70'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'transfer'}
                  onChange={() => setPaymentMethod('transfer')}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <Building2 className="w-5 h-5 text-blue-600 shrink-0" />
                <div className="text-left">
                  <span className="block text-xs font-bold text-stone-900">Transfer Bank</span>
                  <span className="text-[11px] text-stone-500">BCA / Mandiri / BRI</span>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'ewallet'
                    ? 'border-amber-600 bg-amber-50/70'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'ewallet'}
                  onChange={() => setPaymentMethod('ewallet')}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <Smartphone className="w-5 h-5 text-purple-600 shrink-0" />
                <div className="text-left">
                  <span className="block text-xs font-bold text-stone-900">ShopeePay / OVO</span>
                  <span className="text-[11px] text-stone-500">Konfirmasi via nomor HP</span>
                </div>
              </label>
            </div>
          </div>

          {/* Order Summary in Checkout */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5">
            <div className="font-bold text-stone-800 mb-1 flex items-center justify-between">
              <span>Ringkasan {items.reduce((s, i) => s + i.quantity, 0)} Item</span>
              <span className="text-stone-500 font-normal">{items.length} menu berbeda</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Subtotal:</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Potongan Promo:</span>
                <span>-{formatRupiah(discount)}</span>
              </div>
            )}
            {orderType === 'delivery' && (
              <div className="flex justify-between text-stone-600">
                <span>Ongkir:</span>
                <span>{formatRupiah(deliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>Biaya Layanan:</span>
              <span>{formatRupiah(serviceFee)}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-stone-200 font-extrabold text-stone-900 text-sm">
              <span>Total Akhir:</span>
              <span className="text-amber-700">{formatRupiah(totalAmount)}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-semibold text-xs hover:bg-stone-100 transition-colors"
            >
              Kembali
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Konfirmasi & Buat Pesanan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
