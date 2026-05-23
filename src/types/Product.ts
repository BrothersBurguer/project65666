export type ProductCategory =
  | "combos"
  | "hamburguer-artesanal"
  | "batatas"
  | "porcoes"
  | "bebidas"
  | "sobremesas";

export type ProductExtra = {
  id: number;
  name: string;
  price: number;
  maxQty: number;
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: ProductCategory;
  badge?: string;
  featured?: boolean;
  freeExtras?: string;
  extras?: ProductExtra[];
};
