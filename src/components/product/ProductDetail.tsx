"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/types/Product";
import { CartItemExtra } from "@/types/CartItem";
import { useCart } from "@/context/CartContext";
import { getProductsByCategory } from "@/data/products";
import { PriceDisplay } from "./PriceDisplay";
import { ProductBadge } from "./ProductBadge";
import { formatPrice } from "@/lib/formatters";

type ProductDetailProps = {
  product: Product;
};

export function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<
    Record<number, number>
  >({});
  const [selectedSides, setSelectedSides] = useState<Record<number, number>>(
    {}
  );

  const showSides =
    product.category === "hamburguer-artesanal" ||
    product.category === "batatas" ||
    product.category === "porcoes";

  const sideItems = showSides
    ? [
        ...getProductsByCategory("batatas"),
        ...getProductsByCategory("porcoes"),
        ...getProductsByCategory("bebidas"),
      ].filter((p) => p.id !== product.id)
    : [];

  const extrasTotal = (product.extras || []).reduce((sum, extra) => {
    const qty = selectedExtras[extra.id] || 0;
    return sum + extra.price * qty;
  }, 0);

  const sidesTotal = sideItems.reduce((sum, side) => {
    const qty = selectedSides[side.id] || 0;
    return sum + side.price * qty;
  }, 0);

  const unitTotal = product.price + extrasTotal;
  const totalPrice = unitTotal * quantity + sidesTotal;

  const toggleExtra = (extraId: number, maxQty: number) => {
    setSelectedExtras((prev) => {
      const current = prev[extraId] || 0;
      if (current >= maxQty) {
        const next = { ...prev };
        delete next[extraId];
        return next;
      }
      return { ...prev, [extraId]: current + 1 };
    });
  };

  const toggleSide = (sideId: number) => {
    setSelectedSides((prev) => {
      const current = prev[sideId] || 0;
      if (current >= 1) {
        const next = { ...prev };
        delete next[sideId];
        return next;
      }
      return { ...prev, [sideId]: 1 };
    });
  };

  const handleAddToCart = () => {
    const cartExtras: CartItemExtra[] = (product.extras || [])
      .filter((e) => (selectedExtras[e.id] || 0) > 0)
      .map((e) => ({ extra: e, qty: selectedExtras[e.id] }));

    addItem(product, quantity, cartExtras);

    // Add selected side items as separate cart items
    for (const side of sideItems) {
      const sideQty = selectedSides[side.id] || 0;
      if (sideQty > 0) {
        addItem(side, sideQty, []);
      }
    }

    router.push("/carrinho");
  };

  return (
    <div className="pb-24">
      {/* Imagem + Info */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
        <div className="w-full max-w-[300px] rounded-2xl overflow-hidden border border-prime-border">
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-auto object-cover"
            priority
          />
        </div>

        <div className="flex flex-col flex-1">
          {product.badge && <ProductBadge text={product.badge} />}
          <h1 className="text-2xl font-bold text-black">{product.name}</h1>
          <p className="text-gray-600 mt-1">{product.description}</p>

          {product.freeExtras && (
            <span className="text-prime-green font-medium text-sm mt-2">
              {product.freeExtras}
            </span>
          )}

          <div className="mt-3">
            <PriceDisplay
              price={product.price}
              originalPrice={product.originalPrice}
              size="lg"
            />
          </div>
        </div>
      </div>

      {/* Extras/Adicionais */}
      {product.extras && product.extras.length > 0 && (
        <div className="mt-8">
          <div className="bg-prime-border/50 rounded-t-xl px-3 py-2 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Adicionais</h3>
              <span className="text-sm text-gray-600">
                Escolha seus adicionais
              </span>
            </div>
          </div>

          {product.extras.map((extra) => {
            const qty = selectedExtras[extra.id] || 0;
            return (
              <div
                key={extra.id}
                className="flex justify-between items-center border border-t-0 border-prime-border border-dashed px-3 py-3 last:rounded-b-xl"
              >
                <div>
                  <span className="font-medium">{extra.name}</span>
                  {extra.price > 0 && (
                    <span className="ml-2 text-prime-green font-bold">
                      + {formatPrice(extra.price)}
                    </span>
                  )}
                  {extra.price === 0 && (
                    <span className="ml-2 text-prime-green font-bold text-sm">
                      Grátis
                    </span>
                  )}
                </div>
                <button
                  onClick={() => toggleExtra(extra.id, extra.maxQty)}
                  className={`w-12 h-7 rounded-full transition-colors ${
                    qty > 0
                      ? "bg-prime-purple"
                      : "bg-gray-300"
                  } relative`}
                >
                  <span
                    className={`absolute top-[3px] w-5 h-5 rounded-full bg-white transition-all ${
                      qty > 0 ? "left-[26px]" : "left-[3px]"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Acompanhamentos */}
      {showSides && sideItems.length > 0 && (
        <div className="mt-8">
          <div className="bg-prime-border/50 rounded-t-xl px-3 py-2">
            <h3 className="font-semibold">Acompanhamentos</h3>
            <span className="text-sm text-gray-600">
              Adicione ao seu pedido
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
            {sideItems.map((side) => {
              const isSelected = (selectedSides[side.id] || 0) > 0;
              return (
                <button
                  key={side.id}
                  onClick={() => toggleSide(side.id)}
                  className={`flex flex-col items-center text-center rounded-xl border-2 p-3 transition-all ${
                    isSelected
                      ? "border-prime-green bg-prime-green/5 shadow-md"
                      : "border-prime-border hover:border-gray-400"
                  }`}
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden mb-2">
                    <Image
                      src={side.image}
                      alt={side.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-semibold leading-tight">
                    {side.name}
                  </span>
                  <span className="text-xs text-prime-green font-bold mt-1">
                    + {formatPrice(side.price)}
                  </span>
                  {isSelected && (
                    <span className="mt-1 text-[10px] bg-prime-green text-white px-2 py-0.5 rounded-full font-bold">
                      ADICIONADO
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantidade + Adicionar */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-4 z-30">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          {/* Quantidade */}
          <div className="flex items-center border-2 border-prime-border rounded-full">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-11 h-10 flex items-center justify-center text-gray-600 text-lg font-bold"
            >
              -
            </button>
            <span className="w-8 text-center font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-11 h-10 flex items-center justify-center text-gray-600 text-lg font-bold"
            >
              +
            </button>
          </div>

          {/* Botão Adicionar */}
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-prime-purple text-white font-bold py-3 px-6 rounded-full text-sm flex items-center justify-between hover:opacity-90 transition"
          >
            <span>Adicionar</span>
            <span>{formatPrice(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
