import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SummarySection from "./SummarySection";

const strings = {
  summaryHeading: "Summary for {month}",
  statShifts: "Shifts",
  statHours: "Hours",
  statAmount: "Amount",
  summaryTableDate: "Date",
  summaryTableStart: "Start",
  summaryTableEnd: "End",
  summaryTableBreak: "Break",
  summaryTableHours: "Hours",
  summaryTableRate: "Rate",
  summaryTableTotal: "Total",
  summaryTableNote: "Note",
  summaryTableActions: "Actions",
  noShifts: "No shifts",
  minuteSuffix: "min",
  deleteAction: "Delete",
  emptyNote: "—",
};

describe("SummarySection", () => {
  it("shows empty state when there are no shifts", () => {
    render(
      <SummarySection
        strings={strings}
        monthLabel="January 2025"
        stats={{ count: 0, hours: 0, amount: 0 }}
        shifts={[]}
        baseRate={100}
        locale="en-GB"
        onDeleteShift={() => {}}
      />,
    );

    expect(screen.getByText("No shifts")).toBeInTheDocument();
  });

  it("calls onDeleteShift when delete button is clicked", () => {
    const onDeleteShift = vi.fn();

    const shifts = [
      {
        id: "1",
        date: "2025-01-05",
        start: "08:00",
        end: "16:00",
        breakMin: 0,
        rate: 100,
        color: "#22c55e",
        note: "Test",
      },
    ];

    render(
      <SummarySection
        strings={strings}
        monthLabel="January 2025"
        stats={{ count: 1, hours: 8, amount: 800 }}
        shifts={shifts}
        baseRate={100}
        locale="en-GB"
        onDeleteShift={onDeleteShift}
      />,
    );

    const deleteButton = screen.getByText(strings.deleteAction);
    fireEvent.click(deleteButton);

    expect(onDeleteShift).toHaveBeenCalledWith("2025-01-05");
  });
});

