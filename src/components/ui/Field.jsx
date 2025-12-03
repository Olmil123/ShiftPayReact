export default function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-sm text-slate-200">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</span>
      {children}
    </label>
  );
}

