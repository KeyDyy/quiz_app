import { cn } from "@/lib/utils";
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { Inter } from 'next/font/google'

//import { Figtree } from 'next/font/google'

//import ToasterProvider from '../providers/ToasterProvider'
import UserProvider from '../../providers/UserProvider'
import ModalProvider from '../../providers/ModalProvider'
import SupabaseProvider from '../../providers/SupabaseProvider'


import Header from '@/components/Header'
import './globals.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quiz_app",
  description: "Quiz_app with AI's questions!",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const products = await getActiveProductsWithPrices();
  // const userSongs = await getSongsByUserId();

  return (
    <html lang="en">
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <body className={cn(inter.className, "antialiased")}>
        {/* <ToasterProvider /> */}
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider />

            <Navbar />
            {children}
            <Footer />

          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}





