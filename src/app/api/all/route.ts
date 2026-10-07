import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import type { ApiResponse, AllDataResponse } from "@/types/api";
import { isPortfolioSectionKey, PORTFOLIO_SECTIONS } from "@/lib/portfolio-sections";

export const dynamic = "force-dynamic";

export async function GET(): Promise<
  NextResponse<ApiResponse<AllDataResponse>>
> {
  try {
    // Fetch all data in parallel
    const [
      sidebarData,
      profileData,
      socialData,
      generalData,
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
      configData,
      pageSectionsData,
      headerSettingsData,
      footerData,
    ] = await Promise.all([
      db.select().from(schema.sidebar).limit(1),
      db.select().from(schema.portfolioProfile).limit(1),
      db
        .select()
        .from(schema.socialLinks)
        .orderBy(asc(schema.socialLinks.sortOrder)),
      db.select().from(schema.siteSettings).limit(1),
      db.select().from(schema.heroSection).limit(1),
      db
        .select({ title: schema.heroTitles.title })
        .from(schema.heroTitles)
        .innerJoin(
          schema.heroSection,
          eq(schema.heroSection.id, schema.heroTitles.heroSectionId),
        )
        .where(eq(schema.heroSection.sectionKey, 'hero'))
        .orderBy(asc(schema.heroTitles.sortOrder)),
      db.select().from(schema.aboutSection).limit(1),
      db
        .select()
        .from(schema.contactMethods)
        .orderBy(asc(schema.contactMethods.sortOrder)),
      db
        .select()
        .from(schema.profileFacts)
        .orderBy(asc(schema.profileFacts.sortOrder)),
      db
        .select()
        .from(schema.services)
        .orderBy(asc(schema.services.sortOrder)),
      db.select().from(schema.experienceSection).limit(1),
      db
        .select()
        .from(schema.experiences)
        .orderBy(asc(schema.experiences.sortOrder)),
      db
        .select()
        .from(schema.skills)
        .orderBy(asc(schema.skills.sortOrder)),
      db
        .select()
        .from(schema.testimonials)
        .orderBy(asc(schema.testimonials.sortOrder)),
      db
        .select()
        .from(schema.projects)
        .orderBy(asc(schema.projects.sortOrder)),
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
        .orderBy(asc(schema.projectTechnologies.sortOrder)),
      // role links (normalized from projects.roles text[])
      db
        .select({
          projectId: schema.projectRoles.projectId,
          role: schema.projectRoles.role,
          sortOrder: schema.projectRoles.sortOrder,
        })
        .from(schema.projectRoles)
        .orderBy(asc(schema.projectRoles.sortOrder)),
      db.select().from(schema.contactSection).limit(1),
      db.select().from(schema.appConfig).limit(1),
      db
        .select()
        .from(schema.pageSections)
        .orderBy(asc(schema.pageSections.sortOrder)),
      db.select().from(schema.headerSettings).limit(1),
      db.select().from(schema.footer).limit(1),
    ]);

    // Extract first records
    const sidebar = sidebarData[0];
    const profile = profileData[0];
    const general = generalData[0];
    const hero = heroData[0];
    const about = aboutData[0];
    const summary = summaryData[0];
    const contact = contactData[0];
    const configRecord = configData[0];
    const headerSettings = headerSettingsData[0];
    const footerRecord = footerData[0];

    const savedSections = new Map(
      pageSectionsData
        .filter((section) => isPortfolioSectionKey(section.sectionKey))
        .map((section) => [section.sectionKey, section]),
    );
    const sectionMetadata = new Map(
      PORTFOLIO_SECTIONS.map((section, sortOrder) => {
        const savedSection = savedSections.get(section.key);
        return [
          section.key,
          {
            id: savedSection?.id ?? -(sortOrder + 1),
            sectionKey: section.key,
            navigationTitle:
              savedSection?.navigationTitle ?? section.navigationTitle,
            title: savedSection ? savedSection.title : section.title,
            overlayTitle: savedSection
              ? savedSection.overlayTitle
              : section.overlayTitle,
            sortOrder: savedSection?.sortOrder ?? sortOrder,
            isEnabled: savedSection?.isEnabled ?? true,
          },
        ];
      }),
    );

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
      sidebar: {
        profile_image: sidebar?.profileImageUrl ?? null,
        profile_image_alt: sidebar?.profileImageAlt ?? null,
        profile_title: sidebar?.profileTitle ?? null,
        social_media: socialMediaMap,
        portfolio_title: general?.portfolioTitle ?? null,
        portfolio_overlay_title: general?.portfolioOverlayTitle ?? null,
      },
      hero: {
        titles: heroTitlesData.map(({ title }) => title),
        location: hero?.location ?? null,
        subtitle_one: hero?.subtitleOne ?? null,
        subtitle_two: hero?.subtitleTwo ?? null,
        logo: hero?.logoUrl ?? null,
      },
      about: {
        title: sectionMetadata.get("about")?.title ?? null,
        overlay_title: sectionMetadata.get("about")?.overlayTitle ?? null,
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
        overlay_title: sectionMetadata.get("services")?.overlayTitle ?? null,
        items: servicesData.map((item) => ({
          title: item.title,
          description: item.description ?? null,
          icon: item.icon ?? null,
        })),
      },
      summary: {
        title: sectionMetadata.get("experience")?.title ?? null,
        overlay_title: sectionMetadata.get("experience")?.overlayTitle ?? null,
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
        overlay_title: sectionMetadata.get("testimonials")?.overlayTitle ?? null,
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
        overlay_title: sectionMetadata.get("projects")?.overlayTitle ?? null,
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
        overlay_title: sectionMetadata.get("contact")?.overlayTitle ?? null,
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
        defaultTitle: headerSettings?.defaultTitle || "Welcome",
      },
      footer: {
        companyName: footerRecord?.companyName || "Your Company",
        privacyPolicy: footerRecord?.privacyPolicy || null,
        termsOfService: footerRecord?.termsOfService || null,
        copyrightText: footerRecord?.copyrightText || null,
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