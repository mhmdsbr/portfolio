import type { ComponentProps } from "react";

type HeadingProps = ComponentProps<"h2">;

export default function Heading({
  className = "",
  ...props
}: HeadingProps) {
  return (
    <h2
      className={`text-center font-mono text-4xl font-bold ${className}`}
      {...props}
    />
  );
}
