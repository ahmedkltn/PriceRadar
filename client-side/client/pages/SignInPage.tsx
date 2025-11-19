import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import Header from "../components/Header";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";


export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle authentication logic here
    console.log("Form submitted:", formData);
  };

  const socialProviders = [
    { name: "Google", color: "#4285F4" },
    { name: "Apple", color: "#000000" },
    { name: "Facebook", color: "#1877F2" },
  ];

  const benefits = [
    "Track price history for your favorite products",
    "Get instant alerts when prices drop",
    "Save and organize your searches",
    "Personalized deal recommendations",
    "Priority customer support",
  ];

  return (
    <div className="min-h-screen bg-[#f8f8f9]">
      <Header />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Form */}
          <div className="order-2 md:order-1">
            <div className="max-w-[480px] mx-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[rgba(173,70,255,0.1)] to-[rgba(43,127,255,0.1)] border border-[rgba(173,70,255,0.2)] mb-6">
                  <Sparkles className="size-4 text-[#ad46ff]" />
                  <span className="font-['Arimo',sans-serif] text-[14px] text-[#ad46ff]">
                    Start saving today
                  </span>
                </div>
                
                <h1 className="font-['Arimo',sans-serif] text-[40px] md:text-[48px] text-neutral-950 mb-3">
                  {isSignUp ? "Create Account" : "Welcome Back"}
                </h1>
                <p className="font-['Arimo',sans-serif] text-[16px] text-[#717182]">
                  {isSignUp
                    ? "Join thousands of smart shoppers finding the best deals"
                    : "Sign in to access your personalized deal dashboard"}
                </p>
              </div>

              {/* Social Sign In */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {socialProviders.map((provider, index) => (
                  <button
                    key={index}
                    className="bg-white hover:bg-[#f3f3f5] border border-[rgba(0,0,0,0.1)] rounded-[12px] px-4 py-3 transition-all hover:shadow-md font-['Arimo',sans-serif] text-[14px] text-neutral-950"
                  >
                    {provider.name}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-[rgba(0,0,0,0.1)]" />
                <span className="font-['Arimo',sans-serif] text-[14px] text-[#717182]">
                  Or continue with email
                </span>
                <div className="flex-1 h-px bg-[rgba(0,0,0,0.1)]" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="block font-['Arimo',sans-serif] text-[14px] text-neutral-950 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-white border border-[rgba(0,0,0,0.1)] rounded-[12px] px-4 py-3 font-['Arimo',sans-serif] text-[14px] text-neutral-950 placeholder:text-[#717182] outline-none focus:border-[#ad46ff] focus:ring-2 focus:ring-[rgba(173,70,255,0.1)] transition-all"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block font-['Arimo',sans-serif] text-[14px] text-neutral-950 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#717182]" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full bg-white border border-[rgba(0,0,0,0.1)] rounded-[12px] pl-12 pr-4 py-3 font-['Arimo',sans-serif] text-[14px] text-neutral-950 placeholder:text-[#717182] outline-none focus:border-[#ad46ff] focus:ring-2 focus:ring-[rgba(173,70,255,0.1)] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-['Arimo',sans-serif] text-[14px] text-neutral-950 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#717182]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-white border border-[rgba(0,0,0,0.1)] rounded-[12px] pl-12 pr-12 py-3 font-['Arimo',sans-serif] text-[14px] text-neutral-950 placeholder:text-[#717182] outline-none focus:border-[#ad46ff] focus:ring-2 focus:ring-[rgba(173,70,255,0.1)] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#717182] hover:text-neutral-950 transition-colors"
                    >
                      {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </button>
                  </div>
                </div>

                {!isSignUp && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="size-4 rounded border-[rgba(0,0,0,0.2)] text-[#ad46ff] focus:ring-[#ad46ff]"
                      />
                      <span className="font-['Arimo',sans-serif] text-[14px] text-[#717182]">
                        Remember me
                      </span>
                    </label>
                    <button
                      type="button"
                      className="font-['Arimo',sans-serif] text-[14px] text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full text-white bg-purple-600 hover:text-white hover:bg-purple-700 py-4 rounded-[12px] font-['Arimo',sans-serif] text-[16px] transition-all shadow-lg hover:shadow-xl"
                >
                  {isSignUp ? "Create Account" : "Sign In"}
                </Button>
              </form>

              {/* Toggle Sign Up/Sign In */}
              <div className="mt-6 text-center">
                <p className="font-['Arimo',sans-serif] text-[14px] text-[#717182]">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </button>
                </p>
              </div>

              {/* Terms */}
              {isSignUp && (
                <p className="mt-6 font-['Arimo',sans-serif] text-[12px] text-[#717182] text-center">
                  By creating an account, you agree to our{" "}
                  <button className="text-[#ad46ff] hover:text-[#8a2fd9]">Terms of Service</button>{" "}
                  and{" "}
                  <button className="text-[#ad46ff] hover:text-[#8a2fd9]">Privacy Policy</button>
                </p>
              )}
            </div>
          </div>

          {/* Right Side - Benefits & Image */}
          <div className="order-1 md:order-2">
            <div className="relative">
              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#ad46ff] to-[#2b7fff] rounded-[32px] blur-2xl opacity-20" />
              
              {/* Main card */}
              <div className="relative bg-gradient-to-br from-[#030213] to-[#1a1a2e] rounded-[32px] p-8 md:p-12 border border-[rgba(255,255,255,0.1)] overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1621743018966-29194999d736?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2UlMjBkZXNrfGVufDF8fHx8MTc2MzE2NTk5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Workspace"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center size-16 rounded-[16px] bg-gradient-to-br from-[#ad46ff] to-[#2b7fff] mb-6">
                    <Sparkles className="size-8 text-white" />
                  </div>

                  <h2 className="font-['Arimo',sans-serif] text-[32px] md:text-[40px] text-white mb-4">
                    Unlock Premium Features
                  </h2>

                  <p className="font-['Arimo',sans-serif] text-[16px] text-white/80 mb-8">
                    Create a free account and get access to powerful tools that help you save more.
                  </p>

                  <div className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <div className="size-6 rounded-full bg-[#00c950] flex items-center justify-center flex-shrink-0">
                            <svg className="size-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        <p className="font-['Arimo',sans-serif] text-[15px] text-white/90">
                          {benefit}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-around gap-4 mt-12 pt-8 border-t border-white/10 text-center">
                    <div>
                      <div className="font-['Arimo',sans-serif] text-[24px] text-white mb-1">2</div>
                      <div className="font-['Arimo',sans-serif] text-[12px] text-white/60">Retailers</div>
                    </div>
                    <div>
                      <div className="font-['Arimo',sans-serif] text-[24px] text-white mb-1">10K+</div>
                      <div className="font-['Arimo',sans-serif] text-[12px] text-white/60">Products</div>
                    </div>
                    <div>
                      <div className="font-['Arimo',sans-serif] text-[24px] text-white mb-1">1K+</div>
                      <div className="font-['Arimo',sans-serif] text-[12px] text-white/60">Users</div>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -bottom-20 -right-20 size-64 bg-[#ad46ff] rounded-full blur-[100px] opacity-20" />
                <div className="absolute -top-20 -left-20 size-64 bg-[#2b7fff] rounded-full blur-[100px] opacity-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
