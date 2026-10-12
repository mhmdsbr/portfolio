"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface UseExperienceScrollAnimationProps {
  containerRef: React.RefObject<HTMLElement | null>;
  isReady: boolean;
  itemsLength: number;
}

export default function useExperienceScrollAnimation({
  containerRef,
  isReady,
  itemsLength,
}: UseExperienceScrollAnimationProps) {
  const animationTriggered = useRef(false);

  useEffect(() => {
    if (!isReady || !containerRef.current || itemsLength === 0) return;
    if (animationTriggered.current) return;

    const elements = containerRef.current.querySelectorAll<HTMLElement>(".experience-item");
    if (elements.length === 0) return;

    // Mark as triggered to prevent re-running
    animationTriggered.current = true;

    // Kill any existing ScrollTriggers on these elements
    elements.forEach((el) => {
      ScrollTrigger.getById(el.id || `trigger-${Math.random()}`)?.kill();
    });

    // Animate each item with scroll trigger
    elements.forEach((el, index) => {
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
            id: `experience-${index}`,
          },
          delay: index * 0.1,
        }
      );
    });

    // Refresh ScrollTrigger after setup
    ScrollTrigger.refresh();

    return () => {
      // Cleanup ScrollTriggers on unmount
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars?.id?.toString().startsWith("experience-")) {
          trigger.kill();
        }
      });
    };
  }, [containerRef, isReady, itemsLength]);
}