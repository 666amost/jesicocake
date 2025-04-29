import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { CartItem } from '@/types';

interface CheckoutSummaryProps {
  cartItems: CartItem[];
  cartTotal: number;
}

export default function CheckoutSummary({ cartItems, cartTotal }: CheckoutSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-gray-200 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-gray-800">Order Summary</h2>
      </div>
      
      <div className="p-4 md:p-6">
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="flex-shrink-0 w-16 h-16 relative rounded overflow-hidden bg-gray-100">
                <Image
                  src={item.product?.image_url || 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg'}
                  alt={item.product?.name || 'Product'}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="flex-grow">
                <h3 className="text-sm font-medium text-gray-800">{item.product?.name}</h3>
                {item.topping && (
                  <p className="text-xs text-gray-600">Topping: {item.topping.name}</p>
                )}
                <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">
                  {formatCurrency(((item.product?.price || 0) + (item.topping?.price || 0)) * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatCurrency(cartTotal)}</span>
          </div>
          
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-orange-600">{formatCurrency(cartTotal)}</span>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="bg-orange-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-orange-800 mb-2">Payment Instructions</h3>
            <p className="text-sm text-gray-700 mb-2">
              Please transfer the total amount to:
            </p>
            <div className="bg-white p-3 rounded border border-orange-200">
              <p className="text-sm font-medium">Bank BCA</p>
              <p className="text-sm">Account Name: Jesica</p>
              <p className="text-sm">Account Number: 7025-085-281</p>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Your order will be processed after payment is confirmed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}