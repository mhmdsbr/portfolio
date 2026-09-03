'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAllData } from '@/hooks/useAllData';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string | null;
  image: string | null;
  link: string | null;
  github: string | null;
  tech: string[] | null;
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [projects, setProjects] = useState<Project[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [animating, setAnimating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { data: allData, isLoading } = useAllData();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get projects from API
  const allProjects = allData?.projects?.items || [];

  // Extract unique categories
  const categories = [
    'All',
    ...new Set(allProjects.map((p) => p.category)),
  ];

  const filterProjects = (category: string) => {
    return category === 'All'
      ? allProjects
      : allProjects.filter((p) => p.category === category);
  };

  // Initialize projects when data loads
  useEffect(() => {
    if (allProjects.length > 0) {
      setProjects(allProjects);
    }
  }, [allProjects]);

  const handleTabClick = (category: string) => {
    if (animating || category === activeCategory || !isMounted) return;

    setAnimating(true);

    const cards = containerRef.current?.children;
    if (!cards) return;

    // Animate out
    gsap.to(cards, {
      scale: 0.8,
      opacity: 0,
      y: -30,
      stagger: 0.05,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        const newProjects = filterProjects(category);
        setProjects(newProjects);
        setActiveCategory(category);

        // Animate in
        requestAnimationFrame(() => {
          const newCards = containerRef.current?.children;
          if (newCards) {
            gsap.fromTo(
              newCards,
              {
                opacity: 0,
                scale: 1.2,
                y: 30,
              },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.08,
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
    if (containerRef.current?.children && isMounted && projects.length > 0) {
      gsap.fromTo(
        containerRef.current.children,
        {
          opacity: 0,
          scale: 0.95,
          y: 50,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: 'power2.out',
        }
      );
    }
  }, [isMounted, projects]);

  if (isLoading) {
    return (
      <section id="projects" className="px-6 py-16 text-white">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section id="projects" className="px-6 py-16 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-sm uppercase tracking-wider text-gray-400">
            Portfolio
          </span>
          <h2 className="text-5xl md:text-7xl font-bold font-mono mt-2">
            Projects
          </h2>
          <p className="text-gray-400 mt-8">No projects available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="px-6 py-16 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-sm uppercase tracking-wider text-gray-400">
            Portfolio
          </span>
          <h2 className="text-5xl md:text-7xl font-bold font-mono mt-2">
            {allData?.projects?.title || 'Projects'}
          </h2>
          {allData?.projects?.overlay_title && (
            <p className="text-gray-400 mt-2">
              {allData.projects.overlay_title}
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleTabClick(cat)}
              disabled={animating}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-white text-black shadow-lg shadow-white/20 scale-105'
                  : 'bg-gray-800 hover:bg-gray-700 hover:scale-105'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div
          ref={containerRef}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-48 overflow-hidden">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
                    <span className="text-6xl font-bold text-white/20">
                      {project.title[0]}
                    </span>
                  </div>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition"
                    >
                      Live Demo
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-black/80 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-black transition"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase text-cyan-400 font-semibold tracking-wider">
                    {project.category}
                  </span>
                  {project.tech && project.tech.length > 0 && (
                    <div className="flex gap-1">
                      {project.tech.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-700 px-2 py-0.5 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{project.tech.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}