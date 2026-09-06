import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import type { Portfolio, Project } from "../../lib/api";
import { api } from "../../lib/api";

const SITE_URL = "https://sourovadikari.xyz";
const DEFAULT_TITLE = "Sourov Chandra Adikari — Full Stack Web Developer";
const DEFAULT_DESCRIPTION = "Portfolio of Sourov Chandra Adikari, a Full Stack Web Developer building modern, responsive web applications with React, Next.js, TypeScript, Node.js, and modern backend technologies.";

const PAGE_META: Record<string, { title: string; description: string }> = {
  "/": { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
  "/about": { title: "About — Sourov Chandra Adikari", description: "Learn more about Sourov Chandra Adikari, his background, services, languages, and approach to full-stack web development." },
  "/skills": { title: "Expertise & Skills — Sourov Chandra Adikari", description: "Explore Sourov Chandra Adikari's full-stack development expertise, technologies, tools, and professional traits." },
  "/projects": { title: "Projects — Sourov Chandra Adikari", description: "Explore selected web development projects, technologies, features, and practical solutions built by Sourov Chandra Adikari." },
  "/experience": { title: "Experience — Sourov Chandra Adikari", description: "Explore the professional development journey and practical experience of Sourov Chandra Adikari." },
  "/education": { title: "Education — Sourov Chandra Adikari", description: "Explore the academic background and ongoing learning journey of Sourov Chandra Adikari." },
  "/contact": { title: "Contact — Sourov Chandra Adikari", description: "Get in touch with Sourov Chandra Adikari for web development opportunities, collaboration, or professional inquiries." },
};

function upsertMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
}

export default function SEO({ portfolio, project }: { portfolio?: Portfolio; project?: Project | null }) {
  const location = useLocation();
  const { slug } = useParams();
  const [routeProject, setRouteProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!slug || project) return;
    let active = true;
    void api.getProject(slug).then((result) => {
      if (active) setRouteProject(result);
    }).catch(() => {
      if (active) setRouteProject(null);
    });
    return () => { active = false; };
  }, [slug, project]);

  useEffect(() => {
    const currentProject = project ?? routeProject;
    const routeMeta = PAGE_META[location.pathname] ?? {
      title: "Page Not Found — Sourov Chandra Adikari",
      description: "The requested page could not be found on Sourov Chandra Adikari's portfolio.",
    };
    const projectTitle = currentProject ? String(currentProject.title ?? currentProject.name ?? "Project") : "";
    const title = currentProject ? `${projectTitle} — Sourov Chandra Adikari` : routeMeta.title;
    const description = currentProject
      ? String(currentProject.description ?? currentProject.subtitle ?? DEFAULT_DESCRIPTION)
      : location.pathname === "/" ? DEFAULT_DESCRIPTION : String(portfolio?.about ?? routeMeta.description);
    const canonicalPath = currentProject && currentProject.slug
      ? `/projects/${encodeURIComponent(String(currentProject.slug))}`
      : location.pathname;
    const canonicalUrl = `${SITE_URL}${canonicalPath === "/" ? "/" : canonicalPath.replace(/\/$/, "")}`;
    const isNotFound = !PAGE_META[location.pathname] && !currentProject;

    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("name", "author", "Sourov Chandra Adikari");
    upsertMeta("name", "robots", isNotFound ? "noindex, nofollow" : "index, follow");
    upsertMeta("name", "theme-color", "#0b0b0f");
    upsertMeta("property", "og:type", currentProject ? "article" : "website");
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:site_name", "Sourov Chandra Adikari Portfolio");
    upsertMeta("property", "twitter:card", "summary_large_image");
    upsertMeta("property", "twitter:title", title);
    upsertMeta("property", "twitter:description", description);

    if (currentProject?.image || portfolio?.avatarUrl) {
      const image = String(currentProject?.image ?? portfolio?.avatarUrl);
      upsertMeta("property", "og:image", image.startsWith("http") ? image : `${SITE_URL}${image.startsWith("/") ? "" : "/"}${image}`);
    }
    upsertLink("canonical", canonicalUrl);

    let structuredData = document.head.querySelector<HTMLScriptElement>('script[data-portfolio-jsonld="true"]');
    if (!structuredData) {
      structuredData = document.createElement("script");
      structuredData.type = "application/ld+json";
      structuredData.dataset.portfolioJsonld = "true";
      document.head.appendChild(structuredData);
    }
    structuredData.textContent = JSON.stringify(currentProject
      ? {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: projectTitle,
          description,
          url: canonicalUrl,
          author: { "@type": "Person", name: "Sourov Chandra Adikari", url: SITE_URL },
        }
      : {
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Sourov Chandra Adikari",
          url: SITE_URL,
          jobTitle: String(portfolio?.title ?? portfolio?.role ?? "Full Stack Web Developer"),
          address: { "@type": "PostalAddress", addressLocality: "Pirganj", addressCountry: "BD" },
          sameAs: [
            "https://github.com/ursourovadikari",
            "https://www.linkedin.com/in/sourov-chandra-adikari-88b717428",
            "https://www.instagram.com/iamsourovadikari",
            "https://www.facebook.com/URSourovAdikari",
          ],
        });
  }, [location.pathname, portfolio, project, routeProject]);

  return null;
}
