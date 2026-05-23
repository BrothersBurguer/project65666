"use client";

import { useState, useEffect } from "react";

const categories = [
  { id: "combos", name: "Combos" },
  { id: "hamburguer-artesanal", name: "Hambúrguer Artesanal" },
  { id: "batatas", name: "Batatas" },
  { id: "porcoes", name: "Porções" },
  { id: "bebidas", name: "Bebidas" },
  { id: "sobremesas", name: "Sobremesas" },
];

export function CategoryNav() {
  const [active, setActive] = useState(categories[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-100px 0px -60% 0px" }
    );

    for (const cat of categories) {
      const el = document.getElementById(cat.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="sticky top-0 z-20 bg-black py-2.5">
      <div className="max-w-5xl mx-auto px-3 sm:px-5 flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => scrollTo(cat.id)}
            className={`snap-start text-white font-bold px-3 sm:px-4 py-1 whitespace-nowrap text-xs sm:text-sm border-t-2 transition-colors ${
              active === cat.id
                ? "border-white"
                : "border-black hover:border-white/50"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </nav>
  );
}
