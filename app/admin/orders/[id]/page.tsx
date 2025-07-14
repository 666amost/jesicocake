'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeftIcon, PrinterIcon, PhoneIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { QRCodeSVG } from 'qrcode.react';
import supabase from '@/lib/supabase';
import { formatCurrency, formatOrderForWhatsApp } from '@/lib/utils';
import { Order, OrderItem } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { id: orderId } = use(params);
  
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    fetchOrderDetails();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('order_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload) => {
          console.log('Received realtime update:', payload);
          if (payload.new) {
            setOrder(payload.new as Order);
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      channel.unsubscribe();
    };
  }, [orderId]);
  
  const fetchOrderDetails = async () => {
    try {
      setIsRefreshing(true);
      // Fetch order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      
      if (orderError) throw orderError;
      
      setOrder(orderData as Order);
      
      // Fetch order items
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          product:product_id(*),
          topping:topping_id(*)
        `)
        .eq('order_id', orderId);
      
      if (itemsError) throw itemsError;
      
      setOrderItems(itemsData as OrderItem[]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch order details",
        variant: "destructive"
      });
      router.push('/admin/orders');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return;
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', order.id);
      if (error) throw error;
      // Paksa fetch data terbaru
      await fetchOrderDetails();
      toast({
        title: "Order Updated",
        description: `Order status has been updated to ${newStatus}.`
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update order status",
        variant: "destructive"
      });
    }
  };
  
  const updatePaymentStatus = async (newStatus: string) => {
    if (!order) return;
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: newStatus })
        .eq('id', order.id);
      if (error) throw error;
      // Paksa fetch data terbaru
      await fetchOrderDetails();
      toast({
        title: "Payment Status Updated",
        description: `Payment status has been updated to ${newStatus}.`
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update payment status",
        variant: "destructive"
      });
    }
  };
  
  const handlePrint = async () => {
    // Pastikan data terbaru sebelum print
    await fetchOrderDetails();
    setTimeout(() => {
    window.print();
    }, 200); // beri jeda agar state update
  };
  
  const sendWhatsAppNotification = () => {
    if (!order) return;
    
    // Format pesan notifikasi untuk pelanggan
    const message = encodeURIComponent(
      `Halo ${order.customer_name},\n\n` +
      `Ini adalah notifikasi untuk pesanan Anda dengan ID: ${order.id.substr(0, 8)}\n\n` +
      `Status pesanan: *${order.status}*\n` +
      `Status pembayaran: *${order.payment_status}*\n` +
      `Tanggal pengiriman: ${new Date(order.delivery_date).toLocaleDateString()}\n\n` +
      `Jika Anda memiliki pertanyaan, silakan hubungi kami.\n` +
      `Terima kasih!`
    );
    
    // Generate WhatsApp link untuk pelanggan
    const phoneNumber = order.customer_phone.startsWith('+') ? 
      order.customer_phone.substring(1) : 
      order.customer_phone.startsWith('0') ? 
        `62${order.customer_phone.substring(1)}` : 
        order.customer_phone;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Order not found.</p>
        <Link
          href="/admin/orders"
          className="mt-4 inline-flex items-center text-orange-600 hover:text-orange-700"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between no-print">
        <div className="flex items-center">
          <Link 
            href="/admin/orders" 
            className="mr-4 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Order Details
            </h1>
            <p className="text-gray-600">
              Order ID: {order.id}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4 sm:mt-0">
          <button
            onClick={fetchOrderDetails}
            disabled={isRefreshing}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        <button
          onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
        >
          <PrinterIcon className="w-5 h-5 mr-2" />
          Print Invoice
        </button>
          
          <button
            onClick={sendWhatsAppNotification}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <PhoneIcon className="w-5 h-5 mr-2" />
            Notifikasi Pelanggan
          </button>
        </div>
            </div>
            
      <div className="print-invoice bg-white rounded-lg shadow-sm overflow-hidden p-8 mx-auto" style={{maxWidth: '800px'}}>
        {/* HEADER INVOICE */}
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
            <div className="text-gray-600 mt-2 text-sm">Tanggal: {new Date(order.created_at).toLocaleDateString('id-ID')}</div>
            <div className="text-gray-600 text-sm">No. Invoice: {order.id.slice(0, 8).toUpperCase()}</div>
          </div>
          <div className="text-right">
            <div className="text-gray-700 font-semibold">
              Status: 
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(e.target.value)}
                className="ml-2 p-1 border rounded no-print"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              <span className="print-only capitalize">{order.status}</span>
              </div>
            <div className="text-gray-700 font-semibold">
              Pembayaran: 
                <select
                  value={order.payment_status}
                  onChange={(e) => updatePaymentStatus(e.target.value)}
                className="ml-2 p-1 border rounded no-print"
                >
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                <option value="refunded">Refunded</option>
                </select>
              <span className="print-only capitalize">{order.payment_status}</span>
            </div>
          </div>
        </div>
        {/* CUSTOMER & DELIVERY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="font-semibold text-gray-700 mb-1">Customer</h2>
            <div className="text-gray-800">{order.customer_name}</div>
            <div className="text-gray-800">{order.customer_phone}</div>
            <div className="text-gray-800">{order.customer_address}</div>
          </div>
          <div>
            <h2 className="font-semibold text-gray-700 mb-1">Pengiriman</h2>
            <div className="text-gray-800">{new Date(order.delivery_date).toLocaleDateString('id-ID')}</div>
            {order.notes && <div className="text-gray-800 mt-2">Catatan: {order.notes}</div>}
          </div>
              </div>
        {/* ORDER ITEMS TABLE */}
        <table className="w-full mb-8 border-t border-b">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-2 text-left text-sm font-semibold text-gray-700">Produk</th>
              <th className="py-2 px-2 text-center text-sm font-semibold text-gray-700">Qty</th>
              <th className="py-2 px-2 text-right text-sm font-semibold text-gray-700">Harga</th>
              <th className="py-2 px-2 text-right text-sm font-semibold text-gray-700">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item) => (
              <tr key={item.id} className="border-b last:border-b-0">
                <td className="py-2 px-2 text-gray-800">
                  {item.product?.name}
                  {item.topping && (
                    <span className="block text-xs text-gray-500">Topping: {item.topping.name}</span>
                  )}
                </td>
                <td className="py-2 px-2 text-center text-gray-800">{item.quantity}</td>
                <td className="py-2 px-2 text-right text-gray-800">{formatCurrency(item.unit_price + (item.topping_price || 0))}</td>
                <td className="py-2 px-2 text-right text-gray-800">{formatCurrency((item.unit_price + (item.topping_price || 0)) * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* TOTAL */}
        <div className="flex justify-end mb-8">
          <div className="w-full md:w-1/2">
            <div className="flex justify-between py-2 border-b">
              <span className="font-semibold text-gray-700">Total</span>
              <span className="font-bold text-orange-600 text-lg">{formatCurrency(order.total_amount)}</span>
            </div>
          </div>
        </div>
        {/* PAYMENT INFORMATION */}
        <div className="mb-8 border-t pt-4">
          <h3 className="font-semibold text-gray-800 mb-2">Informasi Pembayaran:</h3>
          <div className="space-y-1 text-gray-700">
            <p><span className="font-semibold">Bank BCA:</span> 7025-085-281</p>
            <p><span className="font-semibold">Atas Nama:</span> JESICA</p>
            <p className="text-sm text-gray-500 mt-2">* Mohon transfer sesuai dengan total pembayaran</p>
          </div>
        </div>
        {/* QR CODE */}
        <div className="flex justify-end items-end mt-12">
          <div className="text-center">
            <QRCodeSVG value={`Order:${order.id}`} size={120} includeMargin={true} level="M" />
            <div className="text-xs text-gray-500 mt-2">Scan QR untuk verifikasi pesanan</div>
          </div>
        </div>
      </div>
      {/* PRINT STYLES */}
      <style jsx global>{`
        @media print {
          .no-print, .no-print * {
            display: none !important;
          }
          .print-only {
            display: inline !important;
          }
          body {
            background: #fff !important;
          }
        }
        .print-only {
          display: none;
        }
      `}</style>
    </div>
  );
}