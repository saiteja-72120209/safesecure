import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { HeroArchitecturalDrawing, TechTag } from './ArchitecturalGraphics';

export default function HeroSection({ onExplore, onScrollToProblem }) {
  const [headlineVisible, setHeadlineVisible] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setHeadlineVisible(true);
      setPanelVisible(true);
      return undefined;
    }
    const t1 = setTimeout(() => setHeadlineVisible(true), 120);
    const t2 = setTimeout(() => setPanelVisible(true), 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const headline = 'PRIVACY, BY DESIGN.';

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-56px)] flex flex-col justify-between overflow-hidden px-4 sm:px-8 lg:px-12 py-8 lg:py-10"
    >
      <div className="pointer-events-none absolute inset-0 arch-grid-bg opacity-70" />

      <div className="relative max-w-[1440px] w-full mx-auto flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-lightgray">
        <div className="flex items-center gap-3">
          <TechTag label="SYSTEM" code="SAFESHARE-CORE" signal />
          <TechTag label="CLASS" code="CLEAN ROOM" />
        </div>
        <div className="flex items-center gap-5 font-mono text-[10px] text-muted tracking-widest uppercase">
          <span>Latency <strong className="text-charcoal">12ms</strong></span>
          <span className="hidden sm:inline">Consensus <strong className="text-charcoal">EVM PoA</strong></span>
          <span>Budget <strong className="text-signal">ε = 0.85</strong></span>
        </div>
      </div>

      <div className="relative max-w-[1440px] w-full mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-8">
        <div className="lg:col-span-12 text-center">
          <p className="font-mono text-[11px] sm:text-xs tracking-[0.28em] uppercase text-muted mb-5">
            <span className="inline-block w-1.5 h-1.5 bg-signal align-middle mr-2" />
            Secure data. Shared intelligence.
            <span className="inline-block w-1.5 h-1.5 bg-signal align-middle ml-2" />
          </p>

          <h1 className="font-sans font-bold uppercase text-charcoal tracking-[-0.06em] leading-[0.86] text-[clamp(2.6rem,9vw,8.6rem)] select-none">
            {headline.split('').map((char, idx) => (
              <span
                key={`${char}-${idx}`}
                className="inline-block"
                style={{
                  opacity: headlineVisible ? 1 : 0,
                  transform: headlineVisible ? 'translateY(0)' : 'translateY(28px)',
                  transition: 'opacity 0.55s ease, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: `${idx * 28}ms`
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>

          <p className="mt-6 mx-auto max-w-xl font-mono text-xs text-muted leading-relaxed">
            Multi-institutional cryptographic exchange so banking, clinical, and retail silos can link records without exposing identities.
          </p>
        </div>

        <div className="lg:col-span-12 max-w-5xl mx-auto w-full">
          <HeroArchitecturalDrawing />
        </div>
      </div>

      <div
        className="relative max-w-[1440px] w-full mx-auto pt-6 border-t border-lightgray flex flex-col md:flex-row items-stretch md:items-end justify-between gap-6"
        style={{
          opacity: panelVisible ? 1 : 0,
          transform: panelVisible ? 'translateY(0)' : 'translateY(18px)',
          transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div className="arch-card w-full sm:w-80 overflow-hidden bg-white">
          <div className="bg-charcoal px-3.5 py-1.5 flex items-center justify-between">
            <span className="font-mono text-[9px] font-bold tracking-widest text-white uppercase">
              Consortium architecture v2.4
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-signal" />
          </div>
          <div className="p-3.5 space-y-2 font-mono text-[11px]">
            <div className="flex justify-between text-muted">
              <span>Zero direct PII</span>
              <strong className="text-charcoal">Guaranteed</strong>
            </div>
            <div className="flex justify-between text-muted">
              <span>Key derivation</span>
              <strong className="text-charcoal">HMAC-SHA256</strong>
            </div>
            <div className="flex justify-between text-muted">
              <span>Validator nodes</span>
              <strong className="text-signal">4 active</strong>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onExplore}
            data-cursor-label="LAUNCH"
            data-magnetic="true"
            className="btn-signal gap-2"
          >
            Explore SafeShare
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onScrollToProblem}
            data-cursor-label="SCROLL"
            className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-muted hover:text-charcoal"
          >
            Scroll
            <span className="w-6 h-6 border border-lightgray flex items-center justify-center">
              <ArrowDown className="w-3 h-3" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
