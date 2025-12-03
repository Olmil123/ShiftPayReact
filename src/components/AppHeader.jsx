import LanguagePicker from "./ui/LanguagePicker";

export default function AppHeader({ strings, lang, onChangeLang, languages }) {
  return (
    <header className="panel-animated rounded-3xl border border-slate-700/60 bg-slate-900/60 p-6 shadow-xl backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/80 text-base font-bold text-emerald-950 shadow-lg shadow-emerald-500/40 badge-glow">
              SP
            </span>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{strings.title}</h1>
          </div>
          <p className="mt-2 text-sm text-slate-300/90 sm:text-base">{strings.subtitle}</p>
        </div>
        <LanguagePicker value={lang} onChange={onChangeLang} strings={strings} options={languages} />
      </div>
      <div className="mt-4 text-xs text-slate-400 sm:text-sm">{strings.storageHint}</div>
    </header>
  );
}

