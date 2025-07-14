import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import supabase from '@/lib/supabase';

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  profile: { id: string; name: string; phone: string; address: string };
  onSuccess?: () => void;
}

export default function EditProfileModal({ open, onClose, profile, onSuccess }: EditProfileModalProps) {
  const [form, setForm] = useState({ name: profile.name, phone: profile.phone, address: profile.address });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name: form.name, phone: form.phone, address: form.address })
        .eq('id', profile.id);
      if (error) throw new Error(error.message);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-sm mx-auto">
        <h2 className="text-xl font-bold mb-4 text-orange-600">Edit Profile</h2>
        <div className="space-y-3">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={form.name} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" value={form.phone} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" value={form.address} onChange={handleChange} />
          </div>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        </div>
        <div className="flex gap-2 mt-6">
          <Button className="flex-1 bg-orange-500 hover:bg-orange-600" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
          <Button className="flex-1" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
        </div>
      </div>
    </div>
  );
} 