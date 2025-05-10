import { useState, useEffect } from 'react';
import { personalInfo } from '../../data/portfolio-data';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';

export default function Sidebar({ scrollToContact }) {
  // Typewriter effect states
  const [currentText, setCurrentText] = useState("Open Source Enthusiast");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  
  // List of texts to rotate
  const rotatingTexts = [
    "Open Source Contributor",
    "Backend Developer",
    "Problem Solver",
    "Lifelong Learner",
  ];

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % rotatingTexts.length;
      const fullText = rotatingTexts[i];
      
      if (isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length - 1));
      } else {
        setCurrentText(fullText.substring(0, currentText.length + 1));
      }
      
      // Set typing speed
      if (isDeleting) {
        setTypingSpeed(50);
      } else {
        setTypingSpeed(75);
      }
      
      // Handle text completion or deletion
      if (!isDeleting && currentText === fullText) {
        // Wait at the end of typing
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && currentText === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };
    
    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, loopNum, rotatingTexts, typingSpeed]);

  return (
  <div className="sidebar flex flex-col items-center h-full bg-card border-r border-border">
    <div className="w-full flex flex-col items-justify h-full px-8 py-20">
      {/* Top section - Profile */}
      <div className="w-full flex flex-col items-center">
        <div className="text-center mb-8">
          {/* Profile picture */}
          <div className="mx-auto w-32 h-32 overflow-hidden rounded-full border-4 border-modern-teal/30 mb-4 shadow-lg">
            <img 
              src="pfp.gif" 
              alt={personalInfo.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <h1 className="text-2xl font-bold mt-2 text-gradient">
            {personalInfo.name}
          </h1>
          
          <p className="text-md text-muted-foreground mt-1">
            Computer Science Engineering Student
          </p>
          
          <div className="text-md text-primary mt-1.5 h-6 min-h-[1.5rem]">
            {currentText}
            <span className="inline-block w-[2px] h-5 ml-1 bg-primary animate-cursor-blink align-middle"></span>
          </div>
        </div>
      </div>
      
      {/* Removed flex-grow and justify-center to eliminate the gap */}
      <div className="w-full flex flex-col items-center mt-4">
        {/* Contact info */}
        <div className="w-full flex flex-col items-center space-y-3.5 mb-1.5">
          <div className="flex items-center justify-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 -1 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <a href={`mailto:${personalInfo.email}`} className="text-sm hover:text-modern-teal">
              {personalInfo.email}
            </a>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <a href={`tel:${personalInfo.phone}`} className="text-sm hover:text-modern-teal">
              {personalInfo.phone}
            </a>
          </div>
        </div>
        
        {/* Social links */}
        <div className="sidebar-links w-full mb-2">
          <div className="flex flex-col items-center space-y-1">
            <a href={`https://${personalInfo.links.github}`} 
              className="flex items-center justify-center gap-2 hover:text-modern-teal transition-colors py-1"
              target="_blank" rel="noopener noreferrer">
              <i className="devicon-github-original text-lg"></i>
              <span>GitHub</span>
            </a>
            <a href={`https://${personalInfo.links.linkedin}`}
              className="flex items-center justify-center gap-2 hover:text-modern-teal transition-colors py-1"
              target="_blank" rel="noopener noreferrer">
              <i className="devicon-linkedin-plain text-lg"></i>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Push buttons to bottom */}
      <div className="w-full flex flex-col mt-10">
        <div className="sidebar-buttons flex flex-col w-full gap-1.5">
          <Button className="btn btn-primary w-full bg-modern-teal hover:bg-modern-tealDark text-white py-1.5">
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Resume
            </a>
          </Button>
          <Button 
            className="btn btn-outline w-full bg-modern-charcoalLight hover:bg-modern-charcoal border border-modern-teal py-1.5"
            onClick={scrollToContact}
          >
            <a className="flex items-center justify-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Me
            </a>
          </Button>
          
          {/* Theme toggle */}
          <div className="flex justify-center mt-1.5">
            {/* <ThemeToggle /> */}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}