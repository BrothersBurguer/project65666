type ProductBadgeProps = {
  text: string;
};

export function ProductBadge({ text }: ProductBadgeProps) {
  return (
    <span className="inline-block text-prime-badge-text bg-prime-badge-bg px-2 py-0.5 rounded-lg text-sm text-center font-bold mb-1">
      {text}
    </span>
  );
}
