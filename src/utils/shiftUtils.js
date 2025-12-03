export const pad = (n) => String(n).padStart(2, "0");

export function toYMD(date) {
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  return `${y}-${m}-${d}`;
}

export function parseHhMm(str) {
  if (!str || !/^[0-2]\d:[0-5]\d$/.test(str)) return null;
  const [h, m] = str.split(":").map(Number);
  return { h, m };
}

export function diffHours(start, end, breakMin = 0) {
  const s = parseHhMm(start);
  const e = parseHhMm(end);
  if (!s || !e) return 0;
  let minutes = e.h * 60 + e.m - (s.h * 60 + s.m);
  if (minutes < 0) minutes += 24 * 60;
  minutes -= Number(breakMin || 0);
  return Math.max(0, minutes) / 60;
}

export function buildMonthMatrix(anchorDate) {
  const y = anchorDate.getFullYear();
  const m = anchorDate.getMonth();
  const first = new Date(y, m, 1);
  const startDow = (first.getDay() + 6) % 7;
  const start = new Date(y, m, 1 - startDow);
  const cells = [];
  for (let i = 0; i < 42; i += 1) {
    const d = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate() + i
    );
    cells.push({ date: d });
  }
  return cells;
}

export function inSameMonth(dateStr, y, m) {
  const d = new Date(dateStr);
  return d.getFullYear() === y && d.getMonth() === m;
}

export function currency(value, locale = "en-GB") {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(
    value ?? 0
  );
}

export function fmtDMY(ymd, locale = "en-GB") {
  const [Y, M, D] = ymd.split("-").map(Number);
  const date = new Date(Y, M - 1, D);
  return date.toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function summarizeShifts(list, baseRate) {
  return list.reduce(
    (acc, shift) => {
      const hours = diffHours(shift.start, shift.end, shift.breakMin);
      const rate = shift.rate ?? baseRate;
      return {
        count: acc.count + 1,
        hours: acc.hours + hours,
        amount: acc.amount + hours * rate,
      };
    },
    { count: 0, hours: 0, amount: 0 }
  );
}

export function mapShiftsByDate(shifts) {
  return shifts.reduce((map, shift) => {
    map.set(shift.date, shift);
    return map;
  }, new Map());
}
