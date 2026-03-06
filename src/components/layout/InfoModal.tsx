"use client";

import { useState } from "react";
import { storeInfo } from "@/data/store-info";
import { useUserLocation } from "@/hooks/useUserLocation";

export function InfoButton() {
  const [open, setOpen] = useState(false);
  const { city, loading } = useUserLocation();
  const locationText = loading ? "Carregando..." : city || storeInfo.delivery.address;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Info"
        className="flex items-center justify-center w-11 h-11 rounded-full border-2 border-black text-black text-sm font-bold transition-all hover:shadow-md hover:scale-105"
      >
        i
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 overflow-y-auto h-full">
          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-gray-300 text-gray-400 hover:text-black hover:border-black transition mb-6"
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
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>

          <h2 className="text-lg font-bold text-black mb-3">
            Tipos de Entrega
          </h2>
          {storeInfo.delivery.deliveryTypes.map((type) => (
            <p key={type} className="text-sm mb-1">
              {type === "Entrega Motoboy" ? "🏍️" : "📦"} {type}
            </p>
          ))}

          <h2 className="text-lg font-bold text-black mt-6 mb-3">
            Formas de Pagamento
          </h2>
          {storeInfo.delivery.paymentMethods.map((method) => (
            <p key={method} className="text-sm mb-1">
              ✅ {method}
            </p>
          ))}

          <h2 className="text-lg font-bold text-black mt-6 mb-3">Endereço</h2>
          <p className="text-sm">{locationText}</p>

          <h2 className="text-lg font-bold text-black mt-6 mb-3">
            Áreas de Entrega
          </h2>
          <div className="text-sm mb-1">
            <p className="font-semibold">{locationText}</p>
            <span className="text-prime-green font-bold">GRÁTIS (hoje)</span>
          </div>
        </div>
      </div>
    </>
  );
}
