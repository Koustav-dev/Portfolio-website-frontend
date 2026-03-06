import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const springConfig = { stiffness: 300, damping: 28 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const addHover = () => setIsHovering(true);
    const removeHover = () => setIsHovering(false);

    window.addEventListener("mousemove", move);

    const interactives = document.querySelectorAll("a, button, [role='button'], input, textarea, [data-cursor-hover]");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    // Re-observe periodically for dynamically added elements
    const interval = setInterval(() => {
      const els = document.querySelectorAll("a, button, [role='button'], input, textarea, [data-cursor-hover]");
      els.forEach((el) => {
        el.addEventListener("mouseenter", addHover);
        el.addEventListener("mouseleave", removeHover);
      });
    }, 2000);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("resize", checkMobile);
      clearInterval(interval);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", removeHover);
      });
    };
  }, [cursorX, cursorY]);

  if (isMobile) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{ x, y }}
      >
        <motion.div
          className="rounded-full border border-foreground/30 -translate-x-1/2 -translate-y-1/2"
          animate={{
            width: isHovering ? 48 : 32,
            height: isHovering ? 48 : 32,
            opacity: isHovering ? 0.8 : 0.4,
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-foreground pointer-events-none z-[9999] mix-blend-difference -translate-x-1/2 -translate-y-1/2"
        style={{ x: cursorX, y: cursorY }}
      />
    </>
  );
};

export default CustomCursor;
