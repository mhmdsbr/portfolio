import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/projects";
import Header from "@/components/header";
import { ApiDataProvider } from "@/providers/ApiDataProvider";
import BackgroundGradient from "@/components/backgroundGradient";

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
      <main className="relative min-h-screen overflow-x-hidden px-6 py-16 text-white">
        <BackgroundGradient />
        <Header singleTitle={project.title} />
        <article className="relative z-10 mx-auto max-w-7xl">
          <Link
            href="/#projects"
            className="mb-10 inline-flex text-sm text-cyan-400 transition hover:text-cyan-300"
          >
            ← Back to projects
          </Link>

        <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16 lg:items-start">
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-white/10 bg-gray-900/80 shadow-2xl shadow-cyan-950/20">
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

          <div className="rounded-3xl border border-white/10 bg-gray-950/60 p-7 backdrop-blur-sm md:p-10">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-cyan-400">
              {project.category}
            </p>
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">
              {project.title}
            </h1>
            <p className="text-lg leading-8 text-gray-300">
              {project.description || "Project details coming soon."}
            </p>

            {project.roles && project.roles.length > 0 && (
              <div className="mt-10 border-t border-white/10 pt-8">
                <h2 className="mb-4 text-xl font-semibold">My role</h2>
                <ul className="space-y-3 text-gray-300">
                  {project.roles.map((role) => (
                    <li key={role} className="flex gap-3 leading-7">
                      <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                      <span>{role}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

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
