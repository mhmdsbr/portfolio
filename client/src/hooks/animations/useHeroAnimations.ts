'use client';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroAnimationRefs } from '@/types/animation';

export default function useHeroAnimations(
  {
    containerRef,
    line1Ref,
    line2Ref,
    line3Ref,
    descriptionRef,
  }: HeroAnimationRefs,
  isReady: boolean
) {
  useGSAP(
    () => {
      if (!isReady) return;

      requestAnimationFrame(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!line1Ref.current || !line2Ref.current || !line3Ref.current) return;

        ScrollTrigger.getAll().forEach(trigger => trigger.kill());

        const isMobile = window.innerWidth < 1024;

        const titleTimeline = gsap.timeline();

        titleTimeline
          .fromTo(
            line1Ref.current,
            { scale: 0, opacity: 0 },
            { scale: 2, opacity: 1, duration: 0.6, ease: 'back.out(3)' }
          )
          .to(line1Ref.current, { y: -50, duration: 0.4, ease: 'power1.out' })
          .fromTo(
            line2Ref.current,
            { scale: 3, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.8,
              ease: 'back.out(2)',
              onStart: () => {
                gsap.set(line2Ref.current, { color: 'rgb(168 85 247)' });
              },
              onUpdate: function () {
                const progress = this.progress();
                const r = Math.floor(168 + (0 - 168) * progress);
                const g = Math.floor(85 + (151 - 85) * progress);
                const b = Math.floor(247 + (254 - 247) * progress);
                gsap.set(line2Ref.current, { color: `rgb(${r}, ${g}, ${b})` });
              },
              onComplete: () => {
                gsap.set(line2Ref.current, { color: 'rgb(0 151 254)' });
              },
            }
          )
          .to(line2Ref.current, { y: -50, duration: 0.4, ease: 'power1.out' })
          .fromTo(
            line3Ref.current,
            { scale: 2, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.7, ease: 'power3.out' }
          )
          .to(line3Ref.current, { y: -50, duration: 0.4, ease: 'power1.out' });

        if (!isMobile && descriptionRef?.current && containerRef?.current) {
          const descriptionTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: '+=70',
              scrub: 1,
              pin: true,
              pinSpacing: true,
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
              marginLeft: 'auto',
              marginRight: 'auto',
            },
            {
              x: 0,
              opacity: 1,
              paddingLeft: 20,
              paddingRight: 20,
              marginLeft: 0,
              marginRight: 0,
              ease: 'power2.out',
            }
          );
        }

        let resizeTimeout: ReturnType<typeof setTimeout>;
        const handleResize = () => {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(() => {
            ScrollTrigger.refresh();
          }, 150);
        };

        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
          ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
      });
    },
    { dependencies: [isReady] }
  );
}
