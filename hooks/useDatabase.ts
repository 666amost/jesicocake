import { useState, useEffect } from 'react';

// Generic hook for fetching data from an API endpoint
export function useFetch<T>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url, options);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, JSON.stringify(options)]);

  return { data, error, loading, refetch: () => {} };
}

// Product-specific hooks
export function useProducts() {
  return useFetch<any[]>('/api/products');
}

export function useProduct(id: string) {
  return useFetch<any>(`/api/products?id=${id}`);
}

// Topping-specific hooks
export function useToppings() {
  return useFetch<any[]>('/api/toppings');
}

// Cart-specific hooks
export function useCart() {
  const { data, error, loading } = useFetch<any>('/api/cart');
  
  const addToCart = async (productId: string, quantity: number, toppingId?: string) => {
    await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity, toppingId }),
    });
  };
  
  const updateCartItem = async (itemId: string, quantity: number) => {
    await fetch('/api/cart', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itemId, quantity }),
    });
  };
  
  const removeCartItem = async (itemId: string) => {
    await fetch(`/api/cart?itemId=${itemId}`, {
      method: 'DELETE',
    });
  };
  
  const clearCart = async () => {
    await fetch('/api/cart?clearAll=true', {
      method: 'DELETE',
    });
  };
  
  return {
    cart: data,
    error,
    loading,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
  };
}

// Order-specific hooks
export function useOrder(id: string) {
  return useFetch<any>(`/api/orders?id=${id}`);
}

export function useCreateOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [order, setOrder] = useState<any>(null);
  
  const createOrder = async (orderData: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const newOrder = await response.json();
      setOrder(newOrder);
      setError(null);
      return newOrder;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { createOrder, order, loading, error };
}

export function useUpdateOrderStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const updateStatus = async (id: string, status: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const updatedOrder = await response.json();
      setError(null);
      return updatedOrder;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { updateStatus, loading, error };
} 