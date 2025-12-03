export default function StatBox({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-950/40 p-4 shadow-inner shadow-black/40">
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-slate-50">{value}</div>
    </div>
  );
}

