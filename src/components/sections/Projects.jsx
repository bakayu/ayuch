import { useState } from "react";
import { projects } from "../../data/portfolio-data";

// Tech stack to Devicon mapping
function getDevIconClass(tech) {
  const iconMap = {
    // Languages
    'JavaScript': 'devicon-javascript-plain',
    'TypeScript': 'devicon-typescript-plain',
    'Python': 'devicon-python-plain',
    'Java': 'devicon-java-plain',
    'C++': 'devicon-cplusplus-plain',
    'C#': 'devicon-csharp-plain',
    'PHP': 'devicon-php-plain',
    'Ruby': 'devicon-ruby-plain',
    'Go': 'devicon-go-plain',
    'Rust': 'devicon-rust-plain',
    
    // Frontend
    'React': 'devicon-react-original',
    'Vue': 'devicon-vuejs-plain',
    'Angular': 'devicon-angularjs-plain',
    'Next.js': 'devicon-nextjs-original',
    'Tailwind': 'devicon-tailwindcss-plain',
    'Bootstrap': 'devicon-bootstrap-plain',
    'Svelte': 'devicon-svelte-plain',
    
    // Backend
    'Node.js': 'devicon-nodejs-plain',
    'Express': 'devicon-express-original',
    'Django': 'devicon-django-plain',
    'Flask': 'devicon-flask-original',
    'Spring': 'devicon-spring-plain',
    'FastAPI': 'devicon-fastapi-plain',
    'Laravel': 'devicon-laravel-plain',
    
    // Databases
    'MongoDB': 'devicon-mongodb-plain',
    'PostgreSQL': 'devicon-postgresql-plain',
    'MySQL': 'devicon-mysql-plain',
    'SQLite': 'devicon-sqlite-plain',
    'Redis': 'devicon-redis-plain',
    
    // DevOps
    'Docker': 'devicon-docker-plain',
    'Kubernetes': 'devicon-kubernetes-plain',
    'AWS': 'devicon-amazonwebservices-original',
    'GCP': 'devicon-googlecloud-plain',
    'Azure': 'devicon-azure-plain',
    'GitHub': 'devicon-github-original',
    'GitLab': 'devicon-gitlab-plain',
    'Git': 'devicon-git-plain',
    'CircleCI': 'devicon-circleci-plain',
    'Jenkins': 'devicon-jenkins-plain',
    
    // Tools & Libraries
    'Webpack': 'devicon-webpack-plain',
    'Babel': 'devicon-babel-plain',
    'Vite': 'devicon-vitejs-plain',
    'NPM': 'devicon-npm-original-wordmark',
    'Yarn': 'devicon-yarn-plain',
    'Sass': 'devicon-sass-original',
    'Redux': 'devicon-redux-original',
    'GraphQL': 'devicon-graphql-plain',
    'Jest': 'devicon-jest-plain',
    'Mocha': 'devicon-mocha-plain',
    'jQuery': 'devicon-jquery-plain',
    'Figma': 'devicon-figma-plain',
    'XD': 'devicon-xd-plain',
    'Photoshop': 'devicon-photoshop-plain',
    'VSCode': 'devicon-vscode-plain',
    
    // Specialized
    'TensorFlow': 'devicon-tensorflow-original',
    'PyTorch': 'devicon-pytorch-original',
    'Pandas': 'devicon-pandas-original',
    'NumPy': 'devicon-numpy-original',
    'Jupyter': 'devicon-jupyter-plain',
    'Textual': 'devicon-python-plain', // Fallback for Textual
    'GitPython': 'devicon-git-plain', // Fallback for GitPython
    'MkDocs': 'devicon-markdown-original', // Fallback for MkDocs
    'GH Actions': 'devicon-github-original', // Fallback for GitHub Actions
  };
  
  return iconMap[tech] || null;
}

export default function Projects() {
  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-modern-teal to-modern-tealLight text-transparent bg-clip-text">
        Personal Projects
      </h2>
      
      <div className="grid grid-cols-1 gap-8">
        {projects.map((project, index) => (
          <ProjectCard 
            key={index} 
            project={project} 
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, index }) {
  // Set up project URLs
  const projectUrl = project.url || project.repoUrl || "#";
  
  return (
    <div className="border rounded-lg p-6 bg-card text-card-foreground shadow-md card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex flex-col gap-2">
        {/* Header with title and thumbnail side by side */}
        <div className="flex items-start gap-4">
          {/* Project title and description - take less width */}
          <div className="flex-1 pr-2">
            <a 
              href={projectUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:underline"
            >
              <h3 className="text-xl font-semibold text-modern-teal">{project.title}</h3>
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
                className="text-modern-teal/70"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
            <p className="text-muted-foreground mt-1">{project.description}</p>
            
            {/* Tech stack badges */}
            <div className="flex flex-wrap gap-2 mt-3">
              {project.tech.map((tech, i) => {
                // Map tech name to Devicon class
                const devIconClass = getDevIconClass(tech);
                return (
                  <span 
                    key={i} 
                    className="text-xs bg-modern-teal/10 text-modern-teal px-2.5 py-1 rounded-full border border-modern-teal/20 flex items-center gap-1"
                  >
                    {devIconClass ? (
                      <i className={devIconClass}></i>
                    ) : null}
                    {tech}
                  </span>
                );
              })}
            </div>

            {/* Project details as a paragraph */}
            <div className="text-sm text-muted-foreground mt-3">
              {project.details && (
                <p className="leading-relaxed">
                  {project.details.join('. ')}
                </p>
              )}
            </div>
            
            {/* Project links section */}
            {(project.demoUrl || project.repoUrl) && (
              <div className="mt-3 flex flex-wrap gap-3">
                {project.repoUrl && (
                  <a 
                    href={project.repoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-modern-teal hover:underline"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                    View Code
                  </a>
                )}
                {project.demoUrl && (
                  <a 
                    href={project.demoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-modern-teal hover:underline"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    Live Demo
                  </a>
                )}
              </div>
            )}
          </div>
          
          {/* Project Preview Window - fix mobile display */}
          {project.thumbnail && (
            <div className="w-[150px] md:w-[150px] lg:w-[300px] flex-shrink-0">
              <a 
                href={projectUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block h-full"
              >
                <div className="h-[100px] md:h-[120px] lg:h-[190px] rounded-lg overflow-hidden border border-border shadow-sm">
                  <img 
                    src={project.thumbnail} 
                    alt={`${project.title} preview`} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}