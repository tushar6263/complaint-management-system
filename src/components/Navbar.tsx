'use client';

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold text-blue-600">
          ComplaintSys
        </Link>

        <div className="flex gap-4">
          <Link href="/complaints" className="text-sm hover:text-blue-600">
            Submit
          </Link>
          <Link href="/admin" className="text-sm hover:text-blue-600">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
