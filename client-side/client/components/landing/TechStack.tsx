import { motion } from "framer-motion";

const technologies = [
  { name: "Apache Airflow", description: "Workflow Orchestration", icon: "🔄" },
  { name: "dbt", description: "Data Transformation", icon: "📊" },
  { name: "Django", description: "REST API", icon: "🐍" },
  { name: "React.JS", description: "Frontend Framework", icon: "⚡" },
  { name: "PostgreSQL", description: "Database", icon: "🐘" },
  { name: "Playwright", description: "Web Scraping", icon: "🎭" },
];

export const TechStack = () => {
  return (
    <section className="py-24 relative bg-black">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Built with <span className="text-secondary">Modern Tech</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powered by industry-leading technologies for reliability and scale
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-card border border-border/50 p-6 text-center group cursor-default rounded-lg hover:border-secondary/50 transition-colors"
            >
              <motion.div 
                className="text-4xl mb-3"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
              >
                {tech.icon}
              </motion.div>
              <h3 className="font-semibold text-white mb-1 text-sm">
                {tech.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {tech.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
