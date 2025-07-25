import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET() {
  try {
    const startTime = Date.now();
    
    // Health check for multiple services
    const checks = await Promise.allSettled([
      // Database connectivity
      supabase.from('products').select('count').limit(1),
      
      // Auth service
      supabase.auth.getUser(),
      
      // Storage service (if used)
      supabase.storage.listBuckets()
    ]);
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      services: {
        database: checks[0].status === 'fulfilled' ? 'up' : 'down',
        auth: checks[1].status === 'fulfilled' ? 'up' : 'down',
        storage: checks[2].status === 'fulfilled' ? 'up' : 'down'
      },
      environment: process.env.NODE_ENV || 'development'
    };
    
    // Log for monitoring
    console.log(`[HEALTH-CHECK] ${health.timestamp} - All services: ${
      Object.values(health.services).every(s => s === 'up') ? 'UP' : 'PARTIAL'
    }`);
    
    return NextResponse.json(health, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
    
  } catch (error: any) {
    console.error('[HEALTH-CHECK ERROR]', error);
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 503 });
  }
}
