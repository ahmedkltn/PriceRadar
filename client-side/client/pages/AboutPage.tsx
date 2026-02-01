import { TrendingUp, Users, Zap, Shield, Target, Award } from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { Navbar } from "@/components/landing";
import { Footer } from "@/components/landing";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AboutPage() {
  const navigate = useNavigate();
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Our AI scans millions of products in seconds to find you the best deals.",
      color: "#ff6900",
    },
    {
      icon: Shield,
      title: "Trusted & Secure",
      description:
        "We only partner with verified retailers to ensure safe shopping experiences.",
      color: "#00c950",
    },
    {
      icon: TrendingUp,
      title: "Smart Savings",
      description:
        "Advanced algorithms track price history and predict future price drops.",
      color: "#2b7fff",
    },
    {
      icon: Target,
      title: "Personalized",
      description:
        "Get tailored recommendations based on your shopping preferences.",
      color: "#ad46ff",
    },
  ];

  const stats = [
    { value: "500+", label: "Partner Retailers", color: "#2b7fff" },
    { value: "1M+", label: "Products Tracked", color: "#ad46ff" },
    { value: "$200M+", label: "Total Savings", color: "#00c950" },
    { value: "1K+", label: "Happy Users", color: "#f6339a" },
  ];

  const team = [
    {
      name: "Ahmed Kalbi",
      role: "CEO & Founder",
      description:
        "Former Amazon engineer with 10+ years in e-commerce optimization",
    },
    {
      name: "Ilyes El Ouni",
      role: "CTO",
      description:
        "AI specialist from Google, focused on machine learning and data science",
    },
    {
      name: "Mariem Smadhi",
      role: "Head of Partnerships",
      description: "Built relationships with 500+ retailers across the globe",
    },
    {
      name: "Montasar Zouaghi",
      role: "Head of Partnerships",
      description: "Built relationships with 500+ retailers across the globe",
    },
  ];

  const values = [
    {
      icon: Users,
      title: "Customer First",
      description:
        "Every decision we make is centered around delivering value to you.",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "We're committed to maintaining the highest standards of quality.",
    },
    {
      icon: Shield,
      title: "Transparency",
      description: "Honest pricing, no hidden fees, and complete data privacy.",
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-black text-white pt-20">
        {/* Subtle teal abstract lines/shapes in background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-[1200px] mx-auto px-4 md:px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-[800px] mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/50 mb-6">
              <div className="size-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-sm text-muted-foreground">
                Building the future of smart shopping
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] mb-6 text-white">
              We're on a mission to make
              <span className="block text-secondary">
                shopping smarter
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              PriceRadar was born from a simple idea: everyone deserves to get
              the best deal without spending hours comparing prices. We leverage
              cutting-edge AI to do the hard work for you.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border/50 rounded-xl p-6 md:p-8 hover:border-secondary/50 transition-all group"
            >
              <div className="size-3 rounded-full mb-4 bg-secondary group-hover:scale-150 transition-transform" />
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-24 bg-black">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
              <p>
                Founded in 2025, PriceRadar was born from a simple frustration
                we all face: finding the best deals on electronics in Tunisia
                shouldn't require checking dozens of websites and stores. Our
                team of local developers and data enthusiasts saw an opportunity
                to create a solution that brings clarity to the Tunisian
                electronics market. Today, we're quickly becoming Tunisia's
                go-to platform for electronics shopping, gathering real-time
                pricing and availability from all major Tunisian retailers.
                We're helping Tunisian consumers save time and money by
                providing clear, comprehensive comparisons in one convenient
                location. What sets us apart is our deep understanding of the
                Tunisian market and our commitment to local consumers. We're
                built by Tunisians, for Tunisians, with a focus on transparency
                and user-friendly design. We never sell your data, and we're
                always honest about how we operate (through affiliate
                partnerships with retailers we feature).
              </p>
              <p>
                What sets us apart is our commitment to transparency and user
                privacy. We never sell your data, and we're always upfront about
                how we make money (through affiliate partnerships with
                retailers).
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-2xl blur-xl" />
            <div className="relative rounded-2xl overflow-hidden border border-border/50">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758873268663-5a362616b5a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMG1vZGVybiUyMG9mZmljZXxlbnwxfHx8fDE3NjMyMzc3NDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Team collaboration"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-black border-y border-border/50 py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose <span className="text-secondary">PriceRadar?</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-[600px] mx-auto">
              We've built the most comprehensive price comparison platform with
              features designed to save you time and money.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-card border border-border/50 hover:border-secondary/50 rounded-xl p-8 transition-all"
                >
                  <div className="inline-flex items-center justify-center size-14 rounded-xl bg-gradient-to-r from-secondary to-secondary/80 mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="size-7 text-black" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-24 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our <span className="text-secondary">Values</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-[600px] mx-auto">
            These principles guide everything we do at PriceRadar.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center size-16 rounded-full bg-gradient-to-br from-secondary to-secondary/80 mb-6">
                  <Icon className="size-8 text-black" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Meet the Team */}
      <div className="bg-black py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Meet the <span className="text-secondary">Team</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-[600px] mx-auto">
              The brilliant minds behind PriceRadar's success.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border/50 rounded-xl p-8 hover:border-secondary/50 transition-all text-center group"
              >
                <div className="size-24 rounded-full bg-gradient-to-br from-secondary to-secondary/80 mx-auto mb-6 flex items-center justify-center text-black text-2xl font-bold group-hover:scale-110 transition-transform">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {member.name}
                </h3>
                <div className="text-sm text-secondary mb-4">
                  {member.role}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black border-t border-border/50 py-24">
        <div className="max-w-[800px] mx-auto px-4 md:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Ready to Start <span className="text-secondary">Saving?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground mb-8"
          >
            Join thousands of smart shoppers who trust PriceRadar to find the
            best deals.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <button
              onClick={() => navigate("/register")}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl text-base font-semibold transition-all"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate("/about")}
              className="bg-transparent hover:bg-card text-white border-2 border-border hover:border-secondary/50 px-8 py-4 rounded-xl text-base transition-all"
            >
              Learn More
            </button>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
