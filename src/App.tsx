/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { MenuCard } from './components/MenuCard';
import { MenuItemModal } from './components/MenuItemModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ReceiptModal } from './components/ReceiptModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { MENU_ITEMS, VOUCHERS } from './data/menuData';
import {
  MenuItem,
  CartItem,
  Order,
  FoodCategory,
  OrderType,
  OrderStatus,
  PortionOption,
  AddOnOption,
} from './types';
import { formatRupiah } from './utils/formatters';
import {
  ShoppingBag,
  ArrowRight,
  UtensilsCrossed,
  MapPin,
  Phone,
  Clock,
  Heart,
  Search,
  Sparkles,
} from 'lucide-react';

const CART_STORAGE_KEY = 'selera_nusantara_cart_v1';
const ORDERS_STORAGE_KEY = 'selera_nusantara_orders_v1';

export default function App() {
  // State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('semua');
  const [activeFilter, setActiveFilter] = useState<'all' | 'popular' | 'spicy' | 'budget'>('all');
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  
  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<Order | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Order Options & Promo
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync cart and orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Toast helper
  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Filtered menu items
  const filteredMenuItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesTag = item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesTag) return false;
      }

      // Category
      if (selectedCategory !== 'semua' && item.category !== selectedCategory) {
        return false;
      }

      // Quick filter
      if (activeFilter === 'popular' && !item.isPopular && !item.isBestSeller) {
        return false;
      }
      if (activeFilter === 'spicy' && (!item.spicyLevel || item.spicyLevel < 1)) {
        return false;
      }
      if (activeFilter === 'budget' && item.price > 25000) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, activeFilter]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<FoodCategory, number> = {
      semua: MENU_ITEMS.length,
      makanan: MENU_ITEMS.filter((i) => i.category === 'makanan').length,
      minuman: MENU_ITEMS.filter((i) => i.category === 'minuman').length,
      snack: MENU_ITEMS.filter((i) => i.category === 'snack').length,
      paket: MENU_ITEMS.filter((i) => i.category === 'paket').length,
    };
    return counts;
  }, []);

  // Cart Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [cart]);

  const deliveryFee = orderType === 'delivery' ? 12000 : 0;
  const serviceFee = subtotal > 0 ? 2000 : 0;

  const discountAmount = useMemo(() => {
    if (!voucherCode) return 0;
    const v = VOUCHERS.find((voucher) => voucher.code === voucherCode);
    if (!v) return 0;
    if (subtotal < (v.minOrder || 0)) return 0;

    if (v.discountPercent) {
      const calc = (subtotal * v.discountPercent) / 100;
      return v.maxDiscount ? Math.min(calc, v.maxDiscount) : calc;
    }
    if (v.discountAmount) {
      return Math.min(v.discountAmount, subtotal);
    }
    return 0;
  }, [voucherCode, subtotal]);

  const totalAmount = Math.max(0, subtotal - discountAmount + deliveryFee + serviceFee);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Cart Handlers
  const handleQuickAdd = (menuItem: MenuItem) => {
    // If the item has multiple options, open the customizer modal for best UX
    if (
      (menuItem.portionOptions && menuItem.portionOptions.length > 1) ||
      (menuItem.spiceLevels && menuItem.spiceLevels.length > 1) ||
      (menuItem.addOns && menuItem.addOns.length > 0)
    ) {
      setSelectedMenuItem(menuItem);
      return;
    }

    // Direct add
    const cartId = `${menuItem.id}-reguler`;
    setCart((prev) => {
      const existing = prev.find((i) => i.cartId === cartId);
      if (existing) {
        return prev.map((i) =>
          i.cartId === cartId
            ? {
                ...i,
                quantity: i.quantity + 1,
                totalPrice: (i.quantity + 1) * i.itemUnitPrice,
              }
            : i
        );
      } else {
        const newItem: CartItem = {
          cartId,
          menuItem,
          name: menuItem.name,
          price: menuItem.price,
          image: menuItem.image,
          quantity: 1,
          selectedAddOns: [],
          itemUnitPrice: menuItem.price,
          totalPrice: menuItem.price,
        };
        return [...prev, newItem];
      }
    });

    addToast('success', `${menuItem.name} ditambahkan ke keranjang!`);
  };

  const handleAddCustomizedToCart = (
    menuItem: MenuItem,
    quantity: number,
    portion?: PortionOption,
    spice?: string,
    addOns: AddOnOption[] = [],
    notes?: string
  ) => {
    const portionPrice = portion ? portion.extraPrice : 0;
    const addOnsTotal = addOns.reduce((s, a) => s + a.price, 0);
    const unitPrice = menuItem.price + portionPrice + addOnsTotal;

    const cartId = `${menuItem.id}-${portion?.name || 'reg'}-${spice || 'def'}-${addOns.map((a) => a.id).join('-')}-${notes || ''}`;

    setCart((prev) => {
      const existing = prev.find((i) => i.cartId === cartId);
      if (existing) {
        return prev.map((i) =>
          i.cartId === cartId
            ? {
                ...i,
                quantity: i.quantity + quantity,
                totalPrice: (i.quantity + quantity) * unitPrice,
              }
            : i
        );
      } else {
        const newItem: CartItem = {
          cartId,
          menuItem,
          name: menuItem.name,
          price: unitPrice,
          image: menuItem.image,
          quantity,
          selectedPortion: portion,
          selectedSpice: spice,
          selectedAddOns: addOns,
          notes,
          itemUnitPrice: unitPrice,
          totalPrice: unitPrice * quantity,
        };
        return [...prev, newItem];
      }
    });

    addToast('success', `${quantity}x ${menuItem.name} ditambahkan ke keranjang!`);
  };

  const handleUpdateCartQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(cartId);
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i.cartId === cartId
          ? {
              ...i,
              quantity,
              totalPrice: quantity * i.itemUnitPrice,
            }
          : i
      )
    );
  };

  const handleRemoveCartItem = (cartId: string) => {
    setCart((prev) => prev.filter((i) => i.cartId !== cartId));
    addToast('info', 'Item dihapus dari keranjang.');
  };

  const handleApplyVoucher = (code: string) => {
    const v = VOUCHERS.find((voucher) => voucher.code === code);
    if (!v) {
      addToast('error', 'Kode voucher tidak valid!');
      return;
    }
    if (subtotal < (v.minOrder || 0)) {
      addToast('error', `Min order ${formatRupiah(v.minOrder || 0)} untuk voucher ini!`);
      return;
    }
    setVoucherCode(code);
    addToast('success', `Voucher ${code} berhasil dipasang!`);
  };

  const handleRemoveVoucher = () => {
    setVoucherCode('');
    addToast('info', 'Voucher dibatalkan.');
  };

  // Order Placement
  const handleOrderCreated = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setCart([]); // Reset active cart
    setVoucherCode('');
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setActiveReceiptOrder(order);
    addToast('success', `Pesanan #${order.id} berhasil dibuat!`);
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    if (activeReceiptOrder && activeReceiptOrder.id === orderId) {
      setActiveReceiptOrder((prev) => (prev ? { ...prev, status } : null));
    }
    addToast('info', `Status pesanan diubah ke: ${status}`);
  };

  const handleReorder = (order: Order) => {
    setCart(order.items);
    setIsCartOpen(true);
    addToast('success', `Item dari pesanan #${order.id} dimuat ke keranjang!`);
  };

  // Helper count in cart for a specific menu item
  const getMenuItemCartCount = (itemId: string) => {
    return cart
      .filter((i) => i.menuItem.id === itemId)
      .reduce((sum, i) => sum + i.quantity, 0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Navigation Bar */}
      <Navbar
        cartCount={totalCartCount}
        cartTotal={totalAmount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        orderHistoryCount={orders.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto pb-24 sm:pb-16">
        {/* Hero & Promotion Banner */}
        <HeroBanner
          onApplyVoucher={handleApplyVoucher}
          appliedVoucherCode={voucherCode}
          onShowCategory={(cat) => {
            setSelectedCategory(cat);
            window.scrollTo({ top: 400, behavior: 'smooth' });
          }}
        />

        {/* Category & Fast Filter Tabs */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          activeFilter={activeFilter}
          onSelectFilter={(f) => setActiveFilter(f)}
          counts={categoryCounts}
        />

        {/* Menu Items Grid */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
                {selectedCategory === 'semua'
                  ? 'Daftar Menu Pilihan'
                  : selectedCategory === 'makanan'
                  ? 'Makanan Utama'
                  : selectedCategory === 'minuman'
                  ? 'Minuman Segar'
                  : selectedCategory === 'snack'
                  ? 'Cemilan & Kudapan'
                  : 'Paket Hemat Lengkap'}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Menampilkan {filteredMenuItems.length} menu lezat siap santap
              </p>
            </div>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-amber-700 hover:underline font-semibold"
              >
                Reset Pencarian
              </button>
            )}
          </div>

          {filteredMenuItems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200/80 p-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-base text-stone-800">
                Menu Tidak Ditemukan
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Tidak ada menu yang sesuai dengan kata kunci "{searchQuery}". Coba gunakan kata kunci lain seperti "nasi", "es", "ayam", atau pilih kategori lain.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('semua');
                  setActiveFilter('all');
                }}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors"
              >
                Tampilkan Semua Menu
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredMenuItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onQuickAdd={handleQuickAdd}
                  onOpenDetails={(item) => setSelectedMenuItem(item)}
                  cartQuantity={getMenuItemCartCount(item.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Floating Sticky Mobile Cart Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 p-3 sm:hidden z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-xl">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm flex items-center justify-between shadow-lg active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-white text-amber-700 text-xs font-extrabold flex items-center justify-center">
                {totalCartCount}
              </div>
              <span>Lihat Pesanan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>{formatRupiah(totalAmount)}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-stone-900 text-white border-t border-stone-800 mt-16 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand column */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-sm">
                  <UtensilsCrossed className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="font-extrabold text-xl text-white tracking-tight">
                  Selera<span className="text-amber-500">Nusantara</span>
                </span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Warung makan & resto modern menyajikan kelezatan resep autentik nusantara dengan bahan segar dan rempah alami terbaik.
              </p>
              <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Restoran Buka Setiap Hari (09.00 - 22.00 WIB)</span>
              </div>
            </div>

            {/* Location & Contact */}
            <div className="space-y-2.5 text-xs text-stone-400 md:col-span-1">
              <h4 className="font-bold text-sm text-stone-200">Kontak & Lokasi</h4>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Jl. Senopati Raya No. 88, Kebayoran Baru, Jakarta Selatan</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>WhatsApp: 0812-9876-5432</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Dapur: 09:00 - 21:30 WIB</span>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-2 text-xs text-stone-400 md:col-span-1">
              <h4 className="font-bold text-sm text-stone-200">Layanan Pemesanan</h4>
              <ul className="space-y-1.5">
                <li>• Dine-In (Pesan langsung di nomor meja)</li>
                <li>• Takeaway (Bungkus & ambil sendiri)</li>
                <li>• Delivery (Pesan antar ke rumah/kantor)</li>
                <li>• Pesanan Katering & Kotakan (Hubungi WA)</li>
              </ul>
            </div>

            {/* Payment & Guarantees */}
            <div className="space-y-2 text-xs text-stone-400 md:col-span-1">
              <h4 className="font-bold text-sm text-stone-200">Metode Pembayaran</h4>
              <p className="leading-relaxed">
                Menerima QRIS (semua e-wallet dan mobile banking), Tunai di kasir, dan Transfer Bank BCA / Mandiri.
              </p>
              <div className="pt-2 flex items-center gap-2 flex-wrap">
                <span className="px-2 py-1 rounded bg-stone-800 text-[11px] font-bold text-stone-300">QRIS</span>
                <span className="px-2 py-1 rounded bg-stone-800 text-[11px] font-bold text-stone-300">BCA</span>
                <span className="px-2 py-1 rounded bg-stone-800 text-[11px] font-bold text-stone-300">GoPay</span>
                <span className="px-2 py-1 rounded bg-stone-800 text-[11px] font-bold text-stone-300">OVO</span>
                <span className="px-2 py-1 rounded bg-stone-800 text-[11px] font-bold text-stone-300">ShopeePay</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
            <p>© {new Date().getFullYear()} Selera Nusantara. Seluruh Hak Cipta Dilindungi.</p>
            <p className="flex items-center gap-1">
              Dibuat dengan <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> untuk pecinta kuliner nusantara.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <MenuItemModal
        item={selectedMenuItem}
        onClose={() => setSelectedMenuItem(null)}
        onAddToCart={handleAddCustomizedToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        orderType={orderType}
        onChangeOrderType={setOrderType}
        voucherCode={voucherCode}
        onApplyVoucher={handleApplyVoucher}
        onRemoveVoucher={handleRemoveVoucher}
        discountAmount={discountAmount}
        deliveryFee={deliveryFee}
        serviceFee={serviceFee}
        subtotal={subtotal}
        totalAmount={totalAmount}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        orderType={orderType}
        onChangeOrderType={setOrderType}
        subtotal={subtotal}
        discount={discountAmount}
        discountCode={voucherCode}
        deliveryFee={deliveryFee}
        serviceFee={serviceFee}
        totalAmount={totalAmount}
        onOrderCreated={handleOrderCreated}
      />

      <ReceiptModal
        order={activeReceiptOrder}
        onClose={() => setActiveReceiptOrder(null)}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onOrderAgain={() => setActiveReceiptOrder(null)}
      />

      <OrderHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        orders={orders}
        onSelectOrder={(ord) => {
          setIsHistoryOpen(false);
          setActiveReceiptOrder(ord);
        }}
        onReorder={handleReorder}
      />

      {/* Toast Notifications Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
