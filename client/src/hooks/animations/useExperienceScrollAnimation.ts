import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  containerRef: React.RefObject<HTMLDivElement | null>;
  panelRefs: React.RefObject<HTMLDivElement | null >[];
}

export default function useExperienceScrollAnimation({ containerRef, panelRefs }: Props) {
  useEffect(() => {
    const container = containerRef.current;
    const panels = panelRefs.map(ref => ref.current).filter(Boolean);

    if (!container || panels.length === 0) return;

    // Panel animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${container.scrollHeight}`,
        scrub: true,
        pin: true,
        snap: {
          snapTo: 1 / (panels.length - 1),
          duration: 0.5,
          ease: "power1.inOut"
        },
      },
    });

    // Animate panels in sequence
    panels.forEach((_, i) => {
      if (i === panels.length - 1) return;
      tl.to(panels[i], { yPercent: -100 }, "+=0");
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      tl.kill();
    };
  }, [containerRef, panelRefs]);
}
