import type { ReactNode } from "react";

const API_URL = (import.meta.env.API_URL ?? "http://localhost:5000").replace(/\/$/, "");

export interface Portfolio { name?: string; fullName?: string; title?: string; role?: string; location?: string; email?: string; phone?: string; about?: string; [key: string]: ReactNode; }
export interface Project { id: string | number; title?: string; name?: string; slug?: string; description?: string; subtitle?: string; longDescription?: string; category?: string; status?: string; year?: string | number; purpose?: string; solution?: string; image?: string; imageUrl?: string; technologies?: ReactNode; features?: ReactNode; highlights?: ReactNode; lessons?: ReactNode; [key: string]: ReactNode; }
export interface Skill { id?: string | number; name: string; level?: number; category?: string; focus?: string; progress?: number; [key: string]: ReactNode; }
export interface Experience { id?: string | number; year?: string; startDate?: string; endDate?: string; title?: string; role?: string; company?: string; subtitle?: string; description?: string; [key: string]: ReactNode; }
export interface Education { id?: string | number; degree?: string; school?: string; institution?: string; year?: string; startDate?: string; endDate?: string; badge?: string; details?: string[]; description?: string; [key: string]: ReactNode; }
export interface Language { id?: string | number; name: string; level?: string; [key: string]: ReactNode; }
export interface Social { id?: string | number; name?: string; platform?: string; url: string; [key: string]: ReactNode; }
export interface Service { id?: string | number; title: string; description: string; focus?: string[]; [key: string]: ReactNode; }
export interface ContactPayload { name: string; email: string; subject: string; message: string; }
export interface NewsletterPayload { email: string; }
export interface NewsletterResponse { message?: string; status?: "subscribed" | "already_subscribed" | "pending_confirmation"; }
interface ApiEnvelope<T> { data?: T; results?: T; items?: T; [key: string]: unknown; }

function unwrap<T>(payload: T | ApiEnvelope<T>, key?: string): T { if (payload && typeof payload === "object" && !Array.isArray(payload)) { const envelope = payload as ApiEnvelope<T>; if (key && key in envelope) return envelope[key] as T; return envelope.data ?? envelope.results ?? envelope.items ?? payload as T; } return payload as T; }
function normalizeSkills(value: unknown): Skill[] { if (!Array.isArray(value)) return []; return value.map((item, index) => { const skill = (item ?? {}) as Record<string, unknown>; return { ...skill, id: skill.id as string | number | undefined ?? index, name: typeof skill.name === "string" ? skill.name : "Skill", category: typeof skill.category === "string" ? skill.category : "Technical Skills", focus: typeof skill.focus === "string" ? skill.focus : undefined, progress: typeof skill.progress === "number" ? Math.min(100, Math.max(0, skill.progress)) : undefined }; }); }
function normalizeExperience(value: unknown): Experience[] { if (!Array.isArray(value)) return []; return value.map((item, index) => { const entry = (item ?? {}) as Record<string, unknown>; return { ...entry, id: entry.id as string | number | undefined ?? index, year: typeof entry.period === "string" ? entry.period : typeof entry.year === "string" ? entry.year : undefined, title: typeof entry.role === "string" ? entry.role : typeof entry.title === "string" ? entry.title : undefined }; }); }
function normalizeEducation(value: unknown): Education[] { if (!Array.isArray(value)) return []; return value.map((item, index) => { const entry = (item ?? {}) as Record<string, unknown>; const detail = typeof entry.detail === "string" ? entry.detail : undefined; return { ...entry, id: entry.id as string | number | undefined ?? index, degree: typeof entry.title === "string" ? entry.title : typeof entry.degree === "string" ? entry.degree : undefined, school: typeof entry.school === "string" ? entry.school : typeof entry.institution === "string" ? entry.institution : undefined, year: typeof entry.period === "string" ? entry.period : typeof entry.year === "string" ? entry.year : undefined, details: Array.isArray(entry.details) ? entry.details.filter((x): x is string => typeof x === "string") : detail ? [detail] : [] }; }); }
function normalizeLanguages(value: unknown): Language[] { return Array.isArray(value) ? value.map((item, index) => { const e = (item ?? {}) as Record<string, unknown>; return { ...e, id: e.id as string | number | undefined ?? index, name: typeof e.language === "string" ? e.language : typeof e.name === "string" ? e.name : "Language", level: typeof e.level === "string" ? e.level : undefined }; }) : []; }
function normalizeSocials(value: unknown): Social[] { return Array.isArray(value) ? value.map((item, index) => { const e = (item ?? {}) as Record<string, unknown>; return { ...e, id: e.id as string | number | undefined ?? index, name: typeof e.label === "string" ? e.label : typeof e.name === "string" ? e.name : undefined, platform: typeof e.label === "string" ? e.label : typeof e.platform === "string" ? e.platform : undefined, url: typeof e.href === "string" ? e.href : typeof e.url === "string" ? e.url : "" }; }).filter(x => Boolean(x.url)) : []; }
function normalizeServices(value: unknown): Service[] { return Array.isArray(value) ? value.filter((x): x is Record<string, unknown> => Boolean(x) && typeof x === "object" && !Array.isArray(x)).map((e, index) => ({ ...e, id: e.id as string | number | undefined ?? index, title: typeof e.title === "string" ? e.title : "Service", description: typeof e.description === "string" ? e.description : "", focus: Array.isArray(e.focus) ? e.focus.filter((x): x is string => typeof x === "string") : [] })) : []; }

async function request<T>(path: string, init?: RequestInit, key?: string): Promise<T> { const controller = new AbortController(); const timeout = window.setTimeout(() => controller.abort(), 12000); try { const response = await fetch(`${API_URL}${path}`, { ...init, signal: init?.signal ?? controller.signal, headers: { "Content-Type": "application/json", ...init?.headers } }); const payload: unknown = await response.json().catch(() => undefined); if (!response.ok) throw new Error((payload as { error?: { message?: string } } | undefined)?.error?.message ?? "Portfolio API request failed"); return unwrap(payload as T | ApiEnvelope<T>, key); } catch (error) { if (error instanceof DOMException && error.name === "AbortError") throw new Error("Portfolio API request timed out"); throw error; } finally { window.clearTimeout(timeout); } }

export const api = {
  getHealth: () => request<{ status?: string }>("/api/health"),
  getPortfolio: () => request<Portfolio>("/api/portfolio", undefined, "personalInfo"),
  getProjects: () => request<Project[]>("/api/projects", undefined, "projects"),
  getProject: (slug: string) => request<Project>(`/api/projects/${encodeURIComponent(slug)}`, undefined, "project"),
  getSkills: async () => { const p = await request<{ skills?: unknown; skillDetails?: unknown; professionalTraits?: unknown }>("/api/skills"); const details = normalizeSkills(p.skillDetails); const traits = Array.isArray(p.professionalTraits) ? p.professionalTraits.filter((x): x is string => typeof x === "string").map((name, i) => ({ id: `trait-${i}`, name, category: "Professional Traits" })) : []; return [...details, ...traits]; },
  getExperience: async () => normalizeExperience(await request<unknown>("/api/experience", undefined, "experience")),
  getEducation: async () => normalizeEducation(await request<unknown>("/api/education", undefined, "education")),
  getLanguages: async () => normalizeLanguages(await request<unknown>("/api/languages", undefined, "languages")),
  getSocials: async () => normalizeSocials(await request<unknown>("/api/socials", undefined, "socials")),
  getServices: async () => normalizeServices(await request<unknown>("/api/services", undefined, "services")),
  getGithubProjects: () => request<Project[]>("/api/projects/github", undefined, "repositories"),
  sendContact: (payload: ContactPayload) => request<{ message?: string }>("/api/contact", { method: "POST", body: JSON.stringify(payload) }),
  subscribeNewsletter: (payload: NewsletterPayload) => request<NewsletterResponse>("/api/newsletter/subscribe", { method: "POST", body: JSON.stringify(payload) }),
};

export type ApiData = { portfolio: Portfolio; projects: Project[]; skills: Skill[]; experience: Experience[]; education: Education[]; languages: Language[]; socials: Social[]; services: Service[]; };
