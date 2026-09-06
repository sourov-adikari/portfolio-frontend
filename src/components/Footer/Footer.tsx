import { useState } from "react";
import { Github, Linkedin, Instagram, Facebook, MessageCircle, Mail, ArrowUp, Send, CheckCircle2, LoaderCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { MorphingText } from "../lightswind/morphing-text";
import type { Portfolio, Social } from "../../lib/api";
import { api } from "../../lib/api";

const BUSINESS_EMAIL = "contact@sourovadikari.xyz";
const EMAIL_PATTERN = /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i;

export const Footer = ({ portfolio, socials }: { portfolio: Portfolio; socials: Social[] }) => {
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const morphingTexts = ["Full-Stack Developer", "UI/UX Architect", "AI Systems Engineer", "Product Builder", "Sourov Chandra Adikari"];
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const navLinks = [
    { name: "Home", href: "/" }, { name: "About", href: "/about" }, { name: "Career", href: "/experience" },
    { name: "Projects", href: "/projects" }, { name: "Education", href: "/education" }, { name: "Contact", href: "/contact" },
  ];
  const socialIcon = (social: Social) => { const label = String(social.platform ?? social.name ?? "").toLowerCase(); if (label.includes("facebook")) return Facebook; if (label.includes("instagram")) return Instagram; if (label.includes("whatsapp")) return MessageCircle; if (label.includes("github")) return Github; if (label.includes("linkedin")) return Linkedin; if (label.includes("mail") || label.includes("email")) return Mail; return MessageCircle; };
  const handleNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const normalizedEmail = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(normalizedEmail)) { setNewsletterStatus("error"); setNewsletterMessage("Please enter a valid email address, such as name@gmail.com or name@yahoo.com."); return; }
    setNewsletterStatus("submitting"); setNewsletterMessage("");
    try { const result = await api.subscribeNewsletter({ email: normalizedEmail }); setNewsletterStatus("success"); setNewsletterMessage(result.status === "already_subscribed" ? "You're already subscribed." : "You're subscribed successfully."); setEmail(""); }
    catch (error) { setNewsletterStatus("error"); setNewsletterMessage(error instanceof Error ? error.message : "Unable to subscribe right now."); }
  };

  return (
    <footer className="w-full relative z-10 pt-16 pb-16 md:pb-20 bg-background border-t border-foreground/10 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-primary/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-7 border-b border-foreground/10">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-primary to-sky-400 p-[1px] shadow-lg"><div className="w-full h-full bg-background rounded-[11px] flex items-center justify-center"><span className="font-extrabold text-xs tracking-tighter bg-gradient-to-r from-purple-500 to-sky-400 bg-clip-text text-transparent">SC</span></div></div>
            <div className="flex flex-col text-left"><span className="font-extrabold tracking-tight text-foreground text-base leading-none">{portfolio.fullName ?? portfolio.name ?? "Portfolio"}</span><span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mt-0.5">{portfolio.role ?? portfolio.title ?? "Full Stack Developer"}</span></div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/contact?subject=Hire%20Me%20%E2%80%94%20Full%20Stack%20Web%20Development" className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-lg hover:shadow-xl hover:shadow-primary/15">Hire Me <Send className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
            <button onClick={scrollToTop} className="group flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel border border-foreground/10 text-xs font-bold text-foreground hover:text-primary hover:border-primary/40 hover:-translate-y-0.5 transition-all shadow-sm cursor-pointer"><span>Back to top</span><ArrowUp className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" /></button>
          </div>
        </div>

        <div className="py-10 text-center flex flex-col items-center justify-center">
          <span className="text-xs font-extrabold uppercase tracking-widest text-primary mb-3 bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">Innovate & Build</span>
          <MorphingText texts={morphingTexts} morphTime={1.6} cooldownTime={0.8} className="text-3xl md:text-5xl lg:text-6xl text-foreground font-extrabold min-h-[70px] text-center" />
        </div>

        <div className="portfolio-card rounded-[1.75rem] border border-primary/20 bg-primary/[0.045] p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="max-w-xl text-center lg:text-left"><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary mb-2">Newsletter</p><h3 className="text-2xl md:text-3xl font-bold tracking-tight">Stay in the loop.</h3><p className="text-sm text-muted-foreground mt-2 leading-relaxed">Get occasional updates about new projects, useful web development insights, and things I'm building.</p></div>
          <form onSubmit={handleNewsletterSubmit} className="w-full lg:w-auto lg:min-w-[440px]" noValidate>
            <div className="flex flex-col sm:flex-row gap-2.5"><div className="relative flex-1"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input type="email" inputMode="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); if (newsletterStatus !== "idle") { setNewsletterStatus("idle"); setNewsletterMessage(""); } }} placeholder="you@gmail.com" aria-label="Email address for newsletter" className="w-full h-11 rounded-xl border border-foreground/10 bg-background/80 pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10" required /></div><button type="submit" disabled={newsletterStatus === "submitting"} className="group h-11 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-bold inline-flex items-center justify-center gap-2 hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/15 disabled:opacity-60 disabled:cursor-not-allowed transition-all">{newsletterStatus === "submitting" ? <><LoaderCircle className="w-4 h-4 animate-spin" /> Subscribing...</> : "Subscribe"}<Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></button></div>
            {newsletterStatus === "success" && <p className="mt-2 text-xs text-emerald-500 flex items-center gap-1.5" role="status" aria-live="polite"><CheckCircle2 className="w-3.5 h-3.5" />{newsletterMessage}</p>}
            {newsletterStatus === "error" && <p className="mt-2 text-xs text-red-500" role="alert">{newsletterMessage}</p>}
          </form>
        </div>

        <div className="py-5 border-y border-foreground/10 flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm font-semibold text-muted-foreground">{navLinks.map((link) => <Link key={link.href} to={link.href} className="relative hover:text-foreground transition-colors after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">{link.name}</Link>)}</div>

        <div className="pt-2 flex flex-col md:flex-row items-center justify-between gap-5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2.5">{socials.map((social, i) => { const label = social.platform ?? social.name ?? "Social link"; const Icon = socialIcon(social); return <a key={`${label}-${social.url}-${i}`} href={social.url} target="_blank" rel="noreferrer" title={label} aria-label={label} className="group relative isolate w-11 h-11 min-w-11 min-h-11 shrink-0 rounded-2xl border border-foreground/10 bg-foreground/[0.035] flex items-center justify-center text-muted-foreground shadow-sm overflow-hidden transition-[transform,border-color,box-shadow,color,background-color] duration-300 ease-out hover:-translate-y-1 hover:scale-[1.04] hover:text-primary hover:border-primary/45 hover:bg-primary/[0.08] hover:shadow-[0_12px_30px_rgba(139,92,246,0.16)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:translate-y-0 active:scale-[0.98]"><span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/15 via-transparent to-sky-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" /><Icon className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:scale-110" /></a>; })}<a href={`mailto:${BUSINESS_EMAIL}`} title="Email" aria-label="Email" className="group relative isolate w-11 h-11 min-w-11 min-h-11 shrink-0 rounded-2xl border border-foreground/10 bg-foreground/[0.035] flex items-center justify-center text-muted-foreground shadow-sm overflow-hidden transition-[transform,border-color,box-shadow,color,background-color] duration-300 ease-out hover:-translate-y-1 hover:scale-[1.04] hover:text-primary hover:border-primary/45 hover:bg-primary/[0.08] hover:shadow-[0_12px_30px_rgba(139,92,246,0.16)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:translate-y-0 active:scale-[0.98]"><span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/15 via-transparent to-sky-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" /><Mail className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:scale-110" /></a></div>
          <span className="font-medium text-center md:text-right">© {new Date().getFullYear()} Sourov Chandra Adikari.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
