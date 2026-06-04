import type { Variants } from "framer-motion"

export const spring = {
  snappy: { type: "spring" as const, stiffness: 400, damping: 30 },
  smooth: { type: "spring" as const, stiffness: 200, damping: 25 },
  gentle: { type: "spring" as const, stiffness: 100, damping: 20 },
  bounce: { type: "spring" as const, stiffness: 300, damping: 15 },
}

export const ease = {
  out: [0.16, 1, 0.3, 1] as const,
  in: [0.7, 0, 0.84, 0] as const,
  inOut: [0.87, 0, 0.13, 1] as const,
  apple: [0.25, 0.46, 0.45, 0.94] as const,
}

export const duration = {
  instant: 0.15,
  fast: 0.3,
  normal: 0.5,
  slow: 0.8,
  scene: 1.2,
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: i * 0.1, duration: duration.normal, ease: ease.out },
  }),
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { delay: i * 0.08, duration: duration.normal },
  }),
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, ...spring.smooth },
  }),
}
