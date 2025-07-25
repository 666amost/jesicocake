import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

// Eksekusi: 1x sehari (sesuai dengan batasan akun Hobby Vercel)
// Format: https://crontab.guru/ untuk format yang lebih spesifik
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Eksekusi Cron Job - Contoh untuk reset status atau maintenance harian
export async function GET() {
  try {
    // Contoh operasi: bisa disesuaikan dengan kebutuhan bisnis Anda
    // Misalnya: reset status pesanan yang expired, update stok, dsb.
    
    // Contoh: Update pesanan yang belum dibayar lebih dari 24 jam
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const { data, error } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('status', 'pending')
      .lt('created_at', yesterday.toISOString());
      
    if (error) {
      console.error('Error updating orders:', error);
      return NextResponse.json(
        { success: false, message: 'Error updating orders', error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `Daily maintenance executed successfully. Updated orders.`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json(
      { success: false, message: 'Error executing cron job', error },
      { status: 500 }
    );
  }
}
