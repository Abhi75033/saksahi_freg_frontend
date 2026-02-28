import { motion } from "framer-motion";
import { ReactNode } from "react";

const SectionWrapper = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <motion.section
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6 }}
    className={`py-16 md:py-24 ${className}`}
  >
    {children}
  </motion.section>
);

export default SectionWrapper;
