import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CTA = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-black">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 via-primary/10 to-secondary/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />

      {/* Animated orbs */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-[100px] animate-pulse-glow" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-[100px] animate-pulse-glow" />

      <div className="container px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-card border border-border/50 px-4 py-2 mb-8 rounded-full"
          >
            <Zap className="w-4 h-4 text-secondary" />
            <span className="text-sm text-muted-foreground">Start free, upgrade anytime</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Outsmart Your{" "}
            <span className="text-secondary">Competition?</span>
          </h2>

          <p className="text-xl text-muted-foreground mb-8">
            Join businesses that trust PriceRadar for competitive intelligence. 
            Start tracking prices in minutes.
          </p>

          <div className="flex justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 h-12"
              onClick={() => navigate("/register")}
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            No credit card required • Free 14-day trial • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
};
