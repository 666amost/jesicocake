'use client';

import { formatCurrency } from '@/lib/utils';
import { Topping } from '@/types';

interface ProductToppingsProps {
  toppings: Topping[];
}

export default function ProductToppings({ toppings }: ProductToppingsProps) {
  if (toppings.length === 0) {
    return <p className="text-gray-500 italic">No toppings available</p>;
  }
  
  return (
    <div className="space-y-2">
      {toppings.map((topping) => (
        <div key={topping.id} className="flex items-center justify-between py-1 border-b border-gray-100">
          <span className="text-gray-700">{topping.name}</span>
          <span className="text-orange-600 font-medium">{formatCurrency(topping.price)}</span>
        </div>
      ))}
    </div>
  );
}