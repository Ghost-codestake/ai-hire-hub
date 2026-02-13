import { motion } from "framer-motion";
import { Brain, BarChart3, MessageSquareText, ShieldCheck, Activity } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Resume Screening",
    description: "Automatically parse and analyze resumes to extract key skills, experience, and qualifications in seconds.",
  },
  {
    icon: BarChart3,
    title: "Candidate Ranking",
    description: "Get intelligent match scores from 0-100% with detailed skill breakdowns and gap analysis.",
  },
  {
    icon: MessageSquareText,
    title: "Smart Interview Questions",
    description: "Generate tailored behavioral and technical interview questions based on the job requirements.",
  },
  {
    icon: ShieldCheck,
    title: "Bias-Reduced Matching",
    description: "Our AI focuses on skills and qualifications, helping reduce unconscious bias in the screening process.",
  },
  {
    icon: Activity,
    title: "Real-time Analytics",
    description: "Track your hiring pipeline with live dashboards, funnel metrics, and performance insights.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Features</span>
          <h2 className="text-4xl md:text-5xl font-bold font-display mt-3 mb-4">
            Everything You Need to Hire Better
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A complete AI-powered toolkit that transforms how you find, evaluate, and hire top talent.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-8 rounded-2xl border border-border bg-background hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold font-display mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
