import StatBox from "./ui/StatBox";
import { currency, diffHours, fmtDMY } from "../utils/shiftUtils";

export default function SummarySection({
  strings,
  monthLabel,
  stats,
  shifts,
  baseRate,
  locale,
  onDeleteShift,
}) {
  return (
    <div className="summary-panel panel-animated flex flex-col gap-4 rounded-3xl border border-slate-700/60 bg-slate-900/50 p-4 sm:p-5 shadow-lg backdrop-blur">
      <div>
        <h3 className="text-lg font-semibold tracking-tight">{strings.summaryHeading.replace("{month}", monthLabel)}</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <StatBox label={strings.statShifts} value={stats.count} />
        <StatBox label={strings.statHours} value={stats.hours.toFixed(2)} />
        <StatBox label={strings.statAmount} value={currency(stats.amount, locale)} />
      </div>
      <div className="max-h-80 overflow-auto rounded-2xl border border-slate-700/60">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-slate-950/70">
            <tr className="text-left">
              <Th>{strings.summaryTableDate}</Th>
              <Th>{strings.summaryTableStart}</Th>
              <Th>{strings.summaryTableEnd}</Th>
              <Th>{strings.summaryTableBreak}</Th>
              <Th>{strings.summaryTableHours}</Th>
              <Th>{strings.summaryTableRate}</Th>
              <Th>{strings.summaryTableTotal}</Th>
              <Th>{strings.summaryTableNote}</Th>
              <Th>{strings.summaryTableActions}</Th>
            </tr>
          </thead>
          <tbody>
            {shifts.length === 0 && (
              <tr>
                <td colSpan={9} className="p-4 text-center text-slate-400">
                  {strings.noShifts}
                </td>
              </tr>
            )}
            {shifts.map((shift) => {
              const hours = diffHours(shift.start, shift.end, shift.breakMin);
              const rate = shift.rate ?? baseRate;
              return (
                <tr key={shift.id} className="odd:bg-slate-950/30">
                  <Td>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ background: shift.color || "#22c55e" }} />
                      {fmtDMY(shift.date, locale)}
                    </span>
                  </Td>
                  <Td>{shift.start}</Td>
                  <Td>{shift.end}</Td>
                  <Td>
                    {shift.breakMin} {strings.minuteSuffix}
                  </Td>
                  <Td>{hours.toFixed(2)}</Td>
                  <Td>{currency(rate, locale)}</Td>
                  <Td>{currency(rate * hours, locale)}</Td>
                  <Td className="max-w-[12rem] truncate" title={shift.note || ""}>
                    {shift.note || strings.emptyNote}
                  </Td>
                  <Td>
                    <button
                      type="button"
                      className="text-sm font-medium text-rose-300 transition hover:text-rose-200"
                      onClick={() => onDeleteShift(shift.date)}
                    >
                      {strings.deleteAction}
                    </button>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }) {
  return <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{children}</th>;
}

function Td({ children, className = "" }) {
  return <td className={`px-3 py-2 text-sm text-slate-200 ${className}`}>{children}</td>;
}

