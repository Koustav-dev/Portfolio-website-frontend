import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { Code2, Palette, Zap, Globe, TrendingUp, Users, Coffee, Award } from "lucide-react";
import SectionReveal from "@/components/SectionReveal";
import { useIsMobile } from "@/hooks/use-mobile";

const skills = [
  { name: "React / Next.js", level: 95, color: "from-primary to-secondary"  },
  { name: "TypeScript",      level: 90, color: "from-secondary to-accent"    },
  { name: "UI/UX Design",    level: 88, color: "from-accent to-primary"      },
  { name: "Node.js",         level: 82, color: "from-primary to-accent"      },
  { name: "Motion Design",   level: 85, color: "from-secondary to-primary"   },
];

const cards = [
  { icon: Code2,   title: "Full-Stack",      desc: "End-to-end applications with modern architecture."            },
  { icon: Palette, title: "Design Systems",  desc: "Scalable, consistent visual language across products."       },
  { icon: Zap,     title: "Performance",     desc: "Sub-second loads, 60fps animations, A+ lighthouse."          },
  { icon: Globe,   title: "Integration",     desc: "APIs, third-party services, and cloud infrastructure."       },
];

const stats = [
  { icon: TrendingUp, value: 50,   suffix: "+", label: "Projects Delivered" },
  { icon: Users,      value: 30,   suffix: "+", label: "Happy Clients"       },
  { icon: Coffee,     value: 5000, suffix: "+", label: "Cups of Coffee"      },
  { icon: Award,      value: 12,   suffix: "",  label: "Awards Won"          },
];

// Simple static counter — no spring on mobile
const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: true });
  const isMobile = useIsMobile();
  const [display, setDisplay] = useState(0);
  const spring = useSpring(0, { stiffness: 50, damping: 20 });

  if (!isMobile) {
    if (isInView && spring.get() === 0) spring.set(value);
    spring.on("change", (v) => setDisplay(Math.round(v)));
  }

  return <span ref={ref}>{isMobile ? (isInView ? value : 0) : display}{suffix}</span>;
};

const GlowCard = ({ children, className, index }: { children: React.ReactNode; className?: string; index: number }) => {
  const ref      = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const mouseX   = useMotionValue(0);
  const mouseY   = useMotionValue(0);

  const handleMouse = (e: React.MouseEvent) => {
    if (isMobile || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      className={`relative overflow-hidden group ${className}`}
      variants={fadeInUp}
      custom={index * 0.1}
      whileHover={isMobile ? {} : { y: -6, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
    >
      {children}
    </motion.div>
  );
};

const About = () => {
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const isMobile = useIsMobile();

  return (
    <section id="about" ref={ref} className="py-28 md:py-36 section-padding relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-[1200px] mx-auto">
        <SectionReveal>
          <span className="text-[12px] text-primary tracking-[0.2em] uppercase font-medium">About</span>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-heading font-bold mt-3 tracking-tight">
            Passionate about
            <br />
            <span className="gradient-text">building the web</span>
          </h2>
        </SectionReveal>

        {/* Strength Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-16"
        >
          {cards.map(({ icon: Icon, title, desc }, i) => (
            <GlowCard key={title} index={i} className="glass-card p-5 md:p-6 cursor-default">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/0 group-hover:via-primary/30 to-transparent transition-all duration-500" />
              <div className="relative z-10">
                <motion.div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-primary/10 group-hover:bg-primary/15 transition-colors duration-300"
                  whileHover={isMobile ? {} : { rotate: 5, scale: 1.1 }}
                >
                  <Icon className="text-primary" size={18} />
                </motion.div>
                <h3 className="font-heading font-semibold text-foreground mb-1.5 text-sm">{title}</h3>
                <p className="text-[12px] md:text-[13px] text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </GlowCard>
          ))}
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
        >
          {stats.map(({ icon: Icon, value, suffix, label }, i) => (
            <motion.div
              key={label}
              className="glass-card p-5 text-center group hover:border-primary/20 transition-colors duration-300"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.08 }}
              whileHover={isMobile ? {} : { y: -3 }}
            >
              <Icon size={16} className="text-primary/60 mx-auto mb-2 group-hover:text-primary transition-colors" />
              <span className="text-2xl md:text-3xl font-heading font-bold text-foreground block">
                <AnimatedCounter value={value} suffix={suffix} />
              </span>
              <span className="text-[11px] text-muted-foreground mt-1 block tracking-wide">{label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Skills section */}
        <div className="grid lg:grid-cols-2 gap-12 mt-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-sm font-heading font-semibold text-foreground mb-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              Core Skills
            </h3>
            <div className="space-y-4">
              {skills.map(({ name, level, color }, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="group"
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-[13px] font-medium text-foreground">{name}</span>
                    <motion.span
                      className="text-[13px] text-primary font-bold font-mono"
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    >
                      {level}%
                    </motion.span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full relative overflow-hidden bg-gradient-to-r ${color}`}
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${level}%` } : {}}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {/* Shimmer — desktop only */}
                      {!isMobile && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{ duration: 2, delay: 1.5 + i * 0.2, repeat: Infinity, repeatDelay: 4 }}
                        />
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Philosophy + approach */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-sm font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary" />
              My Approach
            </h3>

            {[
              { step: "01", title: "Understand", desc: "Deep dive into goals, users, and constraints before touching code."  },
              { step: "02", title: "Design",     desc: "Prototype with intention—every pixel earns its place."               },
              { step: "03", title: "Build",      desc: "Clean, typed, tested code. Performance is a feature."                },
              { step: "04", title: "Polish",     desc: "Motion, micro-interactions, and the details that delight."           },
            ].map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                className="flex gap-4 group cursor-default"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={isMobile ? {} : { x: 4 }}
              >
                <span className="text-[11px] font-mono text-primary/50 mt-1 shrink-0">{step}</span>
                <div className="border-l border-border/50 group-hover:border-primary/30 pl-4 transition-colors duration-300">
                  <h4 className="text-sm font-semibold text-foreground mb-0.5">{title}</h4>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Philosophy quote */}
        <SectionReveal delay={0.3} className="mt-20">
          <div className="relative max-w-2xl mx-auto text-center py-10">
            <div className="absolute inset-0 glass-card rounded-2xl" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="relative z-10">
              <motion.span
                className="text-4xl text-primary/20 font-heading"
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                "
              </motion.span>
              <blockquote className="text-base md:text-lg font-heading font-medium text-foreground/80 italic leading-relaxed -mt-4 px-6">
                For me, development isn't just about features —
                it's about clarity, performance, and creating something people genuinely enjoy using.
              </blockquote>
              <p className="text-[13px] text-muted-foreground mt-4 font-medium">— Koustav Paul</p>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};

export default About;
