import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/client/components/public/organisms/header";
import {
  Badge,
  Button,
  Heading,
  Typography,
} from "@/client/components/public/atoms";
import { getPublicAll } from "@/server/services/public-content";
import { getProjectsByCategory } from "@/server/repos/projects";
import PublicPageLayout from "@/client/components/public/layouts/PublicPageLayout";
import BackgroundGradient from "@/client/components/common/backgroundGradient";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectCategoryPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params;
  const projects = await getProjectsByCategory(slug);

  if (projects.length === 0) {
    notFound();
  }

  const categoryName = projects[0].category;
  const { header } = await getPublicAll();

  return (
    <PublicPageLayout className="px-6 py-22">
      <BackgroundGradient />
      <Header singleTitle={categoryName} headerData={header} />
      <section className="mx-auto max-w-6xl">
        <Button
          variant="subtle"
          href="/#projects"
          className="mb-4 block text-cyan-400 transition hover:text-cyan-300"
        >
          ← Back
        </Button>

        <header className="mb-12">
          <Typography
            size="sm"
            color="accent"
            weight="semibold"
            transform="uppercase"
            tracking="wide"
            spacing="bottomMedium"
          >
            Project category
          </Typography>
          <Heading as="h1" size="sectionCompact" color="inherit">
            {categoryName}
          </Heading>
          <Typography
            size="lg"
            color="muted"
            spacing="topMedium"
            width="medium"
          >
            {projects.length} {projects.length === 1 ? "project" : "projects"}{" "}
            in this category.
          </Typography>
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
                <Heading as="h2" size="2xl" color="inherit">
                  {project.title}
                </Heading>
                <Typography
                  size="inherit"
                  color="body"
                  spacing="topSmall"
                  leading="7"
                >
                  {project.description || "Project details coming soon."}
                </Typography>

                {project.tech && project.tech.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tech.map((technology) => (
                      <Badge key={technology} size="medium" tone="cyan">
                        {technology}
                      </Badge>
                    ))}
                  </div>
                )}

                <Link
                  href={`/projects/${project.slug}`}
                  className="mt-6 inline-flex text-sm font-semibold text-cyan-400 transition hover:text-cyan-300"
                >
                  View project →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PublicPageLayout>
  );
}
