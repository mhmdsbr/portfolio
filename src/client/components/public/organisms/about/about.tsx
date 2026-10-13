"use client";

import { useEffect, useRef, useState } from "react";
import useAboutScrollAnimation from "@/client/hooks/animations/useAboutScrollAnimation";
import type { AboutResponse } from '@/shared/types';
import { Heading, Typography } from "@/client/components/public/atoms";

export default function About({ about }: { about: AboutResponse }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const [animationReady, setAnimationReady] = useState(false);

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
        <Heading
          as="h2"
          size="section"
          color="inherit"
          font="mono"
          align="center"
          ref={titleRef}
        >
          {titleWords.map((word, i) => (
            <span key={i} className="word mx-2 inline-block sm:mx-3">
              {word}
            </span>
          ))}
        </Heading>
        <div className="container mx-auto flex w-full flex-col gap-8 px-4 sm:px-6">
          <div
            ref={textRef}
            className="mx-auto flex w-full max-w-4xl flex-col justify-start gap-4 text-base leading-7 text-justify sm:text-xl sm:leading-8"
          >
            <Typography size="inherit" color="inherit">
              {description}
            </Typography>
          </div>
        </div>
      </div>
    </section>
  );
}