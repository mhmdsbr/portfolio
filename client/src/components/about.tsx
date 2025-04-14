'use client';

import { useRef } from 'react';
import useAboutScrollAnimation from '@/hooks/useAboutScrollAnimation';

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const titleWords = ['About', 'me'];


  useAboutScrollAnimation({ titleRef, textRef, containerRef });

  return (
    <section className="block w-full overflow-hidden mx-auto text-center">
      <div ref={containerRef} className="flex flex-col gap-6 h-full my-12 justify-center mx-auto">
        <h2 ref={titleRef} className="flex justify-center text-8xl font-bold text-center font-mono">
        {titleWords.map((word, i) => (
          <span key={i} className="word inline-block mx-3">
            {word}
          </span>
        ))}
        </h2>
        <div ref={textRef} className='flex flex-col justify-start h-[400px] gap-4 w-8/12 mx-auto text-2xl gap-3 text-justify'>
          <p className="text-2xl text-gray-300 font-mono">
          Results-driven JavaScript, React, TypeScript, Next.js, and WordPress developer with over five years of experience leading and implementing projects of varying scales.
          </p>
          <p className="text-2xl text-gray-300 font-mono">
          Successfully led, developed and delivered 30+ projects using React and WordPress. Possesses an in-depth understanding of Javascript, React.js, and the WordPress CMS. Recognized for critical thinking, problem-solving, and an Agile mindset.
          </p>
        </div>
      </div>
    </section>
  );
}
