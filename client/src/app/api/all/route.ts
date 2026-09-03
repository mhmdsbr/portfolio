import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";
import type { ApiResponse, AllDataResponse } from "@/types/api";

export const dynamic = "force-dynamic";

export async function GET(): Promise<
  NextResponse<ApiResponse<AllDataResponse>>
> {
  try {
    // Fetch all data in parallel
    const [
      sidebarData,
      socialData,
      generalData,
      heroData,
      heroTitlesData,
      aboutData,
      aboutContactData,
      aboutDetailsData,
      servicesData,
      serviceItemsData,
      summaryData,
      summaryJobsData,
      summaryExperiencesData,
      testimonialsData,
      testimonialItemsData,
      projectsData,
      projectItemsData,
      contactData,
      footerData,
      configData,
    ] = await Promise.all([
      db.select().from(schema.sidebar),
      db
        .select()
        .from(schema.socialMedia)
        .orderBy(asc(schema.socialMedia.sortOrder)),
      db.select().from(schema.generalSettings),
      db.select().from(schema.heroSection),
      db
        .select()
        .from(schema.heroTitles)
        .orderBy(asc(schema.heroTitles.sortOrder)),
      db.select().from(schema.aboutSection),
      db
        .select()
        .from(schema.aboutContactInfo)
        .orderBy(asc(schema.aboutContactInfo.sortOrder)),
      db
        .select()
        .from(schema.aboutDetails)
        .orderBy(asc(schema.aboutDetails.sortOrder)),
      db.select().from(schema.servicesSection),
      db
        .select()
        .from(schema.serviceItems)
        .orderBy(asc(schema.serviceItems.sortOrder)),
      db.select().from(schema.summarySection),
      db
        .select()
        .from(schema.summaryJobs)
        .orderBy(asc(schema.summaryJobs.sortOrder)),
      db
        .select()
        .from(schema.summaryExperiences)
        .orderBy(asc(schema.summaryExperiences.sortOrder)),
      db.select().from(schema.testimonialsSection),
      db
        .select()
        .from(schema.testimonialItems)
        .orderBy(asc(schema.testimonialItems.sortOrder)),
      db.select().from(schema.projectsSection),
      db
        .select()
        .from(schema.projectItems)
        .orderBy(asc(schema.projectItems.sortOrder)),
      db.select().from(schema.contactSection),
      db.select().from(schema.footer),
      db.select().from(schema.config),
    ]);

    // Extract first records
    const sidebar = sidebarData[0];
    const general = generalData[0];
    const hero = heroData[0];
    const about = aboutData[0];
    const services = servicesData[0];
    const summary = summaryData[0];
    const testimonials = testimonialsData[0];
    const projects = projectsData[0];
    const contact = contactData[0];
    const footerRecord = footerData[0];
    const configRecord = configData[0];

    // Transform social media
    const socialMediaMap = socialData.reduce<Record<string, string>>(
      (acc, item) => {
        acc[item.platform] = item.url;
        return acc;
      },
      {},
    );

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
        titles: heroTitlesData.map((t) => t.title),
        location: hero?.location ?? null,
        subtitle_one: hero?.subtitleOne ?? null,
        subtitle_two: hero?.subtitleTwo ?? null,
        logo: hero?.logoUrl ?? null,
      },
      about: {
        title: about?.title ?? null,
        overlay_title: about?.overlayTitle ?? null,
        name: about?.name ?? null,
        job_title: about?.jobTitle ?? null,
        description: about?.description ?? null,
        button: {
          text: about?.buttonText ?? null,
          url: about?.buttonUrl ?? null,
        },
        contact_information: aboutContactData.map((info) => ({
          title: info.title,
          content: info.content,
        })),
        details: aboutDetailsData.map((detail) => ({
          number: detail.number,
          title: detail.title,
        })),
      },
      services: {
        title: services?.title ?? null,
        overlay_title: services?.overlayTitle ?? null,
        items: serviceItemsData.map((item) => ({
          title: item.title,
          content: item.content ?? null,
          icon: item.icon ?? null,
        })),
      },
      summary: {
        title: summary?.title ?? null,
        overlay_title: summary?.overlayTitle ?? null,
        button: {
          text: summary?.buttonText ?? null,
          url: summary?.buttonUrl ?? null,
        },
        jobs: summaryJobsData.map((job) => ({
          from: job.fromYear ?? null,
          to: job.toYear ?? null,
          title: job.jobTitle,
          company: job.company,
          description: job.description ?? null,
        })),
        experiences: summaryExperiencesData.map((exp) => ({
          skill: exp.skill,
          level: exp.level ?? null,
        })),
      },
      testimonials: {
        title: testimonials?.title ?? null,
        overlay_title: testimonials?.overlayTitle ?? null,
        items: testimonialItemsData.map((item) => ({
          image: item.imageUrl ?? null,
          title: item.title,
          subtitle: item.subtitle ?? null,
          rating: item.rating ?? null,
          content: item.content ?? null,
        })),
      },
      projects: {
        title: projects?.title ?? null,
        overlay_title: projects?.overlayTitle ?? null,
        items: projectItemsData.map((item) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          description: item.description ?? null,
          image: item.image ?? null,
          link: item.link ?? null,
          github: item.github ?? null,
          tech: item.tech ?? null,
        })),
      },
      contact: {
        title: contact?.title ?? null,
        overlay_title: contact?.overlayTitle ?? null,
        form_title: contact?.formTitle ?? null,
        button: {
          text: contact?.buttonText ?? null,
          url: contact?.buttonUrl ?? null,
        },
        info_title: contact?.infoTitle ?? null,
        address: contact?.address ?? null,
        phone: contact?.phone ?? null,
        email: contact?.email ?? null,
      },
      footer: {
        terms_policies: footerRecord?.termsPolicies ?? null,
        disclaimer: footerRecord?.disclaimer ?? null,
      },
      config: {
        api_base_url: configRecord?.apiBaseUrl ?? null,
        smtp: {
          host: configRecord?.smtpHost ?? null,
          port: configRecord?.smtpPort ?? null,
          username: configRecord?.smtpUsername ?? null,
          password: configRecord?.smtpPassword ?? null,
        },
        recaptcha_site_key: configRecord?.recaptchaSiteKey ?? null,
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
