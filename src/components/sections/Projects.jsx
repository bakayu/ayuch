import { useState } from "react";
import { projects } from "../../data/portfolio-data";

export default function Projects() {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-vibrant-purple to-vibrant-pink text-transparent bg-clip-text">
        Projects
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <ProjectCard 
            key={index} 
            project={project} 
            index={index}
            color={index % 2 === 0 ? "vibrant-blue" : "vibrant-teal"} 
          />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, index, color }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div 
      className={`border rounded-lg p-6 bg-card text-card-foreground shadow-md hover-lift overflow-hidden transition-all duration-300`}
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className={`text-xl font-semibold text-${color}`}>{project.title}</h3>
        <span className="text-sm bg-secondary/50 text-secondary-foreground px-3 py-1 rounded-full">
          {project.duration}
        </span>
      </div>
      
      <p className="text-muted-foreground mb-4">{project.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tech.map((tech, i) => (
          <span 
            key={i} 
            className={`text-xs bg-${color}/10 text-${color} px-2.5 py-1 rounded-full border border-${color}/20 animate-pulse-gentle`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {tech}
          </span>
        ))}
      </div>
      
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`text-${color} text-sm flex items-center gap-1 focus:outline-none hover:underline transition-all duration-300`}
        >
          {isExpanded ? "Show less" : "Learn more"}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        
        <div 
          className={`mt-3 space-y-2 text-sm text-muted-foreground overflow-hidden transition-all duration-500 ${
            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="list-disc pl-5 space-y-2">
            {project.details.map((detail, i) => (
              <li 
                key={i}
                className="animate-slide-in-right"
                style={{ animationDelay: `${i * 0.1}s`, animationPlayState: isExpanded ? 'running' : 'paused' }}
              >
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}