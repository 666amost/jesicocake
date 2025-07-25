# 🍰 JESICO CAKE - Premium Cake Pre-Order Platform

**JESICO CAKE** adalah platform pre-order kue premium yang dirancang khusus untuk memberikan pengalaman terbaik bagi pelanggan yang ingin memesan kue berkualitas tinggi untuk momen spesial mereka.

## ✨ Fitur Utama

### 🎂 Pre-Order System
- **Sistem Pre-Order**: Pesan 2-3 hari sebelum acara untuk kualitas optimal
- **Custom Design**: Konsultasi gratis untuk desain kue sesuai keinginan
- **Premium Quality**: Hanya menggunakan bahan berkualitas tinggi

### 📱 Mobile-First Design
- **Responsive**: Optimized untuk semua device (phone, tablet, desktop)
- **Fast Loading**: Performance tinggi dengan optimasi gambar dan caching
- **PWA Ready**: Dapat diinstall sebagai aplikasi mobile
- **Touch-Friendly**: Interface yang mudah digunakan di mobile

### 🛍️ E-Commerce Features
- **Product Catalog**: Katalog lengkap dengan filter dan search
- **Shopping Cart**: Keranjang belanja dengan session persistence
- **User Account**: Manajemen akun dan riwayat pesanan
- **Order Tracking**: Pantau status pesanan real-time

## 🏗️ Tech Stack

### Frontend
- **Next.js 15** dengan App Router
- **TypeScript** untuk type safety
- **Tailwind CSS** untuk styling
- **Heroicons** untuk icons
- **GSAP** untuk animasi (optional)

### Backend & Database
- **Supabase** untuk database dan authentication
- **PostgreSQL** sebagai database utama
- **Real-time subscriptions** untuk live updates
- **Auto-ping system** untuk menjaga database tetap aktif
- **Health monitoring** dengan cron jobs setiap 6 jam

### Mobile Optimization
- **PWA Configuration** untuk mobile app experience
- **Responsive Design** dengan mobile-first approach
- **Touch Gestures** support
- **Offline Capabilities** (coming soon)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Supabase account

### Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/666amost/jesicocake.git
   cd jesicocake
   ```

2. **Install dependencies**
   ```bash
   npm install
   # atau
   yarn install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` dan tambahkan:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run development server**
   ```bash
   npm run dev
   # atau
   yarn dev
   ```

5. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Mobile Features

### Responsive Design
- **Mobile-first**: Didesain khusus untuk mobile experience
- **Touch optimized**: Button dan navigation yang mudah disentuh
- **Fast navigation**: Bottom navigation untuk akses cepat

### PWA Capabilities
- **Installable**: Dapat diinstall sebagai app di home screen
- **Offline ready**: Basic offline functionality
- **Push notifications**: Notifikasi untuk update pesanan (coming soon)

### Performance
- **Image optimization**: WebP dan AVIF format support
- **Code splitting**: Lazy loading untuk performa optimal
- **Caching strategy**: Smart caching untuk loading cepat

## 🎨 Design System

### Color Palette
- **Primary**: Orange (#D97706) - Warm dan inviting
- **Secondary**: Amber (#F59E0B) - Luxury feel
- **Accent**: Cream (#FEF3E2) - Soft background
- **Success**: Green - Untuk confirmations
- **Warning**: Yellow - Untuk alerts

### Typography
- **Headings**: Playfair Display (Serif) - Elegant
- **Body**: Inter (Sans-serif) - Readable
- **UI Elements**: Poppins - Modern

### Components
- **Cards**: Rounded dengan shadow untuk depth
- **Buttons**: Gradient dengan hover effects
- **Forms**: Clean dengan proper validation
- **Navigation**: Bottom nav untuk mobile, header untuk desktop

## 🛍️ Business Model

### Target Market
- **Individual customers**: Birthday, anniversary cakes
- **Corporate clients**: Company events, meetings
- **Wedding couples**: Premium wedding cakes
- **Bakery enthusiasts**: Custom design lovers

### Revenue Streams
1. **Premium cake sales**: High-quality custom cakes
2. **Consultation services**: Design consultation fees
3. **Corporate partnerships**: Bulk orders untuk events
4. **Subscription boxes**: Monthly cake surprises (future)

## 🔧 Development

### Project Structure
```
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
├── lib/                # Utilities dan configurations
├── public/             # Static assets
├── supabase/           # Database migrations
├── types/              # TypeScript type definitions
└── styles/             # Global styles
```

### Key Components
- **Header**: Desktop navigation dengan search
- **BottomNavbar**: Mobile navigation
- **ProductCard**: Product display component
- **CartContext**: Global cart state management
- **AuthForm**: Login/signup forms

### Database Schema
- **products**: Katalog kue dengan gambar dan detail
- **orders**: Sistem pemesanan dengan status tracking
- **users**: User management dan preferences
- **categories**: Kategori kue (wedding, birthday, etc.)

## 📈 Performance Metrics

### Core Web Vitals
- **LCP**: <2.5s (Large Contentful Paint)
- **FID**: <100ms (First Input Delay)  
- **CLS**: <0.1 (Cumulative Layout Shift)

### Mobile Optimization
- **Mobile PageSpeed**: 90+
- **Touch response**: <50ms
- **Image optimization**: WebP/AVIF dengan lazy loading

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
npx vercel --prod
```

### Custom Server
```bash
npm run build
npm start
```

### Environment Variables
Pastikan semua environment variables sudah diset:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (untuk admin functions)

### Monitoring & Health Checks
- **Auto-ping**: `/api/ping-db` - Runs every 6 hours via Vercel Cron
- **Health check**: `/api/health-check` - Monitors all services
- **System status**: `/admin/system-status` - Real-time dashboard
- **Keep-alive**: Prevents Supabase from going inactive

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**JESICO CAKE Team**
- Email: info@jesicocake.com
- Phone: +62 812-3456-7890
- Website: https://jesicocake.com

---

**🍰 "More Bite, More You Like" - JESICO CAKE**

*Bringing premium cake experience to your fingertips with mobile-first design and exceptional quality.*
