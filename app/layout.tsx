import { Figtree } from 'next/font/google';
import './globals.css';
import ThemeRegistry from '../theme/ThemeRegistry';
import Head from './head';
import Header from './_components/Header/header';
import { GetShoppingCartByEnrollmentId } from './_utils/shoppingCartUtils';
import { GetEnrollment } from './_utils/enrollmentUtils';
import Footer from './_components/Footer/footer';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

const figtree = Figtree({ subsets: ['latin'], display: 'swap' });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const enrollment = await GetEnrollment();

  const shoppingCart = enrollment
    ? await GetShoppingCartByEnrollmentId(enrollment?.data.enrollmentId || 0)
    : { shoppingCartItems: [] };

  return (
    <html lang="en" className={figtree.className}>
      <ThemeRegistry>
        <Head />
        <body className="flex flex-col min-h-screen">
          <AppRouterCacheProvider>
            <Header cartItems={shoppingCart?.shoppingCartItems} />
            <main className="flex-grow">{children}</main>
            <Footer />
          </AppRouterCacheProvider>
        </body>
      </ThemeRegistry>
    </html>
  );
}
