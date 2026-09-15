import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { UseProjectsAnimation } from '@/types/animation';

export function useProjectsAnimation<T>({
  projects,
  setProjects,
  activeCategory,
  setActiveCategory,
  filterProjects,
}: UseProjectsAnimation<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animating, setAnimating] = useState(false);
  const introPlayedRef = useRef(false);

  const { contextSafe } = useGSAP({ scope: containerRef });

  useEffect(() => {
    if (introPlayedRef.current) return;
    const cards = containerRef.current?.children;
    if (!cards || cards.length === 0) return;

    introPlayedRef.current = true;
    gsap.fromTo(
      cards,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out',
      }
    );
  }, [projects]);

  const handleTabClick = contextSafe((category: string) => {
    if (animating || category === activeCategory) return;

    setAnimating(true);

    const cards = containerRef.current?.children;
    if (!cards || cards.length === 0) {
      setProjects(filterProjects(category));
      setActiveCategory(category);
      setAnimating(false);
      return;
    }

    gsap.killTweensOf(cards);

    gsap.to(cards, {
      scale: 0.8,
      opacity: 0,
      stagger: 0.05,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        const newProjects = filterProjects(category);
        setProjects(newProjects);
        setActiveCategory(category);

        requestAnimationFrame(() => {
          const newCards = containerRef.current?.children;
          if (newCards && newCards.length > 0) {
            gsap.fromTo(
              newCards,
              { opacity: 0, scale: 2 },
              {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                stagger: 0.05,
                ease: 'power2.out',
                onComplete: () => setAnimating(false),
              }
            );
          } else {
            setAnimating(false);
          }
        });
      },
    });
  });

  return { containerRef, animating, handleTabClick };
}