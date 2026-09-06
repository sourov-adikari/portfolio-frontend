import { useEffect, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ExternalLink, Lightbulb, Target, Wrench } from "lucide-react";
import { AboutSection } from "../components/AboutSection/AboutSection";
import { CareerTimeline } from "../components/CareerSection/CareerTimeline";
import { ContactSection } from "../components/ContactSection/ContactSection";
import { EducationSection } from "../components/EducationSection/EducationSection";
import SkillCategory from "../components/EducationSection/SkillCategory";
import { ProjectsSection } from "../components/ProjectsSection/ProjectsSection";
import { ServicesSection } from "../components/ServicesSection/ServicesSection";
import type { ApiData, Project } from "../lib/api";
import { api } from "../lib/api";
import { LanguagesSection } from "../components/LanguagesSection/LanguagesSection";
import { SectionLoader } from "../components/SectionLoader";

type PageType =
| "about"
| "projects"
| "project"
| "skills"
| "experience"
| "education"
| "contact"
| "not-found";

function PageFrame({ children }: { children: ReactNode }) {
return (
<main className="w-full flex flex-col pt-28 min-h-screen">
{children}
</main>
);
}

function StateMessage({
title,
message,
action,
}: {
title: string;
message: string;
action?: ReactNode;
}) {
return (
<div className="max-w-3xl mx-auto px-6 py-32 text-center">
<h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
{title}
</h1>

<p className="text-muted-foreground text-base mb-6">  
    {message}  
  </p>  

  {action}  
</div>

);
}

function ProjectDetails() {
const { slug } = useParams();

const [project, setProject] = useState<Project | null>(null);
const [status, setStatus] = useState<
"loading" | "success" | "error"

> ("loading");



/*

Load project
*/
useEffect(() => {
if (!slug) {
setProject(null);
setStatus("error");
return;
}


let active = true;  

// Reset previous project immediately when slug changes.  
// This prevents the previous project's content/title from  
// remaining visible while the new project is loading.  
setProject(null);  
setStatus("loading");  

void api  
  .getProject(slug)  
  .then((result) => {  
    if (!active) return;  

    setProject(result);  
    setStatus("success");  
  })  
  .catch(() => {  
    if (!active) return;  

    setProject(null);  
    setStatus("error");  
  });  

return () => {  
  active = false;  
};

}, [slug]);

/*

Dynamic project SEO title

Examples:

Loading:

Loading Project | Sourov Chandra Adikari

Successful project:

SCA Courier | Sourov Chandra Adikari

Failed project:

Project Not Found | Sourov Chandra Adikari
*/
useEffect(() => {
if (status === "loading") {
document.title = "Loading Project | Sourov Chandra Adikari";
return;
}


if (status === "success" && project) {  
  const projectTitle = String(  
    project.title ?? project.name ?? "Project"  
  ).trim();  

  document.title = `${projectTitle} | Sourov Chandra Adikari`;  
  return;  
}  

document.title = "Project Not Found | Sourov Chandra Adikari";

}, [project, status]);

/*

Loading state
*/
if (status === "loading") {
return <SectionLoader label="Loading project" />;
}


/*

Project not found
*/
if (status === "error" || !project) {
return (
<StateMessage
title="Project not found"
message="This project may have been removed or the link may be incorrect."
action={
<Link  
to="/projects"  
className="text-primary hover:underline"  
>
Back to projects
</Link>
}
/>
);
}


/*

Dynamic project data
*/
const title = String(
project.title ?? project.name ?? "Project"
);


const technologyValue =
project.technologies ?? project.techStack;

const technologies = Array.isArray(technologyValue)
? technologyValue.map(String)
: technologyValue
? [String(technologyValue)]
: [];

const image = project.image ?? project.imageUrl;

const description = String(
project.description ?? project.subtitle ?? ""
);

const category = String(
project.category ?? "Project"
);

const year = String(
project.year ?? ""
);

const statusLabel = String(
project.status ?? ""
).replace("-", " ");

const longDescription = project.longDescription
? String(project.longDescription)
: "";

const purpose = project.purpose
? String(project.purpose)
: "";

const solution = project.solution
? String(project.solution)
: "";

const features = Array.isArray(project.features)
? project.features.map(String)
: [];

const highlights = Array.isArray(project.highlights)
? project.highlights.map(String)
: [];

const lessons = Array.isArray(project.lessons)
? project.lessons.map(String)
: [];

const liveUrl = project.liveUrl ?? project.link;

const githubUrl = project.githubUrl;

return (
<PageFrame>
<article className="max-w-6xl mx-auto w-full px-5 md:px-6 pb-20">
<Link  
to="/projects"  
className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-7"  
>
<ArrowLeft className="w-4 h-4" />
Back to projects
</Link>

{image && (  
      <div className="w-full h-[460px] overflow-hidden rounded-[1.75rem] border border-foreground/10 shadow-xl mb-8 bg-foreground/[0.025]">  
        <img  
          src={String(image)}  
          alt={title}  
          className="w-full h-full object-cover"  
        />  
      </div>  
    )}  

    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-7 lg:gap-10 items-start">  
      <div>  
        <div className="flex flex-wrap items-center gap-2 mb-3">  
          <span className="text-xs uppercase tracking-widest text-primary font-bold">  
            {category}  
          </span>  

          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize bg-foreground/5 border border-foreground/10">  
            {statusLabel}  
          </span>  

          {year && (  
            <span className="text-xs text-muted-foreground">  
              {year}  
            </span>  
          )}  
        </div>  

        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">  
          {title}  
        </h1>  

        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">  
          {description}  
        </p>  

        {longDescription && (  
          <section className="mt-7">  
            <h2 className="text-lg font-bold mb-2">  
              Project Overview  
            </h2>  

            <p className="text-sm md:text-base text-muted-foreground leading-7">  
              {longDescription}  
            </p>  
          </section>  
        )}  

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-7">  
          {purpose && (  
            <div className="p-5 rounded-2xl border border-foreground/10 bg-foreground/[0.025]">  
              <div className="flex items-center gap-2 mb-2">  
                <Target className="w-4 h-4 text-primary" />  

                <h2 className="font-bold text-sm">  
                  Purpose  
                </h2>  
              </div>  

              <p className="text-sm text-muted-foreground leading-6">  
                {purpose}  
              </p>  
            </div>  
          )}  

          {solution && (  
            <div className="p-5 rounded-2xl border border-foreground/10 bg-foreground/[0.025]">  
              <div className="flex items-center gap-2 mb-2">  
                <Wrench className="w-4 h-4 text-primary" />  

                <h2 className="font-bold text-sm">  
                  Solution  
                </h2>  
              </div>  

              <p className="text-sm text-muted-foreground leading-6">  
                {solution}  
              </p>  
            </div>  
          )}  
        </div>  

        {features.length > 0 && (  
          <section className="mt-7">  
            <h2 className="text-lg font-bold mb-3">  
              Key Features  
            </h2>  

            <div className="grid sm:grid-cols-2 gap-2.5">  
              {features.map((feature) => (  
                <div  
                  key={feature}  
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-foreground/[0.025] border border-foreground/10 text-sm"  
                >  
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />  

                  <span className="text-muted-foreground">  
                    {feature}  
                  </span>  
                </div>  
              ))}  
            </div>  
          </section>  
        )}  

        {highlights.length > 0 && (  
          <section className="mt-7">  
            <h2 className="text-lg font-bold mb-3">  
              Highlights  
            </h2>  

            <div className="flex flex-wrap gap-2">  
              {highlights.map((highlight) => (  
                <span  
                  key={highlight}  
                  className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/15 text-xs font-medium text-primary"  
                >  
                  {highlight}  
                </span>  
              ))}  
            </div>  
          </section>  
        )}  

        {lessons.length > 0 && (  
          <section className="mt-7">  
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">  
              <Lightbulb className="w-4 h-4 text-primary" />  
              Lessons Learned  
            </h2>  

            <ul className="space-y-2">  
              {lessons.map((lesson) => (  
                <li  
                  key={lesson}  
                  className="text-sm text-muted-foreground leading-6 pl-4 border-l-2 border-primary/20"  
                >  
                  {lesson}  
                </li>  
              ))}  
            </ul>  
          </section>  
        )}  
      </div>  

      <aside className="lg:sticky lg:top-24 space-y-4">  
        {technologies.length > 0 && (  
          <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.025] p-5">  
            <h2 className="font-bold text-sm mb-3">  
              Technology Stack  
            </h2>  

            <div className="flex flex-wrap gap-2">  
              {technologies.map((technology) => (  
                <span  
                  key={technology}  
                  className="px-2.5 py-1.5 rounded-lg bg-primary/10 border border-primary/15 text-xs font-medium text-primary"  
                >  
                  {technology}  
                </span>  
              ))}  
            </div>  
          </div>  
        )}  

        <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.025] p-5">  
          <h2 className="font-bold text-sm mb-3">  
            Project Links  
          </h2>  

          <div className="flex flex-col gap-2">  
            {liveUrl && (  
              <a  
                href={String(liveUrl)}  
                target="_blank"  
                rel="noreferrer"  
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"  
              >  
                Live project  
                <ExternalLink className="w-3.5 h-3.5" />  
              </a>  
            )}  

            {githubUrl && (  
              <a  
                href={String(githubUrl)}  
                target="_blank"  
                rel="noreferrer"  
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"  
              >  
                GitHub  
                <ExternalLink className="w-3.5 h-3.5" />  
              </a>  
            )}  
          </div>  
        </div>  
      </aside>  
    </div>  
  </article>  
</PageFrame>

);
}

export default function PortfolioPages({
type,
data,
}: {
type: PageType;
data: ApiData;
}) {
if (type === "project") {
return <ProjectDetails />;
}

if (type === "about") {
return (
<PageFrame>
<AboutSection
portfolio={{
...data.portfolio,
projectCount: data.projects.length,
experienceYears: Math.max(
1,
new Date().getFullYear() - 2023
),
}}
/>

<ServicesSection services={data.services} />  

    <LanguagesSection languages={data.languages} />  
  </PageFrame>  
);

}

if (type === "projects") {
return (
<PageFrame>
<ProjectsSection projects={data.projects} />
</PageFrame>
);
}

if (type === "skills") {
return (
<PageFrame>
<section className="max-w-7xl mx-auto w-full px-5 md:px-6 pb-20">
<div className="mb-7">
<p className="text-xs font-bold uppercase tracking-[0.16em] text-primary mb-2">
Capabilities
</p>

<h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">  
          Expertise &{" "}  
          <span className="text-gradient-primary">  
            Skills  
          </span>  
        </h1>  

        <p className="text-base text-muted-foreground max-w-2xl">  
          A focused overview of my technical expertise,  
          development stack, and professional traits.  
        </p>  
      </div>  

      <SkillCategory skills={data.skills} />  
    </section>  
  </PageFrame>  
);

}

if (type === "experience") {
return (
<PageFrame>
<section className="max-w-7xl mx-auto w-full">
<div className="px-5 md:px-6 mb-3">
<p className="text-xs font-bold uppercase tracking-[0.16em] text-primary mb-2">
Career
</p>

<h1 className="text-3xl md:text-5xl font-bold tracking-tight">  
          Career{" "}  
          <span className="text-gradient-primary">  
            Journey  
          </span>  
        </h1>  
      </div>  

      <CareerTimeline experience={data.experience} />  
    </section>  
  </PageFrame>  
);

}

if (type === "education") {
return (
<PageFrame>
<section className="max-w-7xl mx-auto w-full">
<div className="px-5 md:px-6 mb-3">
<p className="text-xs font-bold uppercase tracking-[0.16em] text-primary mb-2">
Background
</p>

<h1 className="text-3xl md:text-5xl font-bold tracking-tight">  
          Education &{" "}  
          <span className="text-gradient-primary">  
            Learning  
          </span>  
        </h1>  
      </div>  

      <EducationSection  
        education={data.education}  
        skills={data.skills}  
      />  
    </section>  
  </PageFrame>  
);

}

if (type === "contact") {
return (
<PageFrame>
<ContactSection portfolio={data.portfolio} />
</PageFrame>
);
}

return (
<StateMessage
title="Page not found"
message="The page you requested does not exist."
action={
<Link  
to="/"  
className="text-primary hover:underline"  
>
Return home
</Link>
}
/>
);
}
