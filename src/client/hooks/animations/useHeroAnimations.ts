"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroAnimationRefs } from "@/client/hooks/animations/types";

export default function useHeroAnimations(
  {
    line1Ref,
    line2Ref,
    line3Ref,
    statsRef,
    heroBadgeRef,
  }: HeroAnimationRefs,
  isReady: boolean,
) {
  useGSAP(
    () => {
      if (!isReady) return;

      requestAnimationFrame(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!line1Ref.current || !line2Ref.current || !line3Ref.current) {
          if (heroBadgeRef?.current) gsap.set(heroBadgeRef.current, { opacity: 1 });
          return;
        }


        const titleTimeline = gsap.timeline();

        titleTimeline
          .fromTo(
            line1Ref.current,
            { scale: 0, opacity: 0 },
            { scale: 2, opacity: 1, duration: 0.6, ease: "back.out(3)" },
          )
          .to(line1Ref.current, { y: -50, duration: 0.4, ease: "power1.out" })
          .fromTo(
            line2Ref.current,
            { scale: 3, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.8,
              ease: "back.out(2)",
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
            },
          )
          .to(line2Ref.current, { y: -50, duration: 0.4, ease: "power1.out" })
          .fromTo(
            line3Ref.current,
            { scale: 2, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.7, ease: "power3.out" },
          )
          .to(line3Ref.current, { y: -50, duration: 0.4, ease: "power1.out" });

        const statItems = statsRef?.current
          ? Array.from(statsRef.current.children)
          : [];

        if (statItems.length > 0 && statsRef?.current) {
          const section = statsRef.current.closest("section");
          const sectionRect = (section ?? document.body).getBoundingClientRect();
          const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
          ).matches;

          if (reducedMotion) {
            titleTimeline.to(statItems, { opacity: 1, duration: 0.4 });
          } else {
            // Measure before any transform so offsets are relative to each badge's resting spot.
            const rects = statItems.map((item) => item.getBoundingClientRect());
            const padding = 24;
            const columnWidth =
              (sectionRect.width - padding * 2) / statItems.length;
            const columns = gsap.utils.shuffle(statItems.map((_, i) => i));
            const groundTop = sectionRect.top + sectionRect.height * 0.45;
            // Keep landings on screen and above the hero's bottom info strip.
            const groundBottom =
              Math.min(sectionRect.bottom, window.innerHeight) -
              Math.max(140, sectionRect.height * 0.2);

            // Spread depths evenly (0 = far, 1 = near) so there is always a visible far/near contrast.
            const depths = gsap.utils.shuffle(
              statItems.map((_, i) =>
                statItems.length === 1 ? 0.5 : i / (statItems.length - 1),
              ),
            );

            const landings = rects.map((rect, i) => {
              const depth = depths[i];
              const scale = gsap.utils.interpolate(0.55, 1.35, depth);
              // Scaling happens around the centre, so measure with the scaled size.
              const scaledWidth = rect.width * scale;
              const scaledHeight = rect.height * scale;
              const columnLeft = sectionRect.left + padding + columns[i] * columnWidth;
              const maxLeft = Math.max(
                columnLeft,
                columnLeft + columnWidth - scaledWidth,
              );
              const left = gsap.utils.random(columnLeft, maxLeft);
              // Farther badges sit higher (closer to the "horizon"), nearer ones lower on the ground.
              const groundRange = Math.max(0, groundBottom - scaledHeight - groundTop);
              const top =
                groundTop +
                groundRange *
                  gsap.utils.clamp(0, 1, depth + gsap.utils.random(-0.12, 0.12));
              return {
                x: left + scaledWidth / 2 - (rect.left + rect.width / 2),
                y: top + scaledHeight / 2 - (rect.top + rect.height / 2),
                startY: -(rect.bottom + gsap.utils.random(40, 200)),
                rotation: gsap.utils.random(-25, 25),
                scale,
                blur: gsap.utils.interpolate(3, 0, depth),
                brightness: gsap.utils.interpolate(0.55, 1.1, depth),
                zIndex: Math.round(depth * 10) + 1,
              };
            });

            titleTimeline.addLabel("statsFall");

            statItems.forEach((item, i) => {
              const landing = landings[i];
              const delay = gsap.utils.random(0, 0.5);
              const duration = gsap.utils.random(1, 1.4);

              gsap.set(item, { position: "relative", zIndex: landing.zIndex });

              titleTimeline
                .fromTo(
                  item,
                  { y: landing.startY, opacity: 1 },
                  { y: landing.y, duration, ease: "bounce.out" },
                  `statsFall+=${delay}`,
                )
                .fromTo(
                  item,
                  {
                    x: landing.x + gsap.utils.random(-80, 80),
                    rotation: gsap.utils.random(-90, 90),
                    scale: landing.scale,
                    filter: `blur(${landing.blur}px) brightness(${landing.brightness})`,
                  },
                  {
                    x: landing.x,
                    rotation: landing.rotation,
                    scale: landing.scale,
                    filter: `blur(${landing.blur}px) brightness(${landing.brightness})`,
                    duration,
                    ease: "power2.out",
                  },
                  "<",
                );
            });

            // Magnetic pull: a short tremble as the "field" switches on, then an elastic snap home
            // while every badge comes back into the same focal plane.
            titleTimeline
              .to(
                statItems,
                {
                  rotation: "+=4",
                  duration: 0.06,
                  yoyo: true,
                  repeat: 5,
                  ease: "sine.inOut",
                },
                ">+0.3",
              )
              .addLabel("statsMagnet")
              .to(
                statItems,
                {
                  x: 0,
                  y: 0,
                  rotation: 0,
                  scale: 1,
                  duration: 1.2,
                  ease: "elastic.out(1, 0.5)",
                  stagger: { each: 0.08, from: "random" },
                },
                "statsMagnet",
              )
              .to(
                statItems,
                {
                  filter: "blur(0px) brightness(1)",
                  duration: 0.6,
                  ease: "power2.out",
                  stagger: { each: 0.08, from: "random" },
                  onComplete: () => {
                    gsap.set(statItems, { clearProps: "filter,zIndex,position" });
                  },
                },
                "statsMagnet",
              );
          }
        }

        const heroBadge = heroBadgeRef?.current;
        if (heroBadge) {
          const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
          ).matches;
          // Segments hidden by other effects (e.g. the scroll-revealed description on desktop) are left alone.
          const segments = Array.from(heroBadge.children).filter(
            (segment): segment is HTMLElement =>
              segment instanceof HTMLElement &&
              getComputedStyle(segment).opacity !== "0",
          );

          if (prefersReducedMotion || segments.length === 0) {
            titleTimeline.to(heroBadge, { opacity: 1, duration: 0.4 });
          } else {
            // The strip clips its overflow, so shifting every segment by its full width hides it on the left.
            const distance = heroBadge.scrollWidth;
            const steps = 6;
            const stepDuration = 0.32;
            const segmentLag = 0.07;

            gsap.set(segments, { x: -distance, transformOrigin: "50% 100%" });
            gsap.set(heroBadge, { opacity: 1 });

            titleTimeline.addLabel("badgeCrawl", ">+0.2");

            // Inchworm crawl: the head (right-most segment) reaches forward first and the
            // body follows with a lag, so the segments stretch apart then bunch up each step.
            for (let step = 1; step <= steps; step++) {
              const targetX = -distance + (distance * step) / steps;
              const stepStart = `badgeCrawl+=${(step - 1) * (stepDuration + segmentLag * 1.5)}`;

              titleTimeline
                .to(
                  segments,
                  {
                    x: targetX,
                    duration: stepDuration,
                    ease: "sine.inOut",
                    stagger: { each: segmentLag, from: "end" },
                  },
                  stepStart,
                )
                .to(
                  segments,
                  {
                    y: -6,
                    scaleY: 0.88,
                    duration: stepDuration / 2,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: 1,
                    stagger: { each: segmentLag, from: "end" },
                  },
                  stepStart,
                );
            }

            titleTimeline.set(segments, { clearProps: "transform,transformOrigin" });
          }
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
