import { Badge } from "@/components/ui/badge";

export function BinStatusBadge({ status }: { status: "empty" | "medium" | "full" }) {
  const styles = {
    empty: "status-green border",
    medium: "status-yellow border",
    full: "status-red border",
  };
  const labels = { empty: "Empty", medium: "Medium", full: "Full" };
  const dotColor = {
    empty: "bg-emerald-400 shadow-emerald-400/50",
    medium: "bg-amber-400 shadow-amber-400/50",
    full: "bg-red-400 shadow-red-400/50 animate-pulse-dot",
  };

  return (
    <Badge variant="outline" className={`${styles[status]} text-[11px] font-medium`}>
      <span className={`mr-1.5 h-2 w-2 rounded-full inline-block shadow-sm ${dotColor[status]}`} />
      {labels[status]}
    </Badge>
  );
}
