import { personalInfo } from "../../data/portfolio-data";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Navigation links for footer
  const footerLinks = [
    { name: "Skills", href: "#skills" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Contributions", href: "#contributions" },
    { name: "Contact", href: "#contact" }
  ];

  return (
    <footer className="mt-20 py-8 border-t relative">
      {/* Go to top button */}
      <button 
        onClick={scrollToTop}
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card shadow-md rounded-full p-2 border border-border hover:bg-modern-teal hover:text-white transition-colors"
        aria-label="Go to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      </button>

      <div className="container mx-auto px-4">
        {/* Footer sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Ayush Chauhan</h3>
            <p className="text-sm text-muted-foreground">
              Computer Science Engineering Student passionate about building robust backend systems and contributing to open source.
            </p>
          </div>

          {/* Navigation section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Navigation</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-modern-teal transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <ul className="space-y-2">
              {/* Email */}
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <a href={`mailto:${personalInfo.email}`} className="hover:text-modern-teal transition-colors">
                  {personalInfo.email}
                </a>
              </li>
              
              {/* Phone */}
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path>
                </svg>
                <a href={`tel:${personalInfo.phone}`} className="hover:text-modern-teal transition-colors">
                  {personalInfo.phone}
                </a>
              </li>
              
              {/* GitHub */}
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                <a href={`https://${personalInfo.links.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-modern-teal transition-colors">
                  GitHub
                </a>
              </li>
              
              {/* LinkedIn */}
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
                <a href={`https://${personalInfo.links.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-modern-teal transition-colors">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}