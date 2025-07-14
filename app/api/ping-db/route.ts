import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET() {
  // Query sederhana ke tabel produk
  const { data, error } = await supabase.from('products').select('id').limit(1);
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, ping: true, count: data?.length ?? 0 });
} 