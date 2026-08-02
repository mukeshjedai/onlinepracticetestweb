import type { AccessTier } from "@/data/tests";

type TierBadgeProps = {
  tier: AccessTier;
  size?: "sm" | "md";
};

export function TierBadge({ tier, size = "sm" }: TierBadgeProps) {
  const isFree = tier === "free";
  const base =
    size === "md"
      ? "px-3 py-1 text-xs"
      : "px-2 py-0.5 text-[11px]";

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold uppercase tracking-[0.08em] ${base} ${
        isFree
          ? "bg-success/15 text-success"
          : "bg-gold/20 text-[#8a6a0a]"
      }`}
    >
      {isFree ? "Free" : "Premium"}
    </span>
  );
}
