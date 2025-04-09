"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroAnimationRefs } from "@/types/animation";

export default function useHeroAnimations({
  containerRef,
  line1Ref,
  line2Ref,
  line3Ref,
  descriptionRef,
}: HeroAnimationRefs) {
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      if (!line1Ref.current || !line2Ref.current || !line3Ref.current) return;

      ScrollTrigger.getAll().forEach(trigger => trigger.kill());

      const isMobile = window.innerWidth < 980;

      // Entry animation timeline
      const masterTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      masterTimeline
        .fromTo(
          line1Ref.current,
          { scale: 0, opacity: 0 },
          { scale: 2, opacity: 1, duration: 1, ease: "back.out(3)" }
        )
        .to(line1Ref.current, { y: -100 })
        .fromTo(
          line2Ref.current,
          { scale: 4, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.3,
            ease: "back.out(3)",
            onStart: () => {
              gsap.set(line2Ref.current, { color: "rgb(168 85 247)" });
            },
            onUpdate: function () {
              const progress = this.progress();
              const r = Math.floor(168 + (0 - 168) * progress);
              const g = Math.floor(85 + (151 - 85) * progress);
              const b = Math.floor(247 + (254 - 247) * progress);
              gsap.set(line2Ref.current, { color: `rgb(${r}, ${g}, ${b})` });
            },
            onComplete: () => {
              gsap.set(line2Ref.current, { color: "rgb(0 151 254)" });
            },
          }
        )
        .to(line2Ref.current, { y: -100 })
        .fromTo(
          line3Ref.current,
          { scale: 4, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "elastic.out(1, 0.5)",
          }
        )
        .to(line3Ref.current, { y: -100 });

      // Scroll-triggered description animation (only on non-mobile)
      if (!isMobile && descriptionRef?.current && containerRef?.current) {
        const expandTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=500",
            scrub: 0.5,
            pin: true,
            markers: false,
            invalidateOnRefresh: true,
          },
        });

        expandTimeline.fromTo(
          descriptionRef.current,
          {
            opacity: 0,
            x: -300,
            paddingLeft: 0,
            paddingRight: 0,
            marginLeft: "auto",
            marginRight: "auto",
          },
          {
            x: 0,
            opacity: 1,
            paddingLeft: 40,
            paddingRight: 20,
            marginLeft: 0,
            marginRight: 0,
            ease: "power2.out",
          }
        );
      }

      // Debounced refresh on resize
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
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    },
    { scope: containerRef }
  );
}
