import React from 'react';
import { X, Receipt, RotateCcw, Clock, Utensils, ArrowRight } from 'lucide-react';
import { Order } from '../types';
import { formatRupiah, formatDateIndo } from '../utils/formatters';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onReorder: (order: Order) => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  orders,
  onSelectOrder,
  onReorder,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-stone-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900">Riwayat Pesanan</h2>
            <p className="text-xs text-stone-500">Daftar pesanan Anda yang pernah dibuat</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {orders.length === 0 ? (
            <div className="py-12 text-center text-stone-400 space-y-2">
              <Utensils className="w-10 h-10 mx-auto text-stone-300" />
              <p className="text-sm font-semibold text-stone-600">Belum Ada Riwayat Pesanan</p>
              <p className="text-xs text-stone-400">
                Setelah Anda membuat pesanan, riwayat dan struk pesanan akan tersimpan di sini.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-xl border border-stone-200 hover:border-amber-300 bg-stone-50/50 hover:bg-white transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-stone-900">#{order.id}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          order.status === 'selesai'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'siap'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'dimasak'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDateIndo(order.createdAt)}</span>
                    </div>
                  </div>

                  <span className="font-extrabold text-sm text-stone-900">
                    {formatRupiah(order.totalAmount)}
                  </span>
                </div>

                {/* Items summary */}
                <div className="text-xs text-stone-600 line-clamp-2">
                  {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      onSelectOrder(order);
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-amber-700 transition-colors"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Lihat Struk</span>
                  </button>

                  <button
                    onClick={() => {
                      onReorder(order);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Pesan Ulang</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
