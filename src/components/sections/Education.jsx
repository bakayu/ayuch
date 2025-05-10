import { useState, useEffect } from 'react';
import { education } from '../../data/portfolio-data';

export default function Education() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-gruvbox-green to-gruvbox-aqua text-transparent bg-clip-text">
        Education
      </h2>
      
      <div className="timeline-container ml-2">
        {education.map((item, index) => (
          <EducationTimelineItem 
            key={index}
            data={item}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

function EducationTimelineItem({ data, index }) {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, index * 200);
    
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div 
      className={`mb-10 ml-6 transition-all duration-500 ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      {/* Timeline marker */}
      <div className="timeline-marker mt-1.5" />
      
      {/* Date badge */}
      <time className="mb-1 text-sm font-normal text-muted-foreground">
        {data.period}
      </time>
      
      {/* Institution name */}
      <h3 className="text-lg font-semibold text-foreground mt-2">
        {data.institution}
      </h3>
      
      {/* Degree info */}
      <p className="text-base font-medium text-gruvbox-aqua mb-2">
        {data.degree}
      </p>
      
      {/* Description */}
      <p className="mb-4 text-base font-normal text-muted-foreground">
        {data.description}
      </p>
      
      {/* Relevant courses */}
      {data.courses && data.courses.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-1">Relevant Courses:</h4>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            {data.courses.map((course, idx) => (
              <li key={idx}>{course}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Achievements */}
      {data.achievements && data.achievements.length > 0 && (
        <div className="mt-3">
          <h4 className="text-sm font-semibold mb-1">Achievements:</h4>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            {data.achievements.map((achievement, idx) => (
              <li key={idx}>{achievement}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}