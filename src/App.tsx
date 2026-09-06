import { useState, useEffect, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import { HeroSection } from "./components/HeroSection/HeroSection";
import { AboutSection } from "./components/AboutSection/AboutSection";
import { ProjectsSection } from "./components/ProjectsSection/ProjectsSection";
import { Footer } from "./components/Footer/Footer";
import ReactLenis from "lenis/react";
import { api, type ApiData, type Education, type Experience, type Language, type Portfolio, type Project, type Service, type Skill, type Social } from "./lib/api";
import PortfolioPages from "./pages/PortfolioPages";
import SEO from "./components/SEO/SEO";
import { SectionError, SectionLoader } from "./components/SectionLoader";

type Resource<T> = { data: T; loading: boolean; error: boolean };

const initial = <T,>(data: T): Resource<T> => ({ data, loading: true, error: false });

function ResourceView<T>({ resource, label, children }: { resource: Resource<T>; label: string; children: (data: T) => ReactNode }) {
  if (resource.loading) return <SectionLoader label={label} />;
  if (resource.error) return <SectionError message={`Unable to load ${label.toLowerCase()}. Please try again later.`} />;
  return <>{children(resource.data)}</>;
}

function HomePage({ resources }: { resources: { portfolio: Resource<Portfolio>; projects: Resource<Project[]>; socials: Resource<Social[]> } }) {
  const projects = resources.projects.data;
  const experienceYears = Math.max(1, new Date().getFullYear() - 2023);
  const portfolio = { ...resources.portfolio.data, projectCount: projects.length, experienceYears };

  return (
    <main className="w-full flex flex-col border-none">
      <ResourceView resource={resources.portfolio} label="Loading profile">
        {(profile) => (
          <>
            <HeroSection portfolio={{ ...profile, projectCount: projects.length, experienceYears }} socials={resources.socials.data} projectCount={projects.length} experienceYears={experienceYears} />
            <AboutSection portfolio={portfolio} showImage={false} />
          </>
        )}
      </ResourceView>
      <ResourceView resource={resources.projects} label="Loading projects">
        {(projectData) => <ProjectsSection projects={projectData} limit={3} />}
      </ResourceView>
    </main>
  );
}

function RouteScrollReset() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);
  return null;
}

function App() {
  const [portfolio, setPortfolio] = useState<Resource<Portfolio>>(initial({}));
  const [projects, setProjects] = useState<Resource<Project[]>>(initial([]));
  const [skills, setSkills] = useState<Resource<Skill[]>>(initial([]));
  const [experience, setExperience] = useState<Resource<Experience[]>>(initial([]));
  const [education, setEducation] = useState<Resource<Education[]>>(initial([]));
  const [languages, setLanguages] = useState<Resource<Language[]>>(initial([]));
  const [socials, setSocials] = useState<Resource<Social[]>>(initial([]));
  const [services, setServices] = useState<Resource<Service[]>>(initial([]));

  useEffect(() => {
    let active = true;
    const load = <T,>(request: Promise<T>, setter: Dispatch<SetStateAction<Resource<T>>>) => {
      void request
        .then((value) => {
          if (active) setter({ data: value, loading: false, error: false });
        })
        .catch(() => {
          if (active) setter((current) => ({ ...current, loading: false, error: true }));
        });
    };

    load(api.getPortfolio(), setPortfolio);
    load(api.getProjects(), setProjects);
    load(api.getSkills(), setSkills);
    load(api.getExperience(), setExperience);
    load(api.getEducation(), setEducation);
    load(api.getLanguages(), setLanguages);
    load(api.getSocials(), setSocials);
    load(api.getServices(), setServices);

    return () => { active = false; };
  }, []);

  const portfolioData: ApiData = {
    portfolio: portfolio.data,
    projects: projects.data,
    skills: skills.data,
    experience: experience.data,
    education: education.data,
    languages: languages.data,
    socials: socials.data,
    services: services.data,
  };

  const resources = { portfolio, projects, skills, experience, education, languages, socials, services };

  return (
    <div className="bg-background min-h-screen relative overflow-x-hidden selection:bg-primary/30 selection:text-primary-foreground">
      <ReactLenis root options={{ smoothWheel: true, duration: 1.2 }}>
        <RouteScrollReset />
        <SEO portfolio={portfolio.data} />
        <Header portfolio={portfolio.data} />
        <Routes>
          <Route path="/" element={<HomePage resources={resources} />} />
          <Route path="/about" element={<ResourceView resource={services} label="Loading services">{(data) => <PortfolioPages type="about" data={{ ...portfolioData, services: data }} />}</ResourceView>} />
          <Route path="/projects" element={<ResourceView resource={projects} label="Loading projects">{(data) => <PortfolioPages type="projects" data={{ ...portfolioData, projects: data }} />}</ResourceView>} />
          <Route path="/projects/:slug" element={<PortfolioPages type="project" data={portfolioData} />} />
          <Route path="/skills" element={<ResourceView resource={skills} label="Loading skills">{(data) => <PortfolioPages type="skills" data={{ ...portfolioData, skills: data }} />}</ResourceView>} />
          <Route path="/experience" element={<ResourceView resource={experience} label="Loading career">{(data) => <PortfolioPages type="experience" data={{ ...portfolioData, experience: data }} />}</ResourceView>} />
          <Route path="/education" element={<ResourceView resource={education} label="Loading education">{(data) => <PortfolioPages type="education" data={{ ...portfolioData, education: data }} />}</ResourceView>} />
          <Route path="/contact" element={<ResourceView resource={portfolio} label="Loading contact">{(data) => <PortfolioPages type="contact" data={{ ...portfolioData, portfolio: data }} />}</ResourceView>} />
          <Route path="*" element={<PortfolioPages type="not-found" data={portfolioData} />} />
        </Routes>
        <Footer portfolio={portfolio.data} socials={socials.data} />
      </ReactLenis>
    </div>
  );
}

export default function RoutedApp() { return <BrowserRouter><App /></BrowserRouter>; }
