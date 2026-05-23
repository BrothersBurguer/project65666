"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/formatters";

export function Footer() {
  const { itemCount, total } = useCart();
  const pathname = usePathname();

  // Esconder nas páginas que têm seu próprio botão fixo
  if (itemCount === 0) return null;
  if (pathname === "/carrinho" || pathname === "/checkout" || pathname.startsWith("/produto/")) return null;

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-black text-white font-bold z-30">
      <Link
        href="/carrinho"
        className="flex justify-between items-center max-w-5xl mx-auto px-6 py-4"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded px-1">
              {itemCount}
            </span>
          </div>
          <span>Ver Carrinho</span>
        </div>
        <span>{formatPrice(total)}</span>
      </Link>
    </footer>
  );
}
