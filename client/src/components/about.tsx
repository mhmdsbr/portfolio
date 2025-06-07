"use client";

import { useEffect, useRef, useState } from "react";
import useAboutScrollAnimation from "@/hooks/animations/useAboutScrollAnimation";
import { useApiEntry } from "@/hooks/useApiEntry";

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const { data: about, isLoading } = useApiEntry(
    "portfolio/v2/about-portfolio"
  );
  const [ animationReady, setAnimationReady ] = useState(false);

  const titleWords = about?.about_title?.split(" ") || [];
  const content = about?.about_description;

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

  useAboutScrollAnimation({ titleRef, textRef, containerRef, isReady: animationReady });


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
            <p>{content}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
