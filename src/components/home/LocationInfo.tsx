"use client";

import { useUserLocation } from "@/hooks/useUserLocation";

export function LocationInfo() {
  const { city, loading } = useUserLocation();

  const text = loading ? "Localizando..." : city || "Sua Cidade";

  return (
    <div className="flex flex-wrap items-center justify-center gap-1 text-sm max-[360px]:text-xs py-0.5">
      📍 <span className="whitespace-nowrap">{text}</span> <span>• 4,5km de você</span>
    </div>
  );
}

export function DeliveryBanner() {
  const { city, loading } = useUserLocation();

  return (
    <span>
      <b>Entrega Grátis</b> para{" "}
      <b>{loading ? "sua região" : city || "sua região"}</b>!
    </span>
  );
}
