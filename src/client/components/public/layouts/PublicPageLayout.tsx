import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface PublicPageLayoutProps extends ComponentPropsWithoutRef<"main"> {
  children: ReactNode;
}

export default function PublicPageLayout({
  children,
  className,
  ...mainProps
}: PublicPageLayoutProps) {
  return (
    <main
      {...mainProps}
      className={[
        "relative min-h-screen overflow-x-hidden text-white",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </main>
  );
}
