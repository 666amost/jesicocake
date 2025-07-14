import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CartItem } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateOrderId(): string {
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `JC${year}${month}${day}${random}`;
}

export function getMinDeliveryDate(): string {
  const today = new Date();
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  minDate.setDate(minDate.getDate() + 3); // Minimum 2 days in advance, fix timezone issue
  return minDate.toISOString().split('T')[0];
}

export function getMaxDeliveryDate(): string {
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 30); // Maximum 30 days (1 bulan) in advance
  return maxDate.toISOString().split('T')[0];
}

export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    const productPrice = item.product?.price || 0;
    const toppingPrice = item.topping?.price || 0;
    return total + (productPrice + toppingPrice) * item.quantity;
  }, 0);
}

export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  
  return `INV/${year}${month}${day}/${hour}${minute}${random}`;
}

export function getWhatsAppUrl(
  phone: string, 
  orderId: string, 
  customerName: string, 
  totalAmount: number
): string {
  const message = encodeURIComponent(
    `Halo Jesica, saya sudah melakukan pemesanan kue dengan:\n\n` +
    `No. Pesanan: ${orderId}\n` +
    `Nama: ${customerName}\n` +
    `Total: ${formatCurrency(totalAmount)}\n\n` +
    `Mohon konfirmasi pesanan saya. Terima kasih!`
  );
  
  // Ensure phone number is in the correct format
  const formattedPhone = phone.startsWith('+') ? phone.substring(1) : phone;
  
  return `https://wa.me/${formattedPhone}?text=${message}`;
}

export function formatOrderForWhatsApp(orderData: any): string {
  if (!orderData) return '';
  
  const orderDate = new Date().toLocaleDateString('id-ID');
  const orderTime = new Date().toLocaleTimeString('id-ID');
  
  let message = `*PESANAN BARU - ${orderDate} ${orderTime}*\n\n`;
  message += `*Nama*: ${orderData.customer_name}\n`;
  message += `*Telepon*: ${orderData.customer_phone}\n`;
  message += `*Alamat*: ${orderData.customer_address}\n`;
  message += `*Tanggal Pengiriman*: ${orderData.delivery_date}\n\n`;
  
  message += "*Detail Pesanan*:\n";
  if (orderData.items && orderData.items.length) {
    orderData.items.forEach((item: any, index: number) => {
      message += `${index + 1}. ${item.name || 'Produk'} - ${item.quantity}x @Rp${item.price?.toLocaleString('id-ID') || '0'}\n`;
      if (item.toppings) {
        message += `   Topping: ${item.toppings}\n`;
      }
    });
  }
  
  message += `\n*Total*: Rp${orderData.total_amount?.toLocaleString('id-ID') || '0'}\n\n`;
  message += "*Informasi Pembayaran*:\n";
  message += "Bank BCA\n";
  message += "Account Name: Jesica\n";
  message += "Account Number: 7025-085-281\n\n";
  message += "Silahkan kirim bukti transfer segera. Terima kasih!";
  
  return encodeURIComponent(message);
}