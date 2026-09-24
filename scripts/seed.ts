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
      category: "Fitness",
      description: "Online fitness platform offering guided workouts, recipes, and nutrition tools for exercising at home.",
      roles: ["Maintained and optimized a large-scale production platform", "Delivered new frontend features across CMS-driven experiences", "Improved UI quality, performance, and maintainability"],
      link: "https://www.gymondo.com/",
      github: null,
      tech: ["React", "Next.js", "TypeScript", "Redux"],
      sortOrder: 0,
    },
    {
      projectsId: 0,
      title: "Qaay",
      category: "Crypto",
      description: "Crypto platform focused on crypto-backed financial products, liquidity, and Qaay Prism and Oracle services.",
      roles: ["Built responsive interfaces for crypto products", "Translated product requirements into reusable frontend components", "Improved usability across business-facing platform flows"],
      link: "https://qaay.com/en/home",
      github: null,
      tech: ["React", "JavaScript", "CSS", "Tailwind"],
      sortOrder: 1,
    },
    {
      projectsId: 0,
      title: "Reisetopia",
      category: "Travel",
      description: "German platform covering luxury travel, finance, miles, and points, with a WordPress-based editorial experience.",
      roles: ["Developed and modernized custom WordPress plugins", "Implemented dynamic date and metadata features for editorial content", "Maintained frontend integrations for the travel platform"],
      link: "https://reisetopia.de/",
      github: null,
      tech: ["Next.js", "TypeScript", "PHP", "WordPress"],
      sortOrder: 2,
    },
    {
      projectsId: 0,
      title: "Zarban",
      category: "Crypto",
      description: "Persian crypto lending platform that provides loans backed by cryptocurrency collateral.",
      roles: ["Implemented frontend views for crypto-backed lending flows", "Built responsive UI components for financial product information", "Improved the visual consistency and usability of the platform"],
      link: "https://zarban.io/",
      github: null,
      tech: ["Next.js", "React", "JavaScript", "CSS"],
      sortOrder: 3,
    },
    {
      projectsId: 0,
      title: "CryptoInsider",
      category: "Crypto",
      description: "Multilingual crypto platform built with React, Next.js, and Tailwind featuring live market data flows.",
      roles: ["Built multilingual crypto platform interfaces", "Implemented responsive React and Next.js components", "Connected frontend views to live market data flows"],
      link: null,
      github: null,
      tech: ["React", "Next.js", "TypeScript", "Tailwind"],
      sortOrder: 4,
    },
    {
      projectsId: 0,
      title: "Milimol",
      category: "B2B Marketplace",
      description: "Chemical marketplace for discovering and trading chemical products, including sodium and related materials.",
      roles: ["Developed frontend experiences for a chemical marketplace", "Built responsive product and marketplace interfaces", "Collaborated on reusable UI patterns and interaction quality"],
      link: "https://milimol.com/",
      github: null,
      tech: ["PHP", "JavaScript", "CSS", "UX"],
      sortOrder: 5,
    },
    {
      projectsId: 0,
      title: "Bugloos",
      category: "Business",
      description: "Software development, IT outsourcing, and consultation company website built around business technology services.",
      roles: ["Led frontend delivery for client websites and web applications", "Built reusable React components and shared UI patterns", "Improved performance and maintainability across multiple products"],
      link: "https://bugloos.com/",
      github: null,
      tech: ["WordPress", "Elementor", "JavaScript", "CSS"],
      sortOrder: 6,
    },
    {
      projectsId: 0,
      title: "Urbansofa",
      category: "E-commerce",
      description: "Frontend work for a commercial web experience with optimized structure, content, and performance.",
      roles: ["Implemented responsive e-commerce page layouts", "Improved content structure and frontend performance", "Delivered polished interfaces for commercial user journeys"],
      link: null,
      github: null,
      tech: ["HTML", "CSS", "JavaScript", "WordPress"],
      sortOrder: 7,
    },
    {
      projectsId: 0,
      title: "Birad",
      category: "Business",
      description: "Responsive marketing and business website refined for cleaner UI and better user engagement.",
      roles: ["Implemented responsive marketing pages", "Refined visual presentation and interaction details", "Improved usability across business-focused content"],
      link: null,
      github: null,
      tech: ["JavaScript", "jQuery", "CSS", "HTML"],
      sortOrder: 8,
    },
    {
      projectsId: 0,
      title: "SamSkip",
      category: "Business",
      description: "Global multimodal transportation company offering logistics and freight solutions across multiple transport modes.",
      roles: ["Built frontend interfaces for a logistics services website", "Improved information architecture and responsive behavior", "Implemented clear service-focused user journeys"],
      link: "https://www.samskip.com/",
      github: null,
      tech: ["WordPress", "WPML", "JavaScript", "CSS"],
      sortOrder: 9,
    },
    {
      projectsId: 0,
      title: "Control Union",
      category: "Business",
      description: "Global testing, inspection, and certification company serving businesses across a range of industries.",
      roles: ["Developed multilingual B2B website interfaces", "Implemented responsive business content layouts", "Improved maintainability across localized frontend experiences"],
      link: "https://www.controlunion.com/",
      github: null,
      tech: ["WordPress", "WPML", "JavaScript", "CSS"],
      sortOrder: 10,
    },
    {
      projectsId: 0,
      title: "Janrutgersad",
      category: "Business",
      description: "Legacy redesign and frontend optimization work based on updated design systems and content requirements.",
      roles: ["Redesigned legacy website pages", "Converted updated designs into responsive frontend layouts", "Optimized existing markup, styles, and content presentation"],
      link: null,
      github: null,
      tech: ["HTML", "CSS", "JavaScript", "Bootstrap"],
      sortOrder: 11,
    },
    {
      projectsId: 0,
      title: "Yasmine Asha",
      category: "Business",
      description: "Portfolio website for Yasmine Asha, a filmmaker and photographer.",
      roles: ["Implemented a visual portfolio experience for creative work", "Built responsive media and content layouts", "Refined storytelling through typography, spacing, and navigation"],
      link: "https://yasmineasha.com/",
      github: null,
      tech: ["WordPress", "Divi", "JavaScript", "CSS"],
      sortOrder: 12,
    },
    {
      projectsId: 0,
      title: "Watchino",
      category: "E-commerce",
      description: "Frontend support and enhancements for a consumer-facing product website with responsive UI updates.",
      roles: ["Supported frontend updates for a consumer-facing website", "Implemented responsive UI improvements", "Fixed presentation and cross-device usability issues"],
      link: null,
      github: null,
      tech: ["WordPress", "JavaScript", "CSS", "HTML"],
      sortOrder: 13,
    },
    {
      projectsId: 0,
      title: "Erc20 App",
      category: "Crypto",
      description: "Open-source Next.js app for minting and transferring ERC20 tokens on the Ethereum Goerli test network.",
      roles: ["Built a Next.js interface for minting and transferring ERC20 tokens", "Integrated Ethereum wallet and contract interactions", "Created clear transaction states for Web3 users"],
      link: "https://erc20.app/",
      github: null,
      tech: ["Next.js", "TypeScript", "Ethereum", "Wagmi"],
      sortOrder: 14,
    },
    {
      projectsId: 0,
      title: "Freedom Stocks",
      category: "Business",
      description: "Stock and finance platform presenting investment research and high-growth market opportunities.",
      roles: ["Developed frontend views for a stock and finance platform", "Built responsive dashboard and content interfaces", "Improved performance and usability across investment-focused flows"],
      link: "https://freedomstocks.com/",
      github: null,
      tech: ["WordPress", "Elementor", "JavaScript", "CSS"],
      sortOrder: 15,
    },
  ],
  contact: {
    title: "Contact stuff",
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
    companyName: "Mohammad Saber",
    privacyPolicy:
      "<h1 class=\"mb-2 font-bold\">Privacy Policy</h1><p class=\"mb-6\"><em>Last updated: September 24, 2026</em></p><p class=\"mb-6\">This policy applies to the Mohammad Saber Portfolio (\"the Site\"), a personal portfolio maintained by Mohammad Saber (\"I\", \"me\"). This Site is open source; its code is available at <a href=\"https://github.com/mhmdsbr/portfolio\">https://github.com/mhmdsbr/portfolio</a>.</p><h2 class=\"mt-8 mb-3 font-bold\">1. What I Collect</h2><p class=\"mb-3\">This Site is a personal portfolio and does not require you to create an account or submit personal information to browse it. Depending on how the Site is built, the following may apply:</p><ul class=\"mb-6 space-y-2 pl-6 list-disc\"><li><strong>Analytics (if enabled):</strong> I may use a privacy-friendly analytics tool (e.g., Plausible, Fathom, or similar) or standard analytics (e.g., Google Analytics) to see aggregate traffic like page views, referring sites, browser type, and approximate location (country/city level).</li><li><strong>Contact forms / email links:</strong> If the Site has a contact form or email link, any information you send me (name, email, message) is used only to respond to you.</li><li><strong>Cookies:</strong> The Site may use minimal cookies for basic functionality (e.g., theme preference) or analytics, as noted above.</li><li><strong>Hosting logs:</strong> My hosting provider (e.g., GitHub Pages, Vercel, Netlify) may automatically log standard technical data such as IP address, browser type, and request timestamps, as part of normal server operation. I don't access this data for any purpose beyond troubleshooting.</li></ul><h2 class=\"mt-8 mb-3 font-bold\">2. What I Don't Do</h2><ul class=\"mb-6 space-y-2 pl-6 list-disc\"><li>I don't sell your data.</li><li>I don't share your data with third parties except service providers necessary to run the Site (e.g., hosting or analytics providers), who process it under their own privacy policies.</li><li>I don't use your data for advertising.</li></ul><h2 class=\"mt-8 mb-3 font-bold\">3. Third-Party Links</h2><p class=\"mb-6\">The Site may link to external sites (GitHub, LinkedIn, other projects). I'm not responsible for the privacy practices of those sites &mdash; check their own policies.</p><h2 class=\"mt-8 mb-3 font-bold\">4. Your Rights</h2><p class=\"mb-3\">You can:</p><ul class=\"mb-6 space-y-2 pl-6 list-disc\"><li>Ask what data I hold about you (if any) by contacting me at saaber.mohamad@gmail.com.</li><li>Ask me to delete any personal data you've sent me (e.g., via a contact form).</li><li>Disable cookies/analytics in your browser at any time.</li></ul><h2 class=\"mt-8 mb-3 font-bold\">5. Changes</h2><p class=\"mb-6\">I may update this policy occasionally. The \"Last updated\" date at the top will reflect the most recent change.</p><h2 class=\"mt-8 mb-3 font-bold\">6. Contact</h2><p class=\"mb-6\">Questions about this policy? Email me at <a href=\"mailto:saaber.mohamad@gmail.com\">saaber.mohamad@gmail.com</a>.</p><hr class=\"my-8\"><p class=\"text-sm\"><em>This is a simple, general-purpose template and not legal advice. If your portfolio collects significant personal data, handles payments, or you have specific legal concerns (e.g., GDPR/CCPA compliance), consider having it reviewed by a lawyer.</em></p>",
    termsOfService:
      "<h1 class=\"mb-2 font-bold\">Terms of Service</h1><p class=\"mb-6\"><em>Last updated: September 24, 2026</em></p><p class=\"mb-6\">These terms apply to the Mohammad Saber Portfolio (\"the Site\"), a personal portfolio maintained by Mohammad Saber (\"I\", \"me\"). This Site is open source; its code is available at <a href=\"https://github.com/mhmdsbr/portfolio\">https://github.com/mhmdsbr/portfolio</a>.</p><h2 class=\"mt-8 mb-3 font-bold\">1. Overview</h2><p class=\"mb-6\">By using this Site, you agree to these terms. If you don't agree, please don't use the Site.</p><h2 class=\"mt-8 mb-3 font-bold\">2. Content</h2><ul class=\"mb-6 space-y-2 pl-6 list-disc\"><li>All original content (writing, design, project descriptions) on this Site is mine unless otherwise noted, and is provided for informational purposes about my work and background.</li><li>Code hosted in linked repositories is open source and licensed separately under the license specified in each repository (see the relevant <code>LICENSE</code> file). These Terms of Service do <strong>not</strong> override the open source license terms of any code.</li></ul><h2 class=\"mt-8 mb-3 font-bold\">3. Acceptable Use</h2><p class=\"mb-3\">You agree not to:</p><ul class=\"mb-6 space-y-2 pl-6 list-disc\"><li>Use the Site to distribute malware, spam, or harmful content.</li><li>Attempt to gain unauthorized access to the Site or its underlying infrastructure.</li><li>Scrape or reproduce the Site's content at scale without permission (excluding code covered by an open source license).</li></ul><h2 class=\"mt-8 mb-3 font-bold\">4. No Warranty</h2><p class=\"mb-6\">This Site and any linked open source projects are provided \"as is,\" without warranty of any kind, express or implied. I make no guarantees about uptime, accuracy, or fitness for a particular purpose.</p><h2 class=\"mt-8 mb-3 font-bold\">5. Limitation of Liability</h2><p class=\"mb-6\">To the fullest extent permitted by law, I am not liable for any damages arising from your use of, or inability to use, this Site or any linked/open source projects.</p><h2 class=\"mt-8 mb-3 font-bold\">6. Open Source Disclaimer</h2><p class=\"mb-6\">Projects linked from or showcased on this Site may be experimental, unmaintained, or provided purely for demonstration purposes. Use any code at your own risk and review the applicable license before using it in your own work.</p><h2 class=\"mt-8 mb-3 font-bold\">7. Changes to These Terms</h2><p class=\"mb-6\">I may update these terms from time to time. Continued use of the Site after changes means you accept the updated terms.</p><h2 class=\"mt-8 mb-3 font-bold\">8. Governing Law</h2><p class=\"mb-6\">These terms are governed by the laws of Germany, without regard to conflict of law principles.</p><h2 class=\"mt-8 mb-3 font-bold\">9. Contact</h2><p class=\"mb-6\">Questions about these terms? Email me at <a href=\"mailto:saaber.mohamad@gmail.com\">saaber.mohamad@gmail.com</a>.</p><hr class=\"my-8\"><p class=\"text-sm\"><em>This is a simple, general-purpose template and not legal advice. If your portfolio collects significant personal data, handles payments, or you have specific legal concerns (e.g., GDPR/CCPA compliance), consider having it reviewed by a lawyer.</em></p>",
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
