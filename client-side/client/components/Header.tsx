import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import svgPaths from "./svg-gbk5prcr4x";

function Icon() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g>
          <path
            d="M16 7H22V13"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d={svgPaths.p13253c0}
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}


export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false); // Close menu after navigation
  };

  return (
    <div className="sticky top-0 z-50 glass-dark border-b border-purple-500/20 backdrop-blur-xl">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 group"
          >
            <div className="relative size-[40px]">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-xl flex items-center justify-center transition-all group-hover:shadow-lg group-hover:shadow-purple-500/50 neon-glow">
                <Icon />
              </div>
              <div className="absolute -top-1 -right-1 size-3 bg-cyan-400 rounded-full border-2 border-gray-900 animate-pulse" />
            </div>
            <span className="font-['Orbitron',sans-serif] text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 text-neon-purple">
              PriceRadar
            </span>
          </button>

          {/* Desktop Navigation - hidden on mobile */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate("/contact-us")}
              className={`font-['Inter',sans-serif] text-sm transition-all hover:text-cyan-400 relative ${
                pathname === "/contact-us"
                  ? "text-cyan-400"
                  : "text-gray-300"
              }`}
            >
              Contact us
              {pathname === "/contact-us" && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500" />
              )}
            </button>
            <button
              onClick={() => navigate("/about")}
              className={`font-['Inter',sans-serif] text-sm transition-all hover:text-cyan-400 relative ${
                pathname === "/about" ? "text-cyan-400" : "text-gray-300"
              }`}
            >
              About
              {pathname === "/about" && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500" />
              )}
            </button>
            <button
              onClick={() => navigate("/signin")}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white border border-purple-500/30 transition-all px-4 py-2 rounded-lg font-['Orbitron',sans-serif] text-sm font-semibold neon-glow-cyan hover:shadow-cyan-500/50"
            >
              SIGN IN
            </button>
          </nav>

          {/* Mobile menu button - visible only on small screens */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="flex flex-col justify-center items-center w-6 h-6 relative"
              aria-label="Toggle menu"
            >
              <span
                className={`w-6 h-0.5 bg-purple-400 transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-1" : ""
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-purple-400 transition-all duration-300 mt-1.5 ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-purple-400 transition-all duration-300 mt-1.5 ${
                  isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMenuOpen ? "max-h-48 opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col gap-4 pb-2">
            <button
              onClick={() => handleNavigation("/contact-us")}
              className={
                pathname === "/contact-us"
                  ? "text-cyan-400 font-medium"
                  : "text-gray-300"
              }
            >
              Contact us
            </button>
            <button
              onClick={() => handleNavigation("/about")}
              className={
                pathname === "/about"
                  ? "text-cyan-400 font-medium"
                  : "text-gray-300"
              }
            >
              About
            </button>
            <button
              onClick={() => handleNavigation("/signin")}
              className={pathname === "/signin" ? "!text-cyan-400" : "text-gray-300"}
            >
              Sign In
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
