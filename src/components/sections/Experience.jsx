import { useState, useEffect } from "react";
import { experience, education, accomplishments } from "../../data/portfolio-data";

export default function Experience() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-modern-teal to-modern-tealLight text-transparent bg-clip-text">
        Experience & Education
      </h2>
      
      <div className="grid grid-cols-1 gap-16">
        {/* Timeline for Work Experience */}
        <div>
          <h3 className="text-xl font-semibold mb-8 flex items-center gap-2 text-modern-teal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            Volunteer
          </h3>
          
          <div className="timeline-container">
            {experience
              .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
              .map((exp, index) => (
                <TimelineCard 
                  key={index} 
                  title={exp.role}
                  subtitle={`${exp.company}, ${exp.location}`}
                  date={exp.duration}
                  details={exp.achievements}
                  type="work"
                  index={index}
                  isLast={index === experience.length - 1}
                />
              ))}
          </div>
        </div>
        
        {/* Timeline for Education */}
        <div>
          <h3 className="text-xl font-semibold mb-8 flex items-center gap-2 text-modern-teal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
            Education
          </h3>
          
          <div className="timeline-container">
            {education
              .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
              .map((edu, index) => (
                <TimelineCard 
                  key={index} 
                  title={edu.institution}
                  subtitle={edu.degree}
                  date={edu.duration}
                  badge={edu.details}
                  type="education"
                  index={index}
                  isLast={index === education.length - 1}
                />
              ))}
          </div>
        </div>
        
        {/* Regular cards for Accomplishments */}
        {/* <div>
          <h3 className="text-xl font-semibold mb-8 flex items-center gap-2 text-modern-teal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            Accomplishments
          </h3>
          
          <div className="space-y-6">
            {accomplishments.map((acc, index) => (
              <ExperienceCard 
                key={index} 
                title={acc.title}
                subtitle={acc.organization}
                text={acc.details}
                type="accomplishment"
              />
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}

// Timeline card component with animation
function TimelineCard({ title, subtitle, date, details, badge, type, index, isLast }) {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, index * 200);
    
    return () => clearTimeout(timer);
  }, [index]);
  
  // Styles based on type
  const styles = {
    work: {
      borderColor: 'border-modern-teal',
      textColor: 'text-modern-teal',
      bgHover: 'hover:bg-modern-teal/5',
      dotColor: 'bg-modern-teal'
    },
    education: {
      borderColor: 'border-modern-teal',
      textColor: 'text-modern-teal',
      bgHover: 'hover:bg-modern-teal/5',
      dotColor: 'bg-modern-teal'
    }
  }[type];
  
  return (
    <div 
      className={`timeline-item mb-12 ${isLast ? 'mb-0' : ''} transition-all duration-500 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      {/* Timeline dot - positioned exactly on the timeline */}
      <div className="timeline-dot"></div>
      
      {/* Time label */}
      <div className="mb-3 timeline-date">
        <time className="text-sm font-medium text-modern-teal/90 bg-modern-teal/10 px-3 py-1 rounded-full">
          {date}
        </time>
      </div>
      
      {/* Content card */}
      <div className={`timeline-content border rounded-lg p-5 bg-card text-card-foreground shadow-md card ${styles.borderColor} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
        <div className="mb-2">
          <h4 className={`text-lg font-semibold ${styles.textColor}`}>{title}</h4>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        
        {/* Conditional rendering based on content type */}
        {details && Array.isArray(details) && (
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground list-disc pl-5">
            {details.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
        
        {badge && (
          <p className={`text-sm mt-2 inline-block px-3 py-1 rounded-full ${styles.textColor} bg-secondary/30`}>
            {badge}
          </p>
        )}
      </div>
    </div>
  );
}

// Regular card component for accomplishments
function ExperienceCard({ title, subtitle, text, type }) {
  const styles = {
    accomplishment: {
      borderColor: 'border-modern-teal',
      textColor: 'text-modern-teal',
      bgHover: 'hover:bg-modern-teal/5'
    }
  }[type];
  
  return (
    <div className={`border rounded-lg p-6 bg-card text-card-foreground shadow-md card ${styles.borderColor} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
      <div className="mb-2">
        <h4 className={`font-semibold ${styles.textColor}`}>{title}</h4>
        <p className="text-muted-foreground mb-2">{subtitle}</p>
      </div>
      
      {text && (
        <p className="text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
}