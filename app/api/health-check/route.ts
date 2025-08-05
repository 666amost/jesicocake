import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const startTime = Date.now();
    
    // Health check for DB & storage only (no auth)
    const [dbCheck, storageCheck] = await Promise.allSettled([
      supabase.from('products').select('count').limit(1),
      supabase.storage.listBuckets()
    ]);
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      services: {
        database: dbCheck.status === 'fulfilled' ? 'up' : 'down',
        storage: storageCheck.status === 'fulfilled' ? 'up' : 'down'
      },
      environment: process.env.NODE_ENV || 'development'
    };

    return NextResponse.json(health, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 503 });
  }
}
