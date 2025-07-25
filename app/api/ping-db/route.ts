import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET() {
  try {
    const startTime = Date.now();
    
    // Multiple queries to keep different tables active
    const [productsResult, ordersResult] = await Promise.allSettled([
      supabase.from('products').select('id').limit(1),
      supabase.from('orders').select('id').limit(1)
    ]);
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Log ping activity
    console.log(`[PING-DB] ${new Date().toISOString()} - Response time: ${responseTime}ms`);
    
    const results = {
      success: true,
      ping: true,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      tables: {
        products: productsResult.status === 'fulfilled' ? 'active' : 'error',
        orders: ordersResult.status === 'fulfilled' ? 'active' : 'error'
      }
    };
    
    return NextResponse.json(results, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
  } catch (error: any) {
    console.error('[PING-DB ERROR]', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 