import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, CheckCircle, Mail, User, MessageSquare, ArrowUpRight, AlertCircle } from "lucide-react";
import SectionReveal from "@/components/SectionReveal";
import { api } from "@/lib/api";
import { useIsMobile } from "@/hooks/use-mobile";

interface FormData   { name: string; email: string; message: string; }
interface FormErrors { name?: string; email?: string; message?: string; }

const validate = (data: FormData): FormErrors => {
  const errors: FormErrors = {};
  if (!data.name.trim() || data.name.trim().length < 2)
    errors.name = "Name must be at least 2 characters";
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Please enter a valid email address";
  if (!data.message.trim() || data.message.trim().length < 10)
    errors.message = "Message must be at least 10 characters";
  return errors;
};

const Contact = () => {
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const isMobile = useIsMobile();

  const [formData,     setFormData]     = useState<FormData>({ name: "", email: "", message: "" });
  const [errors,       setErrors]       = useState<FormErrors>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [status,       setStatus]       = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverError,  setServerError]  = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors])
      setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setStatus("sending"); setServerError(null);
    try {
      await api.sendContact({ name: formData.name.trim(), email: formData.email.trim(), message: formData.message.trim() });
      setStatus("sent");
      setFormData({ name: "", email: "", message: "" });
      setErrors({});
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err: any) {
      setStatus("error");
      setServerError(err.message || "Something went wrong. Please try again.");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <section id="contact" ref={ref} className="py-28 md:py-36 section-padding relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Background orbs — desktop only, no infinite animation on mobile */}
      {!isMobile && (
        <>
          <motion.div
            className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none blur-[120px]"
            style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.06), transparent)" }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none blur-[100px]"
            style={{ background: "radial-gradient(circle, hsl(var(--secondary) / 0.04), transparent)" }}
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          />
        </>
      )}

      {/* Static orb substitute on mobile */}
      {isMobile && (
        <div
          className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.04), transparent)", filter: "blur(60px)" }}
        />
      )}

      <div className="max-w-[700px] mx-auto relative z-10">
        <SectionReveal className="text-center mb-12">
          <span className="text-[12px] text-primary tracking-[0.2em] uppercase font-medium">Contact</span>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-heading font-bold mt-3 tracking-tight">
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto text-[15px] leading-relaxed">
            Have a project in mind? I'd love to hear about it. Let's build something remarkable together.
          </p>
        </SectionReveal>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {[
            { label: "koustavp63@gmail.com",  icon: Mail,         href: "mailto:hello@eraf.dev" },
            { label: "Schedule a Call", icon: ArrowUpRight, href: "#"                     },
          ].map(({ label, icon: Icon, href }) => (
            <motion.a
              key={label}
              href={href}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium text-muted-foreground hover:text-foreground bg-muted/30 border border-border/30 hover:border-primary/20 transition-all duration-300"
              whileHover={isMobile ? {} : { scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={14} />{label}
            </motion.a>
          ))}
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          onSubmit={handleSubmit}
          className="glass-card p-7 md:p-9 space-y-5 relative overflow-hidden"
          noValidate
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3 pointer-events-none" />

          {([
            { name: "name",  label: "Your Name",     icon: User, type: "text"  },
            { name: "email", label: "Email Address", icon: Mail, type: "email" },
          ] as const).map(({ name, label, icon: Icon, type }) => (
            <div key={name} className="relative group space-y-1">
              <div className="relative">
                <Icon
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === name ? "text-primary" : "text-muted-foreground"}`}
                  size={16}
                />
                <input
                  type={type} name={name} value={formData[name]} placeholder={label}
                  onChange={handleChange}
                  onFocus={() => setFocusedField(name)}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 bg-muted/30 focus:outline-none transition-all duration-300 border ${errors[name] ? "border-destructive/50 focus:ring-2 focus:ring-destructive/20" : "border-transparent focus:ring-2 focus:ring-primary/30 focus:border-primary/20 focus:bg-muted/50"}`}
                  aria-label={label}
                />
                {!errors[name] && (
                  <motion.div
                    className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-primary"
                    initial={{ scaleX: 0 }}
                    animate={focusedField === name ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
              {errors[name] && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  className="text-[11px] text-destructive/80 pl-1 flex items-center gap-1">
                  <AlertCircle size={10} />{errors[name]}
                </motion.p>
              )}
            </div>
          ))}

          {/* Message */}
          <div className="relative group space-y-1">
            <div className="relative">
              <MessageSquare
                className={`absolute left-4 top-4 transition-colors duration-300 ${focusedField === "message" ? "text-primary" : "text-muted-foreground"}`}
                size={16}
              />
              <textarea
                name="message" value={formData.message} placeholder="Your Message" rows={5}
                onChange={handleChange}
                onFocus={() => setFocusedField("message")}
                onBlur={() => setFocusedField(null)}
                className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 bg-muted/30 focus:outline-none resize-none transition-all duration-300 border ${errors.message ? "border-destructive/50 focus:ring-2 focus:ring-destructive/20" : "border-transparent focus:ring-2 focus:ring-primary/30 focus:border-primary/20 focus:bg-muted/50"}`}
                aria-label="Your Message"
              />
              {!errors.message && (
                <motion.div
                  className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-primary"
                  initial={{ scaleX: 0 }}
                  animate={focusedField === "message" ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
            {errors.message && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="text-[11px] text-destructive/80 pl-1 flex items-center gap-1">
                <AlertCircle size={10} />{errors.message}
              </motion.p>
            )}
          </div>

          {serverError && status !== "sending" && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-destructive/8 border border-destructive/20 text-[13px] text-destructive/90">
              <AlertCircle size={14} className="shrink-0" />{serverError}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={status === "sending" || status === "sent"}
            className="w-full btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-70 relative overflow-hidden text-[14px]"
            whileHover={status === "idle" && !isMobile ? { scale: 1.01 } : {}}
            whileTap={status === "idle" ? { scale: 0.99 } : {}}
          >
            {status === "idle" && (
              <motion.span className="flex items-center gap-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Send size={15} /> Send Message
              </motion.span>
            )}
            {status === "sending" && (
              <motion.div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                animate={{ rotate: 360 }} transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }} />
            )}
            {status === "sent" && (
              <motion.span className="flex items-center gap-2" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                <CheckCircle size={15} /> Message Sent!
              </motion.span>
            )}
            {status === "error" && (
              <motion.span className="flex items-center gap-2" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                <AlertCircle size={15} /> Failed — Retrying...
              </motion.span>
            )}
          </motion.button>

          {focusedField === "message" && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-[11px] text-muted-foreground/40 text-right -mt-2">
              {formData.message.length} / 2000
            </motion.p>
          )}
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;
