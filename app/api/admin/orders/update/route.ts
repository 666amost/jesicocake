import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create admin client with service role key (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function PUT(request: NextRequest) {
  try {
    const { orderId, updates } = await request.json();
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    console.log('🔧 API: Updating order:', orderId, 'with:', updates);

    // Update order using admin client (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select('*')
      .single();

    if (error) {
      console.error('❌ API: Database update failed:', error);
      return NextResponse.json(
        { error: 'Failed to update order', details: error },
        { status: 500 }
      );
    }

    console.log('✅ API: Order updated successfully:', data);
    
    return NextResponse.json({ 
      success: true, 
      data,
      message: 'Order updated successfully' 
    });

  } catch (error: any) {
    console.error('❌ API: Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
