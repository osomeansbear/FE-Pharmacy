import { ProtectedRoute } from "@/components/main/ProtectedRoute";
import type { Metadata } from "next";
import "../globals.css";

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
    <div className=" bg-muted/5">
      <ProtectedRoute>{children}</ProtectedRoute>
    </div>
  );
}
