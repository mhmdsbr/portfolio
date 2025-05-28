import { RefObject } from 'react'

export interface BackgroundGradientMouse {
  x: number
  y: number
}

export interface BackgroundGradientStar {
  x: number
  y: number
  baseX: number
  baseY: number
  radius: number
  alpha: number
  delta: number
}

export interface HeaderAnimationRefs {
  containerRef: RefObject<HTMLElement | null>
  headerRef: RefObject<HTMLElement | null>
  expandRef: RefObject<HTMLElement | null>
  reloadTextRef: RefObject<HTMLElement | null>
}

export interface HeroAnimationRefs {
  containerRef: RefObject<HTMLDivElement | null>
  line1Ref: RefObject<HTMLSpanElement | null>
  line2Ref: RefObject<HTMLSpanElement | null>
  line3Ref: RefObject<HTMLSpanElement | null>
  descriptionRef?: RefObject<HTMLParagraphElement | null>
}