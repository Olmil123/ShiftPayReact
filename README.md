# ShiftPayReact

Shift tracker built with **React + Vite + Tailwind**, with animated Dr.Max-themed background, multi-language UI (EN/UA/CZ), and a mobile‑friendly calendar.  
The app is designed **primarily for warehouse and shift workers** who need a simple way to track daily shifts and quickly estimate **monthly salary / earnings**.
Data is stored in versioned `localStorage` so user shifts survive app updates, and the app can be installed as a **PWA** (Add to Home Screen) on mobile devices.

## Features

- **Calendar UI**: month grid with clear separation between months, day details via modal
- **Shift details**: start/end time, break minutes, optional custom rate, color, note
- **Monthly summary**: total shifts, paid hours, amount + detailed table with delete action
- **Languages**: English, Ukrainian, Czech (switcher in header)
- **Animated UI**: neon multi-color background, floating Dr.Max logo, animated panels
- **Persistence**: versioned `localStorage` (safe across app updates)
- **PWA**: installable on mobile/desktop, offline-ready via service worker

## Quick Start (local dev)

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

## Tests

Unit tests use **Vitest + React Testing Library**:

```bash
npm test -- --run
```

They cover core calculation utilities and key components (`ShiftModal`, `SummarySection`).

## Build (optional)

```bash
npm run build
npm run preview
```
