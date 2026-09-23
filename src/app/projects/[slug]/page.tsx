import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/projects";
import Header from "@/components/header";
import { ApiDataProvider } from "@/providers/ApiDataProvider";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <ApiDataProvider endpoints={["api/all"]}>
      <main className="min-h-screen bg-gray-950 px-6 py-16 text-white">
        <Header singleTitle={project.title} />
        <article className="mx-auto max-w-5xl">
          <Link
            href="/#projects"
            className="mb-10 inline-flex text-sm text-cyan-400 transition hover:text-cyan-300"
          >
            ← Back to projects
          </Link>

        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-start">
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
            {project.image ? (
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-purple-600 to-cyan-500">
                <span className="text-8xl font-bold text-white/20">
                  {project.title[0]}
                </span>
              </div>
            )}
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-cyan-400">
              {project.category}
            </p>
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">
              {project.title}
            </h1>
            <p className="text-lg leading-8 text-gray-300">
              {project.description || "Project details coming soon."}
            </p>

            {project.tech && project.tech.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {project.tech.map((technology) => (
                  <span
                    key={technology}
                    className="rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-300"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-4">
              {project.link?.startsWith("http") && (
                <a
                  href={project.link}
                  target={project.link.startsWith("/") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="rounded-full bg-cyan-500 px-5 py-2.5 font-semibold text-gray-950 transition hover:bg-cyan-400"
                >
                  Visit project
                </a>
              )}
              {project.github?.startsWith("http") && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-gray-600 px-5 py-2.5 font-semibold transition hover:border-gray-400"
                >
                  View source
                </a>
              )}
            </div>
          </div>
        </div>
        </article>
      </main>
    </ApiDataProvider>
  );
}
