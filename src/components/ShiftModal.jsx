import Field from "./ui/Field";
import { currency, diffHours, fmtDMY } from "../utils/shiftUtils";

export default function ShiftModal({
  open,
  strings,
  editingDate,
  form,
  onChange,
  onClose,
  onSave,
  baseRate,
  locale,
  presetColors,
}) {
  if (!open) return null;

  const hours = diffHours(form.start, form.end, Number(form.breakMin || 0));
  const rate = form.rate === "" ? baseRate : Number(form.rate || 0);
  const total = hours * rate;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="panel-animated shift-modal-inner w-full max-w-2xl rounded-3xl border border-slate-700/60 bg-slate-950/80 p-6 shadow-2xl backdrop-blur"
        onClick={(event) => event.stopPropagation()}
        role="presentation"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold tracking-tight">
              {editingDate ? strings.shiftOn.replace("{date}", fmtDMY(editingDate, locale)) : strings.shiftOn}
            </h3>
            <p className="text-sm text-slate-400">{strings.modalHint}</p>
          </div>
          <button
            type="button"
            className="text-slate-400 transition hover:text-slate-200"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label={strings.start}>
            <input
              type="time"
              value={form.start}
              onChange={(event) => onChange("start", event.target.value)}
              className="inp"
            />
          </Field>
          <Field label={strings.end}>
            <input
              type="time"
              value={form.end}
              onChange={(event) => onChange("end", event.target.value)}
              className="inp"
            />
          </Field>
          <Field label={strings.break}>
            <input
              type="number"
              inputMode="numeric"
              value={form.breakMin}
              onChange={(event) => onChange("breakMin", event.target.value)}
              className="inp"
            />
          </Field>
          <Field label={strings.rateOptional}>
            <input
              type="number"
              inputMode="decimal"
              placeholder={strings.rateForShiftPlaceholder.replace("{rate}", baseRate)}
              value={form.rate}
              onChange={(event) => onChange("rate", event.target.value)}
              className="inp"
            />
          </Field>
          <Field label={strings.color}>
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="color"
                  value={form.color}
                  onChange={(event) => onChange("color", event.target.value)}
                  className="h-11 w-20 cursor-pointer rounded-xl border border-slate-600 bg-transparent"
                />
                <span className="text-xs text-slate-400">{strings.colorHint}</span>
              </div>
              <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
                {presetColors.map((color) => {
                  const isSelected = form.color === color;
                  return (
                    <button
                      type="button"
                      key={color}
                      onClick={() => onChange("color", color)}
                      className={[
                        "relative h-10 w-10 rounded-full border-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300",
                        isSelected ? "border-white shadow-lg scale-105" : "border-transparent opacity-80 hover:opacity-100",
                      ].join(" ")}
                      style={{ background: color }}
                    >
                      <span className="sr-only">{color}</span>
                      {isSelected && (
                        <span className="absolute inset-0 grid place-items-center text-xs font-bold text-slate-900">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </Field>
          <Field label={strings.note}>
            <input
              type="text"
              placeholder={strings.notePlaceholder}
              value={form.note}
              onChange={(event) => onChange("note", event.target.value)}
              className="inp"
            />
          </Field>
        </div>

        <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-emerald-200">
          <div className="flex flex-wrap gap-6">
            <span>
              {strings.hoursLabel}: <strong>{hours.toFixed(2)}</strong>
            </span>
            <span>
              {strings.rateLabel}: <strong>{currency(rate, locale)}</strong>
            </span>
            <span>
              {strings.totalLabel}: <strong>{currency(total, locale)}</strong>
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            className="rounded-2xl border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
            onClick={onClose}
          >
            {strings.cancel}
          </button>
          <button
            type="button"
            className="rounded-2xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400"
            onClick={onSave}
          >
            {strings.saveShift}
          </button>
        </div>
      </div>
    </div>
  );
}

