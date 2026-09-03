'use client';

import { useEffect, useRef, useState } from 'react';
import { useAllData } from '@/hooks/useAllData';

import Image from 'next/image';
import useHeroAnimations from '@/hooks/animations/useHeroAnimations';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLHeadingElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

    const { data: allData, isLoading } = useAllData();


      const hero = allData?.hero;


  const [animationReady, setAnimationReady] = useState(false);

  useEffect(() => {
    if (
      !isLoading &&
      hero &&
      line1Ref.current &&
      line2Ref.current &&
      line3Ref.current &&
      containerRef.current &&
      descriptionRef.current
    ) {
      setAnimationReady(true);
    }
  }, [isLoading, hero]);

  useHeroAnimations(
    {
      containerRef,
      line1Ref,
      line2Ref,
      line3Ref,
      descriptionRef,
    },
    animationReady
  );

  if (isLoading) return <div>Loading projects...</div>;
  if (!hero) return <div>No hero data found</div>;

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative overflow-x-hidden h-screen min-h-[700px] flex flex-col items-center gap-4 justify-evenly text-center"
    >
      <div>
        <h1 className="px-10" ref={line1Ref}>
          <span className="block text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-6xl pink-gradient-text font-extrabold">
            {hero.titles[0]}
          </span>
        </h1>
        <h2 className="flex justify-center gap-5">
          <span
            className="block md:text-2xl lg:text-3xl font-roboto font-semibold uppercase mt-8 opacity-0"
            ref={line2Ref}
          >
            {hero.titles[1]},
          </span>
          <span
            className="block md:text-2xl lg:text-3xl font-roboto font-semibold uppercase mt-8 opacity-0"
            ref={line3Ref}
          >
            {hero.titles[2]}
          </span>
        </h2>
      </div>
      <div className="flex justify-center items-center h-16 text-white uppercase font-medium absolute left-auto lg:left-4 bottom-20 z-10">
        <div className="flex items-center bg-primary-cyan h-full border-r-1 rounded-l-xs border-white p-3 z-20">
          <Image
            src={hero.logo}
            width={40}
            height={40}
            alt="Author's logo"
            style={{ width: '40px', height: '40px' }}
          />
        </div>
        <div className="flex items-center bg-primary-orange h-full border-r-1 border-white p-2 z-20">
          <p>{hero.location}</p>
        </div>
        <div className="flex items-center bg-primary-purple h-full border-white p-2 z-20">
          <p>{hero.subtitle_one}</p>
        </div>
        <div
          ref={descriptionRef}
          className="items-center bg-white text-black h-full border-r-6 rounded-r-md border-primary-cyan p-2 z-0 opacity-0 flex"
        >
          <p>{hero.subtitle_two}</p>
        </div>
      </div>
    </section>
  );
}
