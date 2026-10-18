import { ArrowRight } from 'lucide-react';
import { DrawPath } from './ArchitecturalGraphics';
import useReveal from '../hooks/useReveal';

export default function FinalCTA({ onExplore }) {
  const [ref, visible] = useReveal();

  return (
    <section id="contact" className="relative overflow-hidden px-4 sm:px-8 lg:px-12 py-24 lg:py-32">
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <svg viewBox="0 0 1200 480" className="w-full h-full" fill="none" preserveAspectRatio="xMidYMid slice">
          <DrawPath d="M 80 80 H 420 V 240 H 80 Z" stroke="#D7D7D2" />
          <DrawPath d="M 780 120 H 1120 V 360 H 780 Z" stroke="#D7D7D2" delay={120} />
          <DrawPath d="M 300 200 H 900" stroke="#252525" delay={200} />
          <circle cx="600" cy="200" r="6" fill="#FF3218" />
        </svg>
      </div>

      <div ref={ref} className="relative max-w-[1440px] mx-auto text-center">
        <p className="font-mono text-[10px] text-signal tracking-[0.2em] uppercase mb-5">07 / Enter the clean room</p>
        <h2
          className="text-[clamp(2rem,7vw,6.2rem)] font-bold uppercase tracking-[-0.05em] text-charcoal leading-[0.88]"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)'
          }}
        >
          Connect data.
          <br />
          Preserve privacy.
        </h2>
        <p className="mt-6 mx-auto max-w-lg font-mono text-xs text-muted">
          Open the operational workspace: persona selection, ingestion, anonymization, ledger publish, linkage, and SQL sandbox.
        </p>
        <button
          onClick={onExplore}
          data-cursor-label="LAUNCH"
          data-magnetic="true"
          className="btn-signal mt-10 gap-2 text-sm px-10 py-4"
        >
          Explore SafeShare
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
