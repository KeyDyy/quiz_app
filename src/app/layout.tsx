import { cn } from "@/lib/utils";
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { Inter } from "next/font/google";

//import { Figtree } from 'next/font/google'

//import ToasterProvider from '../providers/ToasterProvider'
import UserProvider from "../../providers/UserProvider";
import ModalProvider from "../../providers/ModalProvider";
import SupabaseProvider from "../../providers/SupabaseProvider";
import FriendList from '@/components/FriendList';
import { SidebarProvider } from '../../providers/SidebarContext';

import "./globals.css";
import Head from "next/head";

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
  return (
    <html lang="en">
      <Head>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
      </Head>
      <body
        className={cn(inter.className, "antialiased")}
        style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}
      >
        {/* <ToasterProvider /> */}
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider />

            <SidebarProvider>
              <Navbar />
              <FriendList />
              <div className="flex-1 bg-gray-100">{children}</div>


              <Footer />
            </SidebarProvider>
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
