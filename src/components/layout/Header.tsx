import Image from "next/image";
import Link from "next/link";
import { storeInfo } from "@/data/store-info";
import { StatusBadge } from "@/components/home/StatusBadge";
import { InfoButton } from "@/components/layout/InfoModal";
import { LocationInfo } from "@/components/home/LocationInfo";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-100">
      {/* Cover */}
      <div className="relative h-44 bg-black">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${storeInfo.coverImage})` }}
        />
        {/* Logo */}
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-10 w-[120px] h-[120px] rounded-full border-4 border-white shadow-lg bg-black overflow-hidden transition-transform hover:scale-105">
          <Image
            src={storeInfo.logo}
            alt={storeInfo.name}
            width={120}
            height={120}
            className="w-full h-full object-cover"
            priority
          />
        </div>
        {/* Borda arredondada */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white rounded-t-[40px]" />
      </div>

      {/* Info */}
      <div className="max-w-5xl mx-auto px-5 flex flex-col items-center text-center pt-1">
        <h1 className="font-black text-xl md:text-2xl text-black">
          {storeInfo.name}
        </h1>

        {/* Icones sociais */}
        <div className="flex gap-2.5 my-2">
          {storeInfo.socialLinks.instagram && (
            <a
              href={storeInfo.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
              className="flex items-center justify-center w-11 h-11 rounded-full border-2 border-black text-black text-xl transition-all hover:shadow-md hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
          )}
          <InfoButton />
          <Link
            href="/carrinho"
            title="Carrinho"
            className="flex items-center justify-center w-11 h-11 rounded-full border-2 border-black text-black text-xl transition-all hover:shadow-md hover:scale-105"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
          </Link>
        </div>

        {/* Detalhes */}
        <div className="flex flex-row gap-2.5 text-sm py-0.5">
          <span>
            💰 Pedido Mínimo{" "}
            <b>R$ {storeInfo.delivery.minOrder.toFixed(2).replace(".", ",")}</b>
          </span>
          <div>
            <span>
              🏍️ <b>{storeInfo.delivery.deliveryTimeMin}-{storeInfo.delivery.deliveryTimeMax}</b> min
            </span>{" "}
            •{" "}
            <span className="text-prime-green font-semibold">
              {storeInfo.delivery.deliveryFee === 0 ? "Grátis" : `R$ ${storeInfo.delivery.deliveryFee.toFixed(2)}`}
            </span>
          </div>
        </div>

        <LocationInfo />

        <div className="flex flex-row gap-1 text-sm py-0.5">
          ⭐ <b>{storeInfo.rating}</b> ({storeInfo.reviewCount.toLocaleString("pt-BR")} avaliações)
        </div>

        <StatusBadge />
      </div>
    </header>
  );
}
