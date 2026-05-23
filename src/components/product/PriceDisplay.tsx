import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";

type PriceDisplayProps = {
  price: number;
  originalPrice?: number;
  featured?: boolean;
  size?: "sm" | "lg";
};

export function PriceDisplay({
  price,
  originalPrice,
  featured,
  size = "sm",
}: PriceDisplayProps) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {originalPrice && (
        <>
          <span className="text-sm">de</span>
          <span className="text-sm line-through text-gray-500">
            {formatPrice(originalPrice)}
          </span>
          <span className="text-sm">por</span>
        </>
      )}
      {!originalPrice && <span className="text-sm">por</span>}
      <span
        className={cn(
          "font-bold text-prime-green",
          size === "lg" ? "text-2xl" : "text-lg",
          featured &&
            "bg-prime-green text-white rounded-lg px-1.5 py-0.5 text-xl"
        )}
      >
        {formatPrice(price)}
      </span>
    </div>
  );
}
