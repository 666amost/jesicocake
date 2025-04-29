'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Save, Trash } from 'lucide-react';
import supabase from '@/lib/supabase';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ProductFormPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductFormPage({ params }: ProductFormPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { id } = use(params);
  const isNew = id === 'new';
  
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    image_url: '',
    category: '',
    available: true,
    stock: 0
  });
  
  useEffect(() => {
    if (!isNew) {
      fetchProduct();
    }
  }, [isNew, id]);
  
  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setFormData(data);
        if (data.image_url) {
          setImagePreview(data.image_url);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch product",
        variant: "destructive"
      });
      router.push('/admin/products');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return formData.image_url || null;
    
    try {
      // Generate a unique filename
      const fileExt = imageFile.name.split('.').pop();
      const uniqueId = Date.now().toString();
      const fileName = `${uniqueId}.${fileExt}`;
      
      // Upload the file
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('foto')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data } = supabase.storage
        .from('foto')
        .getPublicUrl(fileName);
      
      return data.publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Image Upload Failed",
        description: error.message || "Failed to upload product image",
        variant: "destructive"
      });
      return null;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Upload image if selected
      const imageUrl = await uploadImage();
      
      const productData = {
        ...formData,
        image_url: imageUrl || formData.image_url
      };
      
      if (isNew) {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        
        if (error) throw error;
        
        toast({
          title: "Product Created",
          description: `${productData.name} has been created successfully.`
        });
      } else {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id);
        
        if (error) throw error;
        
        toast({
          title: "Product Updated",
          description: `${productData.name} has been updated successfully.`
        });
      }
      
      router.push('/admin/products');
    } catch (error: any) {
      toast({
        title: isNew ? "Creation Failed" : "Update Failed",
        description: error.message || `Failed to ${isNew ? 'create' : 'update'} product`,
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
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link 
            href="/admin/products" 
            className="mr-4 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            {isNew ? 'Add New Product' : 'Edit Product'}
          </h1>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
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
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200"
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category || ''}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200"
                >
                  <option value="">Select Category</option>
                  <option value="cake">Cake</option>
                  <option value="brownies">Brownies</option>
                  <option value="tart">Tart</option>
                  <option value="cupcake">Cupcake</option>
                  <option value="cookies">Cookies</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
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
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock || 0}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200"
                  />
                </div>
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
                    Available for Purchase
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image
                </label>
                
                <div className="mb-4 flex justify-center p-6 border-2 border-dashed border-gray-300 rounded-md">
                  {imagePreview ? (
                    <div className="relative w-full h-48 md:h-64">
                      <Image
                        src={imagePreview}
                        alt="Product preview"
                        fill
                        className="object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setImageFile(null);
                          setFormData(prev => ({ ...prev, image_url: '' }));
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 text-center">
                      <div className="text-gray-400">
                        <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="text-sm text-gray-500">
                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none">
                          <span>Upload an image</span>
                          <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  )}
                </div>
                
                {!imagePreview && (
                  <p className="mt-2 text-sm text-gray-500">
                    Or provide a URL to an existing image:
                  </p>
                )}
                
                {!imagePreview && (
                  <input
                    type="text"
                    id="image_url"
                    name="image_url"
                    value={formData.image_url || ''}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 flex justify-end">
          <Link
            href="/admin/products"
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
            {isSaving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}