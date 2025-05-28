"use client";
import { useEffect, useRef } from "react";
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
  const originalTextsRef = useRef<string[]>([]);
  const hasInitialized = useRef(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    if (!titleRef.current || !textRef.current || !containerRef.current) return;

    // Capture original texts only once when they're actually available
    if (!hasInitialized.current) {
      const paragraphs = textRef.current.querySelectorAll("p");

      // Check if paragraphs have content
      const textsToCapture: string[] = [];
      let hasContent = false;

      paragraphs.forEach((p) => {
        const text = p.innerHTML.trim();
        textsToCapture.push(text);
        if (text.length > 0) hasContent = true;
      });

      // If no content yet, don't initialize
      if (!hasContent) {
        console.log("No content found yet, waiting...");
        return;
      }

      originalTextsRef.current = textsToCapture;
      hasInitialized.current = true;

      console.log("Captured original texts:", originalTextsRef.current);
    }

    const triggerId = "about-section-trigger";
    const existingTrigger = ScrollTrigger.getById(triggerId);
    if (existingTrigger) existingTrigger.kill();

    const words = titleRef.current.querySelectorAll(".word");
    const [wordOne, wordTwo] = words;

    gsap.set(wordOne, { scale: 2, z: 400, x: -100 });
    gsap.set(wordTwo, { scale: 2, z: 400, x: 100 });

    const paragraphs = textRef.current.querySelectorAll("p");

    // Clear paragraphs for animation
    paragraphs.forEach((p) => {
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

    originalTextsRef.current.forEach((text, i) => {
      if (paragraphs[i] && text) {
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
      }
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