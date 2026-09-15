"use client";

import { RefObject } from "react";

interface HeroTitlesProps {
  titles: string[];
  line1Ref: RefObject<HTMLHeadingElement | null>;
  line2Ref: RefObject<HTMLSpanElement | null>;
  line3Ref: RefObject<HTMLSpanElement | null>;
}

export default function HeroTitles({ titles, line1Ref, line2Ref, line3Ref }: HeroTitlesProps) {
  return (
    <div>
      <h1 className="px-10" ref={line1Ref}>
        <span className="block text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-6xl pink-gradient-text font-extrabold">
          {titles[0]}
        </span>
      </h1>
      <h2 className="flex justify-center gap-5">
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
      </h2>
    </div>
  );
}