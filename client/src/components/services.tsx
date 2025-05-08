'use client';

import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  useLayoutEffect(() => {
    const cards = gsap.utils.toArray('.service-card');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.services-container',
        start: '20% bottom',
        end: '200px 50%',
        scrub: true, // Makes the animation smooth during scroll
        toggleActions: 'play none none none',
        markers: true
      }
    });

    // Initial state
    gsap.set(cards, { y: 50, opacity: 0 });

    // Add staggered animation to timeline
    tl.to(cards, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out'
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section className="block w-full overflow-hidden mx-auto my-10 text-center">
      <div className="flex flex-col gap-6 h-full my-12 justify-center mx-auto">
        <h2 className="flex justify-center text-8xl font-bold text-center font-mono">
          What I do
        </h2>
        <div className='services-container container w-8/12 flex gap-10 mx-auto'>
          <div className="service-card p-5 rounded-xl border-1 border-gray-700">
            <span>Icon</span>
            <h3 className="text-left font-bold text-2xl mb-4">
              Frontend Development
            </h3>
            <p className="text-gray-400 text-left">
              Transforming your concepts into reality. Let&apos;s collaborate to bring your ideas to life.
            </p>
          </div>
          <div className="service-card p-5 rounded-xl border-1 border-gray-700">
            <span>Icon</span>
            <h3 className="text-left font-bold text-2xl mb-4">
              WordPress Development
            </h3>
            <p className="text-gray-400 text-left">
              Transforming your concepts into reality. Let&apos;s collaborate to bring your ideas to life.
            </p>
          </div>
          <div className="service-card p-5 rounded-xl border-1 border-gray-700">
            <span>Icon</span>
            <h3 className="text-left font-bold text-2xl mb-4">
              English Teaching
            </h3>
            <p className="text-gray-400 text-left">
              Transforming your concepts into reality. Let&apos;s collaborate to bring your ideas to life.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}