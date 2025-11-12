// ...existing code...
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import LiquidGlass from "./LiquidGlass";

const navItems = [
  { name: "Media", href: "#video" },
  { name: "About", href: "#about" },
  { name: "Author", href: "#author" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        // add horizontal padding on small screens so the nav fits on mobile
        "fixed w-full z-40 transition-all duration-300 px-4 md:px-0",
        isScrolled ? "py-3" : "py-5"
      )}
    >
      <LiquidGlass
        // make the glass full width on small screens and constrain on larger screens
        className="w-full max-w-[1200px] h-12 mx-auto px-2"
        isScrolled={isScrolled}
      >
        <div className="max-w-[1200px] w-full flex items-center justify-between mx-auto">
          {/* Title */}
          <a
            className="text-xl font-bold text-primary flex items-center"
            href="#hero"
          >
            <span className="relative z-10">
              <span className="text-glow text-foreground">
                International Space Station
              </span>{" "}
              Impact Tracker
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item, key) => (
              <a
                key={key}
                href={item.href}
                className="text-foreground/80 hover:text-primary transition-colors duration-300"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Mobile nav button */}
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="md:hidden p-2 text-foreground z-50"
            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Mobile nav panel */}
          <div
            className={cn(
              "fixed inset-0 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center",
              "transition-all duration-300 md:hidden",
              // ensure the panel overlays properly and is clickable when open
              isMenuOpen
                ? "opacity-100 pointer-events-auto z-40"
                : "opacity-0 pointer-events-none -z-10"
            )}
          >
            <div className="flex flex-col space-y-8 text-xl px-6">
              {navItems.map((item, key) => (
                <a
                  key={key}
                  href={item.href}
                  className="text-foreground/80 hover:text-primary transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </LiquidGlass>
    </nav>
  );
};
// ...existing code...