import { describe, it, expect } from "vitest";
import {
  diffHours,
  summarizeShifts,
  toYMD,
  buildMonthMatrix,
  inSameMonth,
} from "./shiftUtils";

describe("diffHours", () => {
  it("counts simple same-day shift", () => {
    expect(diffHours("08:00", "16:00", 0)).toBe(8);
  });

  it("respects break minutes", () => {
    expect(diffHours("08:00", "16:30", 30)).toBe(8);
  });

  it("handles crossing midnight", () => {
    // 22:00 -> 06:00 = 8h
    expect(diffHours("22:00", "06:00", 0)).toBe(8);
  });

  it("returns 0 for invalid input", () => {
    expect(diffHours("xx", "yy", 0)).toBe(0);
  });
});

describe("summarizeShifts", () => {
  it("aggregates count, hours and amount", () => {
    const shifts = [
      { start: "08:00", end: "16:00", breakMin: 0, rate: null },
      { start: "09:00", end: "17:30", breakMin: 30, rate: 200 },
    ];
    const baseRate = 150;
    const summary = summarizeShifts(shifts, baseRate);

    // first: 8h * 150 = 1200
    // second: 8h * 200 = 1600
    expect(summary.count).toBe(2);
    expect(summary.hours).toBeCloseTo(16);
    expect(summary.amount).toBeCloseTo(2800);
  });
});

describe("date helpers", () => {
  it("toYMD returns consistent string", () => {
    const d = new Date(2025, 0, 5); // 5 Jan 2025
    expect(toYMD(d)).toBe("2025-01-05");
  });

  it("buildMonthMatrix covers at least 4 full weeks", () => {
    const anchor = new Date(2025, 0, 10);
    const matrix = buildMonthMatrix(anchor);
    expect(matrix).toHaveLength(42); // 6 weeks grid
    // All entries have a date
    expect(matrix.every((c) => c.date instanceof Date)).toBe(true);
  });

  it("inSameMonth detects same month", () => {
    expect(inSameMonth("2025-03-01", 2025, 2)).toBe(true);
    expect(inSameMonth("2025-04-01", 2025, 2)).toBe(false);
  });
});
