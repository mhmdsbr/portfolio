import "dotenv/config";
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
    profileImageAlt: "Mohammad Saber profile",
    profileTitle: "Mohammad Saber",
  },
  socialMedia: [
    {
      platform: "linkedin",
      url: "https://www.linkedin.com/in/mohammad-saber-20b9551a3/",
      sortOrder: 0,
    },
    { platform: "mail", url: "mailto:saaber.mohamad@gmail.com", sortOrder: 1 },
  ],
  generalSettings: {
    portfolioTitle: "Mohammad Saber",
    portfolioOverlayTitle: "Portfolio",
  },
  hero: {
    location: "Berlin, Germany",
    subtitleOne: "Frontend Developer",
    subtitleTwo: "JavaScript, React & CMS",
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
    name: "Mohammad Saber",
    jobTitle: "Frontend Developer",
    description:
      "Senior frontend Developer specializing in JavaScript (React, TypeScript, Next.js, NestJS) and CMS, with 5+ years of experience. Successfully delivered 30+ applications, improving performance, UX, and maintainability. Skilled in modern frontend architecture and state management, with a focus on writing clean, reusable code. Ability to convert designs into pixel-perfect UIs, enforce best practices, and drive Agile delivery. Passionate about analyzing complex problems to develop efficient solutions.",
    buttonText: "Download CV",
    buttonUrl: "/cv.pdf",
  },
  aboutContactInfo: [
    {
      aboutId: 0,
      title: "Phone",
      content: "+4917659232759",
      sortOrder: 0,
    },
    {
      aboutId: 0,
      title: "Email",
      content: "saaber.mohamad@gmail.com",
      sortOrder: 1,
    },
    {
      aboutId: 0,
      title: "Location",
      content: "Berlin, Germany",
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
      fromYear: 2025,
      toYear: "Present",
      jobTitle: "Frontend Developer",
      company: "Gymondo",
      description:
        "Maintained and optimized a large-scale production platform, shipped new features, migrated end-to-end testing from CodeceptJS to Playwright, built unit-test automation tooling, and improved UI/UX across CMS-driven frontend platforms.",
      sortOrder: 0,
    },
    {
      summaryId: 0,
      fromYear: 2025,
      toYear: "2025",
      jobTitle: "Software Developer",
      company: "Reisetopia",
      description:
        "Developed a custom object-oriented WordPress plugin to automatically insert the current month and year into post content and metadata, and modernized in-house plugins.",
      sortOrder: 1,
    },
    {
      summaryId: 0,
      fromYear: 2023,
      toYear: "2025",
      jobTitle: "Frontend Developer",
      company: "Freelancer",
      description:
        "Built a multilingual crypto exchange, contributed to a Web3 decentralized application, led frontend development for a large-scale B2B chemical platform, developed an ERC20 token app, and delivered WordPress plugins and travel-industry projects.",
      sortOrder: 2,
    },
    {
      summaryId: 0,
      fromYear: 2020,
      toYear: "2023",
      jobTitle: "Frontend Developer",
      company: "Bugloos",
      description:
        "Led frontend delivery for websites and web applications, built reusable React components, contributed Angular modules to travel platforms, automated workflows with Gulp and SCSS, and optimized legacy websites for improved performance.",
      sortOrder: 3,
    },
    {
      summaryId: 0,
      fromYear: 2019,
      toYear: "2020",
      jobTitle: "Web Developer",
      company: "TabaneShahr",
      description:
        "Maintained and updated more than 30 CMS-based websites, supported clients, led redesigns and seasonal updates for e-commerce clients, and handled responsive frontend testing and bug fixes.",
      sortOrder: 4,
    },
    {
      summaryId: 0,
      fromYear: 2015,
      toYear: "2016",
      jobTitle: "Web Developer",
      company: "Freelancer",
      description:
        "Built and delivered static websites and custom WordPress themes for local businesses and university students using JavaScript, PHP, CSS, HTML, and jQuery.",
      sortOrder: 5,
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
      imageUrl: null,
      title: "Mostafa Shaban",
      subtitle: "Bugloos",
      rating: "5 Stars",
      content:
        "Mohammad proved to be one of the most committed professionals through his work at Bugloos. He is always punctual, his knowledge is vast and thorough. Mohammad is dedicated, self-motivated, methodical, and very capable. He had vision to see the benefits and the passion to turn that into measurable results for Bugloos. Mohammad possesses a winning combination of solid tech skills and business sense, I learned a great deal from him. He learns quickly and I would have no hesitation in working with Mohammad again in the future.",
      sortOrder: 0,
    },
    {
      testimonialsId: 0,
      imageUrl: null,
      title: "Amin Khoshzahmaat",
      subtitle: "Bugloos",
      rating: "5 Stars",
      content:
        "It was wonderful to work together with Mohammad, who was an outstanding WordPress developer. Proactive, ambitious, dedicated, and broad-minded perfectionist. Mohammad provided outstanding results for Bugloos. Working at Bugloos is most challenging, and he thrived. Eager professional. No matter how complex the problem is, he will always come up with a brilliant, elegant, and cost-effective solution. He most definitely shines in a fast-paced environment. Definitely worth recommending.",
      sortOrder: 1,
    },
    {
      testimonialsId: 0,
      imageUrl: null,
      title: "Pedram Abouzari",
      subtitle: "Colleague",
      rating: "5 Stars",
      content:
        "Mohammad is a perfect skilled WordPress developer. He always knows what he wants. I have worked with him on a couple of projects. He can easily recognize the challenges and bring solutions for them. He is intelligent, and the word impossible is not defined in his character. One of the best traits I love about Mohammad is his reliability. You can count on him in any urgent and stressful situation, no matter what. It is my honor working with you, mate.",
      sortOrder: 2,
    },
    {
      testimonialsId: 0,
      imageUrl: null,
      title: "Alireza Ebrahimzadeh",
      subtitle: "Colleague",
      rating: "5 Stars",
      content:
        "He is really hardworking man and professional in his job. I'm really proud to have had the chance to work with him.",
      sortOrder: 3,
    },
    {
      testimonialsId: 0,
      imageUrl: null,
      title: "Johan Muco",
      subtitle: "Colleague",
      rating: "5 Stars",
      content:
        "I had the pleasure of working with Mohammad as a front-end developer. He combines strong technical skill with a great eye for clean, user-friendly design, and he's reliable, collaborative, and always ready to help a teammate. Any team would be lucky to have him.",
      sortOrder: 4,
    },
  ],
  projects: {
    title: "Key Projects",
    overlayTitle: "My Work",
  },
  projectItems: [
    {
      projectsId: 0,
      title: "Gymondo",
      category: "Fitness Platform",
      description: "Large-scale frontend platform with a focus on user experience, performance, and maintainability.",
      image: "/images/gymondo.png",
      link: "/projects/gymondo",
      github: "#",
      tech: ["React", "Next.js", "TypeScript", "Redux"],
      sortOrder: 0,
    },
    {
      projectsId: 0,
      title: "Qaay",
      category: "B2B Platform",
      description: "Frontend work for a business-facing platform focused on UX quality and scalable component architecture.",
      image: "/images/qaay.png",
      link: "/projects/qaay",
      github: "#",
      tech: ["React", "JavaScript", "CSS", "Tailwind"],
      sortOrder: 1,
    },
    {
      projectsId: 0,
      title: "Reisetopia",
      category: "Travel Platform",
      description: "Travel-oriented platform developed with modern frontend patterns and custom plugin integration.",
      image: "/images/reisetopia.png",
      link: "/projects/reisetopia",
      github: "#",
      tech: ["Next.js", "TypeScript", "PHP", "WordPress"],
      sortOrder: 2,
    },
    {
      projectsId: 0,
      title: "Zarban",
      category: "Web Experience",
      description: "Frontend implementation for a digital product with attention to fast delivery and polished UI.",
      image: "/images/zarban.png",
      link: "/projects/zarban",
      github: "#",
      tech: ["React", "JavaScript", "CSS", "UI Design"],
      sortOrder: 3,
    },
    {
      projectsId: 0,
      title: "CryptoInsider",
      category: "Crypto",
      description: "Multilingual crypto platform built with React, Next.js, and Tailwind featuring live market data flows.",
      image: "/images/cryptoincider.png",
      link: "/projects/cryptoincider",
      github: "#",
      tech: ["React", "Next.js", "TypeScript", "Tailwind"],
      sortOrder: 4,
    },
    {
      projectsId: 0,
      title: "Milimol",
      category: "Marketplace",
      description: "Frontend project focused on high-quality interactions, responsive design, and clean implementation.",
      image: "/images/milimol.png",
      link: "/projects/milimol",
      github: "#",
      tech: ["React", "JavaScript", "CSS", "UX"],
      sortOrder: 5,
    },
    {
      projectsId: 0,
      title: "Bugloos",
      category: "Agency Work",
      description: "Cross-functional frontend delivery for multiple web products using Agile methods and reusable components.",
      image: "/images/bugloos.png",
      link: "/projects/bugloos",
      github: "#",
      tech: ["React", "JavaScript", "Webpack", "Gulp"],
      sortOrder: 6,
    },
    {
      projectsId: 0,
      title: "Urbansofa",
      category: "E-commerce",
      description: "Frontend work for a commercial web experience with optimized structure, content, and performance.",
      image: "/images/urbansofa.png",
      link: "/projects/urbansofa",
      github: "#",
      tech: ["HTML", "CSS", "JavaScript", "WordPress"],
      sortOrder: 7,
    },
    {
      projectsId: 0,
      title: "Birad",
      category: "Brand Platform",
      description: "Responsive marketing and business website refined for cleaner UI and better user engagement.",
      image: "/images/birad.png",
      link: "/projects/birad",
      github: "#",
      tech: ["JavaScript", "jQuery", "CSS", "HTML"],
      sortOrder: 8,
    },
    {
      projectsId: 0,
      title: "SamSkip",
      category: "Logistics / Services",
      description: "Frontend build for a service-driven business site with clear information architecture and UX improvements.",
      image: "/images/samskip.png",
      link: "/projects/samskip",
      github: "#",
      tech: ["Angular", "JavaScript", "HTML", "CSS"],
      sortOrder: 9,
    },
    {
      projectsId: 0,
      title: "Control Union",
      category: "B2B Website",
      description: "Multilingual B2B frontend project built to meet business needs with strong responsiveness and maintainability.",
      image: "/images/controlunion.png",
      link: "/projects/controlunion",
      github: "#",
      tech: ["Angular", "JavaScript", "jQuery", "CSS"],
      sortOrder: 10,
    },
    {
      projectsId: 0,
      title: "Janrutgersad",
      category: "Business Website",
      description: "Legacy redesign and frontend optimization work based on updated design systems and content requirements.",
      image: "/images/janrutgersad.png",
      link: "/projects/janrutgersad",
      github: "#",
      tech: ["HTML", "CSS", "JavaScript", "Bootstrap"],
      sortOrder: 11,
    },
    {
      projectsId: 0,
      title: "Yasmine Asha",
      category: "Brand Website",
      description: "Frontend redesign focused on modern styling, responsiveness, and improved storytelling.",
      image: "/images/yasmineasha.png",
      link: "/projects/yasmine-asha",
      github: "#",
      tech: ["HTML", "CSS", "JavaScript", "jQuery"],
      sortOrder: 12,
    },
    {
      projectsId: 0,
      title: "Watchino",
      category: "E-commerce",
      description: "Frontend support and enhancements for a consumer-facing product website with responsive UI updates.",
      image: "/images/watchino.png",
      link: "/projects/watchino",
      github: "#",
      tech: ["WordPress", "JavaScript", "CSS", "HTML"],
      sortOrder: 13,
    },
    {
      projectsId: 0,
      title: "Erc20 App",
      category: "Web3",
      description: "Open-source Next.js app for minting and transferring ERC20 tokens on the Ethereum Goerli test network.",
      image: "/images/erc20-app.png",
      link: "/projects/erc20-app",
      github: "#",
      tech: ["Next.js", "TypeScript", "Ethereum", "Wagmi"],
      sortOrder: 14,
    },
    {
      projectsId: 0,
      title: "Freedom Stocks",
      category: "Finance",
      description: "Frontend work on a stock and finance platform, combining performance, dashboards, and user-focused UX.",
      image: "/images/freedom-stocks.png",
      link: "/projects/freedom-stocks",
      github: "#",
      tech: ["React", "TypeScript", "Redux", "Tailwind"],
      sortOrder: 15,
    },
  ],
  contact: {
    title: "Get In Touch",
    overlayTitle: "Contact",
    formTitle: "Send me a message",
    buttonText: "Send Message",
    buttonUrl: "#contact",
    infoTitle: "Contact Information",
    address: "Berlin, Germany",
    phone: "+4917659232759",
    email: "saaber.mohamad@gmail.com",
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
