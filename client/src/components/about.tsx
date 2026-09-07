"use client";

import { useEffect, useRef, useState } from "react";
import useAboutScrollAnimation from "@/hooks/animations/useAboutScrollAnimation";
import { useAllData } from '@/hooks/useAllData';

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const { data: allData, isLoading } = useAllData();
  const [animationReady, setAnimationReady] = useState(false);

  const about = allData?.about;

  const titleWords = about?.title?.split(" ") || [];
  const description = about?.description;

  useEffect(() => {
    if (
      !isLoading &&
      about &&
      containerRef.current &&
      titleRef.current &&
      textRef.current
    ) {
      setAnimationReady(true);
    }
  }, [isLoading, about]);

  useAboutScrollAnimation({
    titleRef,
    textRef,
    containerRef,
    isReady: animationReady,
  });

  if (isLoading) {
    return (
      <section id="about" className="block w-full overflow-hidden mx-auto text-center py-20">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="about"
      className="block w-full overflow-hidden mx-auto text-center"
    >
      <div
        ref={containerRef}
        className="flex flex-col gap-6 h-full my-12 justify-center mx-auto"
      >
        <h2
          ref={titleRef}
          className="flex justify-center text-8xl font-bold text-center font-mono"
        >
          {titleWords.map((word, i) => (
            <span key={i} className="word inline-block mx-3">
              {word}
            </span>
          ))}
        </h2>
        <div className="container flex flex-col gap-8 m-auto">
          <div
            ref={textRef}
            className="flex flex-col justify-start h-[400px] gap-4 w-8/12 mx-auto text-2xl text-justify"
          >
            <p>{description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}