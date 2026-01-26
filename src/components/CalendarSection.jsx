import { diffHours, toYMD } from "../utils/shiftUtils";

export default function CalendarSection({
  strings,
  monthMatrix,
  monthCursor,
  shiftMap,
  locale,
  onSelectDate,
  t,
}) {
  const currentMonthIndex = monthCursor.getFullYear() * 12 + monthCursor.getMonth();

  return (
    <div className="calendar-panel panel-animated rounded-3xl border border-slate-700/60 bg-slate-900/50 p-4 sm:p-6 shadow-lg backdrop-blur min-w-[320px] sm:min-w-[460px] xl:min-w-[600px]">
      <div className="grid grid-cols-7 gap-4 sm:gap-5 text-center text-[13px] uppercase tracking-wide text-slate-400">
        {strings.weekdaysShort.map((day) => (
          <div key={day} className="py-1 font-medium">
            {day}
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-7 gap-4 sm:gap-5">
        {monthMatrix.map((cell) => {
          const dateStr = toYMD(cell.date);
          const cellMonthIndex = cell.date.getFullYear() * 12 + cell.date.getMonth();
          const monthOffset = cellMonthIndex - currentMonthIndex;
          const isCurrent = monthOffset === 0;
          const shift = shiftMap.get(dateStr);
          const hours = shift ? diffHours(shift.start, shift.end, shift.breakMin) : 0;
          const isOtherMonth = monthOffset !== 0;
          const isFirstDayOfOffset = isOtherMonth && cell.date.getDate() === 1;
          const monthChip = isFirstDayOfOffset
            ? cell.date.toLocaleDateString(locale, { month: "short" }).toUpperCase()
            : null;

          const buttonClasses = [
            "calendar-day",
            "group relative flex aspect-square min-h-[3.85rem] sm:min-h-[4.6rem] lg:min-h-[5.1rem] flex-col justify-between rounded-3xl p-3 text-left transition-all duration-200",
            "ring-1 ring-slate-800/70 ring-offset-[4px] ring-offset-slate-950/75",
          ];

          if (isCurrent) {
            buttonClasses.push(
              "border border-slate-700/70 bg-gradient-to-br from-slate-950/85 via-slate-950/60 to-slate-950/70 text-slate-100 shadow-[0_18px_50px_rgba(7,11,25,0.45)] hover:-translate-y-[3px] hover:border-emerald-400/70 hover:shadow-[0_24px_60px_rgba(16,185,129,0.25)] hover:ring-emerald-400/70",
            );
          } else {
            buttonClasses.push(
              "border border-slate-700/40 bg-slate-950/30 text-slate-400/70 opacity-70 backdrop-blur-sm hover:ring-emerald-400/40",
            );
            if (monthOffset > 0) buttonClasses.push("mt-2");
            if (monthOffset < 0) buttonClasses.push("opacity-50");
          }

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={buttonClasses.join(" ")}
              title={
                shift
                  ? `${shift.start}–${shift.end} (${hours.toFixed(2)}${strings.hoursSuffix})`
                  : t("addShiftTooltip")
              }
            >
              {monthChip && (
                <span className="month-chip pointer-events-none absolute top-1 right-1 whitespace-nowrap rounded-full border border-slate-700/60 bg-slate-950/85 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-300 shadow-lg">
                  {monthChip}
                </span>
              )}
              <span className="text-xs font-semibold tracking-wide">{cell.date.getDate()}</span>
              {shift && (
                <span
                  className="inline-flex max-w-full items-center gap-1 truncate rounded-full px-2 py-0.5 text-[11px] font-semibold shadow-sm"
                  style={{ background: shift.color || "#22c55e", color: "#071019" }}
                >
                  {hours.toFixed(2)}
                  {strings.hoursSuffix}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-slate-400">{strings.calendarHint}</p>
    </div>
  );
}

