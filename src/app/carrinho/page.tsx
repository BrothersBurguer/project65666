"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/formatters";

export default function CartPage() {
  const { items, itemCount, subtotal, deliveryFee, total, removeItem, updateQuantity } =
    useCart();

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-black mb-2">
            Seu carrinho está vazio
          </h1>
          <p className="text-gray-500 mb-6">
            Adicione itens para continuar seu pedido
          </p>
          <Link
            href="/"
            className="bg-black text-white px-6 py-3 rounded-full font-bold hover:opacity-90 transition"
          >
            Ver Cardápio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      <div className="max-w-3xl mx-auto px-5 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium mb-4 hover:opacity-90 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Voltar
        </Link>

        <h1 className="text-2xl font-bold text-black text-center mb-6">
          Meu Carrinho
        </h1>

        {/* Lista de itens */}
        <div className="flex flex-col">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between border-b border-dashed border-prime-border py-4"
            >
              <div className="flex gap-3">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  width={70}
                  height={70}
                  className="w-[70px] h-[70px] rounded-xl object-cover border border-prime-border"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-prime-purple text-sm">
                    {item.product.name}
                  </span>
                  {item.selectedExtras.length > 0 && (
                    <span className="text-xs text-gray-500">
                      +{" "}
                      {item.selectedExtras
                        .map((e) => e.extra.name)
                        .join(", ")}
                    </span>
                  )}
                  <span className="text-prime-green font-bold text-sm mt-1">
                    {formatPrice(item.unitTotal)}
                  </span>

                  {/* Quantidade */}
                  <div className="flex items-center border-2 border-prime-border rounded-full mt-2 w-fit">
                    <button
                      onClick={() =>
                        item.quantity <= 1
                          ? removeItem(item.id)
                          : updateQuantity(item.id, item.quantity - 1)
                      }
                      className="w-9 h-8 flex items-center justify-center text-gray-600 font-bold"
                    >
                      {item.quantity <= 1 ? "🗑" : "-"}
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="w-9 h-8 flex items-center justify-center text-gray-600 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-right flex flex-col justify-between">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-500 text-sm"
                >
                  ✕
                </button>
                <span className="font-bold text-sm">
                  {formatPrice(item.unitTotal * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Resumo */}
        <div className="bg-gray-50 rounded-2xl p-4 mt-6 text-center">
          <div className="flex justify-between text-sm mb-1">
            <span>Subtotal</span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Taxa de entrega</span>
            <span className="text-prime-green font-bold">
              {deliveryFee === 0 ? "Grátis" : formatPrice(deliveryFee)}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold border-t border-dashed border-prime-border pt-2 mt-2">
            <span>Total</span>
            <span className="text-prime-green">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Botão fixo */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-4 z-30">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/checkout"
            className="block w-full bg-prime-green text-white font-bold py-3.5 rounded-full text-center hover:opacity-90 transition text-lg"
          >
            Finalizar Pedido • {formatPrice(total)}
          </Link>
        </div>
      </div>
    </div>
  );
}
