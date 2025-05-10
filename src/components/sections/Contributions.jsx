import { contributions } from "../../data/portfolio-data";

export default function Contributions() {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-vibrant-green to-vibrant-teal text-transparent bg-clip-text">
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
  // Alternate colors for visual variety
  const colors = ["vibrant-blue", "vibrant-purple", "vibrant-teal"];
  const color = colors[index % colors.length];
  
  return (
    <div className={`border rounded-lg p-6 bg-card text-card-foreground shadow-md hover-lift hover:border-${color} transition-all duration-300`}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
        <h3 className={`text-xl font-semibold text-${color}`}>{contribution.project}</h3>
        <span className="text-sm bg-secondary/50 text-secondary-foreground px-3 py-1 rounded-full">
          {contribution.description}
        </span>
      </div>
      
      <div className={`pl-4 border-l-2 border-${color}`}>
        <p className="text-muted-foreground">{contribution.contribution}</p>
      </div>
    </div>
  );
}