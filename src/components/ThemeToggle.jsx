
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-neon-cyan hover:border-neon-cyan/50 transition-all"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.div>
      
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;
