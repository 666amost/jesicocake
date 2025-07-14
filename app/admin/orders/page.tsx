'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon, EyeIcon, ChevronDownIcon, ChevronUpIcon, TrashIcon } from '@heroicons/react/24/outline';
import supabase from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';
import { Order } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, any[]>>({});
  const [orderDetails, setOrderDetails] = useState<Record<string, any[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { toast } = useToast();
  
  const productNameCache = useRef<Record<string, string>>({});
  
  useEffect(() => {
    fetchOrders();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('orders_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Received realtime update:', payload);
          if (payload.eventType === 'DELETE') {
            setOrders(prev => prev.filter(order => order.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setOrders(prev => prev.map(order => 
              order.id === payload.new.id ? { ...order, ...payload.new } : order
            ));
          } else if (payload.eventType === 'INSERT') {
            fetchOrders(); // Refresh all orders for new insertions
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);
  
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .order(sortField, { ascending: sortDirection === 'asc' });
      
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setOrders(data || []);
      
      // Ambil semua order_details sekaligus
      const { data: allDetails } = await supabase
        .from('order_details')
        .select('*');
      const detailsByOrder: Record<string, any[]> = {};
      for (const detail of allDetails || []) {
        if (!detailsByOrder[detail.order_id]) detailsByOrder[detail.order_id] = [];
        detailsByOrder[detail.order_id].push(detail);
      }
      setOrderDetails(detailsByOrder);

      // (Tetap ambil order_items untuk fallback lama)
      const { data: allItems } = await supabase
        .from('order_items')
        .select('*, product:product_id(*)');
      const itemsByOrder: Record<string, any[]> = {};
      for (const item of allItems || []) {
        if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
        itemsByOrder[item.order_id].push(item);
      }
      setOrderItems(itemsByOrder);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch orders",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // Hanya lakukan update tanpa meminta return data
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
      
      if (error) {
        console.error('Error updating order status:', error);
        throw error;
      }
      
      // Update local state
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      toast({
        title: "Status Updated",
        description: `Order status has been updated to ${newStatus}`
      });

      // Refresh data untuk memastikan sinkronisasi
      await fetchOrders();

    } catch (error: any) {
      console.error('Update status error:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update order status",
        variant: "destructive"
      });
    }
  };
  
  const updatePaymentStatus = async (orderId: string, newStatus: string) => {
    try {
      // Hanya lakukan update tanpa meminta return data
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: newStatus })
        .eq('id', orderId);
      
      if (error) {
        console.error('Error updating payment status:', error);
        throw error;
      }
      
      // Update local state
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, payment_status: newStatus } : order
        )
      );
      
      toast({
        title: "Payment Status Updated",
        description: `Payment status has been updated to ${newStatus}`
      });

      // Refresh data untuk memastikan sinkronisasi
      await fetchOrders();

    } catch (error: any) {
      console.error('Update payment status error:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update payment status",
        variant: "destructive"
      });
    }
  };
  
  // Get product names for an order
  const getProductNames = (orderId: string) => {
    const items = orderItems[orderId] || [];
    return items.map(item => {
      if (item.product && item.product.name) {
        return `${item.product.name} x${item.quantity}`;
      }
      // Jika relasi produk null, cari manual dari tabel products
      if (productNameCache.current[item.product_id]) {
        return `${productNameCache.current[item.product_id]} x${item.quantity}`;
      }
      // Query manual ke tabel products
      supabase.from('products').select('name').eq('id', item.product_id).single().then(({ data }) => {
        if (data && data.name) {
          productNameCache.current[item.product_id] = data.name;
          // Paksa re-render
          setOrderItems((prev) => ({ ...prev }));
        }
      });
      return `${item.product_id} x${item.quantity}`;
    }).join(', ');
  };
  
  const getOrderSummary = (order: any) => {
    const details = orderDetails[order.id] || [];
    if (details.length > 0) {
      return details.map(item => `${item.product_name}${item.topping_name ? ' + ' + item.topping_name : ''} x${item.quantity}`).join(', ');
    }
    // fallback lama
    const items = orderItems[order.id] || [];
    return items.map(item => {
      if (item.product && item.product.name) {
        return `${item.product.name} x${item.quantity}`;
      }
      if (productNameCache.current[item.product_id]) {
        return `${productNameCache.current[item.product_id]} x${item.quantity}`;
      }
      return `${item.product_id} x${item.quantity}`;
    }).join(', ') || 'Tidak ada detail';
  };
  
  const filteredOrders = orders.filter(order => 
    order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer_phone.includes(searchQuery) ||
    order.customer_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getOrderSummary(order).toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      // Delete order items first (due to foreign key constraint)
      const { error: itemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', orderId);

      if (itemsError) {
        console.error('Error deleting order items:', itemsError);
        throw itemsError;
      }

      // Then delete the order
      const { error: orderError } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (orderError) {
        console.error('Error deleting order:', orderError);
        throw orderError;
      }

      // Update local state only after successful deletion from database
      setOrders(prev => prev.filter(order => order.id !== orderId));
      
      // Also update orderItems state
      const newOrderItems = { ...orderItems };
      delete newOrderItems[orderId];
      setOrderItems(newOrderItems);

      toast({
        title: "Order Deleted",
        description: "Order has been successfully deleted from database."
      });

      // Optional: Refresh the orders list to ensure sync
      fetchOrders();

    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete order. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <p className="text-gray-600">Manage customer orders</p>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200"
          />
        </div>
        
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('created_at')}
                  >
                    DATE {sortField === 'created_at' && (
                      sortDirection === 'asc' ? <ChevronUpIcon className="inline h-4 w-4" /> : <ChevronDownIcon className="inline h-4 w-4" />
                      )}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CUSTOMER
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DETAIL PESANAN
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DELIVERY DATE
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('total_amount')}
                  >
                    AMOUNT {sortField === 'total_amount' && (
                      sortDirection === 'asc' ? <ChevronUpIcon className="inline h-4 w-4" /> : <ChevronDownIcon className="inline h-4 w-4" />
                      )}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STATUS
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PAYMENT
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    BUKTI TRANSFER
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                      <div className="text-sm text-gray-500">{order.customer_phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{getOrderSummary(order)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.delivery_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status || 'pending'}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`text-sm rounded-full px-3 py-1 font-semibold
                          ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.payment_status || 'unpaid'}
                        onChange={(e) => updatePaymentStatus(order.id, e.target.value)}
                        className={`text-sm rounded-full px-3 py-1 font-semibold
                          ${order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                        }`}
                      >
                        <option value="unpaid">Unpaid</option>
                        <option value="paid">Paid</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.payment_proof_url ? (
                        <a href={order.payment_proof_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Lihat Bukti Transfer</a>
                      ) : (
                        <span className="text-gray-400">Belum ada</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-orange-600 hover:text-orange-900 inline-block"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="text-red-600 hover:text-red-900 inline-block"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}