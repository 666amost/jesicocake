import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, phone, address } = body;
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Email, password, and name are required.' }, { status: 400 });
    }
    // Register user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone, address }
      }
    });
    if (signUpError) {
      return NextResponse.json({ error: signUpError.message }, { status: 400 });
    }
    // Profile akan otomatis terbuat via trigger Supabase
    return NextResponse.json({ user: signUpData.user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
} 