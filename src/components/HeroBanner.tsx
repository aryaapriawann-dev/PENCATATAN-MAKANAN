import React from 'react';
import { Sparkles, Tag, ShieldCheck, Flame, Bike, Copy, Check } from 'lucide-react';
import { VOUCHERS } from '../data/menuData';

interface HeroBannerProps {
  onApplyVoucher: (code: string) => void;
  appliedVoucherCode?: string;
  onShowCategory: (cat: 'paket' | 'makanan') => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onApplyVoucher,
  appliedVoucherCode,
  onShowCategory,
}) => {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopy = (code: string) => {
    onApplyVoucher(code);
    setCopiedCode(code);
    navigator.clipboard?.writeText(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 text-white rounded-2xl mx-4 sm:mx-6 lg:mx-8 my-6 shadow-xl border border-amber-900/50">
      {/* Background Decorative glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-orange-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-8 sm:py-12 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Content */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-md border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Cita Rasa Otentik Warisan Nusantara</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Pesan Menu Favoritmu, <br />
              <span className="text-amber-400">Lezat, Cepat & Hangat!</span>
            </h1>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Pilihan aneka kuliner khas daerah dengan bumbu rempah pilihan. Cocok untuk makan siang di kantor, santap malam keluarga, atau kumpul bersama teman.
            </p>

            {/* Value badges */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-stone-300 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Halal & Bersih</span>
              </div>
              <span className="text-stone-600">·</span>
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Dimasak Segar Sesuai Pesanan</span>
              </div>
              <span className="text-stone-600">·</span>
              <div className="flex items-center gap-1.5">
                <Bike className="w-4 h-4 text-amber-400" />
                <span>Dine-In, Takeaway & Delivery</span>
              </div>
            </div>

            {/* Quick Action buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onShowCategory('paket')}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm rounded-lg shadow-md transition-all active:scale-95"
              >
                Lihat Paket Hemat 🔥
              </button>
              <button
                onClick={() => onShowCategory('makanan')}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm rounded-lg border border-white/20 transition-all"
              >
                Jelajahi Makanan Utama
              </button>
            </div>
          </div>

          {/* Vouchers Section Card */}
          <div className="lg:col-span-5 bg-stone-900/80 backdrop-blur-md rounded-xl p-5 border border-amber-500/20 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-sm text-stone-200">Voucher Promo Hari Ini</h3>
              <span className="text-[11px] text-amber-400 ml-auto font-medium">Klik untuk pasang</span>
            </div>

            <div className="space-y-2.5">
              {VOUCHERS.map((voucher) => {
                const isApplied = appliedVoucherCode === voucher.code;
                const isJustCopied = copiedCode === voucher.code;
                return (
                  <div
                    key={voucher.code}
                    onClick={() => handleCopy(voucher.code)}
                    className={`cursor-pointer group flex items-center justify-between p-3 rounded-lg border transition-all ${
                      isApplied
                        ? 'bg-amber-500/15 border-amber-400 text-amber-200'
                        : 'bg-stone-800/60 hover:bg-stone-800 border-stone-700/80 text-stone-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm tracking-wide text-amber-300">
                          {voucher.code}
                        </span>
                        {isApplied && (
                          <span className="text-[10px] bg-amber-500 text-stone-950 px-1.5 py-0.5 rounded font-extrabold uppercase">
                            Terpasang
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5">{voucher.description}</p>
                    </div>

                    <button
                      type="button"
                      className="ml-3 shrink-0 p-1.5 text-xs font-semibold rounded bg-white/5 group-hover:bg-amber-500 group-hover:text-stone-950 transition-colors flex items-center gap-1 text-stone-300"
                    >
                      {isJustCopied || isApplied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Dipakai</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Klaim</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-stone-400 mt-3 text-center">
              *Masukkan kode di keranjang saat pembayaran untuk mendapatkan potongan harga.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
