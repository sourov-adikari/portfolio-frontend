import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Command, Menu, X } from "lucide-react";
import { useLenis } from "lenis/react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Portfolio } from "../../lib/api";
import { ThemeToggle } from "../lightswind/theme-toggle";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Skills", href: "/skills" },
  { name: "Education", href: "/education" },
  { name: "Career", href: "/experience" },
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
];

const commandItems = navItems;

export default function Header({ portfolio }: { portfolio: Portfolio }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const lenis = useLenis();
  const navigate = useNavigate();
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const commandInputRef = useRef<HTMLInputElement>(null);
  const wasMobileMenuOpen = useRef(false);

  const isOverlayOpen = isMobileMenuOpen || isCommandOpen;

  const closeOverlays = () => {
    setIsMobileMenuOpen(false);
    setIsCommandOpen(false);
    setCommandQuery("");
  };

  const handleNavigate = (href: string) => {
    if (href === "/" && location.pathname === "/" && lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      navigate(href);
    }
    closeOverlays();
  };

  const isActive = (href: string) => href === "/"
    ? location.pathname === "/"
    : location.pathname === href || location.pathname.startsWith(`${href}/`);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsMobileMenuOpen(false);
        setIsCommandOpen((open) => !open);
        setCommandQuery("");
        return;
      }

      if (event.key === "Escape" && isOverlayOpen) {
        event.preventDefault();
        closeOverlays();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOverlayOpen]);

  // Fully lock page scrolling while an overlay is open, including iOS-style viewport behavior.
  useEffect(() => {
    if (!isOverlayOpen) return;

    const scrollY = window.scrollY;
    const body = document.body;
    const html = document.documentElement;
    const previous = {
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      bodyOverflow: body.style.overflow,
      htmlOverscroll: html.style.overscrollBehavior,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    lenis?.stop();

    return () => {
      body.style.position = previous.bodyPosition;
      body.style.top = previous.bodyTop;
      body.style.width = previous.bodyWidth;
      body.style.overflow = previous.bodyOverflow;
      html.style.overscrollBehavior = previous.htmlOverscroll;
      lenis?.start();
      window.scrollTo({ top: scrollY, left: 0, behavior: "auto" });
    };
  }, [isOverlayOpen, lenis]);

  // Keep keyboard focus inside the mobile menu and return it to the trigger when the menu closes.
  useEffect(() => {
    if (!isMobileMenuOpen) {
      if (wasMobileMenuOpen.current) {
        mobileTriggerRef.current?.focus({ preventScroll: true });
      }
      wasMobileMenuOpen.current = false;
      return;
    }

    wasMobileMenuOpen.current = true;
    const menu = mobileMenuRef.current;
    if (!menu) return;

    const focusableSelector = [
      "button:not([disabled])",
      "a[href]",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "[tabindex]:not([tabindex=\"-1\"])",
    ].join(",");

    const firstFocusable = menu.querySelector<HTMLElement>(focusableSelector);
    firstFocusable?.focus({ preventScroll: true });

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const focusable = Array.from(menu.querySelectorAll<HTMLElement>(focusableSelector));
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    menu.addEventListener("keydown", trapFocus);
    return () => menu.removeEventListener("keydown", trapFocus);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isCommandOpen) {
      requestAnimationFrame(() => commandInputRef.current?.focus({ preventScroll: true }));
    }
  }, [isCommandOpen]);

  const filteredCommands = commandItems.filter((item) =>
    item.name.toLowerCase().includes(commandQuery.trim().toLowerCase()),
  );

  const menuTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.22, ease: "easeOut" as const };

  return (
    <>
      <header className="fixed top-3 md:top-6 left-0 right-0 z-50 flex justify-center px-3 md:px-4 pointer-events-none">
        <div className="w-full max-w-7xl flex items-center justify-between gap-3 rounded-2xl border border-foreground/[0.08] bg-background/65 px-2 py-2 shadow-lg shadow-black/5 backdrop-blur-xl supports-[backdrop-filter]:bg-background/45 pointer-events-auto">
          <button onClick={() => handleNavigate("/")} className="cursor-pointer font-extrabold text-lg flex items-center gap-3 group select-none" aria-label="Go to home">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-primary to-sky-400 p-[1px] shadow-lg group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-background rounded-[11px] flex items-center justify-center">
                <span className="font-extrabold text-xs tracking-tighter bg-gradient-to-r from-purple-500 to-sky-400 bg-clip-text text-transparent">SC</span>
              </div>
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-extrabold tracking-tight text-foreground text-sm leading-none group-hover:text-primary transition-colors">{portfolio.fullName ?? portfolio.name ?? "Portfolio"}</span>
              <span className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase mt-0.5">Portfolio</span>
            </div>
          </button>

          <nav className="hidden md:flex flex-1 justify-center" aria-label="Primary navigation">
            <ul className="flex items-center gap-1">
              {navItems.slice(0, 5).map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.name} className="relative">
                    <button onClick={() => handleNavigate(item.href)} className={`relative cursor-pointer px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${active ? "text-foreground bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"}`} aria-current={active ? "page" : undefined}>
                      {item.name}
                      {active && <motion.span layoutId="active-nav" className="absolute left-1/2 -bottom-1 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5">
            <button onClick={() => setIsCommandOpen(true)} className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-background/50 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors" aria-label="Open quick navigation">
              <Command className="w-3.5 h-3.5" /><span>⌘K</span>
            </button>
            <ThemeToggle />
            <button
              ref={mobileTriggerRef}
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden inline-flex items-center justify-center rounded-xl border border-foreground/10 bg-foreground/[0.035] p-2 text-foreground transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary active:scale-95"
              aria-label="Open navigation"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="fixed inset-0 z-40 md:hidden pointer-events-auto flex flex-col bg-background/75 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/55 overscroll-contain overflow-hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={menuTransition}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) setIsMobileMenuOpen(false);
              }}
            >
              <motion.div
                id="mobile-navigation"
                ref={mobileMenuRef}
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation"
                className="absolute inset-3 bottom-3 rounded-[28px] border border-foreground/[0.09] bg-background/70 shadow-2xl shadow-black/10 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/50 overflow-hidden"
                initial={{ y: prefersReducedMotion ? 0 : -18, opacity: 0, scale: prefersReducedMotion ? 1 : 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: prefersReducedMotion ? 0 : -12, opacity: 0, scale: prefersReducedMotion ? 1 : 0.985 }}
                transition={menuTransition}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-foreground/[0.07]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-primary to-sky-400 p-px">
                        <div className="w-full h-full rounded-[11px] bg-background/80 flex items-center justify-center">
                          <span className="font-extrabold text-xs tracking-tighter bg-gradient-to-r from-purple-500 to-sky-400 bg-clip-text text-transparent">SC</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">Navigation</p>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Explore portfolio</p>
                      </div>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="inline-flex items-center justify-center rounded-xl border border-foreground/10 bg-foreground/[0.035] p-2.5 text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/10 hover:text-primary active:scale-95" aria-label="Close navigation">
                      <X size={20} />
                    </button>
                  </div>

                  <nav className="flex-1 overflow-y-auto overscroll-contain px-4 py-5" aria-label="Mobile navigation links">
                    <ul className="space-y-2">
                      {navItems.map((item, index) => {
                        const active = isActive(item.href);
                        return (
                          <motion.li key={item.name} initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -10 }} animate={{ opacity: 1, x: 0 }} transition={prefersReducedMotion ? { duration: 0 } : { delay: index * 0.035 }}>
                            <button onClick={() => handleNavigate(item.href)} className={`w-full flex items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition-all active:scale-[0.985] ${active ? "border-primary/25 bg-primary/10 text-foreground shadow-sm" : "border-transparent text-muted-foreground hover:border-foreground/10 hover:bg-foreground/[0.045] hover:text-foreground"}`} aria-current={active ? "page" : undefined}>
                              <span className="text-base font-semibold">{item.name}</span>
                              <span className={`h-1.5 w-1.5 rounded-full transition-all ${active ? "bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.55)]" : "bg-foreground/15"}`} />
                            </button>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </nav>

                  <div className="px-4 pb-4">
                    <div className="rounded-2xl border border-foreground/[0.08] bg-foreground/[0.025] px-4 py-3 backdrop-blur-md">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold text-foreground">Quick access</p>
                          <p className="mt-0.5 text-[10px] text-muted-foreground">All portfolio pages are available here.</p>
                        </div>
                        <span className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-primary">Ready</span>
                      </div>
                    </div>
                  </div>

                  <div className="mx-4 mb-4 h-1 rounded-full bg-foreground/10" aria-hidden="true" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {isCommandOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-background/60 backdrop-blur-sm flex items-start justify-center px-4 pt-[18vh] overscroll-contain" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={closeOverlays}>
            <motion.div className="w-full max-w-lg rounded-2xl border border-foreground/10 bg-background shadow-2xl overflow-hidden" initial={{ opacity: 0, y: -12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: 0.98 }} onMouseDown={(event) => event.stopPropagation()}>
              <div className="flex items-center gap-2 px-4 py-3 border-b border-foreground/10">
                <Command className="w-4 h-4 text-primary" />
                <input ref={commandInputRef} value={commandQuery} onChange={(event) => setCommandQuery(event.target.value)} placeholder="Jump to a page..." aria-label="Quick navigation search" className="flex-1 bg-transparent outline-none text-sm" />
                <kbd className="hidden sm:inline-flex rounded-md border border-foreground/10 px-1.5 py-0.5 text-[10px] text-muted-foreground">ESC</kbd>
              </div>
              <div className="p-2 max-h-80 overflow-y-auto overscroll-contain">
                {filteredCommands.length ? filteredCommands.map((item) => (
                  <button key={item.href} onClick={() => handleNavigate(item.href)} className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors">
                    <span>{item.name}</span><span className="text-xs">{item.href}</span>
                  </button>
                )) : <p className="px-3 py-6 text-center text-sm text-muted-foreground">No matching page.</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
