import { useState } from 'react';
import { EngineDiagram } from './ArchitecturalGraphics';
import useReveal from '../hooks/useReveal';

const FEATURES = [
  {
    id: 'pii',
    index: '01',
    title: 'Automated PII detection',
    body: 'Semantic classifiers tag direct identifiers, quasi-identifiers, and sensitive numerics before any record leaves the vault.',
    variant: 'pii'
  },
  {
    id: 'hmac',
    index: '02',
    title: 'Salted HMAC common keys',
    body: 'SHA-256 with a consortium salt derives a deterministic join key from SSN without revealing the source identifier.',
    variant: 'hmac'
  },
  {
    id: 'link',
    index: '03',
    title: 'Privacy-preserving linkage',
    body: 'Matching happens only on common hash keys. Raw identity never crosses the privacy boundary.',
    variant: 'linkage'
  },
  {
    id: 'dp',
    index: '04',
    title: 'Differential privacy',
    body: 'Laplace noise is calibrated to the remaining ε budget so aggregates cannot reconstruct a single person.',
    variant: 'dp'
  },
  {
    id: 'gov',
    index: '05',
    title: 'Consortium ledger governance',
    body: 'Schema consent, salt rotation, and query receipts are appended to an append-only PoA ledger.',
    variant: 'ledger'
  }
];

export default function PrivacyEngineSection() {
  const [ref, visible] = useReveal();
  const [active, setActive] = useState(0);

  return (
    <section id="engine" className="px-4 sm:px-8 lg:px-12 py-20 lg:py-28">
      <div ref={ref} className="max-w-[1440px] mx-auto">
        <p className="font-mono text-[10px] text-signal tracking-[0.2em] uppercase mb-3">03 / Privacy engine</p>
        <h2 className="text-[clamp(1.8rem,4.5vw,3.6rem)] font-bold uppercase tracking-tight text-charcoal max-w-3xl leading-[0.95]">
          Five layers. One privacy architecture.
        </h2>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-2">
            {FEATURES.map((feature, i) => (
              <button
                key={feature.id}
                onClick={() => setActive(i)}
                data-cursor-label="EXPLORE"
                className={`w-full text-left border p-5 transition-colors ${
                  active === i ? 'bg-white border-charcoal' : 'border-lightgray bg-transparent hover:bg-white/60'
                }`}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(16px)',
                  transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms, border-color 0.2s`
                }}
              >
                <div className="flex items-baseline gap-3">
                  <span className={`font-mono text-[10px] ${active === i ? 'text-signal' : 'text-midgray'}`}>
                    {feature.index}
                  </span>
                  <h3 className="font-mono text-sm font-bold uppercase text-charcoal">{feature.title}</h3>
                </div>
                {active === i && (
                  <p className="mt-3 font-mono text-xs text-muted leading-relaxed">{feature.body}</p>
                )}
              </button>
            ))}
          </div>

          <div className="lg:col-span-7 arch-card bg-white p-6 min-h-[320px]">
            <div className="flex items-center justify-between mb-4 font-mono text-[10px] uppercase tracking-widest text-muted">
              <span>Diagram {FEATURES[active].index}</span>
              <span className="text-signal">Live schematic</span>
            </div>
            <div className="h-[280px]">
              <EngineDiagram variant={FEATURES[active].variant} />
            </div>
            <p className="mt-4 font-mono text-xs text-muted leading-relaxed">
              {FEATURES[active].body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
