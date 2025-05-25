import { useState, useEffect } from "react";
import { skills } from "../../data/portfolio-data";

// Tech icons mapping using Devicons
const techIcons = {
  // Languages
  "Python": <i className="devicon-python-plain colored"></i>,
  "Rust": <i className="devicon-rust-plain"></i>,
  "Go": <i className="devicon-go-plain colored"></i>,
  "C": <i className="devicon-c-plain colored"></i>,
  "SQL (Postgres)": <i className="devicon-postgresql-plain colored"></i>,
  "JavaScript": <i className="devicon-javascript-plain colored"></i>,
  "HTML/CSS": <i className="devicon-html5-plain colored"></i>,
  
  // Frameworks
  "React": <i className="devicon-react-original colored"></i>,
  "Node.js": <i className="devicon-nodejs-plain colored"></i>,
  "Flask": <i className="devicon-flask-original"></i>,
  "Django": <i className="devicon-django-plain"></i>,
  "FastAPI": <i className="devicon-fastapi-plain colored"></i>,
  "Textual": <i className="devicon-python-plain colored"></i>,
  "LangChain": <i className="devicon-python-plain colored"></i>,
  "MkDocs": <i className="devicon-markdown-original"></i>,

  // Tools
  "Git": <i className="devicon-git-plain colored"></i>,
  "GH Actions": <i className="devicon-githubactions-plain colored"></i>,
  "Docker": <i className="devicon-docker-plain colored"></i>,
  "Azure": <i className="devicon-azure-plain colored"></i>,
  "VS Code": <i className="devicon-vscode-plain colored"></i>,
  "NeoVim": <i className="devicon-neovim-plain colored"></i>,
  "Linux CLI": <i className="devicon-linux-plain"></i>
};

export default function Skills() {
  return (
    <section className="container-custom section-spacing" id="skills">
      <div className="max-w-3xl mx-auto">
        {/* Section heading with descriptive text */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gradient">
            Technical Expertise
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            With a strong foundation in multiple programming languages and frameworks, 
            I leverage various tools to build robust, efficient solutions for complex problems.
          </p>
        </div>
        
        {/* New integrated skills section */}
        <div className="modern-card p-6 md:p-8">
          <div className="space-y-8">
            {/* Skill categories in tabs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Languages
                </h3>
                <div className="space-y-2">
                  {skills.languages.map((skill, index) => (
                    <div key={index} className="skill-badge">
                      {techIcons[skill]}
                      <span className="text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                  Frameworks
                </h3>
                <div className="space-y-2">
                  {skills.frameworks.map((skill, index) => (
                    <div key={index} className="skill-badge">
                      {techIcons[skill]}
                      <span className="text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Tools
                </h3>
                <div className="space-y-2">
                  {skills.tools.map((skill, index) => (
                    <div key={index} className="skill-badge">
                      {techIcons[skill]}
                      <span className="text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Skills summary */}
            <div className="pt-6 border-t border-border">
              <h4 className="font-medium mb-3">Specialized In</h4>
              <div className="flex flex-wrap gap-2">
                <span className="tech-tag">Backend Development</span>
                <span className="tech-tag">API Design</span>
                <span className="tech-tag">Linux</span>
                <span className="tech-tag">Cloud Infrastructure</span>
                <span className="tech-tag">DevOps</span>
                <span className="tech-tag">Test Automation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}