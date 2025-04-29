import { NextRequest, NextResponse } from 'next/server';
import { 
  getOrCreateCart, 
  getCartWithItems, 
  addItemToCart, 
  updateCartItemQuantity, 
  removeCartItem, 
  clearCart 
} from '@/lib/db';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

// Helper to get or create session ID
async function getSessionId() {
  const cookieStore = cookies();
  let sessionId = cookieStore.get('session_id')?.value;
  
  if (!sessionId) {
    sessionId = uuidv4();
    // Note: This won't actually set the cookie in an API route
    // We'll handle setting the cookie in the front-end
  }
  
  return sessionId;
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = await getSessionId();
    const cart = await getOrCreateCart(sessionId);
    const cartItems = await getCartWithItems(cart.id);
    
    return NextResponse.json({
      cartId: cart.id,
      sessionId,
      items: cartItems
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity, toppingId } = await request.json();
    const sessionId = await getSessionId();
    
    if (!productId || !quantity) {
      return NextResponse.json(
        { error: 'Product ID and quantity are required' }, 
        { status: 400 }
      );
    }
    
    const cart = await getOrCreateCart(sessionId);
    const cartItem = await addItemToCart(cart.id, productId, quantity, toppingId);
    
    return NextResponse.json(cartItem);
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' }, 
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { itemId, quantity } = await request.json();
    
    if (!itemId || !quantity) {
      return NextResponse.json(
        { error: 'Item ID and quantity are required' }, 
        { status: 400 }
      );
    }
    
    const updatedItem = await updateCartItemQuantity(itemId, quantity);
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Failed to update cart item' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');
    const clearAll = searchParams.get('clearAll');
    const sessionId = await getSessionId();
    
    if (clearAll === 'true') {
      const cart = await getOrCreateCart(sessionId);
      await clearCart(cart.id);
      return NextResponse.json({ success: true });
    } else if (itemId) {
      await removeCartItem(itemId);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Item ID or clearAll parameter is required' }, 
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      { error: 'Failed to remove cart item' }, 
      { status: 500 }
    );
  }
} 