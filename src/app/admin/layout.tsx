import type { Metadata } from "next";
import Header from "../../components/main/Header";
import "../globals.css";

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
        <div className="min-w-screen min-h-screen ">
          <Header />

          {children}
        </div>
      </body>
    </html>
  );
}
