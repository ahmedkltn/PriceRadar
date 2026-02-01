import { motion } from "framer-motion";
import { Radar, Github, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "API Docs", href: "#docs" },
    { label: "Changelog", href: "#changelog" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "#blog" },
    { label: "Careers", href: "#careers" },
    { label: "Contact", href: "/contact-us" },
  ],
  Legal: [
    { label: "Privacy", href: "#privacy" },
    { label: "Terms", href: "#terms" },
    { label: "Security", href: "#security" },
  ],
};

export const Footer = () => {
  return (
    <footer className="py-16 border-t border-border/50 bg-black">
      <div className="container px-4">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Radar className="w-6 h-6 text-black" />
              </div>
              <span className="text-xl font-bold text-white">PriceRadar</span>
            </motion.div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-6">
              The complete price intelligence platform for Tunisian e-commerce. 
              Track, compare, and optimize your pricing strategy.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link 
                        to={link.href}
                        className="text-sm text-muted-foreground hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a 
                        href={link.href} 
                        className="text-sm text-muted-foreground hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PriceRadar. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with ❤️ in Tunisia
          </p>
        </div>
      </div>
    </footer>
  );
};
