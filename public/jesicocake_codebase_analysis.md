# jesicocake Web App – Codebase Analysis

Dokumen ini berisi analisis codebase Next.js + Supabase beserta contoh implementasi fitur **Register**, **Login**, dan **Profile Management**.

---

## 1. Ringkasan Proyek

- **Framework**: Next.js (React + API Routes + Server Components)
- **Bahasa**: TypeScript
- **Auth & DB**: Supabase (auth.users, public.profiles)
- **Storage**: Supabase Storage (avatars bucket)
- **UI**: React + Tailwind CSS

**Fitur saat ini**: Checkout/Order sudah berjalan.

**Fitur yang akan ditambahkan**:

1. **Registrasi pengguna** (sign-up)
2. **Login pengguna** (sign-in)
3. **Profile CRUD** (RLS sudah diaktifkan)
4. **Session management** di client
5. **Ubah UI** agar menyerupai BK App (dengan tab Preorder)

---

## 2. Skema Database & Kebijakan RLS

> **Catatan**: Skrip SQL berikut sudah dijalankan di Supabase dan berfungsi sebagai bukti penerapan struktur dan kebijakan.

```sql
-- 1. Tabel profiles sudah ada dan terhubung ke auth.users
-- 2. Kolom: id, name, email, phone, address, created_at, updated_at
-- 3. RLS diaktifkan dan kebijakan berikut:
--    • SELECT oleh semua pengguna
--    • INSERT/UPDATE hanya untuk pemilik baris (auth.uid() = id)

-- Contoh ringkas:
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  email text,
  phone text,
  address text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own profile" ON public.profiles
  FOR INSERT, UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Trigger handle_new_user juga sudah di-deploy:
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email);
  RETURN NEW;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

---

## 3. Struktur Folder & File Utama

```
/pages
  /api
    auth
      login.ts       ← API route: signIn
      register.ts    ← API route: signUp + profile insert
  index.tsx        ← Homepage / Checkout
  _app.tsx         ← Session provider untuk Supabase
/components
  AuthForm.tsx     ← Form Login & Register (Zod + API)
  Navbar.tsx       ← Header & navigasi (BK App style)
/lib
  supabaseClient.ts ← Inisialisasi Supabase client
/types
  supabase.ts      ← Interface Profile & Session
```

---

## 4. Contoh Implementasi (TypeScript)

### 4.1. Type Definitions

```ts
// types/supabase.ts
export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}
```

### 4.2. Supabase Client

```ts
// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### 4.3. API Route: Register

```ts
// pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';
import { z } from 'zod';

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const parse = RegisterSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.format() });

  const { email, password, name } = parse.data;
  const { user, error } = await supabase.auth.signUp({ email, password }, {
    data: { full_name: name }
  });
  if (error) return res.status(400).json({ error: error.message });

  return res.status(200).json({ user });
}
```

### 4.4. API Route: Login

```ts
// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const parse = LoginSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.format() });

  const { email, password } = parse.data;
  const { session, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ error: error.message });

  return res.status(200).json({ session });
}
```

### 4.5. Component: AuthForm

```tsx
// components/AuthForm.tsx
import React, { useState } from 'react';
import { useFormik } from 'formik';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { supabase } from '../lib/supabaseClient';

const RegisterSchema = z.object({ email: z.string().email(), password: z.string().min(6), name: z.string().min(1) });
const LoginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

export default function AuthForm() {
  const [mode, setMode] = useState<'login'|'register'>('login');
  const schema = mode === 'login' ? LoginSchema : RegisterSchema;

  const formik = useFormik({
    initialValues: { email: '', password: '', name: '' },
    validationSchema: toFormikValidationSchema(schema),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
      const data = await res.json();
      setSubmitting(false);
      if (data.error) return setErrors({ email: data.error });
      // TODO: handle redirect setelah sukses
    }
  });

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex space-x-4 mb-4">
        <button onClick={() => setMode('login')} className={mode === 'login' ? 'font-bold' : ''}>Login</button>
        <button onClick={() => setMode('register')} className={mode === 'register' ? 'font-bold' : ''}>Register</button>
      </div>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <div>
            <label>Name</label>
            <input name="name" onChange={formik.handleChange} value={formik.values.name} />
          </div>
        )}
        <div>
          <label>Email</label>
          <input name="email" onChange={formik.handleChange} value={formik.values.email} />
        </div>
        <div>
          <label>Password</label>
          <input name="password" type="password" onChange={formik.handleChange} value={formik.values.password} />
        </div>
        <button type="submit" disabled={formik.isSubmitting}>{mode === 'login' ? 'Sign In' : 'Sign Up'}</button>
      </form>
    </div>
  );
}
```

---

## 5. Petunjuk Penggunaan Dokumen untuk AI di Cursor

> **Tujuan:** Dokumen ini akan langsung dibaca oleh AI di editor (cursor) untuk menghasilkan kode dan instruksi implementasi.
>
> **AI harus melakukan:**
>
> 1. Memindai setiap bagian (Ringkasan Proyek, Skema DB, Struktur Folder, Contoh Implementasi).
> 2. Menghasilkan file kode (.ts, .tsx) dan konfigurasi sesuai contoh.
> 3. Mengikuti TypeScript type-safety, validasi Zod, dan style UI BK App.
> 4. Memberikan output langsung di cursor tanpa instruksi lanjutan dari pengguna.



