import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  iconClassName?: string;
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, iconClassName }: StatCardProps) {
  return (
    <div className="glass-card rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:border-primary/20 group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          {trend && (
            <p className={`text-xs font-medium ${trend.positive ? "text-emerald-400" : "text-red-400"}`}>
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 ${iconClassName || "bg-primary/10 group-hover:bg-primary/20 group-hover:glow-green"}`}>
          <Icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
        </div>
      </div>
    </div>
  );
}
