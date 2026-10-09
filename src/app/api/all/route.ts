import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
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
      socialData,
      heroData,
      heroTitlesData,
      aboutData,
      contactMethodsData,
      profileFactsData,
      servicesData,
      summaryData,
      experiencesData,
      skillsData,
      testimonialsItemsData,
      projectsData,
      projectTechData,
      projectRolesData,
      contactData,
      siteConfigData,
      pageSectionsData,
    ] = await Promise.all([
      db.select().from(schema.profile).limit(1),
      db
        .select()
        .from(schema.socialLinks)
        .orderBy(asc(schema.socialLinks.sortOrder), asc(schema.socialLinks.id)),
      db.select().from(schema.heroSection).limit(1),
      db
        .select({ title: schema.heroTitles.title })
        .from(schema.heroTitles)
        .innerJoin(
          schema.heroSection,
          eq(schema.heroSection.sectionKey, schema.heroTitles.heroSectionKey),
        )
        .where(eq(schema.heroSection.sectionKey, 'hero'))
        .orderBy(asc(schema.heroTitles.sortOrder), asc(schema.heroTitles.id)),
      db.select().from(schema.aboutSection).limit(1),
      db
        .select()
        .from(schema.contactMethods)
        .orderBy(asc(schema.contactMethods.sortOrder), asc(schema.contactMethods.id)),
      db
        .select()
        .from(schema.profileFacts)
        .orderBy(asc(schema.profileFacts.sortOrder), asc(schema.profileFacts.id)),
      db
        .select()
        .from(schema.services)
        .orderBy(asc(schema.services.sortOrder), asc(schema.services.id)),
      db.select().from(schema.experienceSection).limit(1),
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
        .select()
        .from(schema.projects)
        .orderBy(asc(schema.projects.sortOrder), asc(schema.projects.id)),
      // tech links (normalized from projects.tech text[])
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
      // role links (normalized from projects.roles text[])
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
      db.select().from(schema.contactSection).limit(1),
      db.select().from(schema.siteConfig).limit(1),
      db
        .select()
        .from(schema.pageSections)
        .orderBy(asc(schema.pageSections.sortOrder), asc(schema.pageSections.id)),
    ]);

    // Extract first records
    const profile = profileData[0];
    const hero = heroData[0];
    const about = aboutData[0];
    const summary = summaryData[0];
    const contact = contactData[0];
    const configRecord = siteConfigData[0];
    const sectionMetadata = new Map(pageSectionsData.map((section) => [section.sectionKey, section]));

    // Transform social media
    const socialMediaMap = socialData.reduce<Record<string, string>>(
      (acc, item) => {
        acc[item.platform] = item.url;
        return acc;
      },
      {},
    );

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

    const response: AllDataResponse = {
      hero: {
        titles: heroTitlesData.map(({ title }) => title),
        location: hero?.location ?? null,
        subtitle_one: hero?.subtitleOne ?? null,
        subtitle_two: hero?.subtitleTwo ?? null,
        logo: hero?.logoUrl ?? null,
      },
      about: {
        title: sectionMetadata.get("about")?.title ?? null,
        name: profile?.name ?? null,
        job_title: profile?.jobTitle ?? null,
        description: profile?.biography ?? null,
        button: {
          text: about?.buttonText ?? null,
          url: about?.buttonUrl ?? null,
        },
        contact_information: contactMethodsData.map((info) => ({
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
        title: sectionMetadata.get("services")?.title ?? null,
        items: servicesData.map((item) => ({
          title: item.title,
          description: item.description ?? null,
          icon: item.icon ?? null,
        })),
      },
      summary: {
        title: sectionMetadata.get("experience")?.title ?? null,
        button: {
          text: summary?.buttonText ?? null,
          url: summary?.buttonUrl ?? null,
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
        title: sectionMetadata.get("testimonials")?.title ?? null,
        items: testimonialsItemsData.map((item) => ({
          image: item.imageUrl ?? null,
          title: item.title,
          subtitle: item.subtitle ?? null,
          rating: item.rating ?? null,
          body: item.body ?? null,
        })),
      },
      projects: {
        title: sectionMetadata.get("projects")?.title ?? null,
        items: projectsData.map((item) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          description: item.description ?? null,
          image: item.image ?? null,
          link: item.link ?? null,
          github_url: item.githubUrl ?? null,
          // reconstructed from project_technologies + technologies
          tech: techByProject[item.id] ?? null,
          // reconstructed from project_roles
          roles: rolesByProject[item.id] ?? null,
        })),
      },
      contact: {
        title: sectionMetadata.get("contact")?.title ?? null,
        form_title: contact?.formTitle ?? null,
        button: {
          text: contact?.buttonText ?? null,
          url: contact?.buttonUrl ?? null,
        },
        methods: contactMethodsData.map(({ id, kind, title, value }) => ({
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
        sections: [...sectionMetadata.values()].sort(
          (left, right) => left.sortOrder - right.sortOrder,
        ),
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