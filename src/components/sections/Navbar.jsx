import { useState, useEffect } from "react";

export default function Navbar({ activeSection }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "Skills", href: "#skills" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Contributions", href: "#contributions" },
    { name: "Contact", href: "#contact" }
  ];

  return (
    <header 
      className={`w-full fixed top-0 left-0 right-0 transition-all duration-300 ${
        isScrolled ? "bg-background/90 backdrop-blur-md shadow-md" : "bg-background/80 backdrop-blur-sm"
      }`}
    >
      <div className="flex h-16 items-center justify-between px-4 md:px-6 md:container md:mx-auto md:max-w-none">
        {/* Left padding to account for sidebar on desktop */}
        <div className="hidden md:block md:w-80 lg:w-96"></div>
        
        {/* Central content area with flex layout */}
        <div className="flex flex-1 items-center w-full">
          {/* Logo/Name shown on all screens */}
          <div className="text-lg font-bold text-modern-teal">
            {activeSection === 'hero' ? 'bakayu' : 'bakayu'}
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 ml-auto">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm transition-colors hover:text-modern-teal relative group ${
                  activeSection === link.href.substring(1) ? "text-modern-teal font-medium" : "text-muted-foreground"
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-modern-teal transition-all duration-300 ${
                  activeSection === link.href.substring(1) ? "w-full" : "group-hover:w-full"
                }`}></span>
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button - now with margin-left: auto */}
          <div className="md:hidden ml-auto">
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
        
        {/* Right padding to balance layout on desktop */}
        <div className="hidden md:block md:w-80 lg:w-96"></div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-sm border-t">
          <div className="container mx-auto py-4 space-y-2 px-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`block py-2 text-sm ${
                  activeSection === link.href.substring(1) ? "text-modern-teal font-medium" : "text-muted-foreground"
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