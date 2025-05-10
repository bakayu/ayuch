import { Button } from "../ui/Button";
import { personalInfo } from "../../data/portfolio-data";

export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="space-y-8 max-w-3xl animate-fade-up">
        {/* Profile picture */}
        <div className="mx-auto w-32 h-32 md:w-40 md:h-40 overflow-hidden rounded-full border-4 border-primary shadow-lg">
          {/* Replace with your image or GIF */}
          <img 
            src="https://placehold.co/200x200" 
            alt={personalInfo.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-vibrant-blue via-vibrant-purple to-vibrant-teal">
          Hi, I'm {personalInfo.name}
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground">
          Computer Science Engineering Student & Open Source Enthusiast
        </p>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Building tools and applications with a focus on user experience and clean code.
          Passionate about open source development and helping others get started in tech.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Button className="relative overflow-hidden group" size="lg" asChild>
            <a href={`mailto:${personalInfo.email}`}>
              <span className="relative z-10">Contact Me</span>
              {/* Animated button background */}
              <span className="absolute inset-0 bg-gradient-to-r from-vibrant-blue to-vibrant-teal opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            </a>
          </Button>
          <Button variant="outline" size="lg" className="border-primary hover-lift" asChild>
            <a href={`https://${personalInfo.links.github}`} target="_blank" rel="noopener noreferrer">
              GitHub Profile
            </a>
          </Button>
        </div>
        
        <div className="pt-6 flex flex-wrap items-center justify-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-2 animate-pulse-gentle">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{personalInfo.location}</span>
          </div>
          <div className="flex items-center gap-2 animate-pulse-gentle">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <span>{personalInfo.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
}