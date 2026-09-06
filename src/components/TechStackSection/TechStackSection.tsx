import { motion } from "framer-motion";

const technologies = [
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
  { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" },
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
  { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
  { name: "GraphQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/graphql/graphql-plain.svg" },
  { name: "Tailwind CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "Framer Motion", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/framermotion/framermotion-original.svg" },
  { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" },
  { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" },
  { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg" },
  { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" },
  { name: "Kubernetes", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-original.svg" },
  { name: "Redis", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg" },
  { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg" },
  { name: "Redux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redux/redux-original.svg" },
];

const TechStackSection = () => {
  const items = [...technologies, ...technologies];
  return (
    <div className="w-full py-6 border-t border-b border-foreground/10 bg-background overflow-hidden">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="w-full overflow-hidden relative flex items-center">
        <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="flex w-max shrink-0 whitespace-nowrap items-center py-1 tech-marquee">
          {items.map((tech, i) => (
            <motion.div key={`${tech.name}-${i}`} whileHover={{ y: -3, scale: 1.05 }} transition={{ duration: 0.2 }} className="portfolio-chip mx-3 px-5 py-2.5 rounded-full border border-foreground/10 bg-card text-foreground font-medium text-sm flex items-center gap-3 cursor-default shadow-sm group shrink-0 hover:border-primary/50 hover:shadow-md">
              <img src={tech.icon} alt={tech.name} className="w-5 h-5 object-contain transition-transform duration-300 group-hover:scale-110" loading="lazy" decoding="async" />
              <span className="tracking-wide text-xs md:text-sm">{tech.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <style dangerouslySetInnerHTML={{ __html: `
        .tech-marquee { animation: tech-marquee 32s linear infinite; will-change: transform; }
        .tech-marquee:hover { animation-play-state: paused; }
        @keyframes tech-marquee { from { transform: translate3d(0, 0, 0); } to { transform: translate3d(-50%, 0, 0); } }
        @media (prefers-reduced-motion: reduce) { .tech-marquee { animation: none; } }
      ` }} />
    </div>
  );
};

export default TechStackSection;
