'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    role: 'Frontend Developer',
    company: 'Tech Corp',
    period: 'Jan 2021 - Present',
    description: 'Built responsive web applications with React and Next.js.'
  },
  {
    role: 'UI/UX Designer',
    company: 'Design Studio',
    period: 'Jun 2019 - Dec 2020',
    description: 'Crafted wireframes and UI designs for mobile and web interfaces.'
  },
  {
    role: 'Intern Developer',
    company: 'Startup Hub',
    period: 'Jan 2018 - May 2019',
    description: 'Assisted in developing APIs and debugging legacy code.'
  }
];

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = containerRef.current?.querySelectorAll('.experience-item');

    elements?.forEach((el, index) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play reverse play reverse',
          },
          delay: index * 0.1
        }
      );
    });
  }, []);

  return (
    <section ref={containerRef} className="px-6 py-16 text-white">
      <h2 className="text-8xl font-bold text-center font-mono mb-12">Experience</h2>
      <div className="space-y-10 max-w-3xl mx-auto">
        {experiences.map((exp, i) => (
          <div
            key={i}
            className="experience-item p-6 border border-gray-700 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg"
          >
            <h3 className="text-xl font-semibold">{exp.role} @ {exp.company}</h3>
            <p className="text-sm text-gray-400 mb-2">{exp.period}</p>
            <p className="text-base">{exp.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
