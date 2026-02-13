import { motion } from "framer-motion";
import { FileText, Users, Brain, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: FileText,
    step: "01",
    title: "Post a Job",
    description: "Create detailed job postings with requirements, skills, and qualifications.",
  },
  {
    icon: Users,
    step: "02",
    title: "Receive Applications",
    description: "Candidates apply and upload their resumes directly through your portal.",
  },
  {
    icon: Brain,
    step: "03",
    title: "AI Analyzes",
    description: "Our AI screens resumes, scores candidates, and provides detailed match analysis.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Hire Smarter",
    description: "Review ranked candidates, schedule interviews, and make confident hiring decisions.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">How It Works</span>
          <h2 className="text-4xl md:text-5xl font-bold font-display mt-3 mb-4">
            Four Steps to Better Hiring
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From job posting to hire, our AI streamlines every step of the recruitment process.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative text-center"
            >
              <div className="text-6xl font-bold font-display text-primary/10 mb-4">{step.step}</div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary/20">
                <step.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold font-display mb-2">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
