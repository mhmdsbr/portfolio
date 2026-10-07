"use client";

import { useEffect, useRef, useState } from "react";
import useAboutScrollAnimation from "@/hooks/animations/useAboutScrollAnimation";
import { useAllData } from '@/hooks/useAllData';

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const { data: allData } = useAllData();
  const [animationReady, setAnimationReady] = useState(false);

  const about = allData?.about;
  const sectionId = "about";

  const titleWords = about?.title?.split(" ") || [];
  const description = about?.description;

  useEffect(() => {
    if (
      about &&
      containerRef.current &&
      titleRef.current &&
      textRef.current
    ) {
      setAnimationReady(true);
    }
  }, [about]);

  useAboutScrollAnimation({
    titleRef,
    textRef,
    containerRef,
    isReady: animationReady,
  });

  return (
    <section
      id={sectionId}
      className="mx-auto block w-full overflow-x-clip text-center"
    >
      <div
        ref={containerRef}
        className="mx-auto my-12 flex h-full flex-col justify-center gap-6"
      >
        <h2
          ref={titleRef}
          className="flex justify-center text-center font-mono text-4xl font-bold sm:text-5xl lg:text-6xl"
        >
          {titleWords.map((word, i) => (
            <span key={i} className="word mx-2 inline-block sm:mx-3">
              {word}
            </span>
          ))}
        </h2>
        <div className="container mx-auto flex w-full flex-col gap-8 px-4 sm:px-6">
          <div
            ref={textRef}
            className="mx-auto flex w-full max-w-4xl flex-col justify-start gap-4 text-base leading-7 text-justify sm:text-xl sm:leading-8"
          >
            <p>{description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}