"use client";

import type { RefObject } from "react";
import type { AboutResponse } from "@/shared/types/public-content";
import { Badge } from "@/client/components/public/atoms";

interface HeroStatsProps {
  details: AboutResponse["details"];
  statsRef: RefObject<HTMLUListElement | null>;
}

export default function HeroStats({ details, statsRef }: HeroStatsProps) {
  if (details.length === 0) return null;

  return (
    <ul
      ref={statsRef}
      className="flex flex-wrap justify-center gap-3 px-6"
      aria-label="Highlights"
    >
      {details.map(({ number, title }, index) => (
        <li key={`${title}-${index}`} className="opacity-0">
          <Badge
            size="large"
            tone="cyan"
            className="items-center gap-2 border border-cyan-400/40 px-4 py-2 backdrop-blur-sm sm:text-base"
          >
            <span className="font-bold text-cyan-400">{number}</span>
            {title}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
