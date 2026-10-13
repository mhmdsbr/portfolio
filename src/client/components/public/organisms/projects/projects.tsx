"use client";

import { useState, useEffect, useMemo } from "react";
import type { ProjectsResponse } from "@/shared/types";
import { useProjectsAnimation } from "@/client/hooks/animations/useProjectsAnimation";
import { Button, Heading, Typography } from "@/client/components/public/atoms";
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
          <Heading
            as="h2"
            size="sectionLarge"
            color="inherit"
            font="mono"
            spacing="topSmall"
          >
            {projectsData.title}
          </Heading>
          <Typography size="base" color="muted" spacing="topLarge">
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
          <Heading
            as="h2"
            size="sectionCompact"
            color="inherit"
            font="mono"
            spacing="topSmall"
          >
            {projectsData.title}
          </Heading>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant="filter"
              active={activeCategory === cat}
              onClick={() => handleTabClick(cat)}
              disabled={animating}
            >
                {cat}
            </Button>
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
