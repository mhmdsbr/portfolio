"use client";

import { useEffect, useRef, useState } from "react";
import type { HeroResponse } from "@/shared/types";
import type { AboutResponse } from "@/shared/types/public-content";
import useHeroAnimations from "@/client/hooks/animations/useHeroAnimations";
import HeroTitles from "./HeroTitles";
import HeroBadge from "./HeroBadge";
import HeroStats from "./HeroStats";
import SectionLayout from "@/client/components/public/molecules/SectionLayout";

export default function Hero({
  hero,
  details = [],
}: {
  hero: HeroResponse;
  details?: AboutResponse["details"];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLHeadingElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const statsRef = useRef<HTMLUListElement>(null);
  const heroBadgeRef = useRef<HTMLDivElement>(null);
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
      containerRef,
      line1Ref,
      line2Ref,
      line3Ref,
      statsRef,
      heroBadgeRef,
      descriptionRef,
    },
    animationReady,
  );

  if (!hero) return <div>No hero data found</div>;

  return (
    <section
      id={sectionId}
      ref={containerRef}
      className="relative h-screen min-h-175 overflow-x-hidden"
    >
      <SectionLayout
        width="full"
        className="relative flex h-full flex-col items-center justify-evenly gap-4 text-center"
      >
        <div className="flex flex-col items-center gap-4">
          <HeroTitles
            titles={hero.titles}
            line1Ref={line1Ref}
            line2Ref={line2Ref}
            line3Ref={line3Ref}
          />

          <HeroStats details={details} statsRef={statsRef} />
        </div>

        <HeroBadge
          logo={hero.logo}
          location={hero.location}
          subtitleOne={hero.subtitle_one}
          subtitleTwo={hero.subtitle_two}
          descriptionRef={descriptionRef}
          badgeRef={heroBadgeRef}
        />
      </SectionLayout>
    </section>
  );
}