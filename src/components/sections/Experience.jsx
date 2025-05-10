import { experience, education, accomplishments } from "../../data/portfolio-data";

export default function Experience() {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-vibrant-orange to-vibrant-yellow text-transparent bg-clip-text">
        Experience & Education
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-vibrant-orange">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            Work Experience
          </h3>
          {experience.map((exp, index) => (
            <ExperienceCard key={index} experience={exp} index={index} />
          ))}
        </div>
        
        <div>
          <div className="space-y-8 mb-12">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-vibrant-blue">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
              </svg>
              Education
            </h3>
            {education.map((edu, index) => (
              <EducationCard key={index} education={edu} index={index} />
            ))}
          </div>
          
          <div className="space-y-8">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-vibrant-purple">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              Accomplishments
            </h3>
            {accomplishments.map((acc, index) => (
              <AccomplishmentCard key={index} accomplishment={acc} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExperienceCard({ experience}) {
  return (
    <div className="border rounded-lg p-6 bg-card text-card-foreground shadow-md hover-lift relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-2 h-full bg-vibrant-orange transition-all duration-300 group-hover:w-full group-hover:opacity-10"></div>
      
      <div className="flex justify-between items-start mb-2 relative">
        <h4 className="font-semibold text-vibrant-orange">{experience.role}</h4>
        <span className="text-sm text-muted-foreground">{experience.duration}</span>
      </div>
      
      <p className="text-muted-foreground mb-4">{experience.company}, {experience.location}</p>
      
      <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
        {experience.achievements.map((achievement, i) => (
          <li key={i} className="hover:text-foreground transition-colors">{achievement}</li>
        ))}
      </ul>
    </div>
  );
}

function EducationCard({ education }) {
  return (
    <div className="border rounded-lg p-6 bg-card text-card-foreground shadow-md hover-lift relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-2 h-full bg-vibrant-blue transition-all duration-300 group-hover:w-full group-hover:opacity-10"></div>
      
      <div className="flex justify-between items-start mb-2 relative">
        <h4 className="font-semibold text-vibrant-blue">{education.institution}</h4>
        <span className="text-sm text-muted-foreground">{education.duration}</span>
      </div>
      
      <p className="text-muted-foreground">{education.degree}</p>
      {education.details && (
        <p className="text-sm mt-2 inline-block bg-vibrant-blue/10 text-vibrant-blue px-2 py-1 rounded">
          {education.details}
        </p>
      )}
    </div>
  );
}

function AccomplishmentCard({ accomplishment }) {
  return (
    <div className="border rounded-lg p-6 bg-card text-card-foreground shadow-md hover-lift relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-2 h-full bg-vibrant-purple transition-all duration-300 group-hover:w-full group-hover:opacity-10"></div>
      
      <div className="flex justify-between items-start mb-2 relative">
        <h4 className="font-semibold text-vibrant-purple">{accomplishment.title}</h4>
        <span className="text-sm text-muted-foreground">{accomplishment.date}</span>
      </div>
      
      <p className="text-muted-foreground mb-2">{accomplishment.organization}</p>
      <p className="text-sm">{accomplishment.details}</p>
    </div>
  );
}