import React, { useCallback, useEffect, useMemo, useState } from "react";
import AppHeader from "./components/AppHeader";
import SettingsPanel from "./components/SettingsPanel";
import MonthPicker from "./components/MonthPicker";
import CalendarSection from "./components/CalendarSection";
import SummarySection from "./components/SummarySection";
import ShiftModal from "./components/ShiftModal";
import FooterNote from "./components/FooterNote";
import { LANGS, DEFAULT_LANG } from "./i18n/translations";
import { PRESET_COLORS } from "./constants/colors";
import {
  buildMonthMatrix,
  capitalize,
  inSameMonth,
  mapShiftsByDate,
  summarizeShifts,
} from "./utils/shiftUtils";

// LocalStorage keys and versioning
const STORAGE_KEY = "shiftpay-react-v1";
const STORAGE_VERSION_KEY = "shiftpay-react-version";
const CURRENT_STORAGE_VERSION = 1;

function migrateState(state, fromVersion, toVersion) {
  let next = { ...state };

  // Future migrations can go here, e.g.:
  // if (fromVersion < 1) {
  //   next.baseRate = next.baseRate ?? 165;
  // }

  return next;
}

function savePersistedState(state) {
  const payload = {
    version: CURRENT_STORAGE_VERSION,
    data: state,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    localStorage.setItem(STORAGE_VERSION_KEY, String(CURRENT_STORAGE_VERSION));
  } catch {
    // ignore quota or access errors
  }
}

function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    let savedVersion = 0;
    let data = parsed;

    if (parsed && typeof parsed === "object" && "data" in parsed && "version" in parsed) {
      savedVersion = Number(parsed.version) || 0;
      data = parsed.data;
    } else {
      // Legacy format without wrapper, try separate version key
      const legacyVersion = Number(localStorage.getItem(STORAGE_VERSION_KEY));
      if (!Number.isNaN(legacyVersion)) {
        savedVersion = legacyVersion;
      }
    }

    if (savedVersion < CURRENT_STORAGE_VERSION) {
      data = migrateState(data, savedVersion, CURRENT_STORAGE_VERSION);
      savePersistedState(data);
    }

    return data;
  } catch {
    // ignore corrupted storage
    return null;
  }
}

const emptyForm = {
  start: "",
  end: "",
  breakMin: "",
  rate: "",
  note: "",
  color: PRESET_COLORS[0],
};

export default function App() {
  const today = new Date();
  const [baseRate, setBaseRate] = useState(165);
  const [defaultBreak, setDefaultBreak] = useState(0);
  const [monthCursor, setMonthCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [shifts, setShifts] = useState([]);
  const [lang, setLang] = useState(DEFAULT_LANG);

  const [editingDate, setEditingDate] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [modalOpen, setModalOpen] = useState(false);

  const languages = useMemo(() => Object.entries(LANGS), []);
  const { locale, strings } = LANGS[lang] ?? LANGS[DEFAULT_LANG];

  const t = useCallback(
    (key, params = {}) => {
      const template = strings[key] ?? key;
      return template.replace(/\{(\w+)\}/g, (_, token) => params[token] ?? "");
    },
    [strings],
  );

  useEffect(() => {
    document.documentElement.setAttribute("lang", (locale || DEFAULT_LANG).slice(0, 2));
  }, [locale]);

  useEffect(() => {
    const persisted = loadPersistedState();
    if (!persisted) return;

    if (persisted.baseRate != null) setBaseRate(persisted.baseRate);
    if (persisted.defaultBreak != null) setDefaultBreak(persisted.defaultBreak);
    if (Array.isArray(persisted.shifts)) setShifts(persisted.shifts);
    if (persisted.monthCursor) setMonthCursor(new Date(persisted.monthCursor));
    if (persisted.lang && LANGS[persisted.lang]) setLang(persisted.lang);
  }, []);

  useEffect(() => {
    const payload = {
      baseRate,
      defaultBreak,
      shifts,
      monthCursor: monthCursor.toISOString(),
      lang,
    };
    savePersistedState(payload);
  }, [baseRate, defaultBreak, shifts, monthCursor, lang]);

  const monthMatrix = useMemo(() => buildMonthMatrix(monthCursor), [monthCursor]);
  const monthLabel = useMemo(() => {
    return capitalize(monthCursor.toLocaleDateString(locale, { month: "long", year: "numeric" }));
  }, [monthCursor, locale]);
  const currentYear = monthCursor.getFullYear();
  const currentMonth = monthCursor.getMonth();

  const shiftsByDate = useMemo(() => mapShiftsByDate(shifts), [shifts]);
  const monthShifts = useMemo(
    () => shifts.filter((shift) => inSameMonth(shift.date, currentYear, currentMonth)),
    [shifts, currentYear, currentMonth],
  );
  const stats = useMemo(() => summarizeShifts(monthShifts, baseRate), [monthShifts, baseRate]);

  const handleSelectDate = useCallback(
    (dateStr) => {
      setEditingDate(dateStr);
      const existing = shiftsByDate.get(dateStr);
      setForm({
        start: existing?.start || "08:00",
        end: existing?.end || "16:30",
        breakMin: String(existing?.breakMin ?? defaultBreak ?? 0),
        rate: existing?.rate != null ? String(existing.rate) : "",
        note: existing?.note || "",
        color: existing?.color || PRESET_COLORS[0],
      });
      setModalOpen(true);
    },
    [defaultBreak, shiftsByDate],
  );

  const handleFormChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSaveShift = useCallback(() => {
    if (!editingDate) return;
    const newShift = {
      id: `${editingDate}-${Date.now()}`,
      date: editingDate,
      start: form.start,
      end: form.end,
      breakMin: Number(form.breakMin || 0),
      rate: form.rate === "" ? null : Number(form.rate),
      note: form.note?.trim() || "",
      color: form.color || PRESET_COLORS[0],
    };

    setShifts((prev) => {
      const others = prev.filter((shift) => shift.date !== editingDate);
      return [...others, newShift].sort((a, b) => a.date.localeCompare(b.date));
    });

    setModalOpen(false);
    setEditingDate(null);
    setForm(emptyForm);
  }, [editingDate, form]);

  const handleDeleteShift = useCallback((dateStr) => {
    setShifts((prev) => prev.filter((shift) => shift.date !== dateStr));
  }, []);

  const handleClearAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_VERSION_KEY);
    window.location.reload();
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setEditingDate(null);
  }, []);

  const goPrevMonth = () => setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const goNextMonth = () => setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="aurora-layer" />
        <div className="aurora-layer aurora-layer--2" />
        <div className="floating-orb" />
      </div>
      <div className="app-shell relative z-10 mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <AppHeader strings={strings} lang={lang} onChangeLang={setLang} languages={languages} />

        <SettingsPanel
          strings={strings}
          baseRate={baseRate}
          defaultBreak={defaultBreak}
          onBaseRateChange={setBaseRate}
          onDefaultBreakChange={setDefaultBreak}
          onClearAll={handleClearAll}
        />

        <div className="mb-3 flex justify-between sm:justify-end">
          <MonthPicker
            strings={strings}
            monthCursor={monthCursor}
            monthLabel={monthLabel}
            locale={locale}
            onPrevMonth={goPrevMonth}
            onNextMonth={goNextMonth}
            onSelectMonth={(year, monthIndex) => setMonthCursor(new Date(year, monthIndex, 1))}
          />
        </div>

        <section className="grid gap-6 lg:grid-cols-[3fr_2fr]">
          <CalendarSection
            strings={strings}
            monthMatrix={monthMatrix}
            monthCursor={monthCursor}
            shiftMap={shiftsByDate}
            locale={locale}
            onSelectDate={handleSelectDate}
            t={t}
          />
          <SummarySection
            strings={strings}
            monthLabel={monthLabel}
            stats={stats}
            shifts={monthShifts}
            baseRate={baseRate}
            locale={locale}
            onDeleteShift={handleDeleteShift}
          />
        </section>

        <ShiftModal
          open={modalOpen}
          strings={strings}
          editingDate={editingDate}
          form={form}
          onChange={handleFormChange}
          onClose={handleCloseModal}
          onSave={handleSaveShift}
          baseRate={baseRate}
          locale={locale}
          presetColors={PRESET_COLORS}
        />

        <FooterNote strings={strings} />
      </div>
    </div>
  );
}
