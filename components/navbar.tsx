"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle"; // Ensure you have this component created
import Image from "next/image";

export function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      {/* Container adds max-width and mx-auto centers it */}
      <div className="container mx-auto flex h-14 items-center px-4 md:px-6">
        {/* Left Side: Logo & Text */}
        <Link
          className="flex items-center gap-2 font-bold text-xl mr-auto"
          href="/"
        >
          <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-primary/10 flex items-center justify-center">
            {/* 2. Use Image component with 'fill' to adapt to parent div size */}
            <Image
              src="/logo.png" // Path to your image in the public folder
              alt="FinanceGyan Logo"
              fill
              className="object-cover"
              priority // Loads image immediately since it's above the fold
            />
          </div>
          <span>
            Finance <span className="text-[#ffd439]">Gyan</span>
          </span>
        </Link>

        {/* Right Side: Mode Toggle (ml-auto pushes it to the right if needed, though mr-auto on link does the same) */}
        <div className="flex items-center gap-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
