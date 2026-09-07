// app/hero/page.tsx (or wherever Hero is located)
"use client";

import { useEffect, useRef, useState } from "react";
import { useAllData } from "@/hooks/useAllData";
import useHeroAnimations from "@/hooks/animations/useHeroAnimations";
import HeroTitles from "@/components/hero/HeroTitles";
import HeroBadge from "@/components/hero/HeroBadge";
import useBadgeScrollAnimation from "@/hooks/animations/useBadgeScrollAnimation";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLHeadingElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const { data: allData, isLoading } = useAllData();
  const hero = allData?.hero;

  const [animationReady, setAnimationReady] = useState(false);

  useEffect(() => {
    if (
      !isLoading &&
      hero &&
      line1Ref.current &&
      line2Ref.current &&
      line3Ref.current &&
      containerRef.current &&
      descriptionRef.current
    ) {
      setAnimationReady(true);
    }
  }, [isLoading, hero]);

  useHeroAnimations(
    {
      containerRef,
      line1Ref,
      line2Ref,
      line3Ref,
      descriptionRef,
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

  if (isLoading) return <div>Loading projects...</div>;
  if (!hero) return <div>No hero data found</div>;

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative overflow-x-hidden h-screen min-h-[700px] flex flex-col items-center gap-4 justify-evenly text-center"
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