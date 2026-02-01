import { Mail, Radar, ArrowLeft } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function CheckEmailPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!email) {
      navigate("/signin");
    }
  }, [email, navigate]);
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

      <div className="min-h-screen flex items-center justify-center px-4 py-12 md:py-20 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          <div className="bg-card rounded-[24px] border border-border p-8 md:p-12 text-center">
            {/* Email Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center size-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 mb-6"
            >
              <Mail className="size-10 text-primary" />
            </motion.div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Check Your Email
            </h1>

            {/* Description */}
            <p className="text-[16px] text-muted-foreground mb-6">
              We've sent a verification link to
            </p>
            {email && (
              <p className="text-lg font-semibold text-primary mb-6 break-all">
                {email}
              </p>
            )}
            <p className="text-[16px] text-muted-foreground mb-8">
              Please click the link in the email to verify your account and complete your registration.
            </p>

            {/* Instructions */}
            <div className="bg-muted/30 rounded-[16px] p-6 mb-8 text-left">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Didn't receive the email?
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Check your spam or junk folder</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Make sure you entered the correct email address</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Wait a few minutes and check again</span>
                </li>
              </ul>
            </div>

            {/* Back to Sign In */}
            <Link
              to="/signin"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-[14px]"
            >
              <ArrowLeft className="size-4" />
              Back to Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
