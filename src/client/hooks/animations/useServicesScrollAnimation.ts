"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface UseServicesScrollAnimationProps {
  isReady: boolean;
  itemsLength: number;
}

export default function useServicesScrollAnimation({
  isReady,
  itemsLength,
}: UseServicesScrollAnimationProps) {
  const animationTriggered = useRef(false);

  useEffect(() => {
    if (!isReady || itemsLength === 0) return;
    if (animationTriggered.current) return;

    const cards = gsap.utils.toArray(".service-card");
    if (cards.length === 0) return;

    // Mark as triggered to prevent re-running
    animationTriggered.current = true;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".services-container",
        start: "20% bottom",
        end: "200px 70%",
        scrub: 1,
        toggleActions: "play none none none",
        id: "services-animation",
      },
    });

    gsap.set(cards, { y: 50, opacity: 0 });

    tl.to(cards, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 1,
      ease: "power2.out",
    });

    // Refresh ScrollTrigger
    ScrollTrigger.refresh();

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars?.id === "services-animation") {
          trigger.kill();
        }
      });
    };
  }, [isReady, itemsLength]);
}