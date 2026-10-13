import Image from 'next/image';
import Link from 'next/link';
import { Badge, Heading, Typography } from "@/client/components/public/atoms";
import type { Project } from "@/shared/types";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const detailHref = `/projects/${project.slug}`;

  return (
    <div className="group bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 opacity-0">
      <div className="transition-transform duration-300 group-hover:-translate-y-2">
        <div className="relative h-48 overflow-hidden bg-gray-900">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
              <span className="text-6xl font-bold text-white/20">
                {project.title[0]}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
            <Link
                href={detailHref}
                className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition"
              >
                View Project
            </Link>
            {project.github_url && project.github_url !== "#" && (
              <Link
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/80 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-black transition"
              >
                GitHub
              </Link>
            )}
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <Link
              href={`/projects/category/${project.category_slug}`}
              className="text-xs uppercase text-cyan-400 font-semibold tracking-wider hover:text-cyan-300"
            >
              {project.category}
            </Link>
            {project.tech && project.tech.length > 0 && (
              <div className="flex gap-1">
                {project.tech.slice(0, 3).map((tech, i) => (
                  <Badge key={i} size="small">
                    {tech}
                  </Badge>
                ))}
                {project.tech.length > 3 && (
                  <span className="text-xs text-gray-400">
                    +{project.tech.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
          <Link
            href={detailHref}
            className="transition-colors group-hover:text-cyan-400"
          >
            <Heading
              as="h3"
              size="xl"
              color="inherit"
              weight="bold"
              spacing="bottomSmall"
            >
              {project.title}
            </Heading>
          </Link>
          <Typography size="sm" color="muted" overflow="clamp2">
            {project.description}
          </Typography>
        </div>
      </div>
    </div>
  );
}