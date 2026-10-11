"use client";

import { useEffect, useRef, useState } from "react";
import type { HeroResponse } from "@/shared/types";
import useHeroAnimations from "@/hooks/animations/useHeroAnimations";
import HeroTitles from "@/components/public/hero/HeroTitles";
import HeroBadge from "@/components/public/hero/HeroBadge";
import useBadgeScrollAnimation from "@/hooks/animations/useBadgeScrollAnimation";

export default function Hero({ hero }: { hero: HeroResponse }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLHeadingElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const sectionId = "hero";

  const [animationReady, setAnimationReady] = useState(false);

  useEffect(() => {
    if (
      hero &&
      line1Ref.current &&
      line2Ref.current &&
      line3Ref.current &&
      containerRef.current &&
      descriptionRef.current
    ) {
      setAnimationReady(true);
    }
  }, [hero]);

  useHeroAnimations(
    {
      line1Ref,
      line2Ref,
      line3Ref,
    },
    animationReady,
  );

  useBadgeScrollAnimation(
    {
      containerRef,
      descriptionRef,
    },
    animationReady,
  )

  if (!hero) return <div>No hero data found</div>;

  return (
    <section
      id={sectionId}
      ref={containerRef}
      className="relative overflow-x-hidden h-screen min-h-175 flex flex-col items-center gap-4 justify-evenly text-center"
    >
      <HeroTitles
        titles={hero.titles}
        line1Ref={line1Ref}
        line2Ref={line2Ref}
        line3Ref={line3Ref}
      />

      <HeroBadge
        logo={hero.logo}
        location={hero.location}
        subtitleOne={hero.subtitle_one}
        subtitleTwo={hero.subtitle_two}
        descriptionRef={descriptionRef}
      />
    </section>
  );
}