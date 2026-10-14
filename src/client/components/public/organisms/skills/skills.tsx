"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Badge, Heading, Typography } from "@/client/components/public/atoms";

gsap.registerPlugin(ScrollTrigger);

export default function Skills({
  skills,
}: {
  skills: Array<{ skill: string; level: number | null }>;
}) {
  const sectionRef = useRef<HTMLElement>(null);

  // Rain: each badge falls from above the viewport into its slot as the page scrolls toward this section.
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reducedMotion) return;

      const drops = gsap.utils.toArray<HTMLElement>(".skill-drop", section);

      drops.forEach((drop) => {
        // How many viewports before the section arrives this drop starts falling (varies speed per drop).
        const leadViewports = gsap.utils.random(0.9, 1.6);
        const startX = gsap.utils.random(0, 1);
        const startLift = gsap.utils.random(40, 260);
        const endPercent = Math.round(gsap.utils.random(10, 35));
        const setVisibility = (progress: number) =>
          gsap.set(drop, { visibility: progress > 0 ? "visible" : "hidden" });

        gsap.set(drop, { visibility: "hidden" });

        gsap.fromTo(
          drop,
          {
            // offsetTop/offsetLeft ignore transforms, so these stay correct on refresh.
            x: () =>
              startX * (window.innerWidth - drop.offsetWidth) -
              (section.getBoundingClientRect().left + drop.offsetLeft),
            y: () =>
              -(drop.offsetHeight + startLift) -
              (drop.offsetTop + window.innerHeight * (1 + leadViewports)),
            rotation: gsap.utils.random(-35, 35),
          },
          {
            x: 0,
            y: 0,
            rotation: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: () => `top bottom+=${window.innerHeight * leadViewports}`,
              end: `top ${endPercent}%`,
              scrub: 1.5,
              invalidateOnRefresh: true,
              onUpdate: (self) => setVisibility(self.progress),
              onRefresh: (self) => setVisibility(self.progress),
            },
          },
        );
      });
    },
    { scope: sectionRef },
  );

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const badges = gsap.utils.toArray<HTMLElement>(".skill-badge", section);
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) return;

      const badgeAnimations = badges.map((badge) => ({
        badge,
        xTo: gsap.quickTo(badge, "x", {
          duration: 0.7,
          ease: "power2.out",
        }),
        yTo: gsap.quickTo(badge, "y", {
          duration: 0.7,
          ease: "power2.out",
        }),
        rotationTo: gsap.quickTo(badge, "rotation", {
          duration: 0.8,
          ease: "power2.out",
        }),
        directionX: gsap.utils.random(-1, 1),
        directionY: gsap.utils.random(-1, 1),
        rotation: gsap.utils.random(-4, 4),
      }));
      let pointerX = 0;
      let pointerY = 0;
      let animationFrame = 0;

      const updateBadgeTargets = () => {
        animationFrame = 0;
        badgeAnimations.forEach(
          ({ badge, xTo, yTo, rotationTo, directionX, directionY, rotation }) => {
            const rect = badge.getBoundingClientRect();
            const dx = rect.left + rect.width / 2 - pointerX;
            const dy = rect.top + rect.height / 2 - pointerY;
            const influence = Math.max(0, 1 - Math.hypot(dx, dy) / 280) ** 2;

            xTo(directionX * 16 * influence + Math.sign(dx) * 4 * influence);
            yTo(directionY * 12 * influence + Math.sign(dy) * 4 * influence);
            rotationTo(rotation * influence);
          },
        );
      };

      const handlePointerMove = (event: PointerEvent) => {
        if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (!animationFrame) {
          animationFrame = requestAnimationFrame(updateBadgeTargets);
        }
      };

      const handlePointerLeave = () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
          animationFrame = 0;
        }
        badgeAnimations.forEach(({ xTo, yTo, rotationTo }) => {
          xTo(0);
          yTo(0);
          rotationTo(0);
        });
      };

      section.addEventListener("pointermove", handlePointerMove);
      section.addEventListener("pointerleave", handlePointerLeave);

      return () => {
        section.removeEventListener("pointermove", handlePointerMove);
        section.removeEventListener("pointerleave", handlePointerLeave);
        if (animationFrame) cancelAnimationFrame(animationFrame);
        gsap.killTweensOf(badges);
        gsap.set(badges, { clearProps: "transform" });
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative z-20 px-6 py-16 text-white"
    >
      <div className="mx-auto max-w-5xl">
        <Heading
          as="h2"
          size="sectionCompact"
          color="inherit"
          font="mono"
          align="center"
          spacing="bottomLarge"
        >
          Skills
        </Heading>
        {skills.length > 0 ? (
          <ul className="flex flex-wrap justify-center gap-3">
            {skills.map(({ skill }, index) => (
              <li key={`${skill}-${index}`} className="skill-drop">
                <Badge size="xlarge" tone="outline" className="skill-badge">
                  {skill}
                </Badge>
              </li>
            ))}
          </ul>
        ) : (
          <Typography size="base" color="muted" align="center">
            No skills added yet.
          </Typography>
        )}
      </div>
    </section>
  );
}
