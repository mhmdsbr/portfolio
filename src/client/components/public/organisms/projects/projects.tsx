"use client";

import { useState, useEffect, useMemo } from "react";
import type { ProjectsResponse } from "@/shared/types";
import { useProjectsAnimation } from "@/client/hooks/animations/useProjectsAnimation";
import { Heading, Typography } from "@/client/components/public/atoms";
import ProjectCard from "./ProjectCard";

interface Project {
  id: number;
  slug: string;
  title: string;
  category: string;
  category_slug: string;
  description: string | null;
  image: string | null;
  link?: string | null;
  github_url?: string | null;
  tech?: string[] | null;
}

export default function Projects({ projectsData }: { projectsData: ProjectsResponse }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [projects, setProjects] = useState<Project[]>([]);

  const sectionId = "projects";

  const allProjects: Project[] = useMemo(() => {
    return projectsData.items;
  }, [projectsData.items]);

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
      <section id={sectionId} className="px-6 py-16 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-sm uppercase tracking-wider text-gray-400">
          </span>
          <h2 className="text-5xl md:text-7xl font-bold font-mono mt-2">
          </h2>
          <Typography className="mt-8 text-gray-400">
            No projects available yet.
          </Typography>
        </div>
      </section>
    );
  }

  return (
    <section id={sectionId} className="px-6 py-16 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Heading className="mt-2 md:text-6xl">
            {projectsData.title}
          </Heading>
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
