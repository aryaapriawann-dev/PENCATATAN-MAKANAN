export type FoodCategory = 'semua' | 'makanan' | 'minuman' | 'snack' | 'paket';

export interface PortionOption {
  name: string;
  extraPrice: number;
}

export interface AddOnOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'makanan' | 'minuman' | 'snack' | 'paket';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  description: string;
  image: string;
  prepTime: string;
  spicyLevel?: number; // 0 to 3
  isPopular?: boolean;
  isBestSeller?: boolean;
  tags: string[];
  portionOptions?: PortionOption[];
  spiceLevels?: string[];
  addOns?: AddOnOption[];
}

export interface CartItem {
  cartId: string;
  menuItem: MenuItem;
  name: string;
  image?: string;
  price?: number;
  quantity: number;
  selectedPortion?: PortionOption;
  selectedSpice?: string;
  selectedAddOns: AddOnOption[];
  notes?: string;
  itemUnitPrice: number;
  totalPrice: number;
}

export type OrderType = 'dine-in' | 'takeaway' | 'delivery';
export type PaymentMethod = 'qris' | 'cash' | 'transfer' | 'ewallet';
export type OrderStatus = 'diterima' | 'dimasak' | 'siap' | 'selesai';

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  tableNumber?: string;
  deliveryAddress?: string;
  deliveryNotes?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  deliveryFee: number;
  serviceFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  estimatedMinutes: number;
}
