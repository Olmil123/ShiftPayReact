export default function LanguagePicker({ value, onChange, strings, options }) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-slate-700/60 bg-slate-950/40 px-3 py-2 text-sm text-slate-200">
      <span className="text-slate-400">{strings.language}</span>
      <select
        className="rounded-xl border border-slate-700/60 bg-slate-900 px-3 py-1 text-sm font-medium text-slate-100 focus:border-emerald-400 focus:outline-none"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map(([code, cfg]) => (
          <option key={code} value={code}>
            {cfg.label}
          </option>
        ))}
      </select>
    </label>
  );
}

