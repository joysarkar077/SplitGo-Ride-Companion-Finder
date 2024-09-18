import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "./context/AuthProvider";
import Navbar from "@/components/custionUi/Navbar";
import 'leaflet/dist/leaflet.css';
import { Raleway } from 'next/font/google';

const raleway = Raleway({ subsets: ["latin"] });


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
