import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { TrendingDown, TrendingUp, Bell, BarChart3 } from "lucide-react";
import { useGetOffersQuery } from "@/store/products/productApiSlice";

const MetricCard = ({ icon: Icon, label, value, change, isPositive }: { 
  icon: React.ElementType; 
  label: string; 
  value: string; 
  change: string; 
  isPositive: boolean;
}) => (
  <div className="bg-card border border-border/50 p-4 flex items-center gap-4 rounded-lg">
    <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
      <Icon className="w-5 h-5 text-secondary" />
    </div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold text-white">{value}</p>
    </div>
    <span className={`ml-auto text-xs px-2 py-1 rounded-full ${isPositive ? "bg-secondary/20 text-secondary" : "bg-destructive/20 text-destructive"}`}>
      {change}
    </span>
  </div>
);

export const DashboardPreview = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  // Fetch real data for metrics
  const { data: offersData } = useGetOffersQuery({ limit: 100 });
  const totalProducts = offersData?.total || 1234;
  const priceDrops = Math.floor(totalProducts * 0.1); // Estimate 10% have price drops
  const alerts = Math.floor(priceDrops * 0.35); // Estimate 35% trigger alerts

  return (
    <section ref={ref} className="py-24 relative overflow-hidden bg-black">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-secondary/10 rounded-full blur-[160px]" />

      <div className="container px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Powerful <span className="text-secondary">Dashboard</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            All your competitive intelligence in one beautiful, intuitive interface
          </p>
        </motion.div>

        <motion.div style={{ y, opacity }} className="relative max-w-5xl mx-auto">
          {/* Main dashboard mockup */}
          <div className="bg-card border border-border/50 p-6 rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
              <div>
                <h3 className="text-xl font-semibold text-white">Price Overview</h3>
                <p className="text-sm text-muted-foreground">Last 30 days</p>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/50" />
                <div className="w-3 h-3 rounded-full bg-accent/50" />
                <div className="w-3 h-3 rounded-full bg-primary/50" />
              </div>
            </div>

            {/* Metrics grid */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <MetricCard 
                icon={TrendingDown} 
                label="Price Drops Detected" 
                value={priceDrops.toLocaleString()} 
                change="+23%"
                isPositive={true}
              />
              <MetricCard 
                icon={Bell} 
                label="Alerts Triggered" 
                value={alerts.toLocaleString()} 
                change="+12%"
                isPositive={true}
              />
              <MetricCard 
                icon={BarChart3} 
                label="Products Tracked" 
                value={totalProducts.toLocaleString()} 
                change="+8%"
                isPositive={true}
              />
            </div>

            {/* Chart area mockup */}
            <div className="bg-muted/30 rounded-xl p-6 h-64 flex items-end gap-2">
              {[40, 65, 45, 80, 55, 70, 85, 60, 75, 90, 70, 85].map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${height}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="flex-1 bg-gradient-to-t from-primary to-primary/50 rounded-t-sm"
                />
              ))}
            </div>

            {/* Table preview - use real data if available */}
            <div className="mt-6 space-y-2">
              {offersData?.offers && offersData.offers.length > 0 ? (
                offersData.offers.slice(0, 3).map((offer, i) => {
                  const currentPrice = typeof offer.price === 'number' ? offer.price : parseFloat(String(offer.price)) || 0;
                  const priceDiff = currentPrice * 0.02; // Simulate 2% difference
                  const diffPercent = ((priceDiff / currentPrice) * 100).toFixed(1);
                  return (
                    <div key={i} className="flex items-center justify-between py-3 px-4 bg-card/50 border border-border/30 rounded-lg text-sm">
                      <span className="text-white font-medium">{offer.product_name || "Product"}</span>
                      <span className="text-muted-foreground">{currentPrice} TND</span>
                      <span className="text-muted-foreground">{offer.vendor || "Store"}</span>
                      <span className={parseFloat(diffPercent) < 0 ? "text-secondary" : "text-destructive"}>
                        {diffPercent}%
                      </span>
                    </div>
                  );
                })
              ) : (
                [
                  { product: "MacBook Pro M3", mytek: "4,799 TND", tunisianet: "4,899 TND", diff: "-2%" },
                  { product: "Samsung S24 Ultra", mytek: "3,199 TND", tunisianet: "3,149 TND", diff: "+1.6%" },
                  { product: "Sony WH-1000XM5", mytek: "849 TND", tunisianet: "879 TND", diff: "-3.4%" },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-3 px-4 bg-card/50 border border-border/30 rounded-lg text-sm">
                    <span className="text-white font-medium">{row.product}</span>
                    <span className="text-muted-foreground">{row.mytek}</span>
                    <span className="text-muted-foreground">{row.tunisianet}</span>
                    <span className={row.diff.startsWith("-") ? "text-secondary" : "text-destructive"}>
                      {row.diff}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Floating elements */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-8 -right-8 glass-card p-4 hidden lg:flex items-center gap-3"
          >
            <TrendingDown className="w-5 h-5 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">New price drop!</p>
              <p className="text-sm font-medium text-foreground">iPhone 15 - 5% off</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -bottom-4 -left-8 glass-card p-4 hidden lg:flex items-center gap-3"
          >
            <TrendingUp className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Savings this month</p>
              <p className="text-sm font-medium text-foreground">12,450 TND</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
