import { cn } from "@/lib/utils";

type AlertBannerProps = {
  children: React.ReactNode;
  variant?: "success" | "promo" | "danger";
  className?: string;
};

export function AlertBanner({
  children,
  variant = "success",
  className,
}: AlertBannerProps) {
  const styles = {
    success:
      "outline-2 outline-[#468847] text-prime-green",
    promo:
      "outline-2 outline-black text-black",
    danger:
      "outline-2 outline-red-500 text-red-600 bg-red-50",
  };

  return (
    <div
      className={cn(
        "w-full text-sm p-3 my-2.5 text-center rounded-xl outline",
        styles[variant],
        className
      )}
    >
      {children}
    </div>
  );
}
