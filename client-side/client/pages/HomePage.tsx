import {
  Navbar,
  Hero,
  TrustedBy,
  Features,
  HowItWorks,
  DashboardPreview,
  TechStack,
  CTA,
  Footer,
} from "@/components/landing";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Features />
      <HowItWorks />
      <DashboardPreview />
      <TechStack />
      <CTA />
      <Footer />
    </div>
  );
};

export default HomePage;