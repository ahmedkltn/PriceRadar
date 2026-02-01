import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Radar, Loader2 } from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useVerifyEmailMutation } from "@/store/auth/authApiSlice";
import { motion } from "framer-motion";

export default function VerifyEmailPage() {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const navigate = useNavigate();
  const [verifyEmail, { isLoading, isSuccess, isError, error }] = useVerifyEmailMutation();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (uid && token) {
      verifyEmail({ uid, token });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, token]);

  useEffect(() => {
    if (isSuccess) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/signin");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isSuccess, navigate]);

  const errorMessage = error && "data" in error
    ? (error.data as any)?.error || 
      (error.data as any)?.message || 
      "Invalid or expired verification token. Please request a new verification email."
    : "An error occurred during verification. Please try again.";

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
            {isLoading && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="inline-flex items-center justify-center size-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 mb-6"
                >
                  <Loader2 className="size-10 text-primary animate-spin" />
                </motion.div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Verifying Your Email
                </h1>
                <p className="text-[16px] text-muted-foreground">
                  Please wait while we verify your email address...
                </p>
              </>
            )}

            {isSuccess && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="inline-flex items-center justify-center size-20 rounded-full bg-accent/20 border border-accent/30 mb-6"
                >
                  <CheckCircle className="size-10 text-accent" />
                </motion.div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Email Verified!
                </h1>
                <p className="text-[16px] text-muted-foreground mb-6">
                  Your email has been successfully verified. You can now sign in to your account.
                </p>
                <p className="text-sm text-muted-foreground">
                  Redirecting to sign in page in {countdown} second{countdown !== 1 ? "s" : ""}...
                </p>
                <Link
                  to="/signin"
                  className="mt-6 inline-block text-primary hover:text-primary/80 transition-colors text-[14px]"
                >
                  Go to Sign In now
                </Link>
              </>
            )}

            {isError && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="inline-flex items-center justify-center size-20 rounded-full bg-destructive/20 border border-destructive/30 mb-6"
                >
                  <XCircle className="size-10 text-destructive" />
                </motion.div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Verification Failed
                </h1>
                <p className="text-[16px] text-muted-foreground mb-6">
                  {errorMessage}
                </p>
                <div className="flex flex-col gap-3">
                  <Link
                    to="/signin"
                    className="inline-block text-primary hover:text-primary/80 transition-colors text-[14px]"
                  >
                    Back to Sign In
                  </Link>
                  <Link
                    to="/"
                    className="inline-block text-muted-foreground hover:text-foreground transition-colors text-[14px]"
                  >
                    Go to Homepage
                  </Link>
                </div>
              </>
            )}

            {!uid || !token ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="inline-flex items-center justify-center size-20 rounded-full bg-destructive/20 border border-destructive/30 mb-6"
                >
                  <XCircle className="size-10 text-destructive" />
                </motion.div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Invalid Verification Link
                </h1>
                <p className="text-[16px] text-muted-foreground mb-6">
                  The verification link is missing required parameters. Please use the link from your email.
                </p>
                <Link
                  to="/signin"
                  className="inline-block text-primary hover:text-primary/80 transition-colors text-[14px]"
                >
                  Back to Sign In
                </Link>
              </>
            ) : null}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
