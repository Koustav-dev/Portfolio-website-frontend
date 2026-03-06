import { motion, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useRef, useCallback, useState, useEffect } from "react";
import { ArrowDown, ArrowRight, Sparkles, Code2, Layers, Cpu, Database, Globe, Palette } from "lucide-react";
import HeroCanvas from "./HeroCanvas";
import { useIsMobile } from "@/hooks/use-mobile";

const roles = ["Digital Experiences", "Modern Interfaces", "Scalable Systems", "Thoughtful Products"];

const SplitText = ({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) => {
  const chars = text.split("");
  return (
    <span className={className}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: delay + i * 0.025, ease: [0.22, 1, 0.36, 1] }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};

const MagneticButton = ({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => {
  const ref     = useRef<HTMLButtonElement>(null);
  const isMobile = useIsMobile();
  const x       = useMotionValue(0);
  const y       = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouse = (e: React.MouseEvent) => {
    if (isMobile || !ref.current) return;
    const rect    = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width  / 2;
    const centerY = rect.top  + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  };

  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref}
      style={isMobile ? {} : { x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={onClick}
      className={className}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.button>
  );
};

// Only rendered on desktop
const FloatingOrb = ({ size, x, y, delay, color }: { size: number; x: string; y: string; delay: number; color: string }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none blur-[80px]"
    style={{ width: size, height: size, left: x, top: y, background: color, opacity: 0 }}
    animate={{
      opacity: [0, 0.12, 0.06, 0.12, 0],
      scale:   [0.8, 1.2, 0.9, 1.1, 0.8],
      x:       [0, 30, -20, 15, 0],
      y:       [0, -20, 15, -10, 0],
    }}
    transition={{ duration: 12, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

const FloatingTechIcon = ({ icon: Icon, delay, orbit, speed, size = 20 }: { icon: any; delay: number; orbit: number; speed: number; size?: number }) => (
  <motion.div
    className="absolute top-1/2 left-1/2 glass-card p-2.5 rounded-xl shadow-lg"
    style={{ width: size + 20, height: size + 20 }}
    animate={{
      x: [Math.cos(delay) * orbit, Math.cos(delay + Math.PI) * orbit, Math.cos(delay + Math.PI * 2) * orbit],
      y: [Math.sin(delay) * orbit, Math.sin(delay + Math.PI) * orbit, Math.sin(delay + Math.PI * 2) * orbit],
      rotate: [0, 10, -10, 0],
    }}
    transition={{ duration: speed, repeat: Infinity, ease: "easeInOut" }}
    whileHover={{ scale: 1.3, zIndex: 50 }}
  >
    <Icon size={size} className="text-primary" />
  </motion.div>
);

const Hero = () => {
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: true });
  const isMobile = useIsMobile();
  const [roleIndex, setRoleIndex] = useState(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isMobile) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    mouseX.set((e.clientX - rect.left - rect.width  / 2) * 0.02);
    mouseY.set((e.clientY - rect.top  - rect.height / 2) * 0.02);
  }, [mouseX, mouseY, isMobile]);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const scrollToProjects = useCallback(() => {
    document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const scrollToContact = useCallback(() => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex items-center section-padding overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Canvas only on desktop */}
      {!isMobile && <HeroCanvas />}

      {/* Floating orbs — desktop only */}
      {!isMobile && (
        <>
          <FloatingOrb size={600} x="10%" y="20%" delay={0} color="hsl(var(--primary) / 0.15)" />
          <FloatingOrb size={400} x="60%" y="50%" delay={2} color="hsl(var(--secondary) / 0.1)" />
          <FloatingOrb size={300} x="80%" y="10%" delay={4} color="hsl(var(--accent) / 0.08)" />
        </>
      )}

      {/* Mobile: simple static gradient bg */}
      {isMobile && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 0%, hsl(var(--primary) / 0.08), transparent 70%)",
          }}
        />
      )}

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground) / 0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto w-full grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center pt-20">
        {/* Left */}
        <div className="relative z-20">
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-8"
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[12px] font-medium text-muted-foreground tracking-wide">Available for work</span>
            <Sparkles size={12} className="text-primary/60" />
          </motion.div>

          <motion.h1 className="text-[clamp(2.8rem,7vw,5.5rem)] font-heading font-bold leading-[0.95] tracking-[-0.03em] mb-4">
            {isInView && <SplitText text="I craft" delay={0.2} />}
            <br />
            <span className="relative block mt-2" style={{ minHeight: "1.2em" }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={roleIndex}
                  className="gradient-text-animated block"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0,  opacity: 1 }}
                  exit={{   y: -50, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  {roles[roleIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          {/* Animated line accent */}
          <motion.div
            className="h-[2px] rounded-full mb-6 origin-left"
            style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)), transparent)" }}
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-base md:text-lg text-muted-foreground max-w-lg mb-10 leading-relaxed"
          >
            A calm, detail-oriented engineer building thoughtful digital products
            that balance <span className="text-foreground font-medium">aesthetics</span> with <span className="text-foreground font-medium">performance</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-4"
          >
            <MagneticButton
              className="btn-primary flex items-center gap-2.5 group relative overflow-hidden"
              onClick={scrollToProjects}
            >
              <span className="relative z-10 flex items-center gap-2">
                View My Work
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight size={15} />
                </motion.span>
              </span>
              {/* Hover fill — desktop only */}
              {!isMobile && (
                <motion.div
                  className="absolute inset-0 bg-secondary"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </MagneticButton>

            <MagneticButton
              className="btn-outline group relative overflow-hidden"
              onClick={scrollToContact}
            >
              <span className="relative z-10">Get In Touch</span>
              {!isMobile && (
                <motion.div
                  className="absolute inset-0 bg-muted/50"
                  initial={{ y: "100%" }}
                  whileHover={{ y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </MagneticButton>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex gap-8 mt-12 pt-8 border-t border-border/30"
          >
            {[
              { value: "5+",  label: "Years Exp"  },
              { value: "50+", label: "Projects"   },
              { value: "30+", label: "Clients"    },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1 + i * 0.1 }}
              >
                <span className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                  {stat.value}
                </span>
                <p className="text-[11px] text-muted-foreground mt-1 tracking-wide uppercase">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right — Interactive Tech Globe — desktop only */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex justify-center items-center"
          style={{ x: springX, y: springY }}
        >
          <div className="relative w-[460px] h-[460px]">
            {/* Outer glow ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: "conic-gradient(from 0deg, hsl(var(--primary) / 0.15), hsl(var(--secondary) / 0.1), hsl(var(--accent) / 0.08), hsl(var(--primary) / 0.15))",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-[1px] rounded-full bg-background" />

            {/* Inner gradient sphere */}
            <motion.div
              className="absolute inset-8 rounded-full overflow-hidden"
              style={{
                background: "radial-gradient(circle at 30% 30%, hsl(var(--primary) / 0.08), hsl(var(--secondary) / 0.04), transparent 70%)",
              }}
            >
              <div className="absolute inset-0 rounded-full opacity-[0.06]"
                style={{
                  backgroundImage: `
                    linear-gradient(0deg, hsl(var(--primary)) 1px, transparent 1px),
                    linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
                  `,
                  backgroundSize: "40px 40px",
                  maskImage: "radial-gradient(circle, black 60%, transparent 70%)",
                  WebkitMaskImage: "radial-gradient(circle, black 60%, transparent 70%)",
                }}
              />
            </motion.div>

            {/* Rotating border rings */}
            <motion.div
              className="absolute inset-6 rounded-full border border-primary/10"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-12 rounded-full border border-dashed border-secondary/8"
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />

            {/* Floating tech icons */}
            <FloatingTechIcon icon={Code2}    delay={0}    orbit={175} speed={14} size={18} />
            <FloatingTechIcon icon={Layers}   delay={1.05} orbit={170} speed={16} size={16} />
            <FloatingTechIcon icon={Cpu}      delay={2.1}  orbit={180} speed={12} size={18} />
            <FloatingTechIcon icon={Database} delay={3.15} orbit={165} speed={15} size={16} />
            <FloatingTechIcon icon={Globe}    delay={4.2}  orbit={175} speed={13} size={17} />
            <FloatingTechIcon icon={Palette}  delay={5.25} orbit={170} speed={17} size={16} />

            {/* Code snippet card */}
            <motion.div
              className="absolute top-[22%] left-[15%] glass-card rounded-xl p-3 w-[140px] shadow-lg"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.08 }}
            >
              <div className="flex gap-1 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive/60" />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                <div className="w-1.5 h-1.5 rounded-full bg-secondary/60" />
              </div>
              <div className="font-mono text-[9px] space-y-0.5 text-muted-foreground">
                <div><span className="text-primary/80">const</span> <span className="text-secondary">build</span> =</div>
                <div className="pl-2"><span className="text-accent/80">async</span> () {"=>"} {"{"}</div>
                <div className="pl-4 text-foreground/50">// magic ✨</div>
                <div className="pl-2">{"}"}</div>
              </div>
            </motion.div>

            {/* Design card */}
            <motion.div
              className="absolute bottom-[20%] right-[12%] glass-card rounded-xl p-3 w-[130px] shadow-lg"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 6, delay: 1.5, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.08 }}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-3 h-3 rounded bg-gradient-to-br from-primary to-secondary" />
                <span className="text-[9px] font-medium text-foreground/70">Design System</span>
              </div>
              <div className="flex gap-1">
                <div className="w-5 h-5 rounded bg-primary/20" />
                <div className="w-5 h-5 rounded bg-secondary/20" />
                <div className="w-5 h-5 rounded bg-accent/20" />
                <div className="w-5 h-5 rounded bg-muted" />
              </div>
              <div className="mt-1.5 flex gap-0.5">
                <div className="h-1 flex-1 rounded-full bg-primary/30" />
                <div className="h-1 flex-1 rounded-full bg-secondary/30" />
              </div>
            </motion.div>

            {/* Performance card */}
            <motion.div
              className="absolute top-[55%] left-[8%] glass-card rounded-xl p-3 w-[110px] shadow-lg"
              animate={{ y: [0, -5, 0], x: [0, 3, 0] }}
              transition={{ duration: 7, delay: 0.8, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.08 }}
            >
              <span className="text-[9px] font-medium text-muted-foreground block mb-1.5">Performance</span>
              <div className="flex items-end gap-0.5 h-6">
                {[60, 80, 45, 90, 70, 95, 85].map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-primary/40 to-secondary/40"
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 1.5 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                ))}
              </div>
              <div className="text-[10px] font-bold text-primary mt-1">98/100</div>
            </motion.div>

            {/* Central emblem */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-2xl flex items-center justify-center glass-card shadow-xl"
              animate={{ rotate: [0, 5, 0, -5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-3xl font-heading font-bold gradient-text">E</span>
            </motion.div>

            {/* Orbiting dots */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  top: "50%",
                  left: "50%",
                  background: `hsl(var(--primary) / ${0.3 + i * 0.1})`,
                  boxShadow: `0 0 6px hsl(var(--primary) / 0.3)`,
                }}
                animate={{
                  x: [Math.cos((i * Math.PI) / 3) * 190, Math.cos((i * Math.PI) / 3 + Math.PI) * 190],
                  y: [Math.sin((i * Math.PI) / 3) * 190, Math.sin((i * Math.PI) / 3 + Math.PI) * 190],
                }}
                transition={{ duration: 10 + i * 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div className="w-5 h-8 rounded-full border border-muted-foreground/30 flex items-start justify-center p-1">
          <motion.div
            className="w-1 h-2 rounded-full bg-primary/60"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
      </motion.div>
    </section>
  );
};

export default Hero;
