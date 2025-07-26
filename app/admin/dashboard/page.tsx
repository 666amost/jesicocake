'use client';

import { useEffect, useState } from 'react';
import { CakeIcon, UserGroupIcon, CurrencyDollarIcon, ClockIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import supabase from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
}

interface Product {
  id: string;
  name: string;
  stock: number;
  image_url?: string;
}

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  created_at: string;
  delivery_date: string;
  total_amount: number;
  status: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });
  
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Dapatkan total produk
        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });
        
        // Dapatkan total pesanan
        const { count: ordersCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });
        
        // Dapatkan pesanan tertunda
        const { count: pendingCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');
        
        // Dapatkan total pendapatan
        const { data: revenueData } = await supabase
          .from('orders')
          .select('total_amount')
          .eq('payment_status', 'paid');
        
        const totalRevenue = revenueData
          ? revenueData.reduce((sum, order) => sum + order.total_amount, 0)
          : 0;
        
        // Dapatkan pesanan terbaru
        const { data: recentOrdersData } = await supabase
          .from('orders')
          .select('id, customer_name, customer_phone, created_at, delivery_date, total_amount, status')
          .order('created_at', { ascending: false })
          .limit(5);
        
        // Dapatkan produk dengan stok rendah
        const { data: lowStockData } = await supabase
          .from('products')
          .select('id, name, stock, image_url')
          .lt('stock', 5)
          .order('stock', { ascending: true })
          .limit(5);
        
        setStats({
          totalProducts: productsCount || 0,
          totalOrders: ordersCount || 0,
          pendingOrders: pendingCount || 0,
          totalRevenue
        });
        
        setRecentOrders(recentOrdersData || []);
        setLowStockProducts(lowStockData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pb-24 md:pb-0">
      {/* Statistik Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-900 rounded-xl shadow p-5 border border-orange-200 dark:border-orange-700">
          <div className="bg-orange-500 text-white rounded-full p-4 mb-2 shadow-lg">
            <CakeIcon className="h-8 w-8" />
          </div>
          <span className="text-xs font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wider">Total Products</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{stats.totalProducts}</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-900 rounded-xl shadow p-5 border border-orange-200 dark:border-orange-700">
          <div className="bg-orange-500 text-white rounded-full p-4 mb-2 shadow-lg">
            <UserGroupIcon className="h-8 w-8" />
          </div>
          <span className="text-xs font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wider">Total Orders</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{stats.totalOrders}</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-900 rounded-xl shadow p-5 border border-orange-200 dark:border-orange-700">
          <div className="bg-orange-500 text-white rounded-full p-4 mb-2 shadow-lg">
            <ClockIcon className="h-8 w-8" />
          </div>
          <span className="text-xs font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wider">Pending Orders</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{stats.pendingOrders}</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-900 rounded-xl shadow p-5 border border-orange-200 dark:border-orange-700">
          <div className="bg-orange-500 text-white rounded-full p-4 mb-2 shadow-lg flex items-center justify-center text-3xl font-bold">
            <CurrencyDollarIcon className="h-8 w-8" />
          </div>
          <span className="text-xs font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wider">Total Revenue</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{formatCurrency(stats.totalRevenue)}</span>
        </div>
      </div>
      {/* Section Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white dark:bg-gray-900 rounded-xl shadow p-5 border border-gray-100 dark:border-gray-800 mb-6 lg:mb-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-orange-600 hover:text-orange-700 font-semibold">View all</Link>
          </div>
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto -mx-2 md:mx-0">
              <table className="min-w-[500px] md:min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-xs md:text-sm">
                <thead className="sticky top-0 bg-white dark:bg-gray-900 z-10">
                  <tr>
                    <th className="px-2 md:px-4 py-2 md:py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                    <th className="px-2 md:px-4 py-2 md:py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-2 md:px-4 py-2 md:py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Delivery Date</th>
                    <th className="px-2 md:px-4 py-2 md:py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                    <th className="px-2 md:px-4 py-2 md:py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-2 md:px-4 py-2 md:py-4 "><div className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100">{order.customer_name}</div><div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-300">{order.customer_phone}</div></td>
                      <td className="px-2 md:px-4 py-2 md:py-4 ">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="px-2 md:px-4 py-2 md:py-4 ">{new Date(order.delivery_date).toLocaleDateString()}</td>
                      <td className="px-2 md:px-4 py-2 md:py-4 ">{formatCurrency(order.total_amount)}</td>
                      <td className="px-2 md:px-4 py-2 md:py-4 "><span className={`px-2 md:px-3 py-1 text-[10px] md:text-xs rounded-sm uppercase tracking-wider ${order.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' : order.status === 'completed' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'}`}>{order.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 md:py-8 bg-gray-50 dark:bg-gray-800 rounded-md">
              <div className="mb-2 md:mb-4">
                <ClockIcon className="h-8 w-8 md:h-10 md:w-10 text-orange-300 mx-auto" />
              </div>
              <p className="text-gray-500 dark:text-gray-300 mb-1 md:mb-2 text-xs md:text-base">No recent orders found.</p>
              <p className="text-[10px] md:text-sm text-gray-400 dark:text-gray-500">Any new orders will appear here.</p>
            </div>
          )}
        </section>
        <section className="bg-white dark:bg-gray-900 rounded-xl shadow p-5 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Low Stock Products</h2>
            <Link href="/admin/products" className="text-xs text-orange-600 hover:text-orange-700 font-semibold">View all</Link>
          </div>
          {lowStockProducts.length > 0 ? (
            <div className="space-y-2 md:space-y-4">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center">
                  <div className="w-8 h-8 md:w-12 md:h-12 relative flex-shrink-0">
                    <Image src={product.image_url || '/images/product-placeholder.jpg'} alt={product.name} fill className="rounded object-cover" />
                  </div>
                  <div className="ml-2 md:ml-4 flex-grow">
                    <h3 className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100">{product.name}</h3>
                    <p className="text-[10px] md:text-xs text-red-600 dark:text-red-400">Only {product.stock} left in stock</p>
                  </div>
                  <Link href={`/admin/products/${product.id}`} className="text-xs md:text-sm text-orange-600 hover:text-orange-700">Update</Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-300 text-center py-2 md:py-4 text-xs md:text-base">No low stock products.</p>
          )}
          <div className="mt-3 md:mt-6">
            <Link href="/admin/products/new" className="flex items-center justify-center w-full px-2 md:px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-xs md:text-base"><PlusIcon className="w-4 h-4 md:w-5 md:h-5 mr-2" />Add New Product</Link>
          </div>
        </section>
      </div>
    </div>
  );
}