'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import Link from "next/link";
import { formatOrderForWhatsApp } from "@/lib/utils";

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
    if (!paymentProof) return;
    
    setIsUploading(true);
    
    // In a real implementation, you would upload the file to your server
    // and associate it with the order
    setTimeout(() => {
      setIsUploading(false);
      alert('Bukti pembayaran berhasil diunggah!');
    }, 1500);
  };

  const getWhatsAppLink = () => {
    if (!order) return `https://wa.me/${phoneNumber}`;
    return `https://wa.me/${phoneNumber}?text=${formatOrderForWhatsApp(order)}`;
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