import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { Menu, X, Github, Twitter, Instagram } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/Koustav-dev",
    color: "hover:text-white hover:bg-[#333]",
  },
  {
    icon: Twitter,
    label: "X (Twitter)",
    href: "https://x.com/yourhandle",        // ← replace with your handle
    color: "hover:text-white hover:bg-black",
  },
  {
    icon: Instagram,
    label: "Instagram",
    href: "https://instagram.com/yourhandle", // ← replace with your handle
    color: "hover:text-white hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#bc1888]",
  },
];

interface NavbarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

/* ─── AVATAR LOGO ─────────────────────────────────────────────── */
interface AvatarLogoProps {
  onClick: () => void;
}

const AvatarLogo = ({ onClick }: AvatarLogoProps) => (
  <motion.button
    onClick={onClick}
    aria-label="View profile"
    className="relative flex-shrink-0"
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.94 }}
  >
    {/* Outer glow ring */}
    <motion.span
      className="absolute inset-0 rounded-full bg-primary/30"
      animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0, 0.5] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
    />
    {/* Avatar image */}
    <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-primary/50 ring-2 ring-primary/10">
      <img
        src="../../your_photo.png"   // ← replace with your actual photo path
        alt="Koustav Paul"
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback initials if image not found
          const t = e.currentTarget;
          t.style.display = "none";
          const parent = t.parentElement;
          if (parent && !parent.querySelector(".initials")) {
            const init = document.createElement("div");
            init.className =
              "initials absolute inset-0 flex items-center justify-center bg-primary/20 text-primary text-[11px] font-bold font-mono";
            init.textContent = "KP";
            parent.appendChild(init);
          }
        }}
      />
    </div>
  </motion.button>
);

/* ─── PROFILE MODAL ────────────────────────────────────────────── */
interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const ProfileModal = ({ open, onClose }: ProfileModalProps) => {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — blurred bg */}
          <motion.div
            className="fixed inset-0 z-[90] bg-background/60 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={onClose}
          />

          {/* Modal card */}
          <motion.div
            className="fixed z-[100] inset-0 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              className="pointer-events-auto relative flex flex-col items-center gap-6 p-8 rounded-3xl
                bg-background/80 backdrop-blur-2xl
                border border-border/40
                shadow-[0_32px_80px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.04)]
                w-[min(340px,88vw)]"
              initial={{ opacity: 0, scale: 0.82, y: 24 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{   opacity: 0, scale: 0.88,  y: 16 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >

              {/* Close button */}
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full
                  flex items-center justify-center
                  bg-muted/60 text-muted-foreground
                  hover:bg-muted hover:text-foreground
                  border border-border/40 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close profile"
              >
                <X size={15} />
              </motion.button>

              {/* Profile picture — large */}
              <motion.div
                className="relative"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1,   opacity: 1 }}
                transition={{ delay: 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Pulsing glow behind avatar */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/25 blur-xl"
                  animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.2, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative w-32 h-32 rounded-full overflow-hidden
                  border-[3px] border-primary/60
                  ring-4 ring-primary/10
                  shadow-[0_0_40px_rgba(var(--primary-rgb),0.3)]">
                  <img
                    src="../../your_photo.png"  // ← same path as above
                    alt="Koustav Paul"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const t = e.currentTarget;
                      t.style.display = "none";
                      const parent = t.parentElement;
                      if (parent && !parent.querySelector(".initials-lg")) {
                        const init = document.createElement("div");
                        init.className =
                          "initials-lg absolute inset-0 flex items-center justify-center bg-primary/15 text-primary text-3xl font-bold font-mono";
                        init.textContent = "KP";
                        parent.appendChild(init);
                      }
                    }}
                  />
                </div>
              </motion.div>

              {/* Name + role */}
              <motion.div
                className="flex flex-col items-center gap-1 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0  }}
                transition={{ delay: 0.16, duration: 0.4 }}
              >
                <h2 className="text-xl font-heading font-semibold tracking-tight text-foreground">
                  Koustav Paul
                  <span className="text-primary">.</span>
                </h2>
                <p className="text-[12px] font-mono text-muted-foreground tracking-wide">
                  Full-Stack Web Developer
                </p>
                <p className="text-[11px] text-muted-foreground/60 tracking-wider uppercase mt-0.5">
                  UI / UX · System Design
                </p>
              </motion.div>

              {/* Divider */}
              <motion.div
                className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.24, duration: 0.5 }}
              />

              {/* Social links */}
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                {socialLinks.map(({ icon: Icon, label, href, color }, i) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center
                      text-muted-foreground
                      bg-muted/50 border border-border/40
                      transition-all duration-300
                      ${color}`}
                    initial={{ opacity: 0, y: 12, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0,  scale: 1   }}
                    transition={{ delay: 0.32 + i * 0.07, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ scale: 1.12, y: -2 }}
                    whileTap={{ scale: 0.94 }}
                  >
                    <Icon size={18} />
                  </motion.a>
                ))}
              </motion.div>

              {/* Optional: small tagline */}
              <motion.p
                className="text-[10px] text-muted-foreground/40 font-mono tracking-widest uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                portfolio
              </motion.p>

            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ─── NAVBAR ───────────────────────────────────────────────────── */
const Navbar = ({ theme, toggleTheme }: NavbarProps) => {
  const { scrollDirection, scrollY } = useScrollDirection();
  const [activeSection, setActiveSection] = useState("hero");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);  // ← new

  const isScrolled = scrollY > 100;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );
    navLinks.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setSheetOpen(false);
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 glass-nav"
        initial={{ y: 0 }}
        animate={{ y: scrollDirection === "down" && scrollY > 100 ? -100 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav className="section-padding flex items-center justify-between h-16 md:h-18 max-w-[1200px] mx-auto">

          {/* ── LEFT: Avatar + Name ── */}
          <div className="flex items-center gap-2.5">
            <AvatarLogo onClick={() => setProfileOpen(true)} />

            <motion.button
              onClick={() => scrollTo("#hero")}
              className="text-lg font-heading font-semibold tracking-tight text-foreground"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Koustav Paul<span className="text-primary">.</span>
            </motion.button>
          </div>

          {/* ── CENTER: Nav links (unchanged) ── */}
          <AnimatePresence>
            {!isScrolled && (
              <motion.ul
                className="hidden md:flex items-center gap-7"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {navLinks.map(({ label, href }) => (
                  <li key={href}>
                    <button
                      onClick={() => scrollTo(href)}
                      className={`relative text-[13px] font-medium tracking-wide transition-colors duration-300 py-1 ${
                        activeSection === href.slice(1)
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {label}
                      {activeSection === href.slice(1) && (
                        <motion.span
                          layoutId="nav-dot"
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          {/* ── RIGHT: Controls (unchanged) ── */}
          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

            <AnimatePresence>
              {!isScrolled && (
                <motion.div
                  className="hidden md:block"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.button
                    className="btn-primary text-[13px] px-5 py-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => scrollTo("#contact")}
                  >
                    Let's Talk
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {(isScrolled || true) && (
                <motion.div
                  className={isScrolled ? "block" : "block md:hidden"}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                      <motion.button
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-foreground bg-muted/40 border border-border/50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Open menu"
                      >
                        <Menu size={18} />
                      </motion.button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] bg-background/95 backdrop-blur-2xl border-l border-border/30">
                      <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                      <div className="flex flex-col gap-2 mt-8">
                        {navLinks.map(({ label, href }, i) => (
                          <motion.button
                            key={href}
                            onClick={() => scrollTo(href)}
                            className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                              activeSection === href.slice(1)
                                ? "text-foreground bg-primary/10 border border-primary/20"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            }`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.3 }}
                          >
                            <span className="text-[10px] text-primary/60 font-mono mr-2">0{i + 1}</span>
                            {label}
                          </motion.button>
                        ))}
                      </div>

                      <div className="mt-8 px-4">
                        <motion.button
                          className="btn-primary w-full text-[13px] py-2.5"
                          onClick={() => scrollTo("#contact")}
                          whileTap={{ scale: 0.98 }}
                        >
                          Let's Talk
                        </motion.button>
                      </div>

                      <div className="absolute bottom-8 left-0 right-0 px-6">
                        <div className="text-[11px] text-muted-foreground/50 text-center">
                          © 2026 eraf. All rights reserved.
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
      </motion.header>

      {/* ── PROFILE MODAL (rendered outside header, at root level) ── */}
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
};

export default Navbar;