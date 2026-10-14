import type { ReactNode, Ref } from "react";

export type SectionLayoutWidth = "full" | "wide" | "standard" | "narrow";

interface SectionLayoutProps {
  children: ReactNode;
  width: SectionLayoutWidth;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

const widthClasses: Record<SectionLayoutWidth, string> = {
  full: "max-w-none",
  wide: "max-w-6xl",
  standard: "max-w-5xl",
  narrow: "max-w-4xl",
};

export default function SectionLayout({
  children,
  width,
  className = "",
  ref,
}: SectionLayoutProps) {
  return (
    <div
      ref={ref}
      className={`mx-auto w-full ${widthClasses[width]} ${className}`}
    >
      {children}
    </div>
  );
}
