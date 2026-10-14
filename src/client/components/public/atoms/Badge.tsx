import type { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  size?: "small" | "medium" | "large" | "xlarge";
  tone?: "neutral" | "cyan" | "dark" | "outline";
};

const sizeClasses = {
  small: "px-2 py-0.5 text-xs",
  medium: "px-3 py-1 text-xs font-medium",
  large: "px-3 py-1 text-sm font-medium",
  xlarge: "px-5 py-2 text-sm font-medium sm:text-base",
};

const toneClasses = {
  neutral: "bg-gray-700",
  cyan: "bg-cyan-400/10 text-cyan-300",
  dark: "bg-gray-800 text-gray-300",
  outline:
    "cursor-pointer select-none border border-cyan-400/40 bg-gray-800/60 text-cyan-100 shadow-sm shadow-cyan-500/10 transition-colors hover:border-cyan-300 hover:bg-cyan-400/10",
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
