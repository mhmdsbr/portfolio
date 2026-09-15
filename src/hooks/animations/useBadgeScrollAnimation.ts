"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BadgeAnimationRefs } from "@/types/animation";

export default function useBadgeScrollAnimation(
  { containerRef, descriptionRef }: BadgeAnimationRefs,
  isReady: boolean,
) {
  useGSAP(
    () => {
      if (!isReady) return;

      requestAnimationFrame(() => {
        gsap.registerPlugin(ScrollTrigger);

        const isMobile = window.innerWidth < 1024;

        if (!isMobile && descriptionRef?.current && containerRef?.current) {
          const descriptionTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "+=70",
              scrub: 1,
              pin: true,
              invalidateOnRefresh: true,
            },
          });

          descriptionTimeline.fromTo(
            descriptionRef.current,
            {
              x: -400,
              opacity: 0,
              paddingLeft: 0,
              paddingRight: 0,
              marginLeft: "auto",
              marginRight: "auto",
            },
            {
              x: 0,
              opacity: 1,
              paddingLeft: 20,
              paddingRight: 20,
              marginLeft: 0,
              marginRight: 0,
              ease: "power2.out",
            },
          );
        }

        let resizeTimeout: ReturnType<typeof setTimeout>;
        const handleResize = () => {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(() => {
            ScrollTrigger.refresh();
          }, 150);
        };

        window.addEventListener("resize", handleResize);

        return () => {
          window.removeEventListener("resize", handleResize);
        };
      });
    },
    { dependencies: [isReady] },
  );
}
