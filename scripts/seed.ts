import { db } from "../src/lib/db/index.js";
import * as schema from "../src/lib/db/schema.js";

interface SeedConfig {
  sidebar: schema.NewSidebar;
  socialMedia: schema.NewSocialMedia[];
  generalSettings: schema.NewGeneralSettings;
  hero: schema.NewHeroSection;
  heroTitles: Omit<schema.NewHeroTitle, "id">[];
  about: schema.NewAboutSection;
  aboutContactInfo: Omit<schema.NewAboutContactInfo, "id">[];
  aboutDetails: Omit<schema.NewAboutDetail, "id">[];
  services: schema.NewServicesSection;
  serviceItems: Omit<schema.NewServiceItem, "id">[];
  summary: schema.NewSummarySection;
  summaryJobs: Omit<schema.NewSummaryJob, "id">[];
  summaryExperiences: Omit<schema.NewSummaryExperience, "id">[];
  testimonials: schema.NewTestimonialsSection;
  testimonialItems: Omit<schema.NewTestimonialItem, "id">[];
  contact: schema.NewContactSection;
  config: schema.NewConfig;
  projects: schema.NewProjectsSection;
  projectItems: Omit<schema.NewProjectItem, "id">[];
  headerSections: Omit<schema.NewHeaderSection, 'id'>[]
  headerSettings: schema.NewHeaderSettings
  footer: schema.NewFooterSection;
}

const seedData: SeedConfig = {
  sidebar: {
    profileImageUrl: "https://your-image-url.jpg",
    profileImageAlt: "John Doe Profile",
    profileTitle: "John Doe",
  },
  socialMedia: [
    {
      platform: "linkedin",
      url: "https://linkedin.com/in/johndoe",
      sortOrder: 0,
    },
    { platform: "github", url: "https://github.com/johndoe", sortOrder: 1 },
    { platform: "twitter", url: "https://twitter.com/johndoe", sortOrder: 2 },
    { platform: "mail", url: "mailto:john@example.com", sortOrder: 3 },
  ],
  generalSettings: {
    portfolioTitle: "John Doe",
    portfolioOverlayTitle: "Portfolio",
  },
  hero: {
    location: "San Francisco, CA",
    subtitleOne: "Software Engineer",
    subtitleTwo: "Full Stack Developer",
    logoUrl: "https://your-logo.svg",
  },
  heroTitles: [
    { heroId: 0, title: "Creative", sortOrder: 0 },
    { heroId: 0, title: "Developer", sortOrder: 1 },
    { heroId: 0, title: "Designer", sortOrder: 2 },
  ],
  about: {
    title: "About Me",
    overlayTitle: "About",
    name: "John Doe",
    jobTitle: "Full Stack Developer",
    description:
      "I am a passionate developer with 5+ years of experience building web applications...",
    buttonText: "Download CV",
    buttonUrl: "/cv.pdf",
  },
  aboutContactInfo: [
    { aboutId: 0, title: "Phone", content: "+1 234 567 890", sortOrder: 0 },
    { aboutId: 0, title: "Email", content: "john@example.com", sortOrder: 1 },
    {
      aboutId: 0,
      title: "Location",
      content: "San Francisco, CA",
      sortOrder: 2,
    },
  ],
  aboutDetails: [
    { aboutId: 0, number: 5, title: "Years Experience", sortOrder: 0 },
    { aboutId: 0, number: 10, title: "Projects", sortOrder: 1 },
    { aboutId: 0, number: 20, title: "Clients", sortOrder: 2 },
  ],
  services: {
    title: "Services",
    overlayTitle: "What I Do",
  },
  serviceItems: [
    {
      servicesId: 0,
      title: "Web Development",
      content: "Building responsive websites and web applications",
      icon: "desktop",
      sortOrder: 0,
    },
    {
      servicesId: 0,
      title: "UI/UX Design",
      content: "Creating beautiful user interfaces",
      icon: "palette",
      sortOrder: 1,
    },
    {
      servicesId: 0,
      title: "Consulting",
      content: "Technical consulting services",
      icon: "bullhorn",
      sortOrder: 2,
    },
  ],
  summary: {
    title: "Summary",
    overlayTitle: "Resume",
    buttonText: "Download Resume",
    buttonUrl: "/resume.pdf",
  },
  summaryJobs: [
    {
      summaryId: 0,
      fromYear: 2020,
      toYear: "Present",
      jobTitle: "Senior Developer",
      company: "Tech Corp",
      description:
        "Led a team of 5 developers building enterprise applications...",
      sortOrder: 0,
    },
    {
      summaryId: 0,
      fromYear: 2018,
      toYear: "2020",
      jobTitle: "Full Stack Developer",
      company: "Startup Inc",
      description:
        "Built and maintained web applications using React and Node.js...",
      sortOrder: 1,
    },
  ],
  summaryExperiences: [
    { summaryId: 0, skill: "JavaScript", level: 90, sortOrder: 0 },
    { summaryId: 0, skill: "TypeScript", level: 85, sortOrder: 1 },
    { summaryId: 0, skill: "React", level: 90, sortOrder: 2 },
    { summaryId: 0, skill: "Next.js", level: 85, sortOrder: 3 },
    { summaryId: 0, skill: "Python", level: 75, sortOrder: 4 },
    { summaryId: 0, skill: "PostgreSQL", level: 80, sortOrder: 5 },
  ],
  testimonials: {
    title: "Testimonials",
    overlayTitle: "What People Say",
  },
  testimonialItems: [
    {
      testimonialsId: 0,
      imageUrl: "https://example.com/avatar1.jpg",
      title: "Jane Smith",
      subtitle: "CEO, Tech Corp",
      rating: "5 Stars",
      content:
        "John is an exceptional developer who consistently delivers high-quality work...",
      sortOrder: 0,
    },
    {
      testimonialsId: 0,
      imageUrl: "https://example.com/avatar2.jpg",
      title: "Mike Johnson",
      subtitle: "CTO, Startup Inc",
      rating: "5 Stars",
      content:
        "Working with John was a pleasure. He is knowledgeable, professional, and reliable...",
      sortOrder: 1,
    },
  ],
  projects: {
    title: "Projects",
    overlayTitle: "My Work",
  },
  projectItems: [
    {
      projectsId: 0,
      title: "Admin Dashboard",
      category: "React",
      description:
        "Interactive admin dashboard with real-time charts, data tables, and user management.",
      image: "/images/dashboard.png",
      link: "https://dashboard-demo.com",
      github: "https://github.com/yourusername/admin-dashboard",
      tech: ["React", "Recharts", "Material-UI", "Firebase"],
      sortOrder: 4,
    },
    {
      projectsId: 0,
      title: "Digital Agency Website",
      category: "Next.js",
      description:
        "Modern digital agency site with animations, contact forms, and service showcases.",
      image: "/images/agency.png",
      link: "https://agency-site.com",
      github: "https://github.com/yourusername/agency-website",
      tech: ["Next.js", "Framer Motion", "Tailwind", "Sanity"],
      sortOrder: 5,
    },
    {
      projectsId: 0,
      title: "Product Landing Page",
      category: "React",
      description:
        "High-converting landing page with scroll animations, video background, and email capture.",
      image: "/images/landing.png",
      link: "https://landing-demo.com",
      github: "https://github.com/yourusername/landing-page",
      tech: ["React", "GSAP", "EmailJS", "Tailwind"],
      sortOrder: 6,
    },
    {
      projectsId: 0,
      title: "Task Management App",
      category: "React",
      description:
        "Full-featured task management application with drag-and-drop, filters, and team collaboration.",
      image: "/images/taskapp.png",
      link: "https://taskapp-demo.com",
      github: "https://github.com/yourusername/task-manager",
      tech: ["React", "DnD", "Redux", "Node.js"],
      sortOrder: 7,
    },
    {
      projectsId: 0,
      title: "Restaurant Menu System",
      category: "Next.js",
      description:
        "Digital menu system for restaurants with online ordering, table reservations, and QR code scanning.",
      image: "/images/restaurant.png",
      link: "https://restaurant-menu.com",
      github: "https://github.com/yourusername/restaurant-app",
      tech: ["Next.js", "Prisma", "PostgreSQL", "Stripe"],
      sortOrder: 8,
    },
  ],
  contact: {
    title: "Get In Touch",
    overlayTitle: "Contact",
    formTitle: "Send me a message",
    buttonText: "Send Message",
    buttonUrl: "#contact",
    infoTitle: "Contact Information",
    address: "123 Main St, San Francisco, CA 94105",
    phone: "+1 234 567 890",
    email: "john@example.com",
  },
  config: {
    apiBaseUrl: "https://api.example.com",
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "john@example.com",
    smtpPassword: "your-password-here",
    recaptchaSiteKey: "your-recaptcha-key",
  },
  headerSections: [
    { sectionId: 'hero', title: 'Welcome', sortOrder: 0 },
    { sectionId: 'about', title: 'Know me more.', sortOrder: 1 },
    { sectionId: 'experience', title: "What I've done so far!", sortOrder: 2 },
    { sectionId: 'services', title: 'I can help you with:', sortOrder: 3 },
    { sectionId: 'projects', title: 'Here is my portfolio', sortOrder: 4 },
    { sectionId: 'testimonial', title: 'What people say', sortOrder: 5 },
    { sectionId: 'contact', title: "Let's talk more", sortOrder: 6 },
  ],
  headerSettings: {
    defaultTitle: 'Welcome',
  },
  footer: {
    companyName: "Your Company",
    privacyPolicy:
      "This is your privacy policy content. You can replace this with real content explaining how you handle user data, cookies, etc.",
    termsOfService:
      "These are your terms of service. Replace this with the details of how users may use your service, restrictions, liabilities, etc.",
    copyrightText: "All rights reserved.",
  },
};

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // 1. Insert sidebar
    const [sidebar] = await db
      .insert(schema.sidebar)
      .values(seedData.sidebar)
      .returning();

    // 2. Insert social media
    await db.insert(schema.socialMedia).values(seedData.socialMedia);

    // 3. Insert general settings
    await db.insert(schema.generalSettings).values(seedData.generalSettings);

    // 4. Insert hero section
    const [hero] = await db
      .insert(schema.heroSection)
      .values(seedData.hero)
      .returning();

    // Insert hero titles with correct heroId
    await db.insert(schema.heroTitles).values(
      seedData.heroTitles.map((title) => ({
        ...title,
        heroId: hero.id,
      })),
    );

    // 5. Insert about section
    const [about] = await db
      .insert(schema.aboutSection)
      .values(seedData.about)
      .returning();

    // Insert about contact info
    await db.insert(schema.aboutContactInfo).values(
      seedData.aboutContactInfo.map((info) => ({
        ...info,
        aboutId: about.id,
      })),
    );

    // Insert about details
    await db.insert(schema.aboutDetails).values(
      seedData.aboutDetails.map((detail) => ({
        ...detail,
        aboutId: about.id,
      })),
    );

    // 6. Insert services section
    const [services] = await db
      .insert(schema.servicesSection)
      .values(seedData.services)
      .returning();

    // Insert service items
    await db.insert(schema.serviceItems).values(
      seedData.serviceItems.map((item) => ({
        ...item,
        servicesId: services.id,
      })),
    );

    // 7. Insert summary section
    const [summary] = await db
      .insert(schema.summarySection)
      .values(seedData.summary)
      .returning();

    // Insert summary jobs
    await db.insert(schema.summaryJobs).values(
      seedData.summaryJobs.map((job) => ({
        ...job,
        summaryId: summary.id,
      })),
    );

    // Insert summary experiences
    await db.insert(schema.summaryExperiences).values(
      seedData.summaryExperiences.map((exp) => ({
        ...exp,
        summaryId: summary.id,
      })),
    );

    // 8. Insert testimonials section
    const [testimonials] = await db
      .insert(schema.testimonialsSection)
      .values(seedData.testimonials)
      .returning();

    // Insert testimonial items
    await db.insert(schema.testimonialItems).values(
      seedData.testimonialItems.map((item) => ({
        ...item,
        testimonialsId: testimonials.id,
      })),
    );

    // 9. Insert projects section
    const [projects] = await db
      .insert(schema.projectsSection)
      .values(seedData.projects)
      .returning();

    // Insert project items
    await db.insert(schema.projectItems).values(
      seedData.projectItems.map((item) => ({
        ...item,
        projectsId: projects.id,
      })),
    );

    // 10. Insert contact section
    await db.insert(schema.contactSection).values(seedData.contact);

    // 10. Insert footer
    await db.insert(schema.footer).values(seedData.footer);

    // 11. Insert config
    await db.insert(schema.config).values(seedData.config);

    // 11. Insert header sections
    await db.insert(schema.headerSections).values(seedData.headerSections)

    // 12. Insert header settings
    await db.insert(schema.headerSettings).values(seedData.headerSettings)

    // 12. Insert footer section
    await db.insert(schema.footerSection).values(seedData.footer);

    console.log("✅ Database seeded successfully!");
    console.log(`📊 Inserted:`, {
      sidebar: 1,
      socialMedia: seedData.socialMedia.length,
      heroTitles: seedData.heroTitles.length,
      aboutContactInfo: seedData.aboutContactInfo.length,
      aboutDetails: seedData.aboutDetails.length,
      serviceItems: seedData.serviceItems.length,
      summaryJobs: seedData.summaryJobs.length,
      summaryExperiences: seedData.summaryExperiences.length,
      testimonialItems: seedData.testimonialItems.length,
    });
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
