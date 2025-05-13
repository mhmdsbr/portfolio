"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function useTitleScrollAnimation(titleRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!titleRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const triggerId = "title-scroll-trigger";
    const existingTrigger = ScrollTrigger.getById(triggerId);
    if (existingTrigger) existingTrigger.kill();

    const words = titleRef.current.querySelectorAll(".word");
    const [wordOne, wordTwo] = words;

    gsap.set(wordOne, { scale: 1.5, z: 400, x: -100 });
    gsap.set(wordTwo, { scale: 1.5, z: 400, x: 100 });

    const tl = gsap.timeline({
      scrollTrigger: {
        id: triggerId,
        trigger: titleRef.current,
        start: "top center",
        end: "+=100",
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

    return () => {
      const t = ScrollTrigger.getById(triggerId);
      if (t) t.kill();
    };
  }, [titleRef]);
}
