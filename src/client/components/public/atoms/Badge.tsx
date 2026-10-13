import type { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  size?: "small" | "medium" | "large";
  tone?: "neutral" | "cyan" | "dark";
};

const sizeClasses = {
  small: "px-2 py-0.5 text-xs",
  medium: "px-3 py-1 text-xs font-medium",
  large: "px-3 py-1 text-sm font-medium",
};

const toneClasses = {
  neutral: "bg-gray-700",
  cyan: "bg-cyan-400/10 text-cyan-300",
  dark: "bg-gray-800 text-gray-300",
};

export default function Badge({
  className = "",
  size = "medium",
  tone = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full ${sizeClasses[size]} ${toneClasses[tone]} ${className}`}
      {...props}
    />
  );
}
