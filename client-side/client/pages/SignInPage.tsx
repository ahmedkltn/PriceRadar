import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, Sparkles, Radar, User } from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useRegisterMutation, useLoginMutation } from "@/store/auth/authApiSlice";
import { setTokens } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/auth/authSlice";

interface SignInPageProps {
  isSignUp?: boolean;
}

export default function SignInPage({ isSignUp: propIsSignUp }: SignInPageProps = {}) {
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  // Initialize based on prop or current route
  const [isSignUp, setIsSignUp] = useState(() => {
    return propIsSignUp ?? location.pathname === "/register";
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Update isSignUp when route changes
  useEffect(() => {
    setIsSignUp(location.pathname === "/register");
  }, [location.pathname]);
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
  });

  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();

  const isLoading = isRegistering || isLoggingIn;

  const validateForm = (): boolean => {
    if (isSignUp) {
      if (!formData.username.trim()) {
        toast({
          title: "Validation Error",
          description: "Username is required",
          variant: "destructive",
        });
        return false;
      }
      if (!formData.email.trim()) {
        toast({
          title: "Validation Error",
          description: "Email is required",
          variant: "destructive",
        });
        return false;
      }
      if (formData.password.length < 8) {
        toast({
          title: "Validation Error",
          description: "Password must be at least 8 characters",
          variant: "destructive",
        });
        return false;
      }
      if (formData.password !== formData.password2) {
        toast({
          title: "Validation Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return false;
      }
    } else {
      if (!formData.username.trim() && !formData.email.trim()) {
        toast({
          title: "Validation Error",
          description: "Username or email is required",
          variant: "destructive",
        });
        return false;
      }
      if (!formData.password) {
        toast({
          title: "Validation Error",
          description: "Password is required",
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (isSignUp) {
        // Registration
        const result = await register({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          password2: formData.password2,
          first_name: formData.first_name || undefined,
          last_name: formData.last_name || undefined,
        }).unwrap();

        toast({
          title: "Registration Successful",
          description: result.message || "Please check your email to verify your account",
        });

        // Redirect to check-email page with email
        navigate(`/check-email?email=${encodeURIComponent(formData.email)}`);
      } else {
        // Login
        const result = await login({
          username: formData.username || formData.email,
          password: formData.password,
        }).unwrap();

        // Store tokens
        setTokens(result.access, result.refresh);

        // Store user in Redux
        dispatch(setUser(result.user));

        toast({
          title: "Login Successful",
          description: `Welcome back, ${result.user.first_name || result.user.username}!`,
        });

        // Redirect to home page
        navigate("/");
      }
    } catch (error: any) {
      // Handle API errors
      const errorMessage = error?.data?.error || 
                          error?.data?.message || 
                          error?.data?.non_field_errors?.[0] ||
                          Object.values(error?.data || {})[0]?.[0] ||
                          "An error occurred. Please try again.";
      
      toast({
        title: isSignUp ? "Registration Failed" : "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
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
    <div className="min-h-screen bg-background">
      {/* App Icon - Top Left */}
      <div className="fixed top-4 left-4 z-50">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center">
            <Radar className="w-6 h-6 text-background" />
          </div>
        </Link>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-20 pt-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Form */}
          <div className="order-2 md:order-1">
            <div className="max-w-[480px] mx-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 mb-6">
                  <Sparkles className="size-4 text-primary" />
                  <span className="text-[14px] text-primary">
                    Start saving today
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
                  {isSignUp ? "Create Account" : "Welcome Back"}
                </h1>
                <p className="text-[16px] text-muted-foreground">
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
                    className="bg-card hover:bg-card/80 border border-border rounded-[12px] px-4 py-3 transition-all hover:shadow-md text-[14px] text-foreground"
                  >
                    {provider.name}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-border" />
                <span className="text-[14px] text-muted-foreground">
                  Or continue with email
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <>
                    <div>
                      <label className="block text-[14px] text-foreground mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          placeholder="johndoe"
                          className="w-full bg-muted/50 border border-border rounded-[12px] pl-12 pr-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[14px] text-foreground mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={formData.first_name}
                          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                          placeholder="John"
                          className="w-full bg-muted/50 border border-border rounded-[12px] px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[14px] text-foreground mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={formData.last_name}
                          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                          placeholder="Doe"
                          className="w-full bg-muted/50 border border-border rounded-[12px] px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}

                {!isSignUp && (
                  <div>
                    <label className="block text-[14px] text-foreground mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => {
                          const value = e.target.value;
                            setFormData({ ...formData, username: value });
                        }}
                        placeholder="username"
                        className="w-full bg-muted/50 border border-border rounded-[12px] pl-12 pr-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        required
                      />
                    </div>
                  </div>
                )}

                {isSignUp && (
                  <div>
                    <label className="block text-[14px] text-foreground mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full bg-muted/50 border border-border rounded-[12px] pl-12 pr-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[14px] text-foreground mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-muted/50 border border-border rounded-[12px] pl-12 pr-12 py-3 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </button>
                  </div>
                </div>

                {isSignUp && (
                  <div>
                    <label className="block text-[14px] text-foreground mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                      <input
                        type={showPassword2 ? "text" : "password"}
                        value={formData.password2}
                        onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
                        placeholder="••••••••"
                        className="w-full bg-muted/50 border border-border rounded-[12px] pl-12 pr-12 py-3 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword2(!showPassword2)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword2 ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </button>
                    </div>
                  </div>
                )}

                {!isSignUp && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="size-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-[14px] text-muted-foreground">
                        Remember me
                      </span>
                    </label>
                    <button
                      type="button"
                      className="text-[14px] text-primary hover:text-primary/80 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-4 rounded-[12px] text-[16px] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                      {isSignUp ? "Creating Account..." : "Signing In..."}
                    </span>
                  ) : (
                    isSignUp ? "Create Account" : "Sign In"
                  )}
                </Button>
              </form>

              {/* Toggle Sign Up/Sign In */}
              <div className="mt-6 text-center">
                <p className="text-[14px] text-muted-foreground">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                  <Link
                    to={isSignUp ? "/signin" : "/register"}
                    onClick={() => {
                      // Reset form when switching modes
                      setFormData({
                        username: "",
                        email: "",
                        password: "",
                        password2: "",
                        first_name: "",
                        last_name: "",
                      });
                    }}
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </Link>
                </p>
              </div>

              {/* Terms */}
              {isSignUp && (
                <p className="mt-6 text-[12px] text-muted-foreground text-center">
                  By creating an account, you agree to our{" "}
                  <button className="text-primary hover:text-primary/80">Terms of Service</button>{" "}
                  and{" "}
                  <button className="text-primary hover:text-primary/80">Privacy Policy</button>
                </p>
              )}
            </div>
          </div>

          {/* Right Side - Benefits & Image */}
          <div className="order-1 md:order-2">
            <div className="relative">
              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-[32px] blur-2xl opacity-20" />
              
              {/* Main card */}
              <div className="relative bg-gradient-to-br from-card to-muted/30 rounded-[32px] p-8 md:p-12 border border-border overflow-hidden">
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
                  <div className="inline-flex items-center justify-center size-16 rounded-[16px] bg-gradient-to-br from-primary to-accent mb-6">
                    <Sparkles className="size-8 text-background" />
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Unlock Premium Features
                  </h2>

                  <p className="text-[16px] text-muted-foreground mb-8">
                    Create a free account and get access to powerful tools that help you save more.
                  </p>

                  <div className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <div className="size-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                            <svg className="size-4 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        <p className="text-[15px] text-foreground">
                          {benefit}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-around gap-4 mt-12 pt-8 border-t border-border text-center">
                    <div>
                      <div className="text-2xl font-bold text-foreground mb-1">2</div>
                      <div className="text-[12px] text-muted-foreground">Retailers</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground mb-1">10K+</div>
                      <div className="text-[12px] text-muted-foreground">Products</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground mb-1">1K+</div>
                      <div className="text-[12px] text-muted-foreground">Users</div>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -bottom-20 -right-20 size-64 bg-primary rounded-full blur-[100px] opacity-20" />
                <div className="absolute -top-20 -left-20 size-64 bg-accent rounded-full blur-[100px] opacity-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
