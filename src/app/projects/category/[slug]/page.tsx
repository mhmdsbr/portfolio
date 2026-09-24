import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/header";
import { ApiDataProvider } from "@/providers/ApiDataProvider";
import { getProjects } from "@/lib/projects";
import { projectSlug } from "@/lib/project-slug";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectCategoryPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params;
  const allProjects = await getProjects();
  const projects = allProjects.filter(
    (project) => projectSlug(project.category) === slug,
  );

  if (projects.length === 0) {
    notFound();
  }

  const categoryName = projects[0].category;

  return (
    <ApiDataProvider endpoints={["api/all"]}>
      <main className="min-h-screen bg-gray-950 px-6 py-16 text-white">
        <Header singleTitle={categoryName} />
        <section className="mx-auto max-w-6xl">
          <Link
            href="/#projects"
            className="mb-10 inline-flex text-sm text-cyan-400 transition hover:text-cyan-300"
          >
            ← Back to projects
          </Link>

          <header className="mb-12">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-cyan-400">
              Project category
            </p>
            <h1 className="text-4xl font-bold md:text-6xl">{categoryName}</h1>
            <p className="mt-4 max-w-2xl text-lg text-gray-400">
              {projects.length} {projects.length === 1 ? "project" : "projects"}{" "}
              in this category.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <article
                key={project.id}
                className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900"
              >
                <div className="relative aspect-video bg-gray-800">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-purple-600 to-cyan-500">
                      <span className="text-7xl font-bold text-white/20">
                        {project.title[0]}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-bold">{project.title}</h2>
                  <p className="mt-3 leading-7 text-gray-300">
                    {project.description || "Project details coming soon."}
                  </p>

                  {project.tech && project.tech.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.tech.map((technology) => (
                        <span
                          key={technology}
                          className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300"
                        >
                          {technology}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link
                    href={`/projects/${projectSlug(project.title)}`}
                    className="mt-6 inline-flex text-sm font-semibold text-cyan-400 transition hover:text-cyan-300"
                  >
                    View project →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </ApiDataProvider>
  );
}
