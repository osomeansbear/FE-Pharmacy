import Footer from "@/components/main/Footer";
import Navbar from "@/components/main/Navbar";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Login Page",
  description: "Login page for the application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="bg-muted/5">
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
