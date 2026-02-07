"use client";
export default function Home() {
  return (
    <div>
      {/* Desktop */}
      <div className="bg-red-600 hidden md:block">abcd</div>
      {/* Mobile */}
      <div className="bg-blue-600 block md:hidden">abcd</div>
    </div>
  );
}
