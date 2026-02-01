import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="flex justify-center mb-8"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-4xl font-bold text-background">404</span>
            </div>
          </motion.div>
          
          <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-4">
            404 error
          </p>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl mb-4">
            Page not <span className="text-primary">found</span>
          </h1>
          <p className="text-base text-muted-foreground mb-8">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              asChild
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Link to="/">
                <Home className="mr-2 w-4 h-4" />
                Go back home
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-border hover:border-primary/50 text-foreground"
            >
              <Link to="/search">
                <Search className="mr-2 w-4 h-4" />
                Browse Products
              </Link>
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default NotFound;
