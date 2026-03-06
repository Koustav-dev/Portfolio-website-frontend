import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import SectionReveal from "@/components/SectionReveal";
import { api } from "@/lib/api";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Experience {
  id:          string;
  company:     string;
  role:        string;
  description: string;
  startDate:   string;
  endDate:     string | null;
  techUsed:    string[];
  companyLogo: string | null;
  order:       number;
}

const formatPeriod = (startDate: string, endDate: string | null): string => {
  const start = new Date(startDate).getFullYear();
  const end   = endDate ? new Date(endDate).getFullYear() : "Present";
  return `${start} — ${end}`;
};

const SkeletonItem = () => (
  <div className="relative pl-10 animate-pulse">
    <div className="absolute left-0 top-6 w-[15px] h-[15px] rounded-full bg-muted/40" />
    <div className="glass-card p-6 md:p-7">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
        <div className="space-y-2">
          <div className="h-4 w-48 rounded-lg bg-muted/40" />
          <div className="h-3 w-28 rounded-md bg-muted/30" />
        </div>
        <div className="h-6 w-24 rounded-full bg-muted/30" />
      </div>
      <div className="space-y-1.5 mb-3">
        <div className="h-3 w-full rounded bg-muted/25" />
        <div className="h-3 w-4/5 rounded bg-muted/25" />
      </div>
      <div className="flex gap-2">
        <div className="h-5 w-14 rounded-md bg-muted/25" />
        <div className="h-5 w-16 rounded-md bg-muted/25" />
        <div className="h-5 w-10 rounded-md bg-muted/25" />
      </div>
    </div>
  </div>
);

const Experience = () => {
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const isMobile = useIsMobile();

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [hoveredIdx,  setHoveredIdx]  = useState<number | null>(null);

  const fetchExperience = async () => {
    setLoading(true); setError(null);
    try {
      const data = await api.getExperience();
      setExperiences(data as Experience[]);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExperience(); }, []);

  return (
    <section id="experience" ref={ref} className="py-28 md:py-36 section-padding relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-[1200px] mx-auto">
        <SectionReveal>
          <span className="text-[12px] text-primary tracking-[0.2em] uppercase font-medium">Experience</span>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-heading font-bold mt-3 tracking-tight">
            Where I've <span className="gradient-text">worked</span>
          </h2>
        </SectionReveal>

        {loading && (
          <div className="relative mt-16">
            <div className="flex items-center gap-2 mb-8 text-muted-foreground/60">
              <Loader2 size={14} className="animate-spin" />
              <span className="text-[13px] font-mono">Fetching experience...</span>
            </div>
            <div className="space-y-6">{[1, 2, 3].map((i) => <SkeletonItem key={i} />)}</div>
          </div>
        )}

        {error && !loading && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            className="mt-16 flex flex-col items-center gap-4 py-20 text-center">
            <div className="w-12 h-12 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
              <AlertCircle size={20} className="text-destructive" />
            </div>
            <p className="text-[14px] text-muted-foreground max-w-xs">{error}</p>
            <motion.button onClick={fetchExperience} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-medium bg-muted/40 hover:bg-muted/70 border border-border/40 text-foreground transition-all">
              <RefreshCw size={13} /> Try again
            </motion.button>
          </motion.div>
        )}

        {!loading && !error && experiences.length > 0 && (
          <motion.div
            initial="hidden" animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            className="relative mt-16"
          >
            {/* Timeline line */}
            <motion.div
              className="absolute left-[7px] top-2 bottom-2 w-px"
              style={{ background: "linear-gradient(to bottom, hsl(var(--primary) / 0.3), hsl(var(--border)), hsl(var(--primary) / 0.3))" }}
              initial={{ scaleY: 0, transformOrigin: "top" }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />

            <div className="space-y-6">
              {experiences.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } }}
                  className="relative pl-10 group"
                  onMouseEnter={() => !isMobile && setHoveredIdx(i)}
                  onMouseLeave={() => !isMobile && setHoveredIdx(null)}
                >
                  {/* Timeline dot */}
                  <motion.div
                    className="absolute left-0 top-6 w-[15px] h-[15px] rounded-full border-2 border-primary/40 bg-background"
                    animate={
                      hoveredIdx === i
                        ? { borderColor: "hsl(var(--primary))", boxShadow: "0 0 12px hsl(var(--primary) / 0.3)", scale: 1.2 }
                        : { borderColor: "hsl(var(--primary) / 0.4)", boxShadow: "none", scale: 1 }
                    }
                    transition={{ duration: 0.3 }}
                  />

                  <motion.div
                    className="glass-card p-6 md:p-7 relative overflow-hidden"
                    whileHover={isMobile ? {} : { x: 8, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
                  >
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary"
                      initial={{ scaleY: 0 }}
                      animate={hoveredIdx === i ? { scaleY: 1 } : { scaleY: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ transformOrigin: "top" }}
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary/3 to-transparent pointer-events-none" />

                    <div className="relative z-10">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                        <div>
                          <h3 className="text-base font-heading font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                            {exp.role}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            {exp.companyLogo && (
                              <img src={exp.companyLogo} alt={exp.company} className="w-4 h-4 rounded-sm object-contain" />
                            )}
                            <span className="text-[13px] text-primary/80 font-medium">{exp.company}</span>
                          </div>
                        </div>
                        <motion.span
                          className="text-[12px] text-muted-foreground font-medium shrink-0 px-3 py-1 rounded-full bg-muted/30 border border-border/30 self-start"
                          animate={hoveredIdx === i ? { scale: 1.05 } : { scale: 1 }}
                        >
                          {formatPeriod(exp.startDate, exp.endDate)}
                        </motion.span>
                      </div>
                      <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">{exp.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {exp.techUsed.map((t) => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-primary/6 text-primary/80 font-medium border border-primary/8">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {!loading && !error && experiences.length === 0 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-16 text-center text-[14px] text-muted-foreground">
            No experience entries yet.
          </motion.p>
        )}
      </div>
    </section>
  );
};

export default Experience;
