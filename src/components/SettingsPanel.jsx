export default function SettingsPanel({
  strings,
  baseRate,
  defaultBreak,
  onBaseRateChange,
  onDefaultBreakChange,
  onClearAll,
}) {
  return (
    <section className="panel-animated rounded-3xl border border-slate-700/60 bg-slate-900/50 p-6 shadow-lg backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold sm:text-xl">{strings.settings}</h2>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span className="text-slate-300">{strings.baseRate}</span>
          <input
            type="number"
            inputMode="decimal"
            className="inp"
            value={baseRate}
            onChange={(event) => onBaseRateChange(Number(event.target.value || 0))}
          />
        </label>
        <label className="grid gap-2 text-sm">
          <span className="text-slate-300">{strings.defaultBreak}</span>
          <input
            type="number"
            inputMode="numeric"
            className="inp"
            value={defaultBreak}
            onChange={(event) => onDefaultBreakChange(Number(event.target.value || 0))}
          />
        </label>
      </div>
      <div className="mt-5 flex flex-wrap justify-end">
        <button
          type="button"
          onClick={onClearAll}
          className="rounded-2xl bg-rose-500/90 px-4 py-2 text-sm font-medium text-rose-50 shadow-lg shadow-rose-500/20 transition hover:bg-rose-400"
        >
          {strings.clearAll}
        </button>
      </div>
    </section>
  );
}

