export function FillGauge({ percentage }: { percentage: number }) {
  const color = percentage >= 80 ? "bg-red-500" : percentage >= 50 ? "bg-amber-500" : "bg-emerald-500";
  const glowColor = percentage >= 80 ? "shadow-red-500/30" : percentage >= 50 ? "shadow-amber-500/30" : "shadow-emerald-500/30";
  
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">Fill Level</span>
        <span className={`font-bold tabular-nums ${
          percentage >= 80 ? "text-red-400" : percentage >= 50 ? "text-amber-400" : "text-emerald-400"
        }`}>{percentage}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color} shadow-lg ${glowColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
