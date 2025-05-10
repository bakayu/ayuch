import { useState, useEffect } from "react";
import { skills } from "../../data/portfolio-data";

export default function Skills() {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-vibrant-blue to-vibrant-teal text-transparent bg-clip-text">
        Technical Skills
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <SkillCategory 
          title="Languages" 
          skills={skills.languages} 
          delay={0}
          color="vibrant-blue" 
        />
        <SkillCategory 
          title="Frameworks" 
          skills={skills.frameworks} 
          delay={0.2}
          color="vibrant-purple" 
        />
        <SkillCategory 
          title="Tools" 
          skills={skills.tools} 
          delay={0.4}
          color="vibrant-teal" 
        />
      </div>
    </div>
  );
}

function SkillCategory({ title, skills, delay, color }) {
  // Animation for staggered appearance of skills
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay * 1000);
    
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`border rounded-lg p-6 shadow-md hover-lift gradient-border bg-card text-card-foreground transform transition-all duration-500 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <h3 className={`text-xl font-semibold mb-6 text-${color}`}>{title}</h3>
      <ul className="space-y-3">
        {skills.map((skill, index) => (
          <li 
            key={index} 
            className="flex items-center gap-2 transition-all duration-300"
            style={{ 
              transitionDelay: `${delay + (index * 0.05)}s`,
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(20px)'
            }}
          >
            <span className={`w-2 h-2 bg-${color} rounded-full animate-pulse-gentle`} 
                  style={{ animationDelay: `${index * 0.1}s` }}></span>
            <span className="hover:text-primary transition-colors">{skill}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}