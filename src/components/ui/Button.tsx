import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-sans font-medium tracking-wide transition-colors duration-200 focus-ring disabled:opacity-50 disabled:pointer-events-none min-h-11";

const variants: Record<Variant, string> = {
  primary:
    "bg-blue text-ivory border border-blue hover:bg-navy hover:border-blue-light/60",
  outline:
    "border border-line-strong text-ivory hover:border-blue-light hover:text-blue-light bg-transparent",
  ghost: "text-muted hover:text-ivory bg-transparent",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export function buttonClasses(
  variant: Variant = "primary",
  size: Size = "md",
  className = "",
) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`.trim();
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses(variant, size, className)}
      {...props}
    />
  );
}

type ExternalLinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: Size;
};

export function ExternalLinkButton({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ExternalLinkButtonProps) {
  return (
    <a
      className={buttonClasses(variant, size, className)}
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  );
}
