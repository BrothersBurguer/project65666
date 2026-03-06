"use client";

import { useStoreStatus } from "@/hooks/useStoreStatus";

export function StatusBadge() {
  const { isOpen, closingTime } = useStoreStatus();

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold mb-2.5 ${
        isOpen
          ? "bg-prime-green-light text-prime-green"
          : "bg-red-100 text-red-600"
      }`}
    >
      <span
        className={`inline-block w-2 h-2 rounded-full ${
          isOpen ? "bg-prime-green" : "bg-red-500"
        } animate-blink`}
      />
      <span>{isOpen ? "ABERTO" : "FECHADO"}</span>
      {closingTime && (
        <>
          <span>🕐</span>
          <span className="font-normal">{closingTime}</span>
        </>
      )}
    </div>
  );
}
