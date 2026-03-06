import { Variants } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

// No filter:blur on any variant — causes expensive GPU repaints on every element
export const fadeInUp: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease },
  }),
};

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay, ease: "easeOut" },
  }),
};

export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay, ease },
  }),
};

export const slideInLeft: Variants = {
  hidden:  { opacity: 0, x: -40 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, delay, ease },
  }),
};

export const slideInRight: Variants = {
  hidden:  { opacity: 0, x: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, delay, ease },
  }),
};

export const staggerContainer: Variants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

export const skillBarFill = (width: number) => ({
  hidden:  { width: 0 },
  visible: {
    width: `${width}%`,
    transition: { duration: 1, delay: 0.3, ease },
  },
});

export const wordReveal: Variants = {
  hidden:  { opacity: 0, y: 18, rotateX: -45 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.4, delay: i * 0.04, ease },
  }),
};

export const letterReveal: Variants = {
  hidden:  { opacity: 0, y: 30, rotateX: -90 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.45, delay: i * 0.03, ease },
  }),
};
