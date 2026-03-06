"use client";

import { useCountdown } from "@/hooks/useCountdown";

export function CountdownTimer() {
  const { minutes, seconds } = useCountdown();

  return (
    <div className="w-full text-sm p-4 my-2.5 text-center rounded-xl outline outline-2 outline-red-500 text-red-600 bg-red-50">
      <b>A promoção vai acabar em:</b>
      <div className="flex justify-center items-center gap-5 mt-2">
        <div className="flex flex-col items-center">
          <span className="bg-red-500 text-white font-semibold text-xl px-3 py-2 rounded-md min-w-[60px]">
            {String(minutes).padStart(2, "0")}
          </span>
          <p className="text-sm mt-1">Minutos</p>
        </div>
        <div className="flex flex-col items-center">
          <span className="bg-red-500 text-white font-semibold text-xl px-3 py-2 rounded-md min-w-[60px]">
            {String(seconds).padStart(2, "0")}
          </span>
          <p className="text-sm mt-1">Segundos</p>
        </div>
      </div>
      <a
        href="#combos"
        className="inline-block mt-3 bg-white rounded-lg px-3 py-1 text-black text-sm"
      >
        Clique Para Ver Burguers em Promoção 🖤
      </a>
    </div>
  );
}
