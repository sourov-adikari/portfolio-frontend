import { ScrollTimeline } from "../lightswind/scroll-timeline";
import { Briefcase, Globe } from "lucide-react";
import type { Experience } from "../../lib/api";

export const CareerTimeline = ({ experience }: { experience: Experience[] }) => {
  const careerEvents = experience.length > 0 ? experience.map((item, index) => {
    const Icon = index % 2 === 0 ? Globe : Briefcase;
    return {
      year: item.year ?? ([item.startDate, item.endDate].filter(Boolean).join(" – ") || "Experience"),
      title: item.title ?? item.role ?? "Professional Experience",
      subtitle: item.company ?? item.subtitle ?? "",
      description: item.description ?? "",
      icon: <Icon className="h-4 w-4 mr-2 text-primary" />,
    };
  }) : [];

  return (
    <div id="career">
      {careerEvents.length === 0 && <p className="max-w-7xl mx-auto px-6 py-12 text-muted-foreground">No experience is available right now.</p>}
      {careerEvents.length > 0 &&
      <ScrollTimeline
        events={careerEvents}
        title="Career Journey"
        subtitle="An evolving path of leadership, innovation, and impact"
        animationOrder="staggered"
        cardAlignment="alternating"
        cardVariant="elevated"
        cardEffect="glow"
        parallaxIntensity={0.2}
        revealAnimation="slide"
        progressIndicator={true}
        lineColor="bg-primary/20"
        activeColor="bg-primary"
        progressLineWidth={3}
        progressLineCap="round"
        dateFormat="badge"
        connectorStyle="line"
      />}
    </div>
  );
};
