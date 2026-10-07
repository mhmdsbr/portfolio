export const PORTFOLIO_SECTIONS = [
  { key: 'hero', navigationTitle: 'Welcome', title: null, overlayTitle: null },
  { key: 'about', navigationTitle: 'Know me more.', title: 'About Me', overlayTitle: 'About' },
  { key: 'experience', navigationTitle: "What I've done so far!", title: 'Summary', overlayTitle: 'Resume' },
  { key: 'services', navigationTitle: 'I can help you with:', title: 'Services', overlayTitle: 'What I Do' },
  { key: 'projects', navigationTitle: 'Here is my portfolio', title: 'Key Projects', overlayTitle: 'My Work' },
  { key: 'testimonials', navigationTitle: 'What people say', title: 'Testimonials', overlayTitle: 'What People Say' },
  { key: 'contact', navigationTitle: "Let's talk more", title: 'Contact stuff', overlayTitle: 'Contact' },
] as const

export type PortfolioSectionKey = (typeof PORTFOLIO_SECTIONS)[number]['key']

export function isPortfolioSectionKey(value: string): value is PortfolioSectionKey {
  return PORTFOLIO_SECTIONS.some((section) => section.key === value)
}
