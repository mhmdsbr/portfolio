"use client";

import { RefObject } from "react";
import { Heading } from "@/client/components/public/atoms";

interface HeroTitlesProps {
  titles: string[];
  line1Ref: RefObject<HTMLHeadingElement | null>;
  line2Ref: RefObject<HTMLSpanElement | null>;
  line3Ref: RefObject<HTMLSpanElement | null>;
}

export default function HeroTitles({ titles, line1Ref, line2Ref, line3Ref }: HeroTitlesProps) {
  return (
    <div>
      <div className="px-10">
      <Heading
        as="h1"
        size="inherit"
        color="inherit"
        weight="inherit"
        ref={line1Ref}
      >
        <span className="block text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl pink-gradient-text font-extrabold">
          {titles[0]}
        </span>
      </Heading>
      </div>
      <Heading
        as="h2"
        size="inherit"
        color="inherit"
        weight="inherit"
      >
      <div className="flex justify-center gap-5">
        <span
          className="block md:text-2xl lg:text-3xl font-roboto font-semibold uppercase mt-8 opacity-0"
          ref={line2Ref}
        >
          {titles[1]},
        </span>
        <span
          className="block md:text-2xl lg:text-3xl font-roboto font-semibold uppercase mt-8 opacity-0"
          ref={line3Ref}
        >
          {titles[2]}
        </span>
      </div>
      </Heading>
    </div>
  );
}