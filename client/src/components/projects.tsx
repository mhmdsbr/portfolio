'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const categories = ['All', 'React', 'WordPress', 'Next.js'];

const allProjects = [
  {
    id: 1,
    title: 'E-commerce Store',
    category: 'React',
    description: 'A fast and responsive online store built with React.',
    image: '/images/ecommerce.png',
  },
  {
    id: 2,
    title: 'Company Site',
    category: 'WordPress',
    description: 'A business website using custom WordPress theme.',
    image: '/images/company.png',
  },
  {
    id: 3,
    title: 'Portfolio',
    category: 'Next.js',
    description: 'Portfolio site made with Next.js and Tailwind.',
    image: '/images/portfolio.png',
  },
  {
    id: 4,
    title: 'Blog Platform',
    category: 'WordPress',
    description: 'Full-featured blog with SEO support.',
    image: '/images/blog.png',
  },
  {
    id: 5,
    title: 'Admin Dashboard',
    category: 'React',
    description: 'Interactive dashboard with charts and graphs.',
    image: '/images/dashboard.png',
  },
  {
    id: 6,
    title: 'Agency Website',
    category: 'Next.js',
    description: 'Modern digital agency site.',
    image: '/images/agency.png',
  },
  {
    id: 7,
    title: 'Product Landing',
    category: 'React',
    description: 'Landing page built with animations and smooth UX.',
    image: '/images/landing.png',
  },
];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [projects, setProjects] = useState(allProjects);
  const containerRef = useRef<HTMLDivElement>(null);
  const [animating, setAnimating] = useState(false);

  const filterProjects = (category: string) => {
    return category === 'All'
      ? allProjects
      : allProjects.filter((p) => p.category === category);
  };

  const handleTabClick = (category: string) => {
    if (animating || category === activeCategory) return;

    setAnimating(true);

    // Animate out existing cards
    const cards = containerRef.current?.children;
    if (!cards) return;

    gsap.to(cards, {
      scale: .8,
      opacity: 0,
      stagger: 0.05,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        const newProjects = filterProjects(category);
        setProjects(newProjects);
        setActiveCategory(category);

        // Animate in new cards after DOM updates
        requestAnimationFrame(() => {
          const newCards = containerRef.current?.children;
          if (newCards) {
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
          }
        });
      },
    });
  };

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current?.children as HTMLCollection,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out',
      }
    );
  }, []);

  return (
    <section id="projects" className="px-6 py-16 text-white">
      <h2 className="text-5xl md:text-8xl font-bold text-center font-mono mb-12">
        Projects
      </h2>

      {/* Tabs */}
      <div className="flex justify-center gap-3 mb-10 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleTabClick(cat)}
            disabled={animating}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              activeCategory === cat
                ? 'bg-white text-black'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div
        ref={containerRef}
        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
      >
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-md"
          >
            <div className="relative h-40 sm:h-48">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <span className="text-xs uppercase text-gray-400">
                {project.category}
              </span>
              <h3 className="text-lg font-bold mt-2">{project.title}</h3>
              <p className="text-sm text-gray-300 mt-1">
                {project.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
