import { useState, useEffect } from "react";
import { ThemeToggle } from "../ui/ThemeToggle";

export default function Navbar({ activeSection }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Contributions", href: "#contributions" },
    { name: "Experience", href: "#experience" },
    { name: "Resume", href: "/resume.pdf" } // Added resume link
  ];

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-background/90 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <a href="#home" className="text-xl font-bold flex items-center gap-2">
            <span className="bg-gradient-to-r from-vibrant-blue to-vibrant-teal text-transparent bg-clip-text">AC</span>
          </a>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target={link.href.startsWith("#") ? "" : "_blank"}
              rel={link.href.startsWith("#") ? "" : "noopener noreferrer"}
              className={`text-sm transition-colors hover:text-primary relative group ${
                activeSection === link.href.substring(1) && link.href.startsWith("#") 
                  ? "text-primary font-medium" 
                  : "text-muted-foreground"
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 ${
                activeSection === link.href.substring(1) && link.href.startsWith("#") 
                  ? "w-full" 
                  : "group-hover:w-full"
              }`}></span>
            </a>
          ))}
          <ThemeToggle />
        </nav>

        <div className="flex md:hidden items-center gap-4">
          <ThemeToggle />
          <button
            className="text-foreground p-2 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="4" y1="12" x2="20" y2="12"></line>
                  <line x1="4" y1="6" x2="20" y2="6"></line>
                  <line x1="4" y1="18" x2="20" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-sm border-t">
          <div className="container mx-auto py-4 space-y-2 px-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target={link.href.startsWith("#") ? "" : "_blank"}
                rel={link.href.startsWith("#") ? "" : "noopener noreferrer"}
                className={`block py-2 text-sm ${
                  activeSection === link.href.substring(1) && link.href.startsWith("#") 
                    ? "text-primary font-medium" 
                    : "text-muted-foreground"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}