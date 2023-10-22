import { cn } from "@/lib/utils";
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Head from "next/head";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import "./globals.css";
import { Inter } from "next/font/google";
import SessionProvider from "./SessionProvider";
import { Session } from "next-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quiz_app",
  description: "Quiz_app with AI's questions!",
};

type Props = {
  children: React.ReactNode;
  session: Session | null;
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
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
        <SessionProvider session={session}>
          <Navbar />
          <div className="flex-1 bg-gray-100">{children}</div>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
