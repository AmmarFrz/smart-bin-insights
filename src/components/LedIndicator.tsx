export function LedIndicator({ color, active, label }: { color: "green" | "yellow" | "red"; active: boolean; label: string }) {
  const colors = {
    green: active ? "bg-emerald-400 shadow-emerald-400/50" : "bg-emerald-900",
    yellow: active ? "bg-amber-400 shadow-amber-400/50" : "bg-amber-900",
    red: active ? "bg-red-400 shadow-red-400/50" : "bg-red-900",
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`h-3 w-3 rounded-full ${colors[color]} ${active ? "shadow-lg animate-pulse-dot" : ""}`} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
