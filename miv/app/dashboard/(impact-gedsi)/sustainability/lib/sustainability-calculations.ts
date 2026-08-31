import type { Venture } from "../types/sustainability.types";

// Generate nature projects from real venture data
export function generateNatureProjects(ventures: Venture[]) {
  const projects = [];

  // Forest restoration projects (CleanTech and Environmental ventures)
  const forestVentures = ventures.filter(
    (v) =>
      v.sector === "CleanTech" ||
      v.sector === "Environmental" ||
      v.sector === "Agriculture",
  );

  if (forestVentures.length > 0) {
    const totalFunding = forestVentures.reduce(
      (sum, v) => sum + (v.fundingRaised || 0),
      0,
    );
    const treesPlanted = Math.floor(totalFunding / 10); // 1 tree per $10 invested
    const carbonSequestered = Math.floor(treesPlanted * 0.02); // 0.02 tCO2e per tree per year

    projects.push({
      name: "Portfolio Forest Impact",
      description: "Reforestation through portfolio companies",
      status: forestVentures.some((v) => v.status === "ACTIVE")
        ? "Active"
        : "Planning",
      metrics: `${treesPlanted.toLocaleString()} trees equivalent • ${carbonSequestered} tCO2e/year`,
      borderColor: "border-l-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-800",
      descColor: "text-green-700",
      badgeColor: "bg-green-600",
      metricColor: "text-green-600",
    });
  }

  // Conservation projects (HealthTech and Social Impact ventures)
  const conservationVentures = ventures.filter(
    (v) =>
      v.sector === "HealthTech" || v.inclusionFocus?.includes("environmental"),
  );

  if (conservationVentures.length > 0) {
    const hectaresEquivalent = Math.floor(conservationVentures.length * 50); // 50 hectares per venture
    const speciesImpact = conservationVentures.length * 5; // 5 species per venture

    projects.push({
      name: "Ecosystem Conservation",
      description: "Biodiversity protection initiatives",
      status: "Monitoring",
      metrics: `${hectaresEquivalent} hectares equivalent • ${speciesImpact} species impact`,
      borderColor: "border-l-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      descColor: "text-blue-700",
      badgeColor: "bg-blue-600",
      metricColor: "text-blue-600",
    });
  }

  // Agriculture projects
  const agriVentures = ventures.filter((v) => v.sector === "Agriculture");

  if (agriVentures.length > 0) {
    const farmersReached = agriVentures.reduce(
      (sum, v) => sum + (v.totalBeneficiaries || 0),
      0,
    );
    const yieldImprovement =
      agriVentures.length > 0 ? Math.min(50, agriVentures.length * 5) : 0;

    projects.push({
      name: "Regenerative Agriculture",
      description: "Sustainable farming practices",
      status: "Scaling",
      metrics: `${farmersReached.toLocaleString()} farmers reached • ${yieldImprovement}% yield improvement`,
      borderColor: "border-l-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-800",
      descColor: "text-purple-700",
      badgeColor: "bg-purple-600",
      metricColor: "text-purple-600",
    });
  }

  return projects;
}
