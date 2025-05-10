import { contributions } from "../../data/portfolio-data";

export default function Contributions() {
  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-modern-teal to-modern-tealLight text-transparent bg-clip-text">
        Open Source Contributions
      </h2>
      
      <div className="space-y-8">
        {contributions.map((contribution, index) => (
          <ContributionCard key={index} contribution={contribution} index={index} />
        ))}
      </div>
    </div>
  );
}

function ContributionCard({ contribution, index }) {
  // Add default URL if missing
  const projectUrl = contribution.url || "#";
  
  return (
    <a 
      href={projectUrl}
      target="_blank" 
      rel="noopener noreferrer"
      className="block border rounded-lg p-6 bg-card text-card-foreground shadow-md card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex flex-col gap-2 mb-4">
        <h3 className="text-xl font-semibold text-modern-teal flex items-center gap-2">
          {contribution.project}
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
            className="text-muted-foreground"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </h3>
        <span className="text-sm text-muted-foreground">
          {contribution.description}
        </span>
      </div>
      
      <div className="pl-4 border-l-2 border-modern-teal">
        <p className="text-muted-foreground">{contribution.contribution}</p>
      </div>
    </a>
  );
}