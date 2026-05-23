import { Product, ProductExtra } from "./Product";

export type CartItemExtra = {
  extra: ProductExtra;
  qty: number;
};

export type CartItem = {
  id: string;
  product: Product;
  quantity: number;
  selectedExtras: CartItemExtra[];
  unitTotal: number;
};
