export default function Footer({ onNavigate, onExplore }) {
  return (
    <footer className="border-t border-lightgray px-4 sm:px-8 lg:px-12 py-10">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5">
          <p className="font-mono text-xs font-bold text-charcoal">
            SAFESHARE <span className="text-signal">LEDGER</span>
          </p>
          <p className="mt-2 font-mono text-[11px] text-muted max-w-sm leading-relaxed">
            Consortium big data clean room. Salted HMAC linkage, differential privacy, and append-only governance.
          </p>
        </div>
        <div className="md:col-span-4 flex gap-8 font-mono text-[11px] uppercase tracking-widest">
          <button onClick={() => onNavigate('engine')} className="text-muted hover:text-charcoal">Engine</button>
          <button onClick={() => onNavigate('ledger')} className="text-muted hover:text-charcoal">Ledger</button>
          <button onClick={onExplore} className="text-signal">Workspace</button>
        </div>
        <div className="md:col-span-3 font-mono text-[10px] text-muted md:text-right">
          ε = 0.85 · HMAC-SHA256 · React + Node.js
        </div>
      </div>
    </footer>
  );
}
