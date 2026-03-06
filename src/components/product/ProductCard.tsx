import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/Product";
import { PriceDisplay } from "./PriceDisplay";
import { ProductBadge } from "./ProductBadge";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="item">
      <Link
        href={`/produto/${product.slug}`}
        className={cn(
          "flex flex-row justify-between items-center p-3 bg-white rounded-2xl border-2 border-prime-border transition-all hover:border-black",
          product.featured &&
            "border-prime-green animate-pulse-green"
        )}
      >
        <div className="flex flex-col pr-3 max-w-[220px] md:max-w-none">
          {product.badge && <ProductBadge text={product.badge} />}

          <h3 className="font-semibold text-base">{product.name}</h3>
          <span className="text-sm text-gray-600">{product.description}</span>

          {product.freeExtras && (
            <span className="text-sm text-prime-green font-medium">
              {product.freeExtras}
            </span>
          )}

          {product.featured && (
            <span className="text-sm text-gray-500 bg-gray-100 p-2 rounded-lg my-1">
              Mais que o dobro de carne do Combo 1 por apenas{" "}
              <b>R$7 a mais</b>!
            </span>
          )}

          <PriceDisplay
            price={product.price}
            originalPrice={product.originalPrice}
            featured={product.featured}
          />

          {product.featured && (
            <>
              <span className="text-sm italic text-gray-500 mt-1">
                A maioria dos clientes escolhe esse porque é o melhor
                custo-benefício!
              </span>
              <span className="text-xs mt-1">
                🔥 Apenas{" "}
                <b className="bg-red-500 text-white rounded-lg px-1.5 py-0.5">
                  8 combo(s)
                </b>{" "}
                com esse preço especial
              </span>
            </>
          )}
        </div>

        <div className="flex-shrink-0">
          <div className="w-[110px] h-[110px] border border-prime-border rounded-2xl overflow-hidden bg-gray-50">
            <Image
              src={product.image}
              alt={product.name}
              width={110}
              height={110}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </Link>
    </div>
  );
}
