import { motion } from "framer-motion";
import { Link2, Radar, Cpu, Lightbulb } from "lucide-react";

const steps = [
  {
    icon: Link2,
    title: "Connect Your Products",
    description: "Add the products you want to track and define your competitors",
    color: "bg-secondary",
  },
  {
    icon: Radar,
    title: "We Monitor 24/7",
    description: "Our scrapers collect pricing data from all competitor stores continuously",
    color: "bg-primary",
  },
  {
    icon: Cpu,
    title: "Data Processing",
    description: "Raw data is cleaned, validated, and transformed into insights",
    color: "bg-accent",
  },
  {
    icon: Lightbulb,
    title: "Actionable Insights",
    description: "Get recommendations and alerts to optimize your pricing strategy",
    color: "bg-secondary",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/20 to-transparent" />

      <div className="container px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            How <span className="text-secondary">PriceRadar</span> Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From data collection to actionable insights in four simple steps
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-secondary via-secondary/50 to-secondary -translate-y-1/2" />

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Step number */}
                  <div className="bg-card border border-border/50 w-20 h-20 rounded-full flex items-center justify-center mb-6 relative">
                    <div className={`absolute inset-2 ${step.color} rounded-full opacity-20`} />
                    <step.icon className={`w-8 h-8 text-white relative z-10`} />
                    
                    {/* Step indicator */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-secondary border-2 border-secondary flex items-center justify-center text-sm font-bold text-black">
                      {index + 1}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-2 text-white">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
