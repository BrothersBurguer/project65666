import { Product } from "@/types/Product";
import { ProductCard } from "@/components/product/ProductCard";

type ProductSectionProps = {
  id: string;
  title: string;
  products: Product[];
};

export function ProductSection({ id, title, products }: ProductSectionProps) {
  return (
    <div id={id} className="scroll-mt-16 mb-6">
      <h2 className="text-xl font-semibold text-black mb-2">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
