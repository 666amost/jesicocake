'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusCircle, Edit, Trash2, Search } from 'lucide-react';
import supabase from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';
import { Topping } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function AdminToppingsPage() {
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { toast } = useToast();
  
  useEffect(() => {
    fetchToppings();
  }, []);
  
  const fetchToppings = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('toppings')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setToppings(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch toppings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleToppingAvailability = async (topping: Topping) => {
    try {
      const { error } = await supabase
        .from('toppings')
        .update({ available: !topping.available })
        .eq('id', topping.id);
      
      if (error) throw error;
      
      // Update local state
      setToppings(prev => prev.map(t => (
        t.id === topping.id ? { ...t, available: !t.available } : t
      )));
      
      toast({
        title: "Topping Updated",
        description: `${topping.name} is now ${!topping.available ? 'available' : 'unavailable'}.`
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update topping availability",
        variant: "destructive"
      });
    }
  };
  
  const deleteTopping = async (topping: Topping) => {
    if (!confirm(`Are you sure you want to delete ${topping.name}?`)) return;
    
    try {
      const { error } = await supabase
        .from('toppings')
        .delete()
        .eq('id', topping.id);
      
      if (error) throw error;
      
      // Update local state
      setToppings(prev => prev.filter(t => t.id !== topping.id));
      
      toast({
        title: "Topping Deleted",
        description: `${topping.name} has been deleted.`
      });
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete topping",
        variant: "destructive"
      });
    }
  };
  
  const filteredToppings = toppings.filter(topping => 
    topping.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Toppings</h1>
          <p className="text-gray-600">Manage cake toppings</p>
        </div>
        
        <Link 
          href="/admin/toppings/new" 
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add New Topping
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search toppings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200"
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading toppings...</p>
          </div>
        ) : filteredToppings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredToppings.map((topping) => (
                  <tr key={topping.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{topping.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{formatCurrency(topping.price)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          topping.available 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {topping.available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => toggleToppingAvailability(topping)}
                          className="text-orange-600 hover:text-orange-900"
                        >
                          {topping.available ? 'Disable' : 'Enable'}
                        </button>
                        <Link
                          href={`/admin/toppings/${topping.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => deleteTopping(topping)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No toppings found.</p>
          </div>
        )}
      </div>
    </div>
  );
}