import { RefObject } from 'react'

// Types for useHeaderAnimations hook
export interface HeaderAnimationRefs {
  containerRef: RefObject<HTMLElement | null>
  headerRef: RefObject<HTMLElement | null>
  expandRef: RefObject<HTMLElement | null>
  reloadTextRef: RefObject<HTMLElement | null>
}

// Types for useHeroAnimations hook
export interface HeroAnimationRefs {
  containerRef: RefObject<HTMLDivElement | null>
  line1Ref: RefObject<HTMLSpanElement | null>
  line2Ref: RefObject<HTMLSpanElement | null>
  line3Ref: RefObject<HTMLSpanElement | null>
  descriptionRef?: RefObject<HTMLParagraphElement | null>
}
