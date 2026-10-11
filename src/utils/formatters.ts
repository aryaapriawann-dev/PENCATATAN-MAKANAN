import { Order } from '../types';

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function generateOrderId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SN-${code}`;
}

export function formatDateIndo(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function buildWhatsAppMessage(order: Order, restaurantName = 'Selera Nusantara'): string {
  const dateFormatted = formatDateIndo(order.createdAt);
  
  let orderTypeText = '🍽️ Makan di Tempat (Dine-in)';
  if (order.orderType === 'takeaway') orderTypeText = '🥡 Bawa Pulang (Takeaway)';
  if (order.orderType === 'delivery') orderTypeText = '🛵 Pesan Antar (Delivery)';

  let paymentText = 'QRIS';
  if (order.paymentMethod === 'cash') paymentText = 'Tunai / Kasir';
  if (order.paymentMethod === 'transfer') paymentText = 'Transfer Bank';
  if (order.paymentMethod === 'ewallet') paymentText = 'E-Wallet';

  let msg = `Halo *${restaurantName}*, saya ingin konfirmasi pesanan:\n\n`;
  msg += `*ID PESANAN:* #${order.id}\n`;
  msg += `*Waktu:* ${dateFormatted}\n`;
  msg += `*Nama Pemesan:* ${order.customerName}\n`;
  msg += `*No. WhatsApp:* ${order.customerPhone}\n`;
  msg += `*Tipe Pesanan:* ${orderTypeText}\n`;

  if (order.orderType === 'dine-in' && order.tableNumber) {
    msg += `*Nomor Meja:* Meja ${order.tableNumber}\n`;
  }
  if (order.orderType === 'delivery' && order.deliveryAddress) {
    msg += `*Alamat Pengantaran:* ${order.deliveryAddress}\n`;
    if (order.deliveryNotes) {
      msg += `*Catatan Alamat:* ${order.deliveryNotes}\n`;
    }
  }

  msg += `\n*--- RINCIAN MENU ---*\n`;
  order.items.forEach((item, index) => {
    msg += `${index + 1}. *${item.menuItem.name}* (${item.quantity}x) = ${formatRupiah(item.totalPrice)}\n`;
    if (item.selectedPortion && item.selectedPortion.name !== 'Porsi Reguler') {
      msg += `   └ Porsi: ${item.selectedPortion.name}\n`;
    }
    if (item.selectedSpice) {
      msg += `   └ Pedas: ${item.selectedSpice}\n`;
    }
    if (item.selectedAddOns && item.selectedAddOns.length > 0) {
      msg += `   └ Tambahan: ${item.selectedAddOns.map((a) => a.name).join(', ')}\n`;
    }
    if (item.notes) {
      msg += `   └ Catatan: "${item.notes}"\n`;
    }
  });

  msg += `\n*--- PEMBAYARAN ---*\n`;
  msg += `Subtotal: ${formatRupiah(order.subtotal)}\n`;
  if (order.discount > 0) {
    msg += `Diskon Promo (${order.discountCode || 'Promo'}): -${formatRupiah(order.discount)}\n`;
  }
  if (order.deliveryFee > 0) {
    msg += `Ongkos Kirim: ${formatRupiah(order.deliveryFee)}\n`;
  }
  if (order.serviceFee > 0) {
    msg += `Biaya Layanan: ${formatRupiah(order.serviceFee)}\n`;
  }
  msg += `*TOTAL PEMBAYARAN: ${formatRupiah(order.totalAmount)}*\n`;
  msg += `Metode Pembayaran: *${paymentText}*\n\n`;
  msg += `Mohon segera diproses ya. Terima kasih! 🙏`;

  return msg;
}
