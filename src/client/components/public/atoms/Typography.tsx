import type { ComponentProps } from "react";

type TypographyProps = ComponentProps<"p">;

export default function Typography({
  className = "",
  ...props
}: TypographyProps) {
  return <p className={className} {...props} />;
}
