import { motion } from "framer-motion";
import { Code2, Globe2, Layout, Users } from "lucide-react";
import type { Portfolio } from "../../lib/api";

export const AboutSection = ({ portfolio, showImage = true }: { portfolio: Portfolio; showImage?: boolean }) => {
  const about = String(portfolio.about ?? portfolio.bio ?? "Passionate Full Stack Web Developer building responsive, practical and modern web applications with React, Next.js, TypeScript and Node.js.");
  const projectCount = Number(portfolio.projectCount ?? 0);
  const experienceYears = Number(portfolio.experienceYears ?? 0);
  const stats = [
    { icon: <Layout className="w-6 h-6" />, label: "Years Experience", value: experienceYears > 0 ? `${experienceYears}+` : "3+" },
    { icon: <Code2 className="w-6 h-6" />, label: "Projects Completed", value: projectCount > 0 ? String(projectCount) : "8" },
    { icon: <Users className="w-6 h-6" />, label: "Production Apps", value: "4" },
    { icon: <Globe2 className="w-6 h-6" />, label: "Core Stack", value: "10+" },
  ];

  return (
    <section id="about" className="max-w-7xl mx-auto px-6 py-24">
      <motion.div className="flex flex-col md:flex-row gap-12 lg:gap-16 items-center" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} viewport={{ once: true, amount: 0.2 }}>
        {showImage && (
          <div className="w-full md:w-[42%] flex justify-center">
            <motion.div className="portfolio-card relative w-full max-w-sm aspect-[4/5] rounded-[2rem] overflow-hidden border border-foreground/10 bg-foreground/[0.025] shadow-xl" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} whileHover={{ y: -6, rotateX: 1.5, rotateY: -1.5 }} transition={{ duration: 0.7, ease: "easeOut" }} viewport={{ once: true }} style={{ transformStyle: "preserve-3d" }}>
              <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-primary/10 pointer-events-none z-10" />
              <img src="/sourov.jpg" alt="Sourov Adikari" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-x-5 bottom-5 z-20 rounded-2xl border border-white/15 bg-black/25 px-4 py-3 text-white/90 backdrop-blur-xl opacity-0 translate-y-2 transition-all duration-300 hover:opacity-100" />
            </motion.div>
          </div>
        )}

        <div className="flex-1 space-y-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-3">About Me</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Passionate about <span className="text-gradient-primary">Digital Excellence</span></h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{about}</p>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4 w-full">
          {stats.map((stat, i) => (
            <motion.div key={i} className="portfolio-card glass-panel p-6 rounded-2xl border border-foreground/10 group relative overflow-hidden" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1, duration: 0.5 }} viewport={{ once: true }}>
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
              <div className="portfolio-icon text-primary mb-4 p-3 bg-primary/10 w-max rounded-xl">{stat.icon}</div>
              <h3 className="text-3xl font-bold text-foreground mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
