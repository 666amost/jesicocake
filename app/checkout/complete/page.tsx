'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import Link from "next/link";
import { formatOrderForWhatsApp } from "@/lib/utils";
import supabase from '@/lib/supabase';

// Define interfaces for order data
interface OrderItem {
  name?: string;
  price?: number;
  quantity: number;
  toppings?: string;
}

interface Order {
  id?: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  delivery_date: string;
  total_amount: number;
  items?: OrderItem[];
}

export default function CheckoutCompletePage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const phoneNumber = "6281290008991";

  // This would typically come from your order context or URL params
  useEffect(() => {
    // Retrieve order from localStorage or session
    const savedOrder = localStorage.getItem('lastOrder');
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setPaymentProof(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!paymentProof || !order?.id) return;
    setIsUploading(true);
    try {
      // Upload ke Supabase storage
      const fileExt = paymentProof.name.split('.').pop();
      const fileName = `order-${order.id}-${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage.from('bukti-pembayaran').upload(fileName, paymentProof);
      if (error) throw error;
      // Dapatkan public URL
      const { data: publicUrlData } = supabase.storage.from('bukti-pembayaran').getPublicUrl(fileName);
      const paymentProofUrl = publicUrlData?.publicUrl;
      // Update order di Supabase
      await supabase.from('orders').update({ payment_proof_url: paymentProofUrl }).eq('id', order.id);
      alert('Bukti pembayaran berhasil diunggah!');
    } catch (err) {
      alert('Gagal upload bukti pembayaran!');
    } finally {
      setIsUploading(false);
    }
  };

  const getWhatsAppLink = () => {
    if (!order) return `https://wa.me/${phoneNumber}`;
    const message =
      `Halo Jesica, saya sudah melakukan order dan transfer.\n` +
      `No. Order: ${order.id}\n` +
      `Nama: ${order.customer_name}\n` +
      `Total: Rp${order.total_amount?.toLocaleString('id-ID')}\n` +
      `Bukti transfer sudah saya upload.`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="container max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Pesanan Berhasil!</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Terima kasih atas pesanan Anda</CardTitle>
          <CardDescription>
            Pesanan Anda telah diterima dan sedang diproses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {order ? (
            <div className="space-y-4">
              <div>
                <p className="font-medium">Detail Pesanan</p>
                <p>Nama: {order.customer_name}</p>
                <p>Telepon: {order.customer_phone}</p>
                <p>Alamat: {order.customer_address}</p>
                <p>Tanggal Pengiriman: {order.delivery_date}</p>
                <p className="font-bold mt-2">Total: Rp{order.total_amount?.toLocaleString('id-ID')}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded border mt-4">
                <p className="font-medium mb-2">Detail Pembayaran</p>
                <p>Bank: <b>BCA</b></p>
                <p>No. Rekening: <b>7025-085-281</b></p>
                <p>Atas Nama: <b>Jesica</b></p>
              </div>
              <hr className="my-4" />
              <div>
                <h3 className="font-medium mb-2">Unggah Bukti Pembayaran</h3>
                <div className="space-y-3">
                  <Label htmlFor="payment-proof">Bukti Pembayaran</Label>
                  <Input 
                    id="payment-proof" 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <Button 
                    onClick={handleUpload} 
                    disabled={!paymentProof || isUploading}
                    className="w-full"
                  >
                    {isUploading ? "Mengunggah..." : "Unggah Bukti Pembayaran"}
                    {!isUploading && <Upload className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="mt-6">
                <a 
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md flex items-center justify-center"
                >
                  Konfirmasi pesanan dan kirim bukti transfer via WhatsApp
                </a>
              </div>
              {order && order.items && order.items.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Detail Produk Dipesan</h3>
                  <table className="w-full text-sm border">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-2 px-2 text-left">Produk</th>
                        <th className="py-2 px-2 text-center">Qty</th>
                        <th className="py-2 px-2 text-right">Harga</th>
                        <th className="py-2 px-2 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-2">{item.name || item.product_id}</td>
                          <td className="py-2 px-2 text-center">{item.quantity}</td>
                          <td className="py-2 px-2 text-right">Rp{item.price?.toLocaleString('id-ID') || '-'}</td>
                          <td className="py-2 px-2 text-right">Rp{((item.price || 0) * (item.quantity || 0)).toLocaleString('id-ID')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-right font-bold mt-2">Total: Rp{order.total_amount?.toLocaleString('id-ID')}</div>
                </div>
              )}
            </div>
          ) : (
            <p>Memuat detail pesanan...</p>
          )}
        </CardContent>
      </Card>
      
      <div className="text-center">
        <Link href="/">
          <Button variant="outline">Kembali ke Beranda</Button>
        </Link>
      </div>
    </div>
  );
} 