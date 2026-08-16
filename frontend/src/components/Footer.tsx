import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className="border-t border-border bg-bg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <Link to="/" className="font-display text-lg font-semibold text-text">
            Ev<span className="text-gold">ent</span>ure
          </Link>

          <div className="flex gap-6 text-sm text-text-muted">
            <a href="#home" className="hover:text-text transition-colors">Home</a>
            <a href="#about" className="hover:text-text transition-colors">About Us</a>
            <a href="#events" className="hover:text-text transition-colors">Events</a>
            <a href="#faq" className="hover:text-text transition-colors">FAQ</a>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-text-muted text-xs">
            © {new Date().getFullYear()} Eventure. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}