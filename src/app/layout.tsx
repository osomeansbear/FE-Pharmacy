import type { Metadata } from "next";
import "./globals.css";
import NavBar from "../components/main/navbar";
import Header from "../components/main/header";

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
        <div className="w-full">{children}</div>
      </body>
    </html>
  );
}
