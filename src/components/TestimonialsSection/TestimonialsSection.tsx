import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  { name: "Sarah Jenkins", role: "CTO at InnovateX", content: "Sourov transformed our outdated e-commerce system into a faster, scalable architecture. The new experience made the product much easier to use.", image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150" },
  { name: "David Chen", role: "Founder, Peak Analytics", content: "A thoughtful engineer with strong attention to detail. The dashboard was polished, intuitive, and easy for non-technical users to understand.", image: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150" },
  { name: "Maria Rodriguez", role: "Product Lead, Fintech Nexus", content: "Reliable delivery, clean implementation, and a strong focus on both UX and technical quality. A great partner for complex product work.", image: "https://images.pexels.com/photos/2743754/pexels-photo-2743754.jpeg?auto=compress&cs=tinysrgb&w=150" },
];

const TestimonialsSection = () => (
  <section id="testimonials" className="max-w-7xl mx-auto px-6 py-20 md:py-24">
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-12 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-3">Client feedback</p>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Client <span className="text-gradient-primary">Testimonials</span></h2>
      <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">A few words from people I've collaborated with on digital products and engineering work.</p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
      {testimonials.map((test, i) => (
        <motion.article key={test.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ delay: i * 0.1, duration: 0.5 }} className="group h-full min-w-0 rounded-[1.75rem] border border-foreground/10 bg-card/70 p-6 md:p-7 shadow-sm hover:border-primary/30 transition-colors flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-1 text-primary" aria-label="5 out of 5 stars">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className="w-3.5 h-3.5 fill-current" />)}</div>
            <Quote className="w-8 h-8 text-primary/20" />
          </div>
          <blockquote className="flex-1 text-[15px] md:text-base text-muted-foreground leading-7 break-words">“{test.content}”</blockquote>
          <div className="mt-7 pt-5 border-t border-foreground/10 flex items-center gap-3 min-w-0">
            <img src={test.image} alt={test.name} className="w-11 h-11 rounded-full object-cover border border-foreground/10 shrink-0" />
            <div className="min-w-0"><h4 className="text-foreground font-bold text-sm truncate">{test.name}</h4><p className="text-primary text-xs font-medium leading-5 break-words">{test.role}</p></div>
          </div>
        </motion.article>
      ))}
    </div>
  </section>
);

export default TestimonialsSection;
