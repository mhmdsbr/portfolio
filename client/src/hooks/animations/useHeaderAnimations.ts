"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { HeaderAnimationRefs } from "@/types/animation";

gsap.registerPlugin(TextPlugin, ScrollTrigger);

export default function useHeaderAnimations({
  containerRef,
  headerRef,
  expandRef,
  reloadTextRef,
  titleRef,
  setCurrentTitle,
  sections,
  isReady = false,
}: HeaderAnimationRefs) {
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    if (!isReady) return;
    if (!containerRef.current || !headerRef.current) return;

    // Set initial states
    gsap.set(containerRef.current, { opacity: 0 });
    gsap.set(headerRef.current, { y: -200 });

    const tl = gsap.timeline();
    tl.to(containerRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    }).to(headerRef.current, {
      y: 0,
      duration: 1.5,
      ease: "bounce.out",
    });
  }, [containerRef, headerRef, isReady]); // ✅ Re-run when isReady changes

  // Hover animations
  useEffect(() => {
    const expandElement = expandRef.current;
    const reloadText = reloadTextRef.current;
    const header = headerRef.current;

    if (!expandElement || !reloadText || !header || !isReady) return;

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
  }, [expandRef, reloadTextRef, headerRef, isReady]);

  // Scroll-based background change
  useEffect(() => {
    const header = headerRef.current;
    if (!header || !isReady) return;

    ScrollTrigger.create({
      trigger: document.body,
      start: "top+=50",
      onEnter: () => {
        header.classList.add(
          "bg-primary-cyan/80",
          "backdrop-blur",
          "transition-colors",
          "duration-300",
        );
      },
      onLeaveBack: () => {
        header.classList.remove("bg-primary-cyan/80", "backdrop-blur");
      },
    });

    return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }, [headerRef, isReady]);

  // Section-based title changes - FIXED
  useEffect(() => {
    const titleElement = titleRef?.current;
    if (
      !titleElement ||
      !setCurrentTitle ||
      !sections ||
      sections.length === 0 ||
      !isReady
    )
      return;

    // Create ScrollTriggers for each section
    sections.forEach((section) => {
      console.log(
        `Creating trigger for section: ${section.title}, id: ${section.id}`,
      );
      const sectionElement = document.getElementById(section.id);
      console.log(`Element found:`, sectionElement);
      if (sectionElement) {
        const trigger = ScrollTrigger.create({
          trigger: sectionElement,
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            setCurrentTitle(section.title);
          },
          onEnterBack: () => {
            setCurrentTitle(section.title);
          },
        });
        scrollTriggersRef.current.push(trigger);
      }
    });

    // Handle scroll back to top - show first section title
    const topTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "top top",
      onEnter: () => {
        if (sections.length > 0) {
          setCurrentTitle(sections[0].title);
        }
      },
    });
    scrollTriggersRef.current.push(topTrigger);

    // Refresh ScrollTrigger after creation
    ScrollTrigger.refresh();

    return () => {
      scrollTriggersRef.current.forEach((trigger) => trigger.kill());
      scrollTriggersRef.current = [];
    };
  }, [titleRef, setCurrentTitle, sections, isReady]);
}
