type TagProps = {
  children: React.ReactNode;
  tone?: "default" | "brass" | "blue";
};

const tones = {
  default: "border-line text-muted",
  brass: "border-brass/50 text-brass",
  blue: "border-blue/60 text-blue-light",
} as const;

export function Tag({ children, tone = "default" }: TagProps) {
  return (
    <span
      className={`inline-flex items-center border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
