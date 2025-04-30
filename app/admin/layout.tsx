'use client'; // PASTIKAN INI ADA DI BARIS PALING ATAS

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // Redirect to login if not authenticated
        router.push('/admin/login');
        return;
      }

      // Check if user has admin role
      const { data: userData, error } = await supabase
          .from('profiles')
        .select('role')
          .eq('id', session.user.id)
          .single();

      // Check the role
      if (error || !userData || userData.role !== 'admin') {
          // Sign out if role is not 'admin'
        await supabase.auth.signOut();
        router.push('/admin/login');
        return;
      }

      // If everything is OK, set user data and stop loading
      setUser(session.user);
      setLoading(false);
      } catch (error) {
        console.error('Error checking authentication:', error);
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Don't render layout for login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Render layout and content if user is admin
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <AdminHeader user={user} />

      <div className="flex-grow flex">
        <AdminSidebar />
        <main className="flex-grow p-6 mt-16">
          {children}
        </main>
      </div>
    </div>
  );
}