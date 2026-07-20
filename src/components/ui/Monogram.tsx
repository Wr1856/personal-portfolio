type MonogramProps = {
  size?: number;
  className?: string;
  title?: string;
};

/**
 * WM monogram rendered as an inline SVG seal: two thin concentric circles
 * with serif initials, echoing an old archive stamp.
 */
export function Monogram({ size = 44, className, title }: MonogramProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={className}
    >
      <circle
        cx="32"
        cy="32"
        r="30"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.9"
      />
      <circle
        cx="32"
        cy="32"
        r="26"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.5"
      />
      <text
        x="32"
        y="33"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-cormorant), Georgia, serif"
        fontSize="24"
        fontWeight="600"
        letterSpacing="1"
        fill="currentColor"
      >
        WM
      </text>
    </svg>
  );
}
