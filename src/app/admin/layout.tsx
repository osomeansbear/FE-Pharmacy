import type { Metadata } from "next";
import "../globals.css";
import NavBar from "../../components/main/navbar";
import Header from "../../components/main/header";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Admin section of the application",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="w-full">
          <Header />

          {children}
        </div>
      </body>
    </html>
  );
}
