import { motion } from "framer-motion";
import { Bot, Bell, TrendingUp, GitCompare } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Automated Scraping",
    description: "Intelligent bots collect pricing data from multiple e-commerce sites 24/7 without manual intervention.",
    gradient: "from-secondary to-primary",
  },
  {
    icon: Bell,
    title: "Real-time Alerts",
    description: "Get instant notifications when competitor prices change. Never miss a price drop or market shift.",
    gradient: "from-primary to-accent",
  },
  {
    icon: TrendingUp,
    title: "Price History Charts",
    description: "Visualize pricing trends over time. Understand patterns and predict optimal pricing windows.",
    gradient: "from-accent to-secondary",
  },
  {
    icon: GitCompare,
    title: "Multi-store Comparison",
    description: "Compare prices across all major Tunisian stores in one unified dashboard view.",
    gradient: "from-secondary via-primary to-accent",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export const Features = () => {
  return (
    <section className="py-24 relative bg-black">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-secondary/5 rounded-full blur-[120px]" />

      <div className="container px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Everything You Need to{" "}
            <span className="text-secondary">Stay Ahead</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful features designed for competitive intelligence in the Tunisian market
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group relative"
            >
              <div className="bg-card border border-border/50 p-8 h-full transition-all duration-300 hover:border-secondary/50 hover:bg-card/80">
                {/* Gradient border on hover */}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-xl`} />
                
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-black" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
