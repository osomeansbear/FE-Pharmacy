"use client";
import Link from "next/link";
import {
  Pill,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-200 border-t border-gray-500 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-20 lg:px-32">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Column 1: Brand & Description */}
          <div className="col-span-1 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 text-success">
              <Pill className="size-6" />
              <span className="text-xl font-bold">PharmaCore</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              Your trusted partner in modern healthcare. Providing quality
              medications and AI-driven pharmaceutical assistance at your
              fingertips.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/" className="hover:text-success transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="hover:text-success transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/ai-assistant"
                  className="hover:text-success transition-colors"
                >
                  AI Assistant
                </Link>
              </li>
              <li>
                <Link
                  href="/inventory"
                  className="hover:text-success transition-colors"
                >
                  Inventory
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link
                  href="/help"
                  className="hover:text-success transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-success transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-success transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-success transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-success" />
                123 Health St, Medical District
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-success" />
                +1 (555) 000-1234
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-success" />
                support@pharmacore.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400">
            © {currentYear} PharmaCore. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex gap-6 text-slate-400">
            <Link href="#" className="hover:text-success transition-colors">
              <Facebook size={18} />
            </Link>
            <Link href="#" className="hover:text-success transition-colors">
              <Twitter size={18} />
            </Link>
            <Link href="#" className="hover:text-success transition-colors">
              <Instagram size={18} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
