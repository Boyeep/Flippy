import { cn } from "@/lib/utils";

type PlaceholderArtProps = {
  title: string;
  label?: string;
  tone?: "default" | "soft" | "warm" | "neutral";
  className?: string;
};

export function PlaceholderArt({
  title,
  label = "Placeholder",
  tone = "default",
  className,
}: PlaceholderArtProps) {
  const toneClass =
    tone === "soft"
      ? "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.36),transparent_34%),linear-gradient(135deg,#7cc6c9,#1f6f78)]"
      : tone === "warm"
        ? "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.32),transparent_34%),linear-gradient(135deg,#ffd9bf,#ef7d57)]"
        : tone === "neutral"
          ? "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.28),transparent_34%),linear-gradient(135deg,#334155,#64748b)]"
          : "";

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-[inherit] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.3),transparent_34%),linear-gradient(135deg,#1f6f78,#ef7d57)] before:absolute before:right-[-36px] before:top-[-48px] before:h-[180px] before:w-[180px] before:rounded-[999px] before:bg-white/15 before:content-[''] after:absolute after:bottom-[-40px] after:left-[-28px] after:h-[140px] after:w-[140px] after:rounded-[999px] after:bg-white/15 after:content-['']",
        toneClass,
        className
      )}
    >
      <div className="absolute inset-0 grid content-between p-4 text-white">
        <span className="inline-flex w-fit rounded-full bg-white/15 px-3 py-1 text-[0.78rem] font-bold uppercase tracking-[0.04em]">
          {label}
        </span>
        <h3 className="m-0 max-w-[12ch] font-[family-name:var(--font-display)] text-[clamp(1.1rem,2vw,1.8rem)] leading-[0.95]">
          {title}
        </h3>
      </div>
    </div>
  );
}
