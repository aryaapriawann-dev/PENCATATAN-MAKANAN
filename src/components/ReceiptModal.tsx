import React, { useState, useEffect } from 'react';
import {
  X,
  Share2,
  Printer,
  CheckCircle,
  Clock,
  Flame,
  ChefHat,
  Bike,
  UtensilsCrossed,
  Copy,
  Check,
  QrCode,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatRupiah, formatDateIndo, buildWhatsAppMessage } from '../utils/formatters';

interface ReceiptModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onOrderAgain: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  order,
  onClose,
  onUpdateOrderStatus,
  onOrderAgain,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!order) return null;

  const statusSteps: { key: OrderStatus; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      key: 'diterima',
      label: 'Pesanan Diterima',
      desc: 'Kasir telah menerima pesanan Anda',
      icon: <CheckCircle className="w-4 h-4 text-emerald-600" />,
    },
    {
      key: 'dimasak',
      label: 'Sedang Dimasak',
      desc: 'Koki dapur sedang menyiapkan hidangan hangat',
      icon: <ChefHat className="w-4 h-4 text-amber-600" />,
    },
    {
      key: 'siap',
      label: order.orderType === 'delivery' ? 'Dalam Pengantaran' : 'Siap Disajikan',
      desc:
        order.orderType === 'delivery'
          ? 'Kurir sedang menuju alamat pengantaran'
          : order.orderType === 'takeaway'
          ? 'Silakan ambil di loket kasir'
          : 'Pelayan sedang mengantarkan ke meja',
      icon:
        order.orderType === 'delivery' ? (
          <Bike className="w-4 h-4 text-blue-600" />
        ) : (
          <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
        ),
    },
    {
      key: 'selesai',
      label: 'Pesanan Selesai',
      desc: 'Selamat menikmati hidangan lezat!',
      icon: <CheckCircle className="w-4 h-4 text-emerald-600" />,
    },
  ];

  const currentStepIndex = statusSteps.findIndex((s) => s.key === order.status);

  const advanceStatus = () => {
    if (order.status === 'diterima') onUpdateOrderStatus(order.id, 'dimasak');
    else if (order.status === 'dimasak') onUpdateOrderStatus(order.id, 'siap');
    else if (order.status === 'siap') onUpdateOrderStatus(order.id, 'selesai');
  };

  const handleWhatsAppShare = () => {
    const message = buildWhatsAppMessage(order);
    const encoded = encodeURIComponent(message);
    // 6281234567890 dummy resto number or direct wa
    const waUrl = `https://wa.me/?text=${encoded}`;
    window.open(waUrl, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyOrderId = () => {
    navigator.clipboard?.writeText(order.id);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[94vh] overflow-hidden shadow-2xl flex flex-col border border-stone-200">
        {/* Modal Header */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-300">
              Bukti & Struk Pesanan
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Order Status Tracker */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  Status Terkini
                </span>
                <h4 className="text-sm font-bold text-stone-900">
                  {statusSteps[currentStepIndex]?.label}
                </h4>
              </div>

              {order.status !== 'selesai' && (
                <button
                  onClick={advanceStatus}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 rounded-md transition-colors shadow-xs"
                >
                  Simulasi Tahap Lanjut →
                </button>
              )}
            </div>

            {/* Step Progress Bar */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {statusSteps.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={step.key} className="space-y-1">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        isPassed ? 'bg-amber-600' : 'bg-stone-200'
                      }`}
                    />
                    <span
                      className={`text-[10px] block truncate ${
                        isCurrent
                          ? 'font-bold text-amber-700'
                          : isPassed
                          ? 'text-stone-700 font-medium'
                          : 'text-stone-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-stone-500 pt-1">
              {statusSteps[currentStepIndex]?.desc}
            </p>
          </div>

          {/* Realistic Digital Receipt Slip */}
          <div className="bg-white border-2 border-dashed border-stone-300 rounded-xl p-5 shadow-xs font-mono text-xs text-stone-800 space-y-4 print:border-none print:shadow-none">
            {/* Restaurant Heading */}
            <div className="text-center pb-3 border-b border-dashed border-stone-300 space-y-0.5">
              <h3 className="text-base font-extrabold tracking-tight text-stone-900 font-sans">
                SELERA NUSANTARA
              </h3>
              <p className="text-[11px] text-stone-500 font-sans">
                Jl. Kuliner No. 88, Jakarta Selatan
              </p>
              <p className="text-[11px] text-stone-500 font-sans">
                Telp: 0812-9876-5432 · 100% Halal
              </p>
            </div>

            {/* Receipt Meta */}
            <div className="flex justify-between items-center text-[11px] text-stone-600 border-b border-dashed border-stone-300 pb-3">
              <div>
                <div>ID: <strong className="text-stone-900">{order.id}</strong></div>
                <div>{formatDateIndo(order.createdAt)}</div>
              </div>
              <div className="text-right">
                <div className="capitalize font-semibold text-stone-900">
                  {order.orderType === 'dine-in'
                    ? `Meja ${order.tableNumber}`
                    : order.orderType === 'takeaway'
                    ? 'Bawa Pulang'
                    : 'Pesan Antar'}
                </div>
                <div>Pemesan: {order.customerName}</div>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-2.5 border-b border-dashed border-stone-300 pb-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-semibold text-stone-900">
                    <span className="line-clamp-1">{item.quantity}x {item.name}</span>
                    <span>{formatRupiah(item.totalPrice)}</span>
                  </div>
                  {item.selectedPortion && item.selectedPortion.name !== 'Porsi Reguler' && (
                    <div className="text-[10px] text-stone-500 pl-4">
                      └ {item.selectedPortion.name}
                    </div>
                  )}
                  {item.selectedSpice && (
                    <div className="text-[10px] text-stone-500 pl-4">
                      └ Pedas: {item.selectedSpice}
                    </div>
                  )}
                  {item.selectedAddOns.length > 0 && (
                    <div className="text-[10px] text-stone-500 pl-4">
                      └ Extra: {item.selectedAddOns.map((a) => a.name).join(', ')}
                    </div>
                  )}
                  {item.notes && (
                    <div className="text-[10px] text-stone-500 italic pl-4">
                      └ "{item.notes}"
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="space-y-1.5 text-xs border-b border-dashed border-stone-300 pb-3">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>{formatRupiah(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Diskon ({order.discountCode || 'Promo'})</span>
                  <span>-{formatRupiah(order.discount)}</span>
                </div>
              )}
              {order.deliveryFee > 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>Ongkos Kirim</span>
                  <span>{formatRupiah(order.deliveryFee)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Biaya Layanan</span>
                <span>{formatRupiah(order.serviceFee)}</span>
              </div>
              <div className="flex justify-between pt-1.5 font-bold text-sm text-stone-900">
                <span>TOTAL AKHIR</span>
                <span>{formatRupiah(order.totalAmount)}</span>
              </div>
            </div>

            {/* Payment Info */}
            <div className="text-center pt-1 text-[11px] text-stone-500 space-y-1">
              <div>
                Metode Pembayaran:{' '}
                <strong className="uppercase text-stone-800">
                  {order.paymentMethod === 'qris'
                    ? 'QRIS Nasional'
                    : order.paymentMethod === 'cash'
                    ? 'Tunai / Kasir'
                    : order.paymentMethod === 'transfer'
                    ? 'Transfer Bank'
                    : 'E-Wallet'}
                </strong>
              </div>
              {order.paymentMethod === 'qris' && (
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 inline-block my-2 text-center">
                  <div className="w-28 h-28 mx-auto bg-stone-900 text-white rounded flex items-center justify-center p-2">
                    <QrCode className="w-24 h-24" />
                  </div>
                  <span className="text-[10px] text-stone-600 block mt-1 font-semibold">
                    Scan QRIS untuk Verifikasi Cepat
                  </span>
                </div>
              )}
              {order.paymentMethod === 'transfer' && (
                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-[11px] font-sans">
                  <strong>BCA: 829-102-9988</strong> <br />
                  a.n PT Selera Nusantara Boga
                </div>
              )}
              <p className="font-sans italic pt-1">
                Terima kasih atas pesanan Anda! Selamat menikmati hidangan nusantara.
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="space-y-2.5 font-sans">
            {/* WhatsApp Direct Share Button */}
            <button
              onClick={handleWhatsAppShare}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Kirim Pesanan ke WhatsApp Kasir</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handlePrint}
                className="py-2.5 px-3 border border-stone-300 hover:bg-stone-100 text-stone-700 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Struk</span>
              </button>

              <button
                onClick={handleCopyOrderId}
                className="py-2.5 px-3 border border-stone-300 hover:bg-stone-100 text-stone-700 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'ID Tersalin!' : 'Salin ID Pesanan'}</span>
              </button>
            </div>

            <button
              onClick={onOrderAgain}
              className="w-full py-2.5 text-xs font-bold text-amber-700 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors text-center block"
            >
              + Pesan Menu Lainnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
