"use client";

import { useEffect, useRef, useState } from "react";
import { useAllData } from "@/hooks/useAllData";
import useExperienceScrollAnimation from "@/hooks/animations/useExperienceScrollAnimation";

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: allData } = useAllData();
  const [animationReady, setAnimationReady] = useState(false);

  const experience = allData?.summary;
  const title = experience?.title;
  const experienceItems = experience?.jobs || [];

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
      id="experience"
      ref={containerRef}
      className="px-6 py-16 text-white"
    >
      {!experience ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <>
          <h2 className="text-4xl md:text-6xl font-bold text-center font-mono mb-12">
            {title}
          </h2>
          <div className="space-y-10 max-w-3xl mx-auto">
            {experienceItems.map((exp, i) => (
              <div
                key={i}
                className="experience-item p-6 border border-gray-700 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg"
              >
                <h3 className="text-xl font-semibold">
                  {exp.title} @ {exp.company}
                </h3>
                <p className="text-sm text-gray-400 mb-2">
                  {exp.from} - {exp.to}
                </p>
                <p className="text-base">{exp.description}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
