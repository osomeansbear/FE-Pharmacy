"use client";

import { useParams } from "next/navigation";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <span>Product Id: {params.slug}</span>
    </div>
  );
}
