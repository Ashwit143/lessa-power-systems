import { CheckCircle, XCircle, RefreshCw } from "lucide-react";

interface SystemFeature {
  label: string;
  included: boolean;
}

interface SolarSystem {
  type: string;
  tagline: string;
  description: string;
  features: SystemFeature[];
  bestFor: string;
  highlight?: boolean;
}

const SOLAR_SYSTEMS: SolarSystem[] = [
  {
    type: "On-Grid",
    tagline: "Reduce your bill with net metering",
    description:
      "An on-grid (grid-tied) system connects directly to the utility grid. Solar power generated during the day reduces your consumption from the grid, and any surplus is fed back (net metering). Best for homes and businesses that want to reduce electricity bills where grid supply is mostly reliable.",
    features: [
      { label: "Reduces electricity bill", included: true },
      { label: "Net metering — sell surplus to grid", included: true },
      { label: "Works during grid outages", included: false },
      { label: "Requires battery storage", included: false },
      { label: "Lower upfront cost", included: true },
    ],
    bestFor: "Homes & offices with reliable grid supply",
    highlight: false,
  },
  {
    type: "Hybrid",
    tagline: "Best of both worlds — grid + battery",
    description:
      "A hybrid system connects to the grid AND has battery storage. Solar powers your home during the day, charges the battery, and connects to the grid for net metering. During power cuts, the battery provides backup. Increasingly popular in Hyderabad for both bill savings and backup.",
    features: [
      { label: "Reduces electricity bill", included: true },
      { label: "Net metering — sell surplus to grid", included: true },
      { label: "Works during grid outages", included: true },
      { label: "Battery storage included", included: true },
      { label: "Maximum energy independence", included: true },
    ],
    bestFor: "Homes & offices wanting bill savings + power backup",
    highlight: true,
  },
  {
    type: "Off-Grid",
    tagline: "Complete independence from the grid",
    description:
      "An off-grid system operates entirely independently, powered by solar panels and a battery bank. No grid connection required. Ideal for remote locations, farmhouses, and areas with unreliable or absent grid supply. Higher upfront cost but zero electricity bill.",
    features: [
      { label: "Zero electricity bill", included: true },
      { label: "Works without grid connection", included: true },
      { label: "Full energy independence", included: true },
      { label: "Large battery bank required", included: true },
      { label: "Net metering (no grid connection)", included: false },
    ],
    bestFor: "Farmhouses, remote locations, areas with no grid supply",
    highlight: false,
  },
];

export function SolarSystemCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
      {SOLAR_SYSTEMS.map((system) => (
        <div
          key={system.type}
          className={`relative rounded-xl border-2 p-6 flex flex-col gap-4 transition-shadow ${
            system.highlight
              ? "border-accent bg-white shadow-card-hover"
              : "border-neutral-200 bg-white shadow-card"
          }`}
        >
          {system.highlight && (
            <div className="absolute -top-3.5 left-6">
              <span className="bg-accent text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                Most Popular
              </span>
            </div>
          )}

          <div className={system.highlight ? "mt-2" : ""}>
            <h3 className="text-xl font-bold text-neutral-800">{system.type}</h3>
            <p className="text-sm font-semibold text-primary-700 mt-0.5">{system.tagline}</p>
          </div>

          <p className="text-sm text-neutral-600 leading-relaxed">{system.description}</p>

          <ul className="space-y-2.5" aria-label={`${system.type} system features`}>
            {system.features.map((feature) => (
              <li key={feature.label} className="flex items-start gap-2.5 text-sm">
                {feature.included ? (
                  <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" aria-hidden="true" />
                ) : (
                  <XCircle className="h-4 w-4 text-neutral-300 flex-shrink-0 mt-0.5" aria-hidden="true" />
                )}
                <span className={feature.included ? "text-neutral-700" : "text-neutral-400"}>
                  {feature.label}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-4 border-t border-neutral-100">
            <p className="text-xs text-neutral-500">
              <span className="font-semibold text-neutral-600">Best for:</span> {system.bestFor}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
