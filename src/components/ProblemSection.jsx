import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Crosshair } from './ArchitecturalGraphics';
import useReveal from '../hooks/useReveal';

export default function ProblemSection({ onProceedToEngine }) {
  const [ref, visible] = useReveal();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setConnected(true), 700);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [visible]);

  return (
    <section id="problem" className="relative border-y border-lightgray px-4 sm:px-8 lg:px-12 py-20 lg:py-28">
      <div ref={ref} className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-lightgray">
          <div>
            <p className="font-mono text-[10px] text-signal tracking-[0.2em] uppercase mb-3">
              02 / The problem
            </p>
            <h2 className="text-[clamp(1.8rem,5vw,4.2rem)] font-bold text-charcoal tracking-tight uppercase leading-[0.95] max-w-4xl">
              Data should connect.{' '}
              <span className="text-muted">Identities should not.</span>
            </h2>
          </div>
          <p className="max-w-md font-mono text-xs text-muted leading-relaxed">
            Institutions cannot exchange raw customer tables without violating GDPR, HIPAA, and proprietary data moats. Aggregation either leaks identity or destroys resolution.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 arch-card p-5 sm:p-8 bg-white">
            <div className="flex items-center justify-between pb-4 border-b border-lightgray mb-6">
              <div className="flex items-center gap-2 font-mono text-[11px] font-semibold text-charcoal">
                <Crosshair size={10} />
                Geometric record alignment
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setConnected(false)}
                  data-cursor-label="TOGGLE"
                  className={`px-3 py-1 font-mono text-[10px] uppercase border ${connected ? 'border-lightgray text-muted' : 'bg-charcoal text-white border-charcoal'}`}
                >
                  Isolated
                </button>
                <button
                  onClick={() => setConnected(true)}
                  data-cursor-label="TOGGLE"
                  className={`px-3 py-1 font-mono text-[10px] uppercase border ${connected ? 'bg-signal text-white border-signal' : 'border-lightgray text-muted'}`}
                >
                  Linked
                </button>
              </div>
            </div>

            <svg viewBox="0 0 700 300" className="w-full h-auto" fill="none">
              <line x1="350" y1="18" x2="350" y2="282" stroke="#D7D7D2" strokeDasharray="4 4" />
              <text x="350" y="14" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="#A7A7A1">
                CRYPTOGRAPHIC BARRIER
              </text>

              <g style={{ transform: connected ? 'translate(64px, 0)' : 'none', transition: 'transform 700ms cubic-bezier(0.16,1,0.3,1)' }}>
                <rect x="70" y="60" width="190" height="180" fill="#fff" stroke="#252525" />
                <line x1="70" y1="92" x2="260" y2="92" stroke="#D7D7D2" />
                <text x="84" y="82" fontFamily="JetBrains Mono" fontSize="10" fontWeight="700" fill="#252525">BANK ALPHA</text>
                <text x="84" y="118" fontFamily="JetBrains Mono" fontSize="9" fill="#777771">Fragment A · credit vault</text>
                <text x="84" y="140" fontFamily="JetBrains Mono" fontSize="9" fill="#777771">Income / score / risk</text>
                <rect x="84" y="168" width="162" height="24" fill={connected ? 'rgba(255,50,24,0.06)' : '#F5F4EF'} stroke={connected ? '#FF3218' : '#D7D7D2'} />
                <text x="92" y="184" fontFamily="JetBrains Mono" fontSize="8" fill={connected ? '#FF3218' : '#777771'}>
                  {connected ? 'KEY 0x8F3A…' : 'RAW PII LOCKED'}
                </text>
              </g>

              <g style={{ transform: connected ? 'translate(-64px, 0)' : 'none', transition: 'transform 700ms cubic-bezier(0.16,1,0.3,1)' }}>
                <rect x="440" y="60" width="190" height="180" fill="#fff" stroke="#252525" />
                <line x1="440" y1="92" x2="630" y2="92" stroke="#D7D7D2" />
                <text x="454" y="82" fontFamily="JetBrains Mono" fontSize="10" fontWeight="700" fill="#252525">HEALTHCARE BETA</text>
                <text x="454" y="118" fontFamily="JetBrains Mono" fontSize="9" fill="#777771">Fragment B · clinical core</text>
                <text x="454" y="140" fontFamily="JetBrains Mono" fontSize="9" fill="#777771">Diagnosis / cost / claim</text>
                <rect x="454" y="168" width="162" height="24" fill={connected ? 'rgba(42,143,93,0.08)' : '#F5F4EF'} stroke={connected ? '#2A8F5D' : '#D7D7D2'} />
                <text x="462" y="184" fontFamily="JetBrains Mono" fontSize="8" fill={connected ? '#2A8F5D' : '#777771'}>
                  {connected ? 'MATCH 100%' : 'ISOLATED'}
                </text>
              </g>

              {connected ? (
                <>
                  <line x1="324" y1="150" x2="376" y2="150" stroke="#FF3218" strokeWidth="1.5" />
                  <rect x="338" y="138" width="24" height="24" fill="#FF3218" />
                  <text x="350" y="154" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="7" fill="#fff" fontWeight="700">LINK</text>
                </>
              ) : (
                <>
                  <circle cx="350" cy="150" r="9" stroke="#FF3218" />
                  <line x1="344" y1="144" x2="356" y2="156" stroke="#FF3218" />
                  <line x1="356" y1="144" x2="344" y2="156" stroke="#FF3218" />
                </>
              )}
            </svg>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="arch-card p-6 bg-white">
              <p className="font-mono text-xs font-bold text-signal mb-2">01 // Constraint</p>
              <p className="font-mono text-xs text-muted leading-relaxed">
                Direct identifiers cannot leave institutional firewalls, yet they are the only join keys most systems understand.
              </p>
            </div>
            <div className="arch-card p-6 bg-white">
              <p className="font-mono text-xs font-bold text-signal mb-2">02 // Method</p>
              <p className="font-mono text-xs text-muted leading-relaxed">
                Salted HMAC common keys align the same person across silos without transmitting SSN, name, or email.
              </p>
            </div>
            <button
              onClick={onProceedToEngine}
              data-cursor-label="ENGINE"
              className="btn-arch-charcoal w-full justify-between"
            >
              Privacy engine
              <ArrowRight className="w-4 h-4 text-signal" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
