import { motion } from "framer-motion";
import { useGetVendorsQuery } from "@/store/products/productApiSlice";

export const TrustedBy = () => {
  const { data: vendorsData } = useGetVendorsQuery();
  
  // Get vendor names from API or use defaults
  const stores = vendorsData?.vendors?.slice(0, 6).map(vendor => ({
    name: vendor.name,
    logo: vendor.name.toUpperCase(),
  })) || [
    { name: "Mytek", logo: "MYTEK" },
    { name: "TunisiaNet", logo: "TUNISIANET" },
    { name: "Mytek", logo: "MYTEK" },
    { name: "TunisiaNet", logo: "TUNISIANET" },
    { name: "Mytek", logo: "MYTEK" },
    { name: "TunisiaNet", logo: "TUNISIANET" },
    { name: "Mytek", logo: "MYTEK" },
    { name: "TunisiaNet", logo: "TUNISIANET" },
  ];

  return (
    <section id="features" className="py-16 border-y border-border/50 overflow-hidden bg-black">
      <div className="container px-4">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mb-8"
        >
          Monitoring prices from leading Tunisian e-commerce platforms
        </motion.p>

        <div className="relative">
          {/* Gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex gap-16 items-center animate-ticker"
          >
            {[...stores, ...stores].map((store, i) => (
              <div
                key={i}
                className="flex-shrink-0 text-2xl font-bold text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-default"
              >
                {store.logo}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
