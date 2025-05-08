"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

export default function useAboutScrollAnimation({
  titleRef,
  textRef,
  containerRef,
}: {
  titleRef: React.RefObject<HTMLElement | null>;
  textRef: React.RefObject<HTMLElement | null>;
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    if (!titleRef.current || !textRef.current || !containerRef.current) return;

    const triggerId = "about-section-trigger";
    const existingTrigger = ScrollTrigger.getById(triggerId);
    if (existingTrigger) existingTrigger.kill();

    const words = titleRef.current.querySelectorAll(".word");
    const [wordOne, wordTwo] = words;

    gsap.set(wordOne, { scale: 2, z: 400, x: -100 });
    gsap.set(wordTwo, { scale: 2, z: 400, x: 100 });

    const paragraphs = textRef.current.querySelectorAll("p");
    const originalTexts: string[] = [];

    paragraphs.forEach((p) => {
      originalTexts.push(p.innerHTML);
      p.innerHTML = "";
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        id: triggerId,
        trigger: containerRef.current,
        start: "top center",
        end: "+=100",
        pinSpacing: false,
        pin: true,
        scrub: 0.5,
      },
    });

    words.forEach((word) => {
      tl.to(
        word,
        {
          scale: 1,
          z: 0,
          x: 0,
          rotationX: 0,
          ease: "power2.out",
          duration: 0.5,
        },
        "+=.3"
      );
    });

    originalTexts.forEach((text, i) => {
      tl.to(
        paragraphs[i],
        {
          text: {
            value: text,
            delimiter: "",
          },
          duration: 2,
          ease: "none",
        },
        "+=0.2"
      );
    });

    const resizeHandler = () => ScrollTrigger.refresh();
    window.addEventListener("resize", resizeHandler);

    return () => {
      const t = ScrollTrigger.getById(triggerId);
      if (t) t.kill();
      window.removeEventListener("resize", resizeHandler);
    };
  }, [titleRef, textRef, containerRef]);
}
