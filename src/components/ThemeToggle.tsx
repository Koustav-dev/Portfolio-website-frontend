import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeToggle = ({ theme, toggleTheme }: ThemeToggleProps) => (
  <motion.button
    onClick={toggleTheme}
    className="relative w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted transition-colors"
    whileTap={{ scale: 0.9 }}
    aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
  >
    <motion.div
      initial={false}
      animate={{ rotate: theme === "dark" ? 0 : 180, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
    </motion.div>
  </motion.button>
);

export default ThemeToggle;
