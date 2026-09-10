"use client";

import { useState, useEffect, useMemo } from "react";
import { useAllData } from "@/hooks/useAllData";
import { useProjectsAnimation } from "@/hooks/animations/useProjectsAnimation";
import ProjectCard from "./ProjectCard";

interface Project {
  id: number;
  title: string;
  category: string;
  description: string | null;
  image: string | null;
  link?: string | null;
  github?: string | null;
  tech?: string[] | null;
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [projects, setProjects] = useState<Project[]>([]);

  const { data: allData } = useAllData();

  const allProjects: Project[] = useMemo(() => {
    return allData?.projects?.items || [];
  }, [allData?.projects?.items]);

  const categories = useMemo(() => {
    return ["All", ...new Set(allProjects.map((p) => p.category))];
  }, [allProjects]);

  const filterProjects = (category: string) => {
    return category === "All"
      ? allProjects
      : allProjects.filter((p) => p.category === category);
  };

  useEffect(() => {
    if (allProjects.length > 0) {
      setProjects(allProjects);
    }
  }, [allProjects]);

  const { containerRef, animating, handleTabClick } = useProjectsAnimation({
    projects,
    setProjects,
    activeCategory,
    setActiveCategory,
    filterProjects,
  });

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
          <h2 className="text-5xl md:text-7xl font-bold font-mono mt-2">
            {allData?.projects?.title || "Projects"}
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleTabClick(cat)}
              disabled={animating}
              className={`px-6 py-2.5 cursor-pointer rounded-full text-sm font-semibold transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-white text-black shadow-lg shadow-white/20 scale-105"
                  : "bg-gray-800 hover:bg-gray-700 hover:scale-105"
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
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
