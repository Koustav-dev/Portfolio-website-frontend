import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Dribbble, ArrowUp } from "lucide-react";

const socials = [
  { icon: Github,   href: "#", label: "GitHub"   },
  { icon: Twitter,  href: "#", label: "Twitter"  },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Dribbble, href: "#", label: "Dribbble" },
];

const navLinks = [
  { label: "Home",       href: "#hero"       },
  { label: "About",      href: "#about"      },
  { label: "Work",       href: "#projects"   },
  { label: "Experience", href: "#experience" },
  { label: "Contact",    href: "#contact"    },
];

const scrollTo = (href: string) => {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

/* stagger helper */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const Footer = () => (
  <footer className="relative pt-20 pb-10 section-padding overflow-hidden">

    {/* ── Top gradient border ── */}
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

    {/* ── Ambient glow blob ── */}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/5 blur-[80px] rounded-full pointer-events-none" />

    <div className="max-w-[1200px] mx-auto">

      {/* ── TOP SECTION ── */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 pb-12 border-b border-border/20"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >

        {/* Col 1 — Brand */}
        <motion.div
          className="flex flex-col gap-4 items-center md:items-start"
          variants={item}
        >
          <button
            onClick={() => scrollTo("#hero")}
            className="group flex flex-col gap-1"
          >
            <span className="text-2xl font-heading font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
              Koustav Paul<span className="text-primary">.</span>
            </span>
            <span className="text-[11px] font-mono text-muted-foreground/50 tracking-[0.2em] uppercase">
              Full-Stack Developer
            </span>
          </button>

          <p className="text-[13px] text-muted-foreground/70 leading-relaxed text-center md:text-left max-w-[220px]">
            Crafting value-driven web experiences with care &amp; intention.
          </p>

          {/* Availability badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/8 border border-green-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-[11px] text-green-500/80 font-mono tracking-wide">
              Available for work
            </span>
          </div>
        </motion.div>

        {/* Col 2 — Quick Links */}
        <motion.div
          className="flex flex-col items-center md:items-start gap-4"
          variants={item}
        >
          <span className="text-[11px] font-mono text-muted-foreground/40 tracking-[0.18em] uppercase">
            Navigation
          </span>
          <ul className="flex flex-col gap-2.5 items-center md:items-start">
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <button
                  onClick={() => scrollTo(href)}
                  className="group flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  <span className="w-0 group-hover:w-3 h-px bg-primary transition-all duration-300 ease-out" />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Col 3 — Connect */}
        <motion.div
          className="flex flex-col items-center md:items-start gap-4"
          variants={item}
        >
          <span className="text-[11px] font-mono text-muted-foreground/40 tracking-[0.18em] uppercase">
            Connect
          </span>

          {/* Social icons */}
          <div className="flex items-center gap-2">
            {socials.map(({ icon: Icon, href, label }, i) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center
                  text-muted-foreground hover:text-primary
                  bg-muted/30 hover:bg-primary/10
                  border border-border/30 hover:border-primary/25
                  transition-all duration-300"
                whileHover={{ y: -3, scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
              >
                <Icon size={15} />
              </motion.a>
            ))}
          </div>

          {/* Email link */}
          <a
            href="mailto:hello@koustavpaul.dev"
            className="group flex items-center gap-2 text-[13px] text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            <span className="font-mono">hello@koustavpaul.dev</span>
            <motion.span
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </a>

          {/* Animated signature */}
          <motion.svg
            width="90"
            height="28"
            viewBox="0 0 80 24"
            className="text-primary/25 mt-1"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <motion.path
              d="M4 18 Q10 4 18 16 Q23 22 28 12 Q33 4 42 18 Q47 22 54 10 Q60 4 70 18 Q73 21 76 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2.2, ease: "easeInOut", delay: 0.5 }}
            />
          </motion.svg>
        </motion.div>
      </motion.div>

      {/* ── BOTTOM BAR ── */}
      <motion.div
        className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <span className="text-[11px] text-muted-foreground/35 font-mono order-2 sm:order-1">
          © 2026 Koustav Paul. All rights reserved.
        </span>

        <span className="text-[11px] text-muted-foreground/35 font-mono order-3 sm:order-2 flex items-center gap-1.5">
          Designed &amp; built with
          <motion.span
            className="text-red-400/60"
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            ♥
          </motion.span>
          by Koustav Paul
        </span>

        {/* Back to top */}
        <motion.button
          onClick={() => scrollTo("#hero")}
          className="order-1 sm:order-3 group flex items-center gap-2 text-[11px] font-mono text-muted-foreground/40 hover:text-primary transition-colors duration-300"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.96 }}
          aria-label="Back to top"
        >
          Back to top
          <span className="w-6 h-6 rounded-lg flex items-center justify-center bg-muted/40 group-hover:bg-primary/10 border border-border/30 group-hover:border-primary/25 transition-all duration-300">
            <ArrowUp size={11} />
          </span>
        </motion.button>
      </motion.div>

    </div>
  </footer>
);

export default Footer;