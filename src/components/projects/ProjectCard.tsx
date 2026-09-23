import Image from 'next/image';
import Link from 'next/link';
import { projectSlug } from '@/lib/project-slug';

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

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const detailHref = `/projects/${projectSlug(project.title)}`;

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
            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
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
            {project.github && project.github !== "#" && (
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
            <Link
              href={`/projects/category/${projectSlug(project.category)}`}
              className="text-xs uppercase text-cyan-400 font-semibold tracking-wider hover:text-cyan-300"
            >
              {project.category}
            </Link>
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
          <Link href={detailHref}>
            <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
              {project.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-400 line-clamp-2">
            {project.description}
          </p>
        </div>
      </div>
    </div>
  );
}