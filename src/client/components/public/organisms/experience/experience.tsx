"use client";

import { useEffect, useRef, useState } from "react";
import type { ExperienceResponse } from "@/shared/types";
import useExperienceScrollAnimation from "@/client/hooks/animations/useExperienceScrollAnimation";
import {
  Heading,
  LoadingSpinner,
  Typography,
} from "@/client/components/public/atoms";

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
            {experienceItems.map((exp, i) => (
              <div
                key={i}
                className="experience-item p-6 border border-gray-700 rounded-2xl bg-linear-to-br from-gray-900 to-gray-800 shadow-lg"
              >
                <Heading
                  as="h3"
                  size="xl"
                  color="inherit"
                  weight="semibold"
                >
                  {exp.title} @ {exp.company}
                </Heading>
                <Typography
                  size="sm"
                  color="muted"
                  spacing="bottomSmall"
                >
                  {exp.from} - {exp.to ?? "Present"}
                </Typography>
                <Typography size="base" color="inherit">
                  {exp.description}
                </Typography>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
