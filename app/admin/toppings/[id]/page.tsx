'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import supabase from '@/lib/supabase';
import { Topping } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ToppingFormPageProps {
  params: {
    id: string;
  };
}

export default function ToppingFormPage({ params }: ToppingFormPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isNew = params.id === 'new';
  
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Topping>>({
    name: '',
    price: 0,
    available: true
  });
  
  useEffect(() => {
    if (!isNew) {
      fetchTopping();
    }
  }, [isNew, params.id]);
  
  const fetchTopping = async () => {
    try {
      const { data, error } = await supabase
        .from('toppings')
        .select('*')
        .eq('id', params.id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setFormData(data);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch topping",
        variant: "destructive"
      });
      router.push('/admin/toppings');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (isNew) {
        // Create new topping
        const { error } = await supabase
          .from('toppings')
          .insert([formData]);
        
        if (error) throw error;
        
        toast({
          title: "Topping Created",
          description: `${formData.name} has been created successfully.`
        });
      } else {
        // Update existing topping
        const { error } = await supabase
          .from('toppings')
          .update(formData)
          .eq('id', params.id);
        
        if (error) throw error;
        
        toast({
          title: "Topping Updated",
          description: `${formData.name} has been updated successfully.`
        });
      }
      
      router.push('/admin/toppings');
    } catch (error: any) {
      toast({
        title: isNew ? "Creation Failed" : "Update Failed",
        description: error.message || `Failed to ${isNew ? 'create' : 'update'} topping`,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading topping...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link 
            href="/admin/toppings" 
            className="mr-4 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            {isNew ? 'Add New Topping' : 'Edit Topping'}
          </h1>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="max-w-xl mx-auto">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Topping Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price (IDR)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price || 0}
                onChange={handleChange}
                required
                min="0"
                step="1000"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200"
              />
            </div>
            
            <div className="mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="available"
                  name="available"
                  checked={formData.available || false}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="available" className="ml-2 block text-sm text-gray-700">
                  Available for Selection
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 flex justify-end">
          <Link
            href="/admin/toppings"
            className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300 disabled:cursor-not-allowed inline-flex items-center"
          >
            {isSaving && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <Save className="h-4 w-4 mr-1" />
            {isSaving ? 'Saving...' : 'Save Topping'}
          </button>
        </div>
      </form>
    </div>
  );
}