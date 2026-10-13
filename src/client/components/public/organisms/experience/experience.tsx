"use client";

import { useEffect, useRef, useState } from "react";
import type { ExperienceResponse } from "@/shared/types";
import useExperienceScrollAnimation from "@/client/hooks/animations/useExperienceScrollAnimation";
import {
  Heading,
  LoadingSpinner,
} from "@/client/components/public/atoms";
import ExperienceCard from "@/client/components/public/molecules/ExperienceCard";
import SectionLayout from "@/client/components/public/molecules/SectionLayout";

export default function Experience({ experience }: { experience: ExperienceResponse }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationReady, setAnimationReady] = useState(false);

  const sectionId = "experience";
  const title = experience?.title;
  const experienceItems = experience?.experiences || [];

  useEffect(() => {
    if (experience && containerRef.current) {
      setAnimationReady(true);
    }
  }, [experience]);

  useExperienceScrollAnimation({
    containerRef,
    isReady: animationReady,
    itemsLength: experienceItems.length,
  });

  return (
    <section
      id={sectionId}
      ref={containerRef}
      className="px-6 py-16 text-white"
    >
      <SectionLayout width="wide" className="text-white">
        {!experience ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <Heading
              as="h2"
              size="sectionCompact"
              color="inherit"
              font="mono"
              align="center"
              spacing="bottomLarge"
            >
              {title}
            </Heading>
            <div className="space-y-10 max-w-3xl mx-auto">
              {experienceItems.map((item, i) => (
                <ExperienceCard key={`${item.title}-${item.company}-${i}`} experience={item} />
              ))}
            </div>
          </>
        )}
      </SectionLayout>
    </section>
  );
}
