import { motion } from "framer-motion";
import { Code2, Palette, Cpu, Layers } from "lucide-react";
import { MagicCard } from "../lightswind/magic-card";
import type { Service } from "../../lib/api";

const icons = [Code2, Palette, Cpu, Layers];

export const ServicesSection = ({ services }: { services: Service[] }) => {
  if (services.length === 0) return null;

  return (
    <section id="services" className="max-w-7xl mx-auto px-6 py-24">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.6 }} className="mb-12 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 text-gradient-primary">What I Do</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base">Services and capabilities based on my current development focus.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {services.map((service, index) => {
          const Icon = icons[index % icons.length];
          return (
            <motion.div key={service.id ?? `${service.title}-${index}`} className="h-full" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08, duration: 0.45 }} viewport={{ once: true, amount: 0.1 }} whileHover={{ y: -5 }}>
              <MagicCard className="portfolio-card h-full p-7 rounded-[1.5rem] border border-border/80 bg-card/80" gradientSize={280} gradientColor="rgba(139, 92, 246, 0.12)" gradientFrom="#8b5cf6" gradientTo="#38bdf8">
                <div className="flex flex-col h-full gap-5">
                  <div className="portfolio-icon w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground tracking-tight">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{service.description}</p>
                  </div>
                  {service.focus && service.focus.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
                      {service.focus.map((item) => <span key={item} className="portfolio-chip px-2.5 py-1 rounded-lg bg-foreground/[0.04] border border-foreground/10 text-[11px] text-muted-foreground">{item}</span>)}
                    </div>
                  )}
                </div>
              </MagicCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
