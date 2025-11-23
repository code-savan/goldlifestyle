"use client";

import { CircleX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[90vh] w-full flex flex-col items-center justify-center text-center px-6">
      <CircleX className=" text-gray-600 mb-5" size={80} />
      <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-gray-500">Page not found</h1>
      <p className="mt-4 max-w-xl text-sm md:text-sm text-gray-700">
        The page you’re looking for doesn’t exist, was moved, or is temporarily unavailable.
      </p>
      <div className="mt-8 flex items-center gap-3">
        <Link
          href="/"
          className="px-4 py-2 bg-black text-white hover:bg-black/90 text-[12px] tracking-wider uppercase transition-colors cursor-pointer"
        >
          Go to homepage
        </Link>
        <Link
          href="/collection"
          className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-[12px] tracking-wider uppercase transition-colors cursor-pointer"
        >
          Browse Collection
        </Link>
      </div>
    </div>
  );
}
