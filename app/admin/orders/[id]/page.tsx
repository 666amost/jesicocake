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

  // Fungsi download PDF invoice
  const handleDownloadPDF = async (orderId?: string) => {
    if (typeof window === 'undefined') return;
    
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const invoiceElement = document.querySelector('.print-invoice');
      if (!invoiceElement) {
        toast({
          title: "Error",
          description: "Invoice element not found",
          variant: "destructive"
        });
        return;
      }
      
      await html2pdf()
        .set({
          margin: 10,
          filename: `invoice-${orderId?.slice(0, 8) || 'order'}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        })
        .from(invoiceElement)
        .save();
        
      toast({
        title: "Success",
        description: "PDF downloaded successfully"
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive"
      });
    }
  };
  
  useEffect(() => {
    fetchOrderDetails(true);

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`order_changes_${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload) => {
          if (payload.new && payload.new.id === orderId) {
            setOrder(prevOrder => {
              if (!prevOrder) return payload.new as Order;
              return { ...prevOrder, ...payload.new } as Order;
            });
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [orderId]);
  
  const fetchOrderDetails = async (isInitialLoad = false) => {
    try {
      setIsRefreshing(true);
      
      // Fetch order data
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      
      if (orderError) {
        throw new Error(`Failed to fetch order: ${orderError.message}`);
      }
      
      if (!orderData) {
        throw new Error('Order not found');
      }
      
      setOrder(orderData as Order);
      
      // Fetch order items
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          id,
          order_id,
          product_id,
          topping_id,
          quantity,
          unit_price,
          topping_price,
          products!order_items_product_id_fkey(id, name, description, price, image_url),
          toppings!order_items_topping_id_fkey(id, name, price)
        `)
        .eq('order_id', orderId);
      
      if (itemsError) {
        throw itemsError;
      }
      
      // Transform data to match expected structure
      const transformedItems = itemsData?.map(item => ({
        ...item,
        // Use unit_price from order_items if available, otherwise use product price
        unit_price: item.unit_price || (item.products && item.products[0]?.price) || 0,
        topping_price: item.topping_price || (item.toppings && item.toppings[0]?.price) || 0,
        product: item.products ? {
          id: item.products[0]?.id ?? '',
          name: item.products[0]?.name ?? '',
          description: item.products[0]?.description ?? null,
          price: item.products[0]?.price ?? 0,
          image_url: item.products[0]?.image_url ?? null,
          category: '',
          available: true,
          stock: 0,
          created_at: '',
          updated_at: ''
        } : undefined,
        topping: item.toppings ? {
          id: item.toppings[0]?.id ?? '',
          name: item.toppings[0]?.name ?? '',
          price: item.toppings[0]?.price ?? 0,
          available: true,
          created_at: '',
          updated_at: ''
        } : undefined
      })) || [];
      
      console.log('Transformed items:', transformedItems); // Debug log
      
      // If transformed items exist but prices are still 0, try to calculate from order total
      if (transformedItems.length > 0 && transformedItems.every(item => (item.unit_price || 0) === 0)) {
        const totalQuantity = transformedItems.reduce((sum, item) => sum + item.quantity, 0);
        const averagePrice = totalQuantity > 0 ? orderData.total_amount / totalQuantity : 0;
        
        console.log('Calculating average price:', averagePrice, 'from total:', orderData.total_amount, 'for quantity:', totalQuantity);
        
        transformedItems.forEach(item => {
          if (!item.unit_price || item.unit_price === 0) {
            item.unit_price = averagePrice;
          }
        });
      }
      
      // If no items found, try to fetch from order_details as fallback
      if (!transformedItems.length || !transformedItems[0]?.product?.name) {
        const { data: detailsData, error: detailsError } = await supabase
          .from('order_details')
          .select('*')
          .eq('order_id', orderId);
          
        if (!detailsError && detailsData && detailsData.length > 0) {
          // Calculate average price per item from total amount
          const totalItems = detailsData.reduce((sum, detail) => sum + detail.quantity, 0);
          const averagePrice = totalItems > 0 ? orderData.total_amount / totalItems : 0;
          
          const detailsTransformed = detailsData.map(detail => ({
            id: detail.id,
            order_id: detail.order_id,
            product_id: '',
            topping_id: null,
            quantity: detail.quantity,
            unit_price: averagePrice, // Use calculated average price
            topping_price: 0,
            product: {
              id: '',
              name: detail.product_name,
              description: null,
              price: averagePrice,
              image_url: null,
              category: '',
              available: true,
              stock: 0,
              created_at: '',
              updated_at: ''
            },
            topping: detail.topping_name ? {
              id: '',
              name: detail.topping_name,
              price: 0,
              available: true,
              created_at: '',
              updated_at: ''
            } : undefined
          }));
          setOrderItems(detailsTransformed as OrderItem[]);
        } else {
          setOrderItems(transformedItems as OrderItem[]);
        }
      } else {
        setOrderItems(transformedItems as OrderItem[]);
      }
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
      const response = await fetch('/api/admin/orders/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
          updates: { status: newStatus }
        })
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update order status');
      }
      
      // Update local state
      if (result.data) {
        setOrder(prev => prev ? { ...prev, ...result.data } : null);
      } else {
        setOrder(prev => prev ? { 
          ...prev, 
          status: newStatus, 
          updated_at: new Date().toISOString() 
        } : null);
      }
      
      toast({
        title: "Order Updated",
        description: `Order status has been updated to ${newStatus}.`
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || 'Failed to update order status',
        variant: "destructive"
      });
    }
  };
  
  const updatePaymentStatus = async (newStatus: string) => {
    if (!order) return;
    
    try {
      const response = await fetch('/api/admin/orders/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
          updates: { payment_status: newStatus }
        })
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update payment status');
      }
      
      // Update local state
      if (result.data) {
        setOrder(prev => prev ? { ...prev, ...result.data } : null);
      } else {
        setOrder(prev => prev ? { 
          ...prev, 
          payment_status: newStatus, 
          updated_at: new Date().toISOString() 
        } : null);
      }
      
      toast({
        title: "Payment Status Updated",
        description: `Payment status has been updated to ${newStatus}.`
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || 'Failed to update payment status',
        variant: "destructive"
      });
    }
  };
  
  const handlePrint = () => {
    window.print();
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
              Order ID: {order?.id || 'N/A'}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
          <button
            onClick={() => fetchOrderDetails(false)}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm w-full sm:w-auto"
          >
            <ArrowPathIcon className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm w-full sm:w-auto"
          >
            <PrinterIcon className="w-4 h-4 mr-2" />
            Print Invoice
          </button>

          <button
            onClick={() => handleDownloadPDF(order?.id)}
            className="inline-flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm w-full sm:w-auto"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 16v-8m0 8l-4-4m4 4l4-4M4 20h16" /></svg>
            Download PDF
          </button>
          
          <button
            onClick={sendWhatsAppNotification}
            className="inline-flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm w-full sm:w-auto"
          >
            <PhoneIcon className="w-4 h-4 mr-2" />
            Notifikasi Pelanggan
          </button>
        </div>
      </div>
      
      {/* Admin Controls - Not printed */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 no-print">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status Pesanan:</label>
          <select
            value={order?.status || ''}
            onChange={(e) => updateOrderStatus(e.target.value)}
            className="w-full p-2 border rounded text-sm"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status Pembayaran:</label>
          <select
            value={order?.payment_status || ''}
            onChange={(e) => updatePaymentStatus(e.target.value)}
            className="w-full p-2 border rounded text-sm"
          >
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>
            
      <div className="print-invoice bg-white rounded-lg shadow-sm overflow-hidden p-8 mx-auto" style={{maxWidth: '800px'}}>
        {/* HEADER INVOICE */}
        <div className="flex justify-between items-start mb-8 border-b-2 border-gray-200 pb-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">INVOICE</h1>
            <div className="space-y-1">
              <div className="text-gray-600 text-sm">
                <span className="font-medium">Tanggal:</span> {order?.created_at ? new Date(order.created_at).toLocaleDateString('id-ID') : 'N/A'}
              </div>
              <div className="text-gray-600 text-sm">
                <span className="font-medium">No. Invoice:</span> {order?.id ? order.id.slice(0, 8).toUpperCase() : 'N/A'}
              </div>
            </div>
          </div>
          <div className="logo-container flex-shrink-0 ml-8">
            <img 
              src="/android-chrome-512x512.png" 
              alt="JESICO CAKE"
              className="logo-jesico w-20 h-20 object-contain"
            />
          </div>
        </div>
        {/* CUSTOMER & DELIVERY */}
        <div className="customer-delivery-container grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="customer-section bg-gray-50 p-4 rounded-lg">
            <h2 className="font-semibold text-gray-800 mb-3 text-lg border-b border-gray-200 pb-2">Customer</h2>
            <div className="space-y-2">
              <div className="text-gray-800 font-medium">{order?.customer_name || 'N/A'}</div>
              <div className="text-gray-700">{order?.customer_phone || 'N/A'}</div>
              <div className="text-gray-700 text-sm">{order?.customer_address || 'N/A'}</div>
            </div>
          </div>
          <div className="delivery-section bg-gray-50 p-4 rounded-lg">
            <h2 className="font-semibold text-gray-800 mb-3 text-lg border-b border-gray-200 pb-2">Pengiriman</h2>
            <div className="space-y-2">
              <div className="text-gray-800">
                <span className="font-medium">Tanggal:</span> {order?.delivery_date ? new Date(order.delivery_date).toLocaleDateString('id-ID') : 'N/A'}
              </div>
              {order?.notes && (
                <div className="text-gray-700 text-sm">
                  <span className="font-medium">Catatan:</span> {order.notes}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* ORDER ITEMS TABLE */}
        <table className="w-full mb-8 border-t border-b print-table">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-r">Produk</th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700 border-r" style={{width: '80px'}}>Qty</th>
              <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700 border-r" style={{width: '120px'}}>Harga</th>
              <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700" style={{width: '120px'}}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.length > 0 ? orderItems.map((item) => {
              const unitPrice = item.unit_price || 0;
              const toppingPrice = item.topping_price || 0;
              const totalPrice = unitPrice + toppingPrice;
              const subtotal = totalPrice * item.quantity;
              
              return (
                <tr key={item.id} className="border-b last:border-b-0">
                  <td className="py-3 px-4 text-gray-800 border-r">
                    <div className="font-medium">{item.product?.name || 'Product not found'}</div>
                    {item.topping && (
                      <div className="text-xs text-gray-500 mt-1">+ {item.topping.name}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-800 border-r">{item.quantity}</td>
                  <td className="py-3 px-4 text-right text-gray-800 border-r">
                    {totalPrice > 0 ? formatCurrency(totalPrice) : '-'}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-800 font-medium">
                    {subtotal > 0 ? formatCurrency(subtotal) : '-'}
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={4} className="py-6 px-4 text-center text-gray-500">
                  No order items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* TOTAL */}
        <div className="total-section flex justify-end mb-8">
          <div className="total-container w-full md:w-1/2 max-w-sm">
            <div className="total-box bg-gray-50 p-6 rounded-lg">
              <div className="total-row flex justify-between items-center py-4 border-b border-gray-300">
                <span className="total-label text-lg font-semibold text-gray-700">Total:</span>
                <span className="total-amount text-xl font-bold text-orange-600">{formatCurrency(order?.total_amount || 0)}</span>
              </div>
            </div>
          </div>
        </div>
        {/* PAYMENT INFORMATION */}
        <div className="mb-8 border-t-2 border-gray-200 pt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3 text-lg">Informasi Pembayaran</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="space-y-2 text-gray-700">
                  <p><span className="font-semibold text-gray-800">Bank:</span> BCA</p>
                  <p><span className="font-semibold text-gray-800">No. Rekening:</span> 7025-085-281</p>
                  <p><span className="font-semibold text-gray-800">Atas Nama:</span> JESICA</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                  <p className="font-medium text-yellow-800">Perhatian:</p>
                  <p className="text-yellow-700">Mohon transfer sesuai dengan total pembayaran</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* QR CODE */}
        <div className="flex justify-end items-end mt-12 qr-container">
          <div className="text-center">
            <QRCodeSVG 
              value={`Order ID: ${order?.id || 'N/A'}-${order?.status || 'N/A'}-${order?.payment_status || 'N/A'}`} 
              size={120} 
              includeMargin={true} 
              level="M" 
            />
            <div className="text-xs text-gray-500 mt-2">Scan QR untuk verifikasi pesanan</div>
          </div>
        </div>
      </div>
      {/* PRINT STYLES */}
      <style jsx global>{`
        @media print {
          /* Hide everything except the invoice */
          body * {
            visibility: hidden;
          }
          .print-invoice, .print-invoice * {
            visibility: visible;
          }
          .print-invoice {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 12mm !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            background: white !important;
            font-family: Arial, sans-serif !important;
            font-size: 10pt !important;
            line-height: 1.2 !important;
            color: #000 !important;
          }
          .no-print, .no-print * {
            display: none !important;
            visibility: hidden !important;
          }
          .print-only {
            display: inline !important;
            visibility: visible !important;
          }
          
          /* A4 Paper optimized layout */
          @page {
            size: letter portrait;
            margin: 12mm;
          }
          
          /* Header styling - Smaller for letter size */
          .print-invoice h1 {
            font-size: 24pt !important;
            font-weight: bold !important;
            margin: 0 0 8pt 0 !important;
            color: #000 !important;
          }
          
          .print-invoice h2 {
            font-size: 12pt !important;
            font-weight: bold !important;
            margin: 0 0 6pt 0 !important;
            color: #000 !important;
            border-bottom: 1pt solid #ccc !important;
            padding-bottom: 3pt !important;
          }
          
          .print-invoice h3 {
            font-size: 11pt !important;
            font-weight: bold !important;
            margin: 0 0 4pt 0 !important;
            color: #000 !important;
          }
          
          /* Layout improvements - Use table for better alignment */
          .print-invoice .flex.justify-between {
            display: table !important;
            width: 100% !important;
            margin-bottom: 10pt !important;
          }
          
          .print-invoice .flex-1 {
            display: table-cell !important;
            vertical-align: top !important;
            width: 70% !important;
          }
          
          .print-invoice .logo-container {
            display: table-cell !important;
            vertical-align: top !important;
            width: 30% !important;
            text-align: right !important;
            padding-left: 10pt !important;
          }
          
          .print-invoice .logo-jesico {
            width: 60pt !important;
            height: 60pt !important;
            max-width: 60pt !important;
            max-height: 60pt !important;
            object-fit: contain !important;
            display: inline-block !important;
          }
          
          /* Grid layout for customer/delivery sections - Force table layout */
          .print-invoice .customer-delivery-container {
            display: table !important;
            width: 100% !important;
            margin: 10pt 0 !important;
            table-layout: fixed !important;
          }
          
          .print-invoice .customer-section {
            display: table-cell !important;
            vertical-align: top !important;
            width: 48% !important;
            padding-right: 4% !important;
          }
          
          .print-invoice .delivery-section {
            display: table-cell !important;
            vertical-align: top !important;
            width: 48% !important;
            padding-left: 0 !important;
          }
          
          /* Customer/delivery boxes */
          .print-invoice .bg-gray-50 {
            background-color: #f8f8f8 !important;
            border: 1pt solid #ddd !important;
            padding: 6pt !important;
            margin-bottom: 6pt !important;
          }
          
          .print-invoice .bg-blue-50 {
            background-color: #f0f8ff !important;
            border: 1pt solid #ddd !important;
            padding: 6pt !important;
          }
          
          .print-invoice .bg-yellow-50 {
            background-color: #fffbf0 !important;
            border-left: 2pt solid #fbbf24 !important;
            padding: 4pt !important;
          }
          
          /* Table styling with fixed columns */
          .print-invoice table {
            border-collapse: collapse !important;
            width: 100% !important;
            margin: 10pt 0 !important;
            table-layout: fixed !important;
            font-size: 9pt !important;
          }
          
          .print-invoice table th {
            background-color: #f0f0f0 !important;
            color: #000 !important;
            font-size: 9pt !important;
            font-weight: bold !important;
            padding: 6pt 4pt !important;
            border: 1pt solid #ccc !important;
            text-align: left !important;
          }
          
          /* Fixed column widths - More specific */
          .print-invoice .print-table th:nth-child(1),
          .print-invoice .print-table td:nth-child(1) {
            width: 45% !important;
            text-align: left !important;
          }
          
          .print-invoice .print-table th:nth-child(2),
          .print-invoice .print-table td:nth-child(2) {
            width: 15% !important;
            text-align: center !important;
          }
          
          .print-invoice .print-table th:nth-child(3),
          .print-invoice .print-table td:nth-child(3) {
            width: 20% !important;
            text-align: right !important;
          }
          
          .print-invoice .print-table th:nth-child(4),
          .print-invoice .print-table td:nth-child(4) {
            width: 20% !important;
            text-align: right !important;
            font-weight: bold !important;
          }
          
          /* Fixed column widths */
          .print-invoice table th:nth-child(1) {
            width: 45% !important;
            text-align: left !important;
          }
          
          .print-invoice table th:nth-child(2) {
            width: 15% !important;
            text-align: center !important;
          }
          
          .print-invoice table th:nth-child(3) {
            width: 20% !important;
            text-align: right !important;
          }
          
          .print-invoice table th:nth-child(4) {
            width: 20% !important;
            text-align: right !important;
          }
          
          .print-invoice table td {
            font-size: 9pt !important;
            padding: 4pt !important;
            border: 1pt solid #ccc !important;
            vertical-align: top !important;
            word-wrap: break-word !important;
          }
          
          /* Cell alignment */
          .print-invoice table td:nth-child(1) {
            text-align: left !important;
          }
          
          .print-invoice table td:nth-child(2) {
            text-align: center !important;
          }
          
          .print-invoice table td:nth-child(3) {
            text-align: right !important;
          }
          
          .print-invoice table td:nth-child(4) {
            text-align: right !important;
            font-weight: bold !important;
          }
          
          /* Total section - More precise alignment */
          .print-invoice .total-section {
            display: table !important;
            width: 100% !important;
            margin: 12pt 0 !important;
            clear: both !important;
          }
          
          .print-invoice .total-container {
            display: table-cell !important;
            width: 50% !important;
            text-align: right !important;
            vertical-align: top !important;
          }
          
          .print-invoice .total-box {
            display: inline-block !important;
            width: 200pt !important;
            background-color: #f8f8f8 !important;
            border: 2pt solid #000 !important;
            padding: 8pt !important;
            text-align: left !important;
          }
          
          .print-invoice .total-box {
            display: inline-block !important;
            width: 200pt !important;
            background-color: #f8f8f8 !important;
            border: none !important;
            box-shadow: none !important;
            outline: none !important;
            padding: 8pt !important;
            text-align: left !important;
          }
            display: table-cell !important;
            font-size: 12pt !important;
            font-weight: bold !important;
            color: #000 !important;
            vertical-align: middle !important;
            width: 60% !important;
          }
          
          .print-invoice .total-amount {
            display: table-cell !important;
            font-size: 14pt !important;
            font-weight: bold !important;
            color: #ea580c !important;
            text-align: right !important;
            vertical-align: middle !important;
            width: 40% !important;
          }
          
          /* Payment info section */
          .print-invoice .border-t-2 {
            border-top: 2pt solid #ccc !important;
            padding-top: 16pt !important;
            margin-top: 16pt !important;
          }
          
          /* QR Code positioning */
          .print-invoice .qr-container {
            margin-top: 20pt !important;
            text-align: right !important;
            clear: both !important;
          }
          
          /* Remove rounded corners */
          .print-invoice .rounded,
          .print-invoice .rounded-lg,
          .print-invoice .rounded-md,
          .print-invoice .rounded-full {
            border-radius: 0 !important;
          }
          
          /* Font weights */
          .print-invoice .font-bold {
            font-weight: bold !important;
          }
          
          .print-invoice .font-semibold {
            font-weight: 600 !important;
          }
          
          .print-invoice .font-medium {
            font-weight: 500 !important;
          }
          
          /* Colors for print */
          .print-invoice .text-orange-600 {
            color: #ea580c !important;
            font-weight: bold !important;
          }
          
          .print-invoice .text-gray-800 {
            color: #000 !important;
          }
          
          .print-invoice .text-gray-700 {
            color: #333 !important;
          }
          
          .print-invoice .text-gray-600 {
            color: #555 !important;
          }
          
          .print-invoice .text-gray-500 {
            color: #666 !important;
          }
          
          /* Spacing */
          .print-invoice .space-y-2 > * + * {
            margin-top: 2pt !important;
          }
          
          .print-invoice .space-y-1 > * + * {
            margin-top: 1pt !important;
          }
          
          .print-invoice .mb-8 {
            margin-bottom: 8pt !important;
          }
          
          .print-invoice .mb-6 {
            margin-bottom: 6pt !important;
          }
          
          .print-invoice .mb-3 {
            margin-bottom: 3pt !important;
          }
          
          .print-invoice .mb-2 {
            margin-bottom: 2pt !important;
          }
          
          .print-invoice .mt-2 {
            margin-top: 2pt !important;
          }
          
          .print-invoice .mt-12 {
            margin-top: 12pt !important;
          }
          
          /* Border styling */
          .print-invoice .border-b-2 {
            border-bottom: 2pt solid #000 !important;
            padding-bottom: 6pt !important;
            margin-bottom: 10pt !important;
          }
          
          .print-invoice .border-b {
            border-bottom: 1pt solid #ccc !important;
          }
          
          .print-invoice .border-t {
            border-top: 1pt solid #ccc !important;
          }
          
          /* Payment info section */
          .print-invoice .border-t-2 {
            border-top: 2pt solid #ccc !important;
            padding-top: 8pt !important;
            margin-top: 8pt !important;
          }
          
          /* QR Code positioning */
          .print-invoice .qr-container {
            margin-top: 10pt !important;
            text-align: right !important;
            clear: both !important;
          }
          
          /* Remove box shadows */
          .print-invoice .shadow-sm {
            box-shadow: none !important;
          }
        }
        
        .print-only {
          display: none;
        }
      `}</style>
    </div>
  );
}