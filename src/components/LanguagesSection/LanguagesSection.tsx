import { motion } from "framer-motion";
import { Globe2 } from "lucide-react";
import type { Language } from "../../lib/api";

export function LanguagesSection({ languages }: { languages: Language[] }) {
  return (
    <section className="max-w-7xl mx-auto w-full px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="flex items-center gap-3 mb-8">
        <motion.div className="portfolio-icon w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary" whileHover={{ y: -2, rotate: 4 }}><Globe2 className="w-5 h-5" /></motion.div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Languages</h2>
      </motion.div>
      {languages.length === 0 ? <p className="text-muted-foreground">No languages are available right now.</p> : <div className="flex flex-wrap gap-3">{languages.map((language, index) => <motion.div key={language.id ?? `${language.name}-${index}`} className="portfolio-card glass-panel portfolio-chip rounded-2xl border border-foreground/10 px-5 py-3 cursor-default" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -4, scale: 1.02 }} transition={{ delay: index * 0.05, duration: 0.35 }} viewport={{ once: true }}><span className="font-semibold text-foreground">{language.name}</span>{language.level && <span className="text-sm text-muted-foreground ml-2">{language.level}</span>}</motion.div>)}</div>}
    </section>
  );
}
