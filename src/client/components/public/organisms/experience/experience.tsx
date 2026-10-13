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
          <Heading className="mb-12 md:text-6xl">
            {title}
          </Heading>
          <div className="space-y-10 max-w-3xl mx-auto">
            {experienceItems.map((exp, i) => (
              <div
                key={i}
                className="experience-item p-6 border border-gray-700 rounded-2xl bg-linear-to-br from-gray-900 to-gray-800 shadow-lg"
              >
                <h3 className="text-xl font-semibold">
                  {exp.title} @ {exp.company}
                </h3>
                <Typography className="text-sm text-gray-400 mb-2">
                  {exp.from} - {exp.to ?? "Present"}
                </Typography>
                <Typography className="text-base">{exp.description}</Typography>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
