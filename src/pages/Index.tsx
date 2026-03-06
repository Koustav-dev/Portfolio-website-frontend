import { useEffect, lazy, Suspense } from "react";
import Lenis from "lenis";
import Navbar from "@/components/Navbar/Navbar";
import Hero   from "@/components/Hero/Hero";
import ScrollProgress from "@/components/ScrollProgress";
import CustomCursor   from "@/components/CustomCursor";
import { useTheme }   from "@/hooks/useTheme";
import { useIsMobile } from "@/hooks/use-mobile";

// Lazy-load below-fold sections so only Hero renders on initial paint
const About      = lazy(() => import("@/components/About/About"));
const Projects   = lazy(() => import("@/components/Projects/Projects"));
const Experience = lazy(() => import("@/components/Experience/Experience"));
const Contact    = lazy(() => import("@/components/Contact/Contact"));
const Footer     = lazy(() => import("@/components/Footer/Footer"));

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();

  // Lenis smooth scroll — desktop only (mobile has native momentum scroll)
  useEffect(() => {
    if (isMobile) return;

    const lenis = new Lenis({
      duration:    1.2,
      easing:      (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [isMobile]);

  return (
    <div className="min-h-screen grain-overlay">
      <CustomCursor />
      <ScrollProgress />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Hero />
      <Suspense fallback={null}>
        <About />
        <Projects />
        <Experience />
        <Contact />
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
