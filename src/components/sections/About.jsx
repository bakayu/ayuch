import { personalInfo } from '../../data/portfolio-data';

export default function About() {
  return (
    <div className="container-custom section-spacing" id="about">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-gradient text-center">
          About Me
        </h2>
        
        <div className="modern-card p-8">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-1/3">
                <div className="aspect-square rounded-xl overflow-hidden">
                  <img 
                    src={personalInfo.avatarUrl || "https://placehold.co/400x400"} 
                    alt={personalInfo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-2/3 space-y-4">
                <p className="text-lg leading-relaxed">
                  I'm a passionate Computer Science Engineering student with a focus on backend development 
                  and a strong commitment to open-source contribution. With expertise in Python, JavaScript, 
                  and various frameworks, I enjoy building robust systems and solving complex technical challenges.
                </p>
                
                <p className="text-lg leading-relaxed">
                  My approach combines analytical thinking with creative problem-solving, allowing me to 
                  develop efficient solutions that meet both technical requirements and user needs.
                </p>
                
                <div className="pt-4">
                  <h3 className="text-xl font-semibold mb-3">Core Values</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-modern-teal/10 text-modern-teal mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Quality First</h4>
                        <p className="text-sm text-muted-foreground">Prioritizing clean, maintainable code over quick fixes.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-modern-teal/10 text-modern-teal mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Continuous Learning</h4>
                        <p className="text-sm text-muted-foreground">Always exploring new technologies and methodologies.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-modern-teal/10 text-modern-teal mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Community Engagement</h4>
                        <p className="text-sm text-muted-foreground">Contributing to and learning from open source communities.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-modern-teal/10 text-modern-teal mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Efficiency</h4>
                        <p className="text-sm text-muted-foreground">Finding the most resource-efficient solutions.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-border">
              <h3 className="text-xl font-semibold mb-4">Key Interests</h3>
              <div className="flex flex-wrap gap-2">
                <span className="tech-tag">Backend Architecture</span>
                <span className="tech-tag">API Design</span>
                <span className="tech-tag">Cloud Computing</span>
                <span className="tech-tag">Database Optimization</span>
                <span className="tech-tag">CI/CD Pipelines</span>
                <span className="tech-tag">Open Source</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}