import type { Metadata } from "next";
import { AdminProtectedRoute } from "../../components/main/AdminProtectedRoute";
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
        <AdminProtectedRoute>
          <div className="min-w-screen min-h-screen">
            <Header />
            {children}
          </div>
        </AdminProtectedRoute>
      </body>
    </html>
  );
}
