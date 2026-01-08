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

// Hamburger menu icon component
function MenuIcon({ isOpen, onClick }) {
  return (
    <button
      onClick={onClick}
      className="md:hidden flex flex-col justify-center items-center w-6 h-6 relative"
      aria-label="Toggle menu"
    >
      <span
        className={`w-6 h-0.5 bg-neutral-950 transition-all duration-300 ${
          isOpen ? "rotate-45 translate-y-1" : ""
        }`}
      />
      <span
        className={`w-6 h-0.5 bg-neutral-950 transition-all duration-300 mt-1.5 ${
          isOpen ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`w-6 h-0.5 bg-neutral-950 transition-all duration-300 mt-1.5 ${
          isOpen ? "-rotate-45 -translate-y-2" : ""
        }`}
      />
    </button>
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
    <div className="sticky top-0 z-50 bg-[rgba(255,255,255,0.8)] backdrop-blur-lg border-b border-[rgba(0,0,0,0.1)]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3"
          >
            <div className="relative size-[40px]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#030213] to-[#9032db] rounded-[14px] flex items-center justify-center transition-all hover:shadow-lg hover:shadow-purple-500/20">
                <Icon />
              </div>
              <div className="absolute -top-1 -right-1 size-[12px] bg-[#00c950] rounded-full border-2 border-white" />
            </div>
            <span className="font-['Arimo',sans-serif] text-[20px] text-neutral-950">
              PriceRadar
            </span>
          </button>

          {/* Desktop Navigation - hidden on mobile */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate("/contact-us")}
              className={`font-['Arimo',sans-serif] text-[14px] transition-all hover:text-[#9032db] relative ${
                pathname === "/contact-us"
                  ? "text-[#9032db]"
                  : "text-neutral-950"
              }`}
            >
              Contact us
              {pathname === "/contact-us" && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#9032db]" />
              )}
            </button>
            <button
              onClick={() => navigate("/about")}
              className={`font-['Arimo',sans-serif] text-[14px] transition-all hover:text-[#9032db] relative ${
                pathname === "/about" ? "text-[#9032db]" : "text-neutral-950"
              }`}
            >
              About
              {pathname === "/about" && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#9032db]" />
              )}
            </button>
            <button
              onClick={() => navigate("/signin")}
              className={`bg-purple-700 text-white hover:bg-purple-800 hover:text-white border border-[rgba(0,0,0,0.1)] transition-all px-[13px] py-1.5 rounded-[8px] font-['Arimo',sans-serif] text-[14px] text-neutral-950`}
            >
              Sign In
            </button>
          </nav>

          {/* Mobile menu button - visible only on small screens */}
          <div className="md:hidden flex items-center">
            <MenuIcon isOpen={isMenuOpen} onClick={toggleMenu} />
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
                  ? "text-[#9032db] font-medium"
                  : "text-neutral-950"
              }
            >
              Contact us
            </button>
            <button
              onClick={() => handleNavigation("/about")}
              className={
                pathname === "/about"
                  ? "text-[#9032db] font-medium"
                  : "text-neutral-950"
              }
            >
              About
            </button>
            <button
              onClick={() => handleNavigation("/signin")}
              className={pathname === "/signin" ? "!text-[#9032db]" : ""}
            >
              Sign In
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
