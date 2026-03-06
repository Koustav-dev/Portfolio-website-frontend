import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { ExternalLink, Github, ArrowUpRight, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import SectionReveal from "@/components/SectionReveal";
import { api } from "@/lib/api";
import { useIsMobile } from "@/hooks/use-mobile";

interface Project {
  id:              string;
  title:           string;
  slug:            string;
  description:     string;
  longDescription: string | null;
  coverImage:      string | null;
  liveUrl:         string | null;
  githubUrl:       string | null;
  techStack:       string[];
  category:        "WEB" | "MOBILE" | "DESIGN" | "AI";
  featured:        boolean;
  order:           number;
}

const CATEGORY_LABELS: Record<string, string> = { WEB: "Web App", MOBILE: "Mobile", DESIGN: "Design", AI: "AI / SaaS" };
const CATEGORY_GLOW:   Record<string, string> = { WEB: "124, 90, 240", MOBILE: "56, 155, 240", DESIGN: "230, 80, 150", AI: "240, 150, 40" };
const CATEGORY_BADGE:  Record<string, string> = {
  WEB:    "bg-violet-500/10 text-violet-400 border-violet-500/20",
  MOBILE: "bg-blue-500/10   text-blue-400   border-blue-500/20",
  DESIGN: "bg-pink-500/10   text-pink-400   border-pink-500/20",
  AI:     "bg-amber-500/10  text-amber-400  border-amber-500/20",
};
const CATEGORY_BG: Record<string, string> = {
  WEB:    "from-violet-600/15 via-violet-500/5 to-transparent",
  MOBILE: "from-blue-600/15   via-blue-500/5   to-transparent",
  DESIGN: "from-pink-600/15   via-pink-500/5   to-transparent",
  AI:     "from-amber-600/15  via-amber-500/5  to-transparent",
};

const categoryToFilter = (cat: string) => CATEGORY_LABELS[cat] ?? cat;

const ProjectVisual = ({ project, tall }: { project: Project; tall?: boolean }) => (
  <div className={`relative w-full ${tall ? "h-40" : "h-32"} rounded-xl overflow-hidden border border-white/5 flex-shrink-0`}>
    {project.coverImage ? (
      <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
    ) : (
      <div className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_BG[project.category] ?? "from-primary/10 to-transparent"}`}>
        <div className="absolute inset-0"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)", backgroundSize: "18px 18px" }}
        />
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          {[["75%", 0.45], ["50%", 0.3], ["88%", 0.2]].map(([w, o], i) => (
            <motion.div key={i} className="h-1.5 rounded-full bg-white/20"
              style={{ width: w as string, opacity: o as number }}
              animate={{ opacity: [o as number, (o as number) * 0.4, o as number] }}
              transition={{ duration: 2.4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
            />
          ))}
        </div>
        <div className="absolute top-3 right-3 grid grid-cols-3 gap-[5px]">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="w-[5px] h-[5px] rounded-full bg-white/12" />
          ))}
        </div>
      </div>
    )}
  </div>
);

const Skeleton = ({ wide }: { wide?: boolean }) => (
  <div className={`glass-card p-6 animate-pulse ${wide ? "md:col-span-2" : ""}`}>
    <div className="h-36 rounded-xl bg-muted/25 mb-5" />
    <div className="flex justify-between mb-3"><div className="h-5 w-16 rounded-full bg-muted/35" /></div>
    <div className="h-6 w-3/5 rounded-lg bg-muted/35 mb-2" />
    <div className="space-y-1.5 mb-4">
      <div className="h-3 w-full rounded bg-muted/20" />
      <div className="h-3 w-4/5 rounded bg-muted/20" />
    </div>
    <div className="flex gap-2">{[14, 18, 12].map((w, i) => <div key={i} className={`h-5 w-${w} rounded-md bg-muted/25`} />)}</div>
  </div>
);

const Card = ({ project, index, wide }: { project: Project; index: number; wide: boolean }) => {
  const cardRef               = useRef<HTMLDivElement>(null);
  const isMobile              = useIsMobile();
  const [hovered, setHovered] = useState(false);
  const [glow, setGlow]       = useState({ x: 50, y: 50 });
  const rgb   = CATEGORY_GLOW[project.category]  ?? "124,90,240";
  const badge = CATEGORY_BADGE[project.category] ?? "bg-primary/10 text-primary border-primary/20";

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setGlow({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  }, [isMobile]);

  return (
    <motion.div
      layout
      className={wide ? "md:col-span-2" : ""}
      variants={{
        hidden: { opacity: 0, y: 24, scale: 0.97 },
        show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.07 } },
      }}
    >
      <motion.div
        ref={cardRef}
        className="glass-card overflow-hidden cursor-pointer h-full relative"
        onMouseEnter={() => !isMobile && setHovered(true)}
        onMouseLeave={() => !isMobile && setHovered(false)}
        onMouseMove={onMove}
        whileHover={isMobile ? {} : { y: -7, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }}
        whileTap={{ scale: 0.985 }}
      >
        {/* Radial glow — desktop only */}
        {!isMobile && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            style={{ background: `radial-gradient(360px circle at ${glow.x}% ${glow.y}%, rgba(${rgb},0.14), transparent 65%)` }}
          />
        )}

        {/* Top shimmer border */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
          style={{ background: `linear-gradient(90deg, transparent, rgba(${rgb},0.9), transparent)` }}
          animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        />

        <div className={`p-5 md:p-6 flex h-full ${wide ? "md:flex-row md:items-start md:gap-7" : "flex-col"}`}>
          {wide ? (
            <>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="md:hidden mb-5"><ProjectVisual project={project} tall /></div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold tracking-[0.18em] uppercase px-2.5 py-[5px] rounded-full border ${badge}`}>
                    {CATEGORY_LABELS[project.category]}
                  </span>
                  <div className={`flex gap-1.5 transition-all duration-300 ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}>
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all"
                        onClick={e => e.stopPropagation()}><Github size={13} /></a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all"
                        onClick={e => e.stopPropagation()}><ExternalLink size={13} /></a>
                    )}
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-2.5 flex items-center gap-2 flex-wrap">
                  {project.title}
                  <motion.span className="text-primary" animate={hovered ? { x: 3, y: -3, opacity: 1 } : { x: 0, y: 0, opacity: 0 }} transition={{ duration: 0.18 }}>
                    <ArrowUpRight size={18} />
                  </motion.span>
                </h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed mb-5 flex-1">{project.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {project.techStack.slice(0, 7).map(tag => (
                    <motion.span key={tag} whileHover={isMobile ? {} : { scale: 1.07, y: -1 }}
                      className="text-[10px] px-2.5 py-[5px] rounded-md font-medium text-primary/80 bg-primary/8 border border-primary/12 backdrop-blur-sm">
                      {tag}
                    </motion.span>
                  ))}
                  {project.techStack.length > 7 && (
                    <span className="text-[10px] px-2.5 py-[5px] rounded-md text-muted-foreground/40 bg-muted/15 border border-border/15">
                      +{project.techStack.length - 7}
                    </span>
                  )}
                </div>
              </div>
              <motion.div className="hidden md:block w-52 flex-shrink-0 self-stretch"
                animate={hovered ? { scale: 1.02 } : { scale: 1 }} transition={{ duration: 0.3 }}>
                <ProjectVisual project={project} tall />
              </motion.div>
            </>
          ) : (
            <>
              <div className="mb-5"><ProjectVisual project={project} /></div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-bold tracking-[0.18em] uppercase px-2.5 py-[5px] rounded-full border ${badge}`}>
                  {CATEGORY_LABELS[project.category]}
                </span>
                <div className="flex gap-1.5">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all"
                      onClick={e => e.stopPropagation()}><Github size={13} /></a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all"
                      onClick={e => e.stopPropagation()}><ExternalLink size={13} /></a>
                  )}
                </div>
              </div>
              <h3 className="text-lg font-heading font-bold text-foreground mb-2 flex items-center gap-1.5 flex-wrap">
                {project.title}
                <motion.span className="text-primary" animate={hovered ? { x: 3, y: -3, opacity: 1 } : { x: 0, y: 0, opacity: 0 }} transition={{ duration: 0.18 }}>
                  <ArrowUpRight size={15} />
                </motion.span>
              </h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed mb-4 flex-1">{project.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {project.techStack.slice(0, 4).map(tag => (
                  <motion.span key={tag} whileHover={isMobile ? {} : { scale: 1.07, y: -1 }}
                    className="text-[10px] px-2.5 py-[5px] rounded-md font-medium text-primary/80 bg-primary/8 border border-primary/12 backdrop-blur-sm">
                    {tag}
                  </motion.span>
                ))}
                {project.techStack.length > 4 && (
                  <span className="text-[10px] px-2.5 py-[5px] rounded-md text-muted-foreground/40 bg-muted/15 border border-border/15">
                    +{project.techStack.length - 4}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const getWide = (projects: Project[], filter: string): boolean[] => {
  if (projects.length === 1) return [true];
  const wide = new Array(projects.length).fill(false);
  if (filter === "All") {
    let col = 0;
    for (let i = 0; i < projects.length; i++) {
      if (projects[i].featured && col === 0) { wide[i] = true; col = 0; }
      else { col = col === 0 ? 1 : 0; }
    }
  }
  return wide;
};

const Projects = () => {
  const isMobile = useIsMobile();
  const [projects,     setProjects]     = useState<Project[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const fetchProjects = async () => {
    setLoading(true); setError(null);
    try { setProjects((await api.getProjects()) as Project[]); }
    catch (err: any) { setError(err.message || "Something went wrong"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const filtered = activeFilter === "All" ? projects : projects.filter(p => categoryToFilter(p.category) === activeFilter);
  // On mobile, no wide cards — single column only
  const wideMap  = isMobile ? new Array(filtered.length).fill(false) : getWide(filtered, activeFilter);
  const availableFilters = ["All", ...Array.from(new Set(projects.map(p => categoryToFilter(p.category))))];

  return (
    <section id="projects" className="py-28 md:py-36 section-padding relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="max-w-[1200px] mx-auto">
        <SectionReveal>
          <span className="text-[12px] text-primary tracking-[0.2em] uppercase font-medium">Work</span>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-heading font-bold mt-3 tracking-tight">
            Selected <span className="gradient-text">Projects</span>
          </h2>
        </SectionReveal>

        {!loading && !error && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="flex flex-wrap gap-2 mt-10 mb-12">
            {availableFilters.map(cat => (
              <motion.button key={cat} onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-300 relative overflow-hidden ${activeFilter === cat ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted/60 border border-border/30"}`}
                whileHover={isMobile ? {} : { scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                {activeFilter === cat && (
                  <motion.div layoutId="fpill" className="absolute inset-0 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 320, damping: 32 }} />
                )}
                <span className="relative z-10">{cat}</span>
              </motion.button>
            ))}
          </motion.div>
        )}

        {loading && (
          <div className="mt-10">
            <div className="flex items-center gap-2 mb-8 text-muted-foreground/60">
              <Loader2 size={14} className="animate-spin" />
              <span className="text-[13px] font-mono">Fetching projects...</span>
            </div>
            <div className="grid md:grid-cols-2 gap-5"><Skeleton wide /><Skeleton /><Skeleton /></div>
          </div>
        )}

        {error && !loading && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            className="mt-10 flex flex-col items-center gap-4 py-24 text-center">
            <div className="w-12 h-12 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
              <AlertCircle size={20} className="text-destructive" />
            </div>
            <p className="text-[14px] text-muted-foreground max-w-xs">{error}</p>
            <motion.button onClick={fetchProjects} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-medium bg-muted/40 hover:bg-muted/70 border border-border/40 text-foreground transition-all">
              <RefreshCw size={13} /> Try again
            </motion.button>
          </motion.div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="py-24 text-center text-[14px] text-muted-foreground">
            No projects in this category yet.
          </motion.p>
        )}

        {!loading && !error && filtered.length > 0 && (
          <motion.div layout initial="hidden" animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <Card key={project.id} project={project} index={i} wide={wideMap[i] ?? false} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Projects;
