'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import supabase from '@/lib/supabase';
import { Topping } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface ToppingFormProps {
  id: string;
}

export default function ToppingForm({ id }: ToppingFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isNew = id === 'new';
  
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
  }, [isNew, id]);
  
  const fetchTopping = async () => {
    try {
      const { data, error } = await supabase
        .from('toppings')
        .select('*')
        .eq('id', id)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (isNew) {
        const { error } = await supabase
          .from('toppings')
          .insert(formData);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('toppings')
          .update(formData)
          .eq('id', id);
        
        if (error) throw error;
      }
      
      toast({
        title: "Success",
        description: `Topping ${isNew ? 'created' : 'updated'} successfully`,
      });
      router.push('/admin/toppings');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${isNew ? 'create' : 'update'} topping`,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ArrowPathIcon className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        {isNew ? 'Add New Topping' : 'Edit Topping'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            value={formData.price || 0}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            required
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="available"
            checked={formData.available}
            onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
          />
          <Label htmlFor="available">Available</Label>
        </div>
        
        <div className="flex space-x-4">
          <Button type="submit" disabled={isSaving}>
            {isSaving && <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />}
            {isNew ? 'Create Topping' : 'Update Topping'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/toppings')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
} 