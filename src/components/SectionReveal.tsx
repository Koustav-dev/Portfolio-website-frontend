import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface SectionRevealProps {
  children:   ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
  delay?:     number;
}

const SectionReveal = ({ children, className = "", direction = "up", delay = 0 }: SectionRevealProps) => {
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const directionMap = {
    up:    { y: 40, x: 0 },
    left:  { y: 0,  x: -40 },
    right: { y: 0,  x: 40 },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        y: directionMap[direction].y,
        x: directionMap[direction].x,
        // No filter:blur here — too expensive at section level
      }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default SectionReveal;
