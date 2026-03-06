import { motion, useScroll, useSpring } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const isMobile = useIsMobile();

  // On mobile use direct scroll value — no spring, saves a motion value subscription
  const scaleX = useSpring(scrollYProgress, {
    stiffness: isMobile ? 200 : 100,
    damping:   isMobile ? 40  : 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--accent)))",
      }}
    />
  );
};

export default ScrollProgress;
