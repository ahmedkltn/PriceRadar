import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tag, TrendingDown, TrendingUp, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetOffersQuery } from "@/store/products/productApiSlice";

interface PriceUpdate {
  product: string;
  store: string;
  oldPrice: number;
  newPrice: number;
  change: number;
}

const FloatingTag = ({ delay, x, y }: { delay: number; x: string; y: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 0.15, scale: 1 }}
    transition={{ delay, duration: 0.5 }}
    className="absolute pointer-events-none"
    style={{ left: x, top: y }}
  >
    <motion.div
      animate={{ y: [0, -15, 0] }}
      transition={{ duration: 4, repeat: Infinity, delay }}
      className="text-secondary/30"
    >
      <Tag size={24} />
    </motion.div>
  </motion.div>
);

const PriceTicker = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: offersData } = useGetOffersQuery({ limit: 10, sort: "price_asc" });
  
  // Transform offers into price updates format
  const priceUpdates: PriceUpdate[] = offersData?.offers?.slice(0, 5).map((offer, index) => {
    // Simulate price change (in real app, you'd compare with historical data)
    const currentPrice = typeof offer.price === 'number' ? offer.price : parseFloat(String(offer.price)) || 0;
    const oldPrice = currentPrice * 1.05; // Simulate 5% higher old price
    const change = ((currentPrice - oldPrice) / oldPrice) * 100;
    
    return {
      product: offer.product_name || "Product",
      store: offer.vendor || "Store",
      oldPrice: Math.round(oldPrice),
      newPrice: currentPrice,
      change: Math.round(change * 10) / 10,
    };
  }) || [];

  // Fallback to default updates if no data
  const defaultUpdates: PriceUpdate[] = [
    { product: "MacBook Pro M3", store: "Mytek", oldPrice: 4999, newPrice: 4799, change: -4 },
    { product: "Samsung S24 Ultra", store: "TunisiaNet", oldPrice: 3299, newPrice: 3199, change: -3 },
    { product: "iPhone 15 Pro", store: "SBS", oldPrice: 4199, newPrice: 4299, change: 2.4 },
    { product: "Sony WH-1000XM5", store: "Mytek", oldPrice: 899, newPrice: 849, change: -5.6 },
    { product: "iPad Air", store: "TunisiaNet", oldPrice: 1999, newPrice: 1899, change: -5 },
  ];

  const updates = priceUpdates.length > 0 ? priceUpdates : defaultUpdates;

  useEffect(() => {
    if (updates.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % updates.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [updates.length]);

  if (updates.length === 0) return null;

  const update = updates[currentIndex];
  const isDown = update.change < 0;

  return (
    <motion.div
      key={currentIndex}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-card border border-border/50 px-6 py-4 inline-flex items-center gap-4 rounded-lg"
    >
      <div className="flex items-center gap-2">
        {isDown ? (
          <TrendingDown className="w-5 h-5 text-accent" />
        ) : (
          <TrendingUp className="w-5 h-5 text-destructive" />
        )}
        <span className="text-muted-foreground text-sm">{update.store}</span>
      </div>
      <div className="text-foreground font-medium">{update.product}</div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground line-through text-sm">{update.oldPrice} TND</span>
        <span className={isDown ? "text-accent font-semibold" : "text-destructive font-semibold"}>
          {update.newPrice} TND
        </span>
        <span className={`text-xs px-2 py-1 rounded-full ${isDown ? "bg-accent/20 text-accent" : "bg-destructive/20 text-destructive"}`}>
          {update.change > 0 ? "+" : ""}{update.change}%
        </span>
      </div>
    </motion.div>
  );
};

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Subtle teal abstract lines/shapes in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        {/* Abstract teal lines */}
        <svg className="absolute top-0 right-0 w-full h-full opacity-10" viewBox="0 0 1200 800" fill="none">
          <path d="M0 200 Q300 100 600 200 T1200 200" stroke="currentColor" strokeWidth="2" className="text-secondary" />
          <path d="M0 400 Q300 300 600 400 T1200 400" stroke="currentColor" strokeWidth="2" className="text-secondary" />
          <path d="M0 600 Q300 500 600 600 T1200 600" stroke="currentColor" strokeWidth="2" className="text-secondary" />
        </svg>
      </div>

      {/* Floating price tags - teal accent */}
      <FloatingTag delay={0} x="10%" y="20%" />
      <FloatingTag delay={0.5} x="85%" y="15%" />
      <FloatingTag delay={1} x="75%" y="70%" />
      <FloatingTag delay={1.5} x="15%" y="75%" />

      <div className="container relative z-10 px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-card border border-border/50 px-4 py-2 mb-8 rounded-full"
          >
            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Monitoring prices 24/7</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white"
          >
            Track Every Price.{" "}
            <span className="text-secondary">Beat Every Competitor.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Automated price intelligence for Tunisian e-commerce. Monitor competitors, 
            get real-time alerts, and make data-driven pricing decisions.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-8 text-lg font-semibold"
              onClick={() => navigate("/search")}
            >
              Start Tracking Prices
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-border hover:bg-card text-white px-8 text-lg"
              onClick={() => {
                document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              See How It Works
            </Button>
          </motion.div>

          {/* Live price ticker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-8"
          >
            <p className="text-sm text-muted-foreground mb-4">Live price updates</p>
            <PriceTicker />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
