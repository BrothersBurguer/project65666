"use client";

import { useUserLocation } from "@/hooks/useUserLocation";

export function LocationInfo() {
  const { city, loading } = useUserLocation();

  const text = loading ? "Localizando..." : city || "Sua Cidade";

  return (
    <div className="flex flex-row gap-1 text-sm py-0.5">
      📍 <span>{text}</span> • 4,5km de você
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
