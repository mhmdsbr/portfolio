"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { HeaderAnimationRefs } from "@/types/animation";
import { SECTIONS } from "@/lib/sections-config"


gsap.registerPlugin(TextPlugin, ScrollTrigger);

export default function useHeaderAnimations({
  containerRef,
  headerRef,
  expandRef,
  reloadTextRef,
  titleRef,
  setCurrentTitle,
}: HeaderAnimationRefs) {

  // Initial animations
  useEffect(() => {
    if (!containerRef.current || !headerRef.current) return;

    gsap.set(containerRef.current, { opacity: 0 });
    gsap.set(headerRef.current, { y: -200 });

    const tl = gsap.timeline();
    tl.to(containerRef.current, {
      opacity: 1,
      duration: 0.5,
    }).to(headerRef.current, {
      y: 0,
      duration: 1.5,
      ease: "bounce.out",
    });
  }, [containerRef, headerRef]);

  // Hover animations
  useEffect(() => {
    const expandElement = expandRef.current;
    const reloadText = reloadTextRef.current;
    const header = headerRef.current;

    if (!expandElement || !reloadText || !header) return;

    const originalText = reloadText.textContent || "";

    const hoverTl = gsap.timeline({ paused: true });

    hoverTl.set(reloadText, { text: "" });
    hoverTl
      .to(expandElement, {
        maxWidth: 400,
        opacity: 1,
        paddingRight: "0.75rem",
        duration: 0.5,
        ease: "power1.in",
      })
      .to(reloadText, {
        text: {
          value: originalText,
          speed: 1,
        },
        duration: originalText.length * 0.05,
      });

    const playAnimation = () => hoverTl.play();
    const reverseAnimation = () => hoverTl.reverse();

    header.addEventListener("mouseenter", playAnimation);
    header.addEventListener("mouseleave", reverseAnimation);

    return () => {
      header.removeEventListener("mouseenter", playAnimation);
      header.removeEventListener("mouseleave", reverseAnimation);
    };
  }, [expandRef, reloadTextRef, headerRef]);

  // Scroll-based background change
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    ScrollTrigger.create({
      trigger: document.body,
      start: "top+=50",
      onEnter: () => {
        header.classList.add(
          "bg-primary-cyan/80",
          "backdrop-blur",
          "transition-colors",
          "duration-300"
        );
      },
      onLeaveBack: () => {
        header.classList.remove("bg-primary-cyan/80", "backdrop-blur");
      },
    });

    return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }, [headerRef]);

  // Section-based title changes
  useEffect(() => {
    const titleElement = titleRef?.current;
    if (!titleElement || !setCurrentTitle) return;

    const setupTitleScrollTriggers = () => {
      const scrollTriggers: ScrollTrigger[] = [];

      SECTIONS.forEach((section) => {
        const sectionElement = document.getElementById(section.id);
        if (sectionElement) {
          const trigger = ScrollTrigger.create({
            trigger: sectionElement,
            start: "top center",
            end: "bottom center",
            markers: true,
            onEnter: () => {
              gsap.to(titleElement, {
                opacity: 0,
                duration: 0.2,
                onComplete: () => {
                  setCurrentTitle(section.title);
                  gsap.to(titleElement, {
                    opacity: 1,
                    duration: 0.2,
                  });
                },
              });
            },
            onEnterBack: () => {
              gsap.to(titleElement, {
                opacity: 0,
                duration: 0.2,
                onComplete: () => {
                  setCurrentTitle(section.title);
                  gsap.to(titleElement, {
                    opacity: 1,
                    duration: 0.2,
                  });
                },
              });
            },
          });
          scrollTriggers.push(trigger);
        }
      });

      return scrollTriggers;
    };

    const retryDelays = [100, 300, 600];
    const timers: NodeJS.Timeout[] = [];
    let scrollTriggers: ScrollTrigger[] = [];

    const trySetup = () => {
      scrollTriggers.forEach((t) => t.kill());
      scrollTriggers = setupTitleScrollTriggers();
    };

    trySetup();

    retryDelays.forEach((delay) => {
      const timer = setTimeout(trySetup, delay);
      timers.push(timer);
    });

    return () => {
      scrollTriggers.forEach((trigger) => trigger.kill());
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [titleRef, setCurrentTitle]);
}
