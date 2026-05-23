import { Product } from "@/types/Product";

export const products: Product[] = [
  // === COMBOS ===
  {
    id: 1,
    slug: "combo-prime-chespy-bacon",
    name: "Combo Prime Chespy Bacon Individual",
    description: "Prime Cheddar Bacon + Batata 150g + Refrigerante 350ml",
    price: 23.9,
    originalPrice: 39.8,
    image: "/images/products/combo-chespy-bacon.png",
    category: "combos",
    extras: [
      { id: 101, name: "Bacon Extra", price: 4.0, maxQty: 3 },
      { id: 102, name: "Cheddar Extra", price: 3.0, maxQty: 3 },
      { id: 103, name: "Ovo", price: 3.0, maxQty: 2 },
      { id: 104, name: "Hambúrguer Extra", price: 7.0, maxQty: 2 },
    ],
  },
  {
    id: 2,
    slug: "2-prime-duplo-bacon",
    name: "2 Prime Duplo Bacon",
    description:
      "2 Prime Duplo Bacon + 2 Batatas 500g + 2 Refrigerantes 350ml",
    price: 34.9,
    originalPrice: 53.8,
    image: "/images/products/combo-duplo-bacon.png",
    category: "combos",
    extras: [
      { id: 101, name: "Bacon Extra", price: 4.0, maxQty: 3 },
      { id: 102, name: "Cheddar Extra", price: 3.0, maxQty: 3 },
      { id: 103, name: "Ovo", price: 3.0, maxQty: 2 },
    ],
  },
  {
    id: 3,
    slug: "combo-familia",
    name: "Combo Família 4 Cheddar Prime Bacon",
    description: "4 Prime Cheddar Bacon + Batata 500g + Refrigerante 2L",
    price: 54.9,
    originalPrice: 75.8,
    image: "/images/products/combo-familia.png",
    category: "combos",
    badge: "MAIS VENDIDO 🖤",
    featured: true,
    extras: [
      { id: 101, name: "Bacon Extra", price: 4.0, maxQty: 3 },
      { id: 102, name: "Cheddar Extra", price: 3.0, maxQty: 3 },
      { id: 103, name: "Ovo", price: 3.0, maxQty: 2 },
      { id: 104, name: "Hambúrguer Extra", price: 7.0, maxQty: 4 },
    ],
  },

  // === HAMBÚRGUER ARTESANAL ===
  {
    id: 4,
    slug: "prime-chespy-bacon",
    name: "Prime Chespy Bacon",
    description: "Pão brioche, hambúrguer artesanal, cheddar, bacon crocante",
    price: 23.9,
    image: "/images/products/prime-chespy-bacon.png",
    category: "hamburguer-artesanal",
    freeExtras: "2 Adicionais Grátis",
    extras: [
      { id: 201, name: "Bacon Extra", price: 0, maxQty: 1 },
      { id: 202, name: "Cheddar Extra", price: 0, maxQty: 1 },
      { id: 203, name: "Ovo", price: 3.0, maxQty: 2 },
      { id: 204, name: "Hambúrguer Extra", price: 7.0, maxQty: 2 },
      { id: 205, name: "Salada", price: 0, maxQty: 1 },
    ],
  },
  {
    id: 5,
    slug: "prime-triple-bacon",
    name: "Prime Triple Bacon",
    description:
      "Pão brioche, 3 hambúrgueres artesanais, cheddar, bacon triplo",
    price: 27.9,
    image: "/images/products/prime-triple-bacon.png",
    category: "hamburguer-artesanal",
    freeExtras: "2 Adicionais Grátis",
    extras: [
      { id: 201, name: "Bacon Extra", price: 0, maxQty: 1 },
      { id: 202, name: "Cheddar Extra", price: 0, maxQty: 1 },
      { id: 203, name: "Ovo", price: 3.0, maxQty: 2 },
      { id: 204, name: "Hambúrguer Extra", price: 7.0, maxQty: 2 },
    ],
  },
  {
    id: 6,
    slug: "prime-salada",
    name: "Prime Salada",
    description:
      "Pão brioche, hambúrguer artesanal, queijo, alface, tomate, cebola",
    price: 26.9,
    image: "/images/products/prime-salada.png",
    category: "hamburguer-artesanal",
    freeExtras: "2 Adicionais Grátis",
    extras: [
      { id: 201, name: "Bacon Extra", price: 0, maxQty: 1 },
      { id: 202, name: "Cheddar Extra", price: 0, maxQty: 1 },
      { id: 203, name: "Ovo", price: 3.0, maxQty: 2 },
    ],
  },
  {
    id: 7,
    slug: "double-bacon-smash",
    name: "Double Bacon Smash",
    description: "Pão brioche, 2 smash burgers, cheddar, bacon, molho especial",
    price: 26.9,
    image: "/images/products/double-bacon-smash.png",
    category: "hamburguer-artesanal",
    freeExtras: "2 Adicionais Grátis",
    extras: [
      { id: 201, name: "Bacon Extra", price: 0, maxQty: 1 },
      { id: 202, name: "Cheddar Extra", price: 0, maxQty: 1 },
      { id: 203, name: "Ovo", price: 3.0, maxQty: 2 },
    ],
  },
  {
    id: 8,
    slug: "prime-cheddar",
    name: "Prime Cheddar",
    description: "Pão brioche, hambúrguer artesanal, cheddar cremoso",
    price: 23.9,
    image: "/images/products/prime-cheddar.png",
    category: "hamburguer-artesanal",
    freeExtras: "2 Adicionais Grátis",
    extras: [
      { id: 201, name: "Bacon Extra", price: 0, maxQty: 1 },
      { id: 202, name: "Cheddar Extra", price: 0, maxQty: 1 },
      { id: 203, name: "Ovo", price: 3.0, maxQty: 2 },
    ],
  },
  {
    id: 9,
    slug: "prime-gorgonzola-melt",
    name: "Prime Gorgonzola Melt",
    description: "Pão brioche, hambúrguer artesanal, gorgonzola derretido",
    price: 21.9,
    image: "/images/products/prime-gorgonzola.png",
    category: "hamburguer-artesanal",
    freeExtras: "2 Adicionais Grátis",
    extras: [
      { id: 201, name: "Bacon Extra", price: 0, maxQty: 1 },
      { id: 202, name: "Cheddar Extra", price: 0, maxQty: 1 },
      { id: 203, name: "Ovo", price: 3.0, maxQty: 2 },
    ],
  },
  {
    id: 10,
    slug: "prime-picanha",
    name: "Prime Picanha",
    description:
      "Pão brioche, hambúrguer de picanha, cheddar, cebola caramelizada",
    price: 27.9,
    image: "/images/products/prime-picanha.png",
    category: "hamburguer-artesanal",
    freeExtras: "2 Adicionais Grátis",
    extras: [
      { id: 201, name: "Bacon Extra", price: 0, maxQty: 1 },
      { id: 202, name: "Cheddar Extra", price: 0, maxQty: 1 },
      { id: 203, name: "Ovo", price: 3.0, maxQty: 2 },
    ],
  },
  {
    id: 11,
    slug: "prime-brigadeiro",
    name: "Prime Brigadeiro",
    description: "Pão brioche, hambúrguer artesanal, brigadeiro gourmet",
    price: 19.9,
    image: "/images/products/prime-brigadeiro.png",
    category: "hamburguer-artesanal",
    freeExtras: "2 Adicionais Grátis",
    extras: [
      { id: 201, name: "Bacon Extra", price: 0, maxQty: 1 },
      { id: 202, name: "Cheddar Extra", price: 0, maxQty: 1 },
    ],
  },
  {
    id: 12,
    slug: "prime-moda-da-casa",
    name: "Prime Moda da Casa",
    description:
      "Pão brioche, hambúrguer artesanal, molho da casa, queijo, bacon",
    price: 24.9,
    image: "/images/products/prime-moda-da-casa.png",
    category: "hamburguer-artesanal",
    freeExtras: "2 Adicionais Grátis",
    extras: [
      { id: 201, name: "Bacon Extra", price: 0, maxQty: 1 },
      { id: 202, name: "Cheddar Extra", price: 0, maxQty: 1 },
      { id: 203, name: "Ovo", price: 3.0, maxQty: 2 },
    ],
  },
  // === BATATAS ===
  {
    id: 13,
    slug: "batata-frita-simples",
    name: "Batata Frita Simples",
    description: "Porção de batata frita crocante com sal (300g)",
    price: 12.9,
    image: "/images/products/batata-simples.jpg",
    category: "batatas",
    extras: [
      { id: 301, name: "Cheddar", price: 4.0, maxQty: 2 },
      { id: 302, name: "Bacon", price: 4.0, maxQty: 2 },
      { id: 303, name: "Catupiry", price: 4.0, maxQty: 1 },
    ],
  },
  {
    id: 14,
    slug: "batata-com-cheddar",
    name: "Batata com Cheddar",
    description: "Porção de batata frita coberta com cheddar cremoso (300g)",
    price: 16.9,
    image: "/images/products/batata-cheddar.jpg",
    category: "batatas",
    extras: [
      { id: 302, name: "Bacon", price: 4.0, maxQty: 2 },
      { id: 303, name: "Catupiry", price: 4.0, maxQty: 1 },
    ],
  },
  {
    id: 15,
    slug: "batata-cheddar-bacon",
    name: "Batata Cheddar e Bacon",
    description:
      "Porção de batata frita com cheddar cremoso e bacon crocante (300g)",
    price: 19.9,
    image: "/images/products/batata-cheddar-bacon.jpg",
    category: "batatas",
    badge: "MAIS PEDIDA 🔥",
    extras: [
      { id: 303, name: "Catupiry", price: 4.0, maxQty: 1 },
      { id: 304, name: "Cheddar Extra", price: 4.0, maxQty: 2 },
    ],
  },
  {
    id: 16,
    slug: "batata-mega",
    name: "Batata Mega Completa",
    description:
      "Porção grande de batata frita com cheddar, bacon e catupiry (500g)",
    price: 24.9,
    image: "/images/products/batata-mega.jpg",
    category: "batatas",
    featured: true,
    extras: [
      { id: 302, name: "Bacon Extra", price: 4.0, maxQty: 2 },
      { id: 304, name: "Cheddar Extra", price: 4.0, maxQty: 2 },
    ],
  },

  // === PORÇÕES ===
  {
    id: 17,
    slug: "onion-rings",
    name: "Onion Rings",
    description: "Anéis de cebola empanados e fritos, crocantes por fora (200g)",
    price: 14.9,
    image: "/images/products/onion-rings.jpg",
    category: "porcoes",
    extras: [
      { id: 301, name: "Cheddar", price: 4.0, maxQty: 1 },
    ],
  },
  {
    id: 18,
    slug: "nuggets-10un",
    name: "Nuggets (10 un)",
    description: "10 nuggets de frango crocantes com molho especial",
    price: 15.9,
    image: "/images/products/nuggets.jpg",
    category: "porcoes",
    extras: [
      { id: 301, name: "Cheddar", price: 4.0, maxQty: 1 },
      { id: 305, name: "Molho BBQ", price: 2.0, maxQty: 1 },
    ],
  },
  {
    id: 19,
    slug: "isca-de-frango",
    name: "Isca de Frango",
    description:
      "Iscas de frango empanadas com molho de mostarda e mel (250g)",
    price: 17.9,
    image: "/images/products/isca-frango.jpg",
    category: "porcoes",
    extras: [
      { id: 301, name: "Cheddar", price: 4.0, maxQty: 1 },
      { id: 302, name: "Bacon", price: 4.0, maxQty: 1 },
    ],
  },

  // === BEBIDAS ===
  {
    id: 20,
    slug: "coca-cola-350ml",
    name: "Coca-Cola 350ml",
    description: "Coca-Cola lata gelada 350ml",
    price: 6.0,
    image: "/images/products/coca-350.jpg",
    category: "bebidas",
  },
  {
    id: 21,
    slug: "coca-cola-2l",
    name: "Coca-Cola 2 Litros",
    description: "Coca-Cola garrafa 2 litros",
    price: 14.9,
    image: "/images/products/coca-2l.jpg",
    category: "bebidas",
  },
  {
    id: 22,
    slug: "guarana-antarctica-350ml",
    name: "Guaraná Antarctica 350ml",
    description: "Guaraná Antarctica lata gelada 350ml",
    price: 5.5,
    image: "/images/products/guarana-350.jpg",
    category: "bebidas",
  },
  {
    id: 24,
    slug: "agua-mineral-500ml",
    name: "Água Mineral 500ml",
    description: "Água mineral sem gás 500ml",
    price: 3.5,
    image: "/images/products/agua-mineral.jpg",
    category: "bebidas",
  },

  // === SOBREMESAS ===
  {
    id: 25,
    slug: "brownie-chocolate",
    name: "Brownie de Chocolate",
    description: "Brownie artesanal de chocolate com pedaços derretidos",
    price: 9.9,
    image: "/images/products/brownie-chocolate.jpg",
    category: "sobremesas",
  },
  {
    id: 26,
    slug: "milk-shake-ovomaltine",
    name: "Milk Shake Ovomaltine",
    description: "Milk shake cremoso de Ovomaltine com chantilly (400ml)",
    price: 16.9,
    image: "/images/products/milk-shake-ovomaltine.jpg",
    category: "sobremesas",
    badge: "NOVIDADE 🆕",
  },
  {
    id: 27,
    slug: "acai-500ml",
    name: "Açaí 500ml",
    description: "Açaí cremoso com granola, banana e leite condensado",
    price: 18.9,
    image: "/images/products/acai-500.jpg",
    category: "sobremesas",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}
