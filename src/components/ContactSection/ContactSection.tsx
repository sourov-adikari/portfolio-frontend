import * as React from "react";
import { motion } from "framer-motion";
import {
  Send,
  MapPin,
  Mail,
  Phone,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Input } from "../lightswind/input";
import { Textarea } from "../lightswind/textarea";
import { Button } from "../lightswind/button";
import { api } from "../../lib/api";
import type { Portfolio } from "../../lib/api";

const BUSINESS_EMAIL = "contact@sourovadikari.xyz";

const EMAIL_PATTERN =
  /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i;

const isValidEmail = (email: string) => EMAIL_PATTERN.test(email.trim());

const HIRE_ME_SUBJECT = "Hire Me — Full Stack Web Development";

export const ContactSection = ({ portfolio }: { portfolio: Portfolio }) => {
  const [searchParams] = useSearchParams();
  const requestedSubject = searchParams.get("subject");

  const [form, setForm] = React.useState({
    name: "",
    email: "",
    subject: requestedSubject || "",
    message: "",
  });

  const [status, setStatus] = React.useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const subject = searchParams.get("subject");

    if (subject) {
      setForm((current) => ({ ...current, subject }));
    }
  }, [searchParams]);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));

    if (status !== "idle") {
      setStatus("idle");
      setError("");
    }
  };

  // Automatically reset success/error feedback.
  React.useEffect(() => {
    if (status !== "success" && status !== "error") {
      return;
    }

    const timeout = window.setTimeout(
      () => {
        setStatus("idle");
        setError("");
      },
      status === "success" ? 5000 : 7000
    );

    return () => window.clearTimeout(timeout);
  }, [status]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = form.email.trim();

    if (!isValidEmail(email)) {
      setStatus("error");
      setError("Enter a valid email address.");
      return;
    }

    setStatus("sending");
    setError("");

    try {
      await api.sendContact({ ...form, email });

      setStatus("success");
      setForm({
        name: "",
        email: "",
        subject: requestedSubject || "",
        message: "",
      });
    } catch (submitError) {
      setStatus("error");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to send your message."
      );
    }
  };

  return (
    <section
      id="contact"
      className="max-w-7xl mx-auto px-5 md:px-6 py-16 md:py-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
        className="mb-9 text-center"
      >
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary mb-2">
          Get in touch
        </p>

        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
          Let's <span className="text-gradient-primary">Connect</span>
        </h2>

        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Have a project, collaboration idea, or opportunity in mind? Tell
          me what you're building and I'll get back to you.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-5 items-stretch">
        {/* Contact information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          whileHover={{ y: -4 }}
          viewport={{ once: true }}
          className="portfolio-card rounded-[1.75rem] border border-foreground/10 bg-card/70 p-6 md:p-7 flex flex-col justify-between"
        >
          <div>
            <span className="inline-flex px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
              Available for work
            </span>

            <h3 className="text-2xl md:text-3xl font-bold mt-4 mb-2">
              Let's build something useful.
            </h3>

            <p className="text-sm text-muted-foreground leading-6">
              Whether you need a full-stack application, a polished
              interface, or help turning an idea into a working product,
              I'm open to thoughtful collaborations.
            </p>
          </div>

          <div className="mt-8 space-y-2.5">
            <div className="portfolio-card flex items-center gap-3 rounded-2xl border border-foreground/10 bg-background/60 px-3.5 py-3">
              <div className="portfolio-icon w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>

              <a
                href={`mailto:${BUSINESS_EMAIL}`}
                className="font-medium text-sm break-all hover:text-primary transition-colors"
              >
                {BUSINESS_EMAIL}
              </a>

              <a
                href={`mailto:${BUSINESS_EMAIL}`}
                aria-label="Open email"
                className="ml-auto p-2 text-muted-foreground hover:text-primary hover:scale-110 transition-all shrink-0"
              >
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            {portfolio.phone && (
              <div className="portfolio-card flex items-center gap-3 rounded-2xl border border-foreground/10 bg-background/60 px-3.5 py-3">
                <div className="portfolio-icon w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>

                <span className="font-medium text-sm">{portfolio.phone}</span>
              </div>
            )}

            <div className="portfolio-card flex items-center gap-3 rounded-2xl border border-foreground/10 bg-background/60 px-3.5 py-3">
              <div className="portfolio-icon w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>

              <span className="font-medium text-sm">
                {portfolio.location ?? "Pirganj, Bangladesh"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Contact form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          whileHover={{ y: -4 }}
          viewport={{ once: true }}
          className="portfolio-card rounded-[1.75rem] border border-foreground/10 bg-card/70 p-5 md:p-7"
        >
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {requestedSubject === HIRE_ME_SUBJECT && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary"
              >
                You're contacting me about a hiring opportunity. The
                subject has been prepared for you.
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Your Name
                </label>

                <Input
                  type="text"
                  className="rounded-xl py-3 px-4 bg-background/70 border-foreground/10 text-foreground"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Your Email
                </label>

                <Input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  className="rounded-xl py-3 px-4 bg-background/70 border-foreground/10 text-foreground"
                  placeholder="you@gmail.com"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  required
                  aria-invalid={status === "error" && Boolean(form.email)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Subject
              </label>

              <Input
                type="text"
                className="rounded-xl py-3 px-4 bg-background/70 border-foreground/10 text-foreground"
                placeholder="Project inquiry"
                value={form.subject}
                onChange={(e) => updateField("subject", e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Message
              </label>

              <Textarea
                rows={6}
                className="rounded-xl py-3 px-4 bg-background/70 border-foreground/10 text-foreground resize-none min-h-[150px]"
                placeholder="Tell me about your project..."
                value={form.message}
                onChange={(e) => updateField("message", e.target.value)}
                required
              />
            </div>

            {/* Send button with inline feedback */}
            <Button
              type="submit"
              size="lg"
              disabled={status === "sending"}
              aria-live="polite"
              className={`w-full rounded-xl font-bold h-11 transition-all duration-300 ${
                status === "success"
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : status === "error"
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              } ${status === "sending" ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {status === "sending" ? (
                <>
                  <LoaderCircle className="w-4 h-4 mr-1 animate-spin" />
                  Sending...
                </>
              ) : status === "success" ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-1 shrink-0" />
                  Message Sent
                </>
              ) : status === "error" ? (
                <>
                  <AlertCircle className="w-4 h-4 mr-1 shrink-0" />
                  <span className="truncate">{error || "Unable to send"}</span>
                </>
              ) : (
                <>
                  Send Message
                  <Send className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};
