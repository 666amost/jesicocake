import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, Cormorant_Garamond, Montserrat, Inter } from 'next/font/google';
import { CartProvider } from '@/lib/CartContext';
import { Toaster } from '@/components/ui/toaster';
import BottomNavbar from '@/components/BottomNavbar';

// Premium fonts for a luxury pastry brand
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
});

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Jesico Cake - More Bite More You Like',
  description: 'Premium cakes and pastries for your special moments',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable} ${montserrat.variable} font-sans bg-neutral-50`}>
      <body>
        <CartProvider>
          <main>
            {children}
          </main>
          <BottomNavbar />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}