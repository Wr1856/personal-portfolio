type SectionHeadingProps = {
  number: string;
  title: string;
  subtitle?: string;
  id?: string;
};

export function SectionHeading({
  number,
  title,
  subtitle,
  id,
}: SectionHeadingProps) {
  return (
    <header className="mb-10 sm:mb-14">
      <p className="font-mono text-xs tracking-[0.35em] text-brass uppercase">
        N.º {number}
      </p>
      <h2
        id={id}
        className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-ivory"
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 max-w-xl text-base sm:text-lg text-muted">
          {subtitle}
        </p>
      ) : null}
      <div className="divider-ornament mt-6 max-w-xs" aria-hidden="true">
        <span className="text-[10px]">◆</span>
      </div>
    </header>
  );
}
