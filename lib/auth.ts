import { createServerComponentClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getSession() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function requireAuth() {
  const session = await getSession();
  
  if (!session) {
    redirect('/admin/login');
  }
  
  return session;
}

export async function requireAdmin() {
  const session = await getSession();
  
  if (!session) {
    redirect('/admin/login');
  }
  
  // Check if user has admin role
  const supabase = createServerComponentClient({ cookies });
  const { data: userData, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single();
  
  if (error || !userData || userData.role !== 'admin') {
    redirect('/admin/login');
  }
  
  return session;
}