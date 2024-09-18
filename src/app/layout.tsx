import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "./context/AuthProvider";
import Navbar from "@/components/custionUi/Navbar";
import 'leaflet/dist/leaflet.css';
import {Raleway} from 'next/font/google';

const raleway = Raleway({ subsets: ["latin"] });

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SplitGo",
  description: "Split and share expenses with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={raleway.className}>
        <AuthProvider>
          <Navbar></Navbar>
          <div className="mt-16">{children}</div>
        </AuthProvider>
        <Toaster></Toaster>
      </body>
    </html>
  );
}
