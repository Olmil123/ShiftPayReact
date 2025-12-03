import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ShiftModal from "./ShiftModal";

const baseStrings = {
  shiftOn: "Shift on {date}",
  modalHint: "Hint",
  start: "Start",
  end: "End",
  break: "Break",
  rateOptional: "Rate (optional)",
  rateForShiftPlaceholder: "base {rate}",
  color: "Color",
  colorHint: "Pick a color",
  note: "Note",
  notePlaceholder: "Note...",
  hoursLabel: "Hours",
  rateLabel: "Rate",
  totalLabel: "Total",
  cancel: "Cancel",
  saveShift: "Save shift",
};

const presetColors = ["#22c55e", "#0ea5e9"];

function renderModal(overrides = {}) {
  const onChange = vi.fn();
  const onClose = vi.fn();
  const onSave = vi.fn();

  const props = {
    open: true,
    strings: baseStrings,
    editingDate: "2025-01-05",
    form: {
      start: "08:00",
      end: "16:00",
      breakMin: "30",
      rate: "",
      color: presetColors[0],
      note: "",
    },
    onChange,
    onClose,
    onSave,
    baseRate: 100,
    locale: "en-GB",
    presetColors,
    ...overrides,
  };

  const utils = render(<ShiftModal {...props} />);
  return { ...utils, onChange, onClose, onSave };
}

describe("ShiftModal", () => {
  it("renders calculated preview for hours, rate and total", () => {
    renderModal();

   
    expect(screen.getByText(/Hours:/i)).toHaveTextContent("Hours: 7.50");
    expect(screen.getByText(/Rate:/i)).toHaveTextContent("Rate:");
    expect(screen.getByText(/Total:/i)).toBeInTheDocument();
  });

  it("calls onChange when time inputs change", () => {
    const { onChange } = renderModal();

    const startInput = screen.getByLabelText(baseStrings.start);
    fireEvent.change(startInput, { target: { value: "09:00" } });

    expect(onChange).toHaveBeenCalledWith("start", "09:00");
  });

  it("calls onSave and onClose from buttons", () => {
    const { onClose, onSave } = renderModal();

    fireEvent.click(screen.getByText(baseStrings.saveShift));
    expect(onSave).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText(baseStrings.cancel));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not render anything when open is false", () => {
    const { container } = render(
      <ShiftModal
        open={false}
        strings={baseStrings}
        editingDate={null}
        form={{
          start: "",
          end: "",
          breakMin: "",
          rate: "",
          color: presetColors[0],
          note: "",
        }}
        onChange={() => {}}
        onClose={() => {}}
        onSave={() => {}}
        baseRate={100}
        locale="en-GB"
        presetColors={presetColors}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});

