import { useEffect, useMemo, useState } from "react";

export default function MonthPicker({
  strings,
  monthCursor,
  monthLabel,
  locale,
  onPrevMonth,
  onNextMonth,
  onSelectMonth,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pickerCursor, setPickerCursor] = useState(monthCursor);

  useEffect(() => {
    if (!menuOpen && monthCursor) {
      setPickerCursor(monthCursor);
    }
  }, [monthCursor, menuOpen]);

  const monthOptions = useMemo(() => {
    if (!pickerCursor) return [];
    const year = pickerCursor.getFullYear();
    return Array.from({ length: 12 }, (_, index) => ({
      index,
      label: new Date(year, index, 1).toLocaleDateString(locale, { month: "short" }),
    }));
  }, [pickerCursor, locale]);

  const currentMonthIndex = pickerCursor?.getMonth?.() ?? 0;

  return (
    <div className="month-picker-root relative flex flex-wrap items-center justify-end gap-2 sm:gap-4">
      <div className="flex items-center gap-2 sm:gap-3 rounded-2xl border border-slate-700/60 bg-slate-950/40 px-2 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs text-slate-300">
        <button
          type="button"
          className="flex h-8 w-8 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-slate-600/70 bg-slate-900/70 text-slate-200 shadow-sm transition hover:border-emerald-400/80 hover:bg-emerald-500/15"
          onClick={onPrevMonth}
          aria-label={strings.prevMonth}
        >
          <span className="inline-block h-3 w-3 -translate-x-[1px] rotate-45 border-b-2 border-l-2 border-emerald-400" />
        </button>

        <button
          type="button"
          className="relative flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-950/60 px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-medium text-slate-100 transition hover:border-emerald-400/70 hover:bg-slate-900"
          onClick={() => {
            setMenuOpen((open) => !open);
            if (!menuOpen && monthCursor) setPickerCursor(monthCursor);
          }}
        >
          <span className="text-slate-400">{strings.month}</span>
          <span>{monthLabel}</span>
          <span
            className={`inline-block h-2 w-2 rotate-45 border-b border-r ${
              menuOpen ? "border-emerald-400" : "border-slate-400"
            }`}
          />
        </button>

        <button
          type="button"
          className="flex h-8 w-8 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-slate-600/70 bg-slate-900/70 text-slate-200 shadow-sm transition hover:border-emerald-400/80 hover:bg-emerald-500/15"
          onClick={onNextMonth}
          aria-label={strings.nextMonth}
        >
          <span className="inline-block h-3 w-3 translate-x-[1px] -rotate-45 border-b-2 border-r-2 border-emerald-400" />
        </button>
      </div>

      {menuOpen && monthOptions.length > 0 && pickerCursor && (
        <div className="absolute right-0 top-full z-40 mt-2 w-52 sm:w-56 rounded-2xl border border-slate-700/70 bg-slate-950/95 p-2 text-xs shadow-xl">
          <div className="mb-2 flex items-center justify-between gap-2 px-1 text-[11px] text-slate-200">
            <button
              type="button"
              className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-600/70 bg-slate-900/80 text-[10px] hover:border-emerald-400/80 hover:bg-emerald-500/10"
              onClick={() =>
                setPickerCursor((prev) => new Date(prev.getFullYear() - 1, prev.getMonth(), 1))
              }
              aria-label={strings.prevMonth}
            >
              <span className="inline-block h-2 w-2 -translate-x-[1px] rotate-45 border-b border-l border-emerald-400" />
            </button>
            <span className="font-medium">
              {pickerCursor.toLocaleDateString(locale, { year: "numeric" })}
            </span>
            <button
              type="button"
              className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-600/70 bg-slate-900/80 text-[10px] hover:border-emerald-400/80 hover:bg-emerald-500/10"
              onClick={() =>
                setPickerCursor((prev) => new Date(prev.getFullYear() + 1, prev.getMonth(), 1))
              }
              aria-label={strings.nextMonth}
            >
              <span className="inline-block h-2 w-2 translate-x-[1px] -rotate-45 border-b border-r border-emerald-400" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {monthOptions.map((m) => {
              const isActive = m.index === currentMonthIndex;
              return (
                <button
                  key={m.index}
                  type="button"
                  className={[
                    "rounded-xl px-2 py-1",
                    isActive
                      ? "bg-emerald-500/90 text-emerald-950 font-semibold"
                      : "bg-slate-900/70 text-slate-200 hover:bg-slate-800",
                  ].join(" ")}
                  onClick={() => {
                    onSelectMonth?.(pickerCursor.getFullYear(), m.index);
                    setMenuOpen(false);
                  }}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}



