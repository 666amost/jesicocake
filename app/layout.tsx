import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter, Poppins } from 'next/font/google';
import { CartProvider } from '@/lib/CartContext';
import { Toaster } from '@/components/ui/toaster';
import BottomNavbar from '@/components/BottomNavbar';
import { ThemeProvider } from '@/lib/theme';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Premium fonts for JESICO CAKE brand
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://jesicocake.com'),
  title: 'JESICO CAKE - Premium Cake Pre-Order | Kue Premium untuk Momen Spesial',
  description: 'Pesan kue premium terbaik di JESICO CAKE. Sistem pre-order untuk wedding cake, birthday cake, dan custom cake dengan bahan berkualitas tinggi. Mobile-friendly dan mudah diakses.',
  keywords: 'jesico cake, kue premium, pre order cake, wedding cake, birthday cake, custom cake, kue jakarta',
  authors: [{ name: 'JESICO CAKE Team' }],
  creator: 'JESICO CAKE',
  publisher: 'JESICO CAKE',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
    shortcut: '/favicon.png',
  },
  openGraph: {
    title: 'JESICO CAKE - Premium Cake Pre-Order',
    description: 'Kue premium terbaik dengan sistem pre-order untuk momen spesial Anda',
    url: 'https://jesicocake.com',
    siteName: 'JESICO CAKE',
    images: [
      {
        url: '/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: 'JESICO CAKE Premium Cakes',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JESICO CAKE - Premium Cake Pre-Order',
    description: 'Kue premium terbaik dengan sistem pre-order untuk momen spesial Anda',
    images: ['/android-chrome-512x512.png'],
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#D97706',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${playfair.variable} ${inter.variable} ${poppins.variable}`}>
      <body className={`${inter.className} bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 min-h-screen antialiased`}>
        <ThemeProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              {/* Header - Hidden on mobile, visible on desktop */}
              <div className="hidden md:block">
                <Header />
              </div>
              
              {/* Main Content */}
              <main className="flex-1 w-full max-w-md mx-auto bg-transparent md:max-w-6xl md:px-4 lg:px-8">
                <div className="md:bg-white/50 md:backdrop-blur-sm md:rounded-2xl md:shadow-lg md:my-4 md:overflow-hidden">
                  {children}
                </div>
              </main>
              {/* Footer - Only show on desktop */}
              <div className="hidden md:block">
                <Footer />
              </div>
              {/* Bottom Navigation - Mobile Only */}
              <BottomNavbar />
              
              {/* Toast Notifications */}
              <Toaster />
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}