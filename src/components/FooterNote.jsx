export default function FooterNote({ strings }) {
  const note = strings.creatorNote;
  const [before, after] = note.split("olmil");

  return (
    <footer className="mt-4 space-y-1 text-center text-xs text-slate-500">
      <div>{strings.footerNote}</div>
      <div className="text-slate-600">
        {before}
        <a
          href="https://olmilprofil.netlify.app/"
          className="text-emerald-400 hover:text-emerald-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          olmil
        </a>
        {after}
      </div>
    </footer>
  );
}

