import type { Metadata } from "next";
import "../globals.css";
import Navbar from "../../components/main/navbar";
import Header from "../../components/main/header";
import Footer from "@/components/main/footer";

export const metadata: Metadata = {
  title: "User Interface",
  description: "User section of the application",
};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div>
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
