export function LcdDisplay({ lines }: { lines: [string, string] }) {
  return (
    <div className="rounded-lg border-2 border-emerald-800/30 bg-emerald-950 p-3 font-mono text-emerald-400 shadow-inner">
      <div className="text-xs leading-relaxed tracking-wider">
        <p>{lines[0]}</p>
        <p>{lines[1]}</p>
      </div>
    </div>
  );
}
