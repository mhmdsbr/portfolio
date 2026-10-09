import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import type { SectionKind } from "@/lib/db/constants";
import { readSectionConfig } from "@/lib/db/section-config";
import { getContactMethodsWithSections } from "@/lib/contact-methods";
import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import type { ApiResponse, AllDataResponse } from "@/types/api";

export const dynamic = "force-dynamic";

export async function GET(): Promise<
  NextResponse<ApiResponse<AllDataResponse>>
> {
  try {
    // Fetch all data in parallel
    const [
      profileData,
      heroTitlesData,
      contactMethodsData,
      profileFactsData,
      servicesData,
      experiencesData,
      skillsData,
      testimonialsItemsData,
      projectsData,
      projectTechData,
      projectRolesData,
      siteConfigData,
      pageSectionsData,
    ] = await Promise.all([
      db.select().from(schema.profile).limit(1),
      db
        .select({ title: schema.heroTitles.title })
        .from(schema.heroTitles)
        .innerJoin(
          schema.pageSections,
          eq(schema.pageSections.id, schema.heroTitles.sectionId),
        )
        .where(eq(schema.pageSections.kind, "hero"))
        .orderBy(asc(schema.heroTitles.sortOrder), asc(schema.heroTitles.id)),
      getContactMethodsWithSections(),
      db
        .select()
        .from(schema.profileFacts)
        .orderBy(asc(schema.profileFacts.sortOrder), asc(schema.profileFacts.id)),
      db
        .select()
        .from(schema.services)
        .orderBy(asc(schema.services.sortOrder), asc(schema.services.id)),
      db
        .select()
        .from(schema.experiences)
        .orderBy(asc(schema.experiences.sortOrder), asc(schema.experiences.id)),
      db
        .select()
        .from(schema.skills)
        .orderBy(asc(schema.skills.sortOrder), asc(schema.skills.id)),
      db
        .select()
        .from(schema.testimonials)
        .orderBy(asc(schema.testimonials.sortOrder), asc(schema.testimonials.id)),
      db
        .select({
          project: schema.projects,
          category: schema.projectCategories.name,
          categorySlug: schema.projectCategories.slug,
        })
        .from(schema.projects)
        .innerJoin(
          schema.projectCategories,
          eq(schema.projectCategories.id, schema.projects.categoryId),
        )
        .orderBy(asc(schema.projects.sortOrder), asc(schema.projects.id)),
      db
        .select({
          projectId: schema.projectTechnologies.projectId,
          name: schema.technologies.name,
          sortOrder: schema.projectTechnologies.sortOrder,
        })
        .from(schema.projectTechnologies)
        .innerJoin(
          schema.technologies,
          eq(schema.technologies.id, schema.projectTechnologies.technologyId),
        )
        .orderBy(
          asc(schema.projectTechnologies.sortOrder),
          asc(schema.projectTechnologies.projectId),
          asc(schema.projectTechnologies.technologyId),
        ),
      db
        .select({
          projectId: schema.projectRoles.projectId,
          role: schema.projectRoles.role,
          sortOrder: schema.projectRoles.sortOrder,
        })
        .from(schema.projectRoles)
        .orderBy(
          asc(schema.projectRoles.sortOrder),
          asc(schema.projectRoles.projectId),
          asc(schema.projectRoles.role),
        ),
      db.select().from(schema.siteConfig).limit(1),
      db
        .select()
        .from(schema.pageSections)
        .orderBy(asc(schema.pageSections.sortOrder), asc(schema.pageSections.id)),
    ]);

    const profile = profileData[0];
    const configRecord = siteConfigData[0];
    const sectionsByKind = new Map(
      pageSectionsData.map((section) => [section.kind, section]),
    );
    const sectionTitle = (kind: SectionKind) =>
      sectionsByKind.get(kind)?.title ?? null;
    const sectionConfig = <K extends SectionKind>(kind: K) =>
      readSectionConfig(kind, sectionsByKind.get(kind)?.config);

    const hero = sectionConfig("hero");
    const about = sectionConfig("about");
    const summary = sectionConfig("experience");
    const contact = sectionConfig("contact");

    // Group normalized tech + roles by projectId
    const techByProject = projectTechData.reduce<
      Record<number, string[]>
    >((acc, row) => {
      (acc[row.projectId] ??= []).push(row.name);
      return acc;
    }, {});
    const rolesByProject = projectRolesData.reduce<
      Record<number, string[]>
    >((acc, row) => {
      (acc[row.projectId] ??= []).push(row.role);
      return acc;
    }, {});

    const methodsFor = (kind: "about" | "contact") =>
      contactMethodsData.filter((method) => method.sections.includes(kind));

    const response: AllDataResponse = {
      hero: {
        titles: heroTitlesData.map(({ title }) => title),
        location: hero.location,
        subtitle_one: hero.subtitleOne,
        subtitle_two: hero.subtitleTwo,
        logo: hero.logoUrl,
      },
      about: {
        title: sectionTitle("about"),
        name: profile?.name ?? null,
        job_title: profile?.jobTitle ?? null,
        description: profile?.biography ?? null,
        button: {
          text: about.buttonText,
          url: about.buttonUrl,
        },
        contact_information: methodsFor("about").map((info) => ({
          kind: info.kind,
          title: info.title,
          value: info.value,
        })),
        details: profileFactsData.map((detail) => ({
          number: detail.number,
          title: detail.title,
        })),
      },
      services: {
        title: sectionTitle("services"),
        items: servicesData.map((item) => ({
          title: item.title,
          description: item.description ?? null,
          icon: item.icon ?? null,
        })),
      },
      summary: {
        title: sectionTitle("experience"),
        button: {
          text: summary.buttonText,
          url: summary.buttonUrl,
        },
        jobs: experiencesData.map((job) => ({
          from: job.fromYear ?? null,
          to: job.toYear,
          title: job.jobTitle,
          company: job.company,
          description: job.description ?? null,
        })),
        experiences: skillsData.map((exp) => ({
          skill: exp.skill,
          level: exp.level ?? null,
        })),
      },
      testimonials: {
        title: sectionTitle("testimonials"),
        items: testimonialsItemsData.map((item) => ({
          image: item.imageUrl ?? null,
          title: item.title,
          subtitle: item.subtitle ?? null,
          rating: item.rating ?? null,
          body: item.body ?? null,
        })),
      },
      projects: {
        title: sectionTitle("projects"),
        items: projectsData.map(({ project, category, categorySlug }) => ({
          id: project.id,
          slug: project.slug,
          title: project.title,
          category,
          category_slug: categorySlug,
          description: project.description ?? null,
          image: project.image ?? null,
          link: project.link ?? null,
          github_url: project.githubUrl ?? null,
          // reconstructed from project_technologies + technologies
          tech: techByProject[project.id] ?? null,
          // reconstructed from project_roles
          roles: rolesByProject[project.id] ?? null,
        })),
      },
      contact: {
        title: sectionTitle("contact"),
        form_title: contact.formTitle,
        button: {
          text: contact.buttonText,
          url: contact.buttonUrl,
        },
        methods: methodsFor("contact").map(({ id, kind, title, value }) => ({
          id,
          kind,
          title,
          value,
        })),
      },
      config: {
        recaptcha_site_key: configRecord?.recaptchaSiteKey ?? null,
      },
      header: {
        sections: pageSectionsData.map((section) => ({
          id: section.id,
          kind: section.kind,
          navigationTitle: section.navigationTitle,
          title: section.title,
          sortOrder: section.sortOrder,
          isEnabled: section.isEnabled,
        })),
        defaultTitle: null,
      },
      footer: {
        companyName: configRecord?.companyName || "Your Company",
        privacyPolicy: configRecord?.privacyPolicy || null,
        termsOfService: configRecord?.termsOfService || null,
        copyrightText: configRecord?.copyrightText || null,
      },
    };

    return NextResponse.json({
      data: response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error fetching all data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch data",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
