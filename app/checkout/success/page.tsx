'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Phone } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import supabase from '@/lib/supabase';
import { formatCurrency, getWhatsAppUrl } from '@/lib/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Order, OrderItem } from '@/types';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const router = useRouter();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Generate invoice number based on order ID and timestamp
  const invoiceNumber = `INV/${orderId?.slice(0, 8).toUpperCase()}/${new Date().getTime().toString().slice(-4)}`;
  
  // WhatsApp URL
  const whatsappUrl = getWhatsAppUrl(
    '6281290008991',
    invoiceNumber,
    order?.customer_name || '',
    order?.total_amount || 0
  );
  
  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Fetch order
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();
        
        if (orderError || !orderData) {
          throw new Error(orderError?.message || 'Order not found');
        }
        
        setOrder(orderData as Order);
        
        // Fetch order items with product and topping details
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            *,
            product:product_id(*),
            topping:topping_id(*)
          `)
          .eq('order_id', orderId);
        
        if (itemsError) {
          throw new Error(itemsError.message || 'Failed to fetch order items');
        }
        
        setOrderItems(itemsData as OrderItem[]);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setOrder(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrderDetails();
    
    // Clear justOrdered flag from session storage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('justOrdered');
    }
  }, [orderId]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat detail pesanan...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Error state - Order not found
  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-20">
          <div className="container mx-auto px-4 md:px-6 py-16 text-center">
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
              <h1 className="text-2xl font-bold text-red-600 mb-2">Pesanan Tidak Ditemukan</h1>
              <p className="text-gray-600 mb-6">Maaf, kami tidak dapat menemukan pesanan yang Anda cari.</p>
              <Link 
                href="/" 
                className="inline-flex items-center px-5 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
              >
                Kembali ke Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Success state - Show order details
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            {/* Success Header */}
            <div className="bg-green-50 p-6 text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-2">
                Order Berhasil!
              </h1>
              <p className="text-gray-700 mb-2">
                Terima kasih, pesanan Anda telah berhasil dibuat.<br />
                Silakan lakukan pembayaran dan konfirmasi ke WhatsApp admin.
              </p>
            </div>
            
            {/* Invoice Details */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Invoice: {invoiceNumber}</h2>
                <span className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Customer</h3>
                  <p className="text-gray-800 font-medium">{order.customer_name}</p>
                  <p className="text-gray-800">{order.customer_phone}</p>
                  <p className="text-gray-800">{order.customer_address}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Order Details</h3>
                  <p className="text-gray-800">
                    <span className="font-medium">Tanggal Pengiriman:</span>{' '}
                    {new Date(order.delivery_date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-medium">Status:</span>{' '}
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      Menunggu Pembayaran
                    </span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Order Items */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Detail Pesanan</h3>
              <div className="divide-y divide-gray-200">
                {orderItems.map((item) => (
                  <div key={item.id} className="py-3 flex items-center">
                    <div className="w-16 h-16 relative rounded overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.product?.image_url || '/images/default-product.jpg'}
                        alt={item.product?.name || 'Product'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="ml-4 flex-grow">
                      <h4 className="text-sm font-medium text-gray-800">{item.product?.name}</h4>
                      {item.topping && (
                        <p className="text-xs text-gray-600">Topping: {item.topping.name}</p>
                      )}
                      <p className="text-xs text-gray-600">Jumlah: {item.quantity}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-800">
                        {formatCurrency((item.unit_price + (item.topping_price || 0)) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Total */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">{formatCurrency(order.total_amount)}</span>
                </div>
              </div>
            </div>
            
            {/* QR Code */}
            <div className="p-6 border-b border-gray-200 flex flex-col items-center">
              <h3 className="text-sm font-medium text-gray-800 mb-3">Scan QR code untuk verifikasi pesanan</h3>
              <QRCodeSVG 
                value={`Order:${orderId}`} 
                size={150} 
                includeMargin={true}
                level="M"
              />
              <p className="mt-3 text-xs text-gray-500 text-center">
                Tunjukkan QR code ini saat pengambilan atau sebagai bukti pesanan
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="p-6 flex flex-col items-center space-y-4">
              <button
                onClick={() => window.open(whatsappUrl, '_blank')}
                className="w-full max-w-md px-6 py-3 bg-orange-600 text-white rounded-md font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center"
              >
                <Phone className="w-5 h-5 mr-2" />
                OK - Lanjutkan ke WhatsApp
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}