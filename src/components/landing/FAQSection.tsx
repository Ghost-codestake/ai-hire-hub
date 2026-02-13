import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How accurate is the AI scoring?",
    answer: "Our AI achieves 95%+ accuracy in matching candidates to job requirements. It uses advanced NLP to understand context, not just keywords, ensuring nuanced and reliable scoring.",
  },
  {
    question: "Is candidate data secure?",
    answer: "Absolutely. All data is encrypted at rest and in transit. We use row-level security policies, and your data is never shared with third parties or used to train AI models.",
  },
  {
    question: "Can I customize the scoring criteria?",
    answer: "Yes! You can define custom requirements, weight different skills, and adjust scoring parameters for each job posting to match your specific needs.",
  },
  {
    question: "Does it help reduce hiring bias?",
    answer: "Our AI focuses on skills, experience, and qualifications rather than demographic information. This helps create a more equitable screening process, though we recommend combining AI insights with human judgment.",
  },
  {
    question: "How long does it take to get started?",
    answer: "You can be up and running in minutes. Simply create an account, post your first job, and start receiving AI-analyzed applications immediately.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">FAQ</span>
          <h2 className="text-4xl md:text-5xl font-bold font-display mt-3 mb-4">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-xl px-6 data-[state=open]:bg-card"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
