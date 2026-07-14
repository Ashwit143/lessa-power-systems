import { Users, Store, Award, Calendar } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

interface StatItem {
  icon: React.ElementType;
  value: string;
  label: string;
  color: string;
}

const STATS: StatItem[] = [
  {
    icon: Calendar,
    value: SITE_CONFIG.stats.yearsEstablished,
    label: "In Business",
    color: "text-primary-700",
  },
  {
    icon: Users,
    value: SITE_CONFIG.stats.customers,
    label: "Happy Customers",
    color: "text-primary-700",
  },
  {
    icon: Store,
    value: SITE_CONFIG.stats.dealers,
    label: "Trusted Dealers",
    color: "text-primary-700",
  },
  {
    icon: Award,
    value: "Authorized",
    label: "Luminous Distributor",
    color: "text-accent",
  },
];

export function TrustBar() {
  return (
    <section
      className="bg-white border-y border-neutral-100 py-6"
      aria-label="Trust statistics"
    >
      <div className="container-site">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="trust-stat">
                <div className="flex items-center justify-center w-10 h-10 bg-primary-50 rounded-lg mb-2">
                  <Icon
                    className={`h-5 w-5 ${stat.color}`}
                    aria-hidden="true"
                  />
                </div>
                <p className={`trust-stat-value ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="trust-stat-label">{stat.label}</p>
              </div>
            );
          })}
        </div>
        <p className="text-center text-xs text-neutral-400 mt-4">
          *Customer and dealer counts are client-provided figures. Authorized distributor since {SITE_CONFIG.established}.
        </p>
      </div>
    </section>
  );
}
