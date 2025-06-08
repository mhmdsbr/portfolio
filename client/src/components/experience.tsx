"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useApiEntry } from "@/hooks/useApiEntry";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: experience, isLoading } = useApiEntry(
    "portfolio/v2/summary-portfolio"
  );
  const [animationReady, setAnimationReady] = useState(false);
  const title = experience?.summary_title;
  const experiencItems = experience?.summaries;

  useEffect(() => {
    if (!isLoading && experience && containerRef.current) {
      setAnimationReady(true);
    }
  }, [experience, isLoading]);

  useEffect(() => {
    if (!animationReady) return;

    const elements = containerRef.current?.querySelectorAll(".experience-item");

    elements?.forEach((el, index) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play reverse play reverse",
          },
          delay: index * 0.1,
        }
      );
    });
  }, [animationReady]);

  return (
    <section
      id="experience"
      ref={containerRef}
      className="px-6 py-16 text-white"
    >
      <h2 className="text-8xl font-bold text-center font-mono mb-12">
        {title}
      </h2>
      <div className="space-y-10 max-w-3xl mx-auto">
        {Array.isArray(experiencItems) &&
          experiencItems.map((exp, i) => (
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
    </section>
  );
}
