import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import supabase from '@/lib/supabase';

interface AuthFormProps {
  onSuccess?: () => void;
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      if (mode === 'login') {
        // Login user dengan Supabase Auth
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password
        });
        if (loginError) throw new Error(loginError.message);
        // Cek session
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) throw new Error('Login gagal, session tidak aktif.');
        if (onSuccess) onSuccess();
      } else {
        // Register user (pakai endpoint custom jika ada logic tambahan)
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            name: data.name,
            phone: data.phone,
            address: data.address
          })
        });
        const result = await res.json();
        if (result.error) throw new Error(result.error);
        if (onSuccess) onSuccess();
      }
      reset();
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md p-6 mt-4">
      <div className="flex justify-center mb-6">
        <button
          className={`flex-1 py-2 rounded-l-lg font-bold text-lg ${mode === 'login' ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-600'}`}
          onClick={() => setMode('login')}
          type="button"
        >
          Login
        </button>
        <button
          className={`flex-1 py-2 rounded-r-lg font-bold text-lg ${mode === 'register' ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-600'}`}
          onClick={() => setMode('register')}
          type="button"
        >
          Register
        </button>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {mode === 'register' && (
          <>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name', { required: true })} placeholder="Your name" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register('phone')} placeholder="08xxxxxxxxxx" />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register('address')} placeholder="Your address" />
            </div>
          </>
        )}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email', { required: true })} placeholder="you@email.com" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register('password', { required: true })} placeholder="Password" />
        </div>
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={loading}>
          {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Register'}
        </Button>
      </form>
    </div>
  );
} 