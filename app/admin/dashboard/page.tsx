'use client';

import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  DollarSign,
  Clock,
  Plus 
} from 'lucide-react';
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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the admin dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-md shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-50 p-3 rounded-full">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm text-gray-500 uppercase tracking-wider">Total Products</h2>
              <p className="text-2xl font-medium text-gray-800">{stats.totalProducts}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-md shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-green-50 p-3 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm text-gray-500 uppercase tracking-wider">Total Orders</h2>
              <p className="text-2xl font-medium text-gray-800">{stats.totalOrders}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-md shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-orange-50 p-3 rounded-full">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm text-gray-500 uppercase tracking-wider">Pending Orders</h2>
              <p className="text-2xl font-medium text-gray-800">{stats.pendingOrders}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-md shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-purple-50 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-sm text-gray-500 uppercase tracking-wider">Total Revenue</h2>
              <p className="text-2xl font-medium text-gray-800">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-md shadow-sm p-6 mb-8 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium text-gray-800">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-orange-600 hover:text-orange-700">View all</Link>
        </div>
        
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-800">{order.customer_name}</div>
                      <div className="text-xs text-gray-500">{order.customer_phone}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(order.delivery_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 text-xs rounded-sm uppercase tracking-wider ${
                        order.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-md">
            <div className="mb-4">
              <Clock className="h-10 w-10 text-orange-300 mx-auto" />
            </div>
            <p className="text-gray-500 mb-2">No recent orders found.</p>
            <p className="text-sm text-gray-400">Any new orders will appear here.</p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Low Stock Products</h2>
            <Link href="/admin/products" className="text-sm text-orange-600 hover:text-orange-700">View all</Link>
          </div>
          
          {lowStockProducts.length > 0 ? (
            <div className="space-y-4">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center">
                  <div className="w-12 h-12 relative flex-shrink-0">
                    <Image
                      src={product.image_url || '/images/product-placeholder.jpg'}
                      alt={product.name}
                      fill
                      className="rounded object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <h3 className="text-sm font-medium text-gray-800">{product.name}</h3>
                    <p className="text-xs text-red-600">Only {product.stock} left in stock</p>
                  </div>
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="text-sm text-orange-600 hover:text-orange-700"
                  >
                    Update
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No low stock products.</p>
          )}

          <div className="mt-6">
            <Link
              href="/admin/products/new"
              className="flex items-center justify-center w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Product
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}