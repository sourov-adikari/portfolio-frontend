import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project } from "../../lib/api";

const normalizeSearchText = (value: unknown) => String(value ?? "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const projectSearchText = (project: Project) => normalizeSearchText([project.title, project.name, project.slug, project.description, project.subtitle, project.longDescription, project.category, project.status, project.year, project.purpose, project.solution, project.technologies, project.features, project.highlights, project.lessons].flat().join(" "));

export const ProjectsSection = ({ projects: apiProjects, limit }: { projects: Project[]; limit?: number }) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const projects = typeof limit === "number" ? apiProjects.slice(0, limit) : apiProjects;
  const categories = useMemo(() => ["All", ...Array.from(new Set(projects.map((project) => String(project.category ?? "Other")))).sort((a, b) => a.localeCompare(b))], [projects]);
  const statuses = useMemo(() => ["All", ...Array.from(new Set(projects.map((project) => String(project.status ?? "Other")))).sort((a, b) => a.localeCompare(b))], [projects]);
  const filteredProjects = useMemo(() => {
    if (typeof limit === "number") return projects;
    const searchTerms = normalizeSearchText(query).split(" ").filter(Boolean);
    return projects.filter((project) => {
      const searchable = projectSearchText(project);
      return (searchTerms.length === 0 || searchTerms.every((term) => searchable.includes(term))) && (category === "All" || String(project.category ?? "Other") === category) && (status === "All" || String(project.status ?? "Other") === status);
    });
  }, [category, projects, query, status, limit]);
  const hasActiveFilters = Boolean(query.trim()) || category !== "All" || status !== "All";
  const clearFilters = () => { setQuery(""); setCategory("All"); setStatus("All"); };

  return (
    <section id="projects" className="w-full max-w-7xl mx-auto px-5 md:px-6 py-16 md:py-20">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.6 }} className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary mb-2">Portfolio</p><h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">Selected <span className="text-gradient-primary">Works</span></h2><p className="text-sm md:text-base text-muted-foreground max-w-2xl">A quick look at selected work. Explore the projects page for the complete portfolio and details.</p></div>
          <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-foreground hover:-translate-y-0.5 transition-all shrink-0">View all projects <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
        </div>
      </motion.div>

      {typeof limit !== "number" && projects.length > 0 && <div className="portfolio-card mb-7 rounded-2xl border border-foreground/10 bg-foreground/[0.025] p-3 md:p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects, technologies, features..." aria-label="Search projects" className="w-full h-10 rounded-xl border border-foreground/10 bg-background/60 pl-9 pr-9 text-sm outline-none focus:border-primary/50" />{query && <button onClick={() => setQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground hover:scale-110 transition-transform" aria-label="Clear search"><X className="w-4 h-4" /></button>}</div>
          <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category" className="h-10 rounded-xl border border-foreground/10 bg-background/60 px-3 text-sm outline-none focus:border-primary/50"><option value="All">All categories</option>{categories.filter((item) => item !== "All").map((item) => <option key={item} value={item}>{item}</option>)}</select>
          <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status" className="h-10 rounded-xl border border-foreground/10 bg-background/60 px-3 text-sm outline-none focus:border-primary/50"><option value="All">All status</option>{statuses.filter((item) => item !== "All").map((item) => <option key={item} value={item}>{item.replace(/-/g, " ")}</option>)}</select>
          {hasActiveFilters && <button type="button" onClick={clearFilters} className="h-10 inline-flex items-center justify-center gap-1.5 rounded-xl border border-foreground/10 px-3 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all">Reset <X className="w-3.5 h-3.5" /></button>}
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground"><span>Showing <span className="font-semibold text-foreground">{filteredProjects.length}</span> of {projects.length} projects</span>{query.trim() && <span className="hidden sm:inline">Search checks titles, descriptions, stack, features and project details</span>}</div>
      </div>}

      {filteredProjects.length === 0 ? <div className="py-16 text-center"><Search className="w-7 h-7 mx-auto mb-3 text-muted-foreground" /><p className="font-semibold mb-1">No matching projects</p><p className="text-sm text-muted-foreground mb-4">Try a different keyword or remove one of the filters.</p>{hasActiveFilters && <button type="button" onClick={clearFilters} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">Clear filters <X className="w-3.5 h-3.5" /></button>}</div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        {filteredProjects.map((project, i) => (
          <motion.article key={project.id} className="group relative overflow-hidden rounded-[1.75rem] block shadow-xl border border-foreground/10 h-[390px] bg-neutral-950" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -6, scale: 1.008 }} transition={{ delay: i * 0.06, duration: 0.6 }} viewport={{ once: true, amount: 0.1 }}>
            {project.slug && <Link to={`/projects/${project.slug}`} className="absolute inset-0 z-20" aria-label={`View ${project.title ?? project.name ?? "project"}`} />}
            <div className="absolute inset-0 bg-neutral-950"><img src={String(project.image ?? project.imageUrl ?? "https://images.pexels.com/photos/8294591/pexels-photo-8294591.jpeg?auto=compress&cs=tinysrgb&w=1200")} alt={String(project.title ?? project.name ?? "Project")} loading="lazy" decoding="async" className="w-full h-full object-cover transition-[transform,opacity,filter] duration-700 group-hover:scale-110 group-hover:saturate-110 opacity-75 group-hover:opacity-100 transform-gpu" /><div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/5 pointer-events-none" /><div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/[0.06] transition-colors duration-500 pointer-events-none" /></div>
            <div className="absolute inset-0 p-6 flex flex-col justify-end pointer-events-none"><div className="flex items-end justify-between gap-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300"><div className="max-w-[80%]"><span className="text-[11px] font-bold uppercase tracking-widest text-white/60">{project.category ?? "Project"}</span><h3 className="text-2xl font-extrabold text-white mt-1 mb-2 tracking-tight drop-shadow-md">{project.title ?? project.name}</h3><p className="text-sm font-medium text-white/80 line-clamp-2">{project.subtitle ?? project.description}</p></div><div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center shrink-0 opacity-80 group-hover:opacity-100 group-hover:bg-white group-hover:text-black group-hover:scale-110 transition-all duration-300 z-10 shadow-lg"><ArrowUpRight className="w-5 h-5 text-white group-hover:text-black transition-colors" /></div></div></div>
          </motion.article>
        ))}
      </div>}
    </section>
  );
};
