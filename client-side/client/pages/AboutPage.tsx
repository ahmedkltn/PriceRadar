import { TrendingUp, Users, Zap, Shield, Target, Award } from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import Header from "../components/Header";

import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

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
    <div className="min-h-screen bg-[#f8f8f9]">
      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#030213] via-[#1a1a2e] to-[#ad46ff] text-white">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1644088379091-d574269d422f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlY2hub2xvZ3klMjBuZXR3b3JrfGVufDF8fHx8MTc2MzE3NjUxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>

        <div className="relative max-w-[1200px] mx-auto px-4 md:px-8 py-24 md:py-32">
          <div className="text-center max-w-[800px] mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <div className="size-2 rounded-full bg-[#00c950] animate-pulse" />
              <span className="font-['Arimo',sans-serif] text-[14px]">
                Building the future of smart shopping
              </span>
            </div>

            <h1 className="font-['Arimo',sans-serif] text-[48px] md:text-[64px] leading-[1.1] mb-6">
              We're on a mission to make
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00c950] to-[#00b8db]">
                shopping smarter
              </span>
            </h1>

            <p className="font-['Arimo',sans-serif] text-[18px] md:text-[20px] text-white/80 leading-relaxed">
              PriceRadar was born from a simple idea: everyone deserves to get
              the best deal without spending hours comparing prices. We leverage
              cutting-edge AI to do the hard work for you.
            </p>
          </div>
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute top-20 left-10 size-64 bg-[#ad46ff] rounded-full blur-[120px] opacity-30" />
        <div className="absolute bottom-20 right-10 size-64 bg-[#00c950] rounded-full blur-[120px] opacity-30" />
      </div>

      {/* Stats Section */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-[16px] p-6 md:p-8 border border-[rgba(0,0,0,0.1)] shadow-lg hover:shadow-xl transition-all group"
            >
              <div
                className="size-3 rounded-full mb-4 group-hover:scale-150 transition-transform"
                style={{ backgroundColor: stat.color }}
              />
              <div className="font-['Arimo',sans-serif] text-[36px] md:text-[48px] text-neutral-950 mb-2">
                {stat.value}
              </div>
              <div className="font-['Arimo',sans-serif] text-[14px] text-[#717182]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-['Arimo',sans-serif] text-[40px] md:text-[48px] text-neutral-950 mb-6">
              Our Story
            </h2>
            <div className="space-y-4 font-['Arimo',sans-serif] text-[16px] text-[#717182] leading-relaxed">
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
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ad46ff] to-[#00b8db] rounded-[24px] blur-xl opacity-20" />
            <div className="relative rounded-[24px] overflow-hidden border border-[rgba(0,0,0,0.1)] shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758873268663-5a362616b5a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMG1vZGVybiUyMG9mZmljZXxlbnwxfHx8fDE3NjMyMzc3NDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Team collaboration"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white border-y border-[rgba(0,0,0,0.1)] py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="font-['Arimo',sans-serif] text-[40px] md:text-[48px] text-neutral-950 mb-4">
              Why Choose PriceRadar?
            </h2>
            <p className="font-['Arimo',sans-serif] text-[18px] text-[#717182] max-w-[600px] mx-auto">
              We've built the most comprehensive price comparison platform with
              features designed to save you time and money.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-[#f8f8f9] hover:bg-white rounded-[20px] p-8 border border-[rgba(0,0,0,0.1)] hover:border-[rgba(0,0,0,0.2)] transition-all hover:shadow-lg"
                >
                  <div
                    className="inline-flex items-center justify-center size-14 rounded-[14px] mb-6 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: feature.color }}
                  >
                    <Icon className="size-7 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="font-['Arimo',sans-serif] text-[24px] text-neutral-950 mb-3">
                    {feature.title}
                  </h3>
                  <p className="font-['Arimo',sans-serif] text-[16px] text-[#717182] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="font-['Arimo',sans-serif] text-[40px] md:text-[48px] text-neutral-950 mb-4">
            Our Values
          </h2>
          <p className="font-['Arimo',sans-serif] text-[18px] text-[#717182] max-w-[600px] mx-auto">
            These principles guide everything we do at PriceRadar.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center size-16 rounded-full bg-gradient-to-br from-[#ad46ff] to-[#2b7fff] mb-6">
                  <Icon className="size-8 text-white" strokeWidth={2} />
                </div>
                <h3 className="font-['Arimo',sans-serif] text-[24px] text-neutral-950 mb-3">
                  {value.title}
                </h3>
                <p className="font-['Arimo',sans-serif] text-[16px] text-[#717182] leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meet the Team */}
      <div className="bg-gradient-to-br from-[#f8f8f9] to-white py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="font-['Arimo',sans-serif] text-[40px] md:text-[48px] text-neutral-950 mb-4">
              Meet the Team
            </h2>
            <p className="font-['Arimo',sans-serif] text-[18px] text-[#717182] max-w-[600px] mx-auto">
              The brilliant minds behind PriceRadar's success.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-[20px] p-8 border border-[rgba(0,0,0,0.1)] hover:shadow-lg transition-all text-center group"
              >
                <div className="size-24 rounded-full bg-gradient-to-br from-[#ad46ff] to-[#2b7fff] mx-auto mb-6 flex items-center justify-center text-white text-[32px] font-['Arimo',sans-serif] group-hover:scale-110 transition-transform">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="font-['Arimo',sans-serif] text-[20px] text-neutral-950 mb-2">
                  {member.name}
                </h3>
                <div className="font-['Arimo',sans-serif] text-[14px] text-[#ad46ff] mb-4">
                  {member.role}
                </div>
                <p className="font-['Arimo',sans-serif] text-[14px] text-[#717182] leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-[#030213] to-[#ad46ff] text-white py-24">
        <div className="max-w-[800px] mx-auto px-4 md:px-8 text-center">
          <h2 className="font-['Arimo',sans-serif] text-[40px] md:text-[48px] mb-6">
            Ready to Start Saving?
          </h2>
          <p className="font-['Arimo',sans-serif] text-[18px] text-white/80 mb-8">
            Join thousands of smart shoppers who trust PriceRadar to find the
            best deals.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate("/signin")}
              className="bg-white hover:bg-[#f3f3f5] text-[#030213] px-8 py-4 rounded-[14px] font-['Arimo',sans-serif] text-[16px] transition-all shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-transparent hover:bg-white/10 text-white border-2 border-white px-8 py-4 rounded-[14px] font-['Arimo',sans-serif] text-[16px] transition-all"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
