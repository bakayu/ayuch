import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { personalInfo } from '../../data/portfolio-data';

export default function Hero() {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    setVisible(true);
  }, []);
  
  return (
    <div className="container-custom pb-12 pt-24 md:pt-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div 
          className={`space-y-8 transition-all duration-1000 ${
            visible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
          }`}
        >
          <div>
            <p className="text-primary font-medium mb-3">Hello, I'm (username str = "bakayu";)</p>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4">
              {personalInfo.name.split(' ').map((word, i) => (
                <span key={i} className={i === 0 ? 'text-gradient' : ''}>
                  {word}{' '}
                </span>
              ))}
            </h1>
            <h2 className="text-2xl md:text-3xl text-muted-foreground font-light">
              {personalInfo.title}
            </h2>
          </div>
          
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg text-justify">
              I'm a student and <span className="text-primary font-medium">Software Engineer</span> passionate about <span className="text-primary font-medium">FOSS</span>, <span className="text-primary font-medium">Low-Level Systems</span>, and <span className="text-primary font-medium">DevOps</span>. Always exploring the depths of computational systems and open-source collaboration.
            </p>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              className="bg-modern-teal hover:bg-modern-tealDark text-white px-6"
              onClick={() => {
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View My Work
              <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Button>
            
            {/* Hero buttons */}
            <div className="flex flex-wrap gap-4">
              <a 
                href="#contact" 
                className="flex items-center gap-2 px-4 py-2 bg-modern-teal text-white rounded hover:bg-modern-teal/90 transition"
              >
                Get in touch
                <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              
              {/* Resume button */}
              <a 
                href="/resume.pdf" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-border rounded hover:bg-card transition"
                aria-label="Download Resume"
              >
                Resume
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="pt-4">
            <p className="text-sm text-muted-foreground mb-3">Tech stack I work with:</p>
            <div className="flex flex-wrap gap-4">
              <i className="devicon-python-plain colored text-2xl"></i>
              <i className="devicon-rust-plain text-2xl"></i>
              <i className="devicon-go-original-wordmark colored text-2xl"></i>
              <i className="devicon-javascript-plain colored text-2xl"></i>
              <i className="devicon-react-original colored text-2xl"></i>
              <i className="devicon-docker-plain colored text-2xl"></i>
              <i className="devicon-git-plain colored text-2xl"></i>
              <i className="devicon-github-original text-2xl"></i>
              <i className="devicon-linux-plain text-2xl"></i>
              <i className="devicon-bash-plain text-2xl"></i>
              
            </div>
          </div>
        </div>
        
        <div 
          className={`flex justify-center transition-all duration-1000 delay-300 ${
            visible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
          }`}
        >
          <div className="relative">
            {/* Main profile image */}
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-modern-teal/30 shadow-xl">
              <img 
                src={personalInfo.avatarUrl || "pfp.gif"} 
                alt={personalInfo.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Decorative circles */}
            <div className="absolute -z-10 w-full h-full rounded-full border-2 border-dashed border-modern-teal/20 top-6 left-6"></div>
            <div className="absolute -z-10 w-full h-full rounded-full border border-modern-teal/10 -top-6 -left-6"></div>
            
            {/* Background glow effect */}
            <div className="absolute -z-20 w-full h-full rounded-full bg-modern-teal/10 blur-3xl transform -translate-x-1/4 -translate-y-1/4"></div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce-gentle hidden md:block">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}