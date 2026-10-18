import useReveal from '../hooks/useReveal';

export default function ConsortiumNetwork() {
  const [ref, visible] = useReveal();

  return (
    <section id="network" className="px-4 sm:px-8 lg:px-12 py-20 lg:py-28">
      <div ref={ref} className="max-w-[1440px] mx-auto">
        <p className="font-mono text-[10px] text-signal tracking-[0.2em] uppercase mb-3">05 / Consortium</p>
        <h2 className="text-[clamp(1.8rem,4.5vw,3.4rem)] font-bold uppercase tracking-tight text-charcoal leading-[0.95] max-w-3xl">
          Records move. Identities stay.
        </h2>
        <p className="mt-4 max-w-xl font-mono text-xs text-muted">
          Bank Alpha, Healthcare Beta, and Retail Gamma exchange HMAC tokens and differentially private aggregates — never raw personal identifiers.
        </p>

        <div className="mt-12 arch-card bg-white p-4 sm:p-8">
          <svg viewBox="0 0 960 420" className="w-full h-auto" fill="none">
            <defs>
              <pattern id="netGrid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(37,37,37,0.05)" />
              </pattern>
            </defs>
            <rect width="960" height="420" fill="url(#netGrid)" />

            <circle cx="480" cy="210" r="54" stroke="#252525" strokeWidth="1.2" fill="#F5F4EF" />
            <circle cx="480" cy="210" r="8" fill="#FF3218" />
            <text x="480" y="286" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#252525" fontWeight="700">
              CLEAN ROOM
            </text>
            <text x="480" y="302" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="8" fill="#777771">
              COMMON_HASH_KEY
            </text>

            <g style={{ opacity: visible ? 1 : 0.2, transition: 'opacity 0.8s ease' }}>
              <rect x="40" y="150" width="180" height="72" fill="#fff" stroke="#252525" />
              <text x="56" y="178" fontFamily="JetBrains Mono" fontSize="11" fill="#252525" fontWeight="700">BANK ALPHA</text>
              <text x="56" y="198" fontFamily="JetBrains Mono" fontSize="8" fill="#777771">HMAC 0x8F3A…</text>

              <rect x="740" y="70" width="180" height="72" fill="#fff" stroke="#252525" />
              <text x="756" y="98" fontFamily="JetBrains Mono" fontSize="11" fill="#252525" fontWeight="700">HEALTHCARE BETA</text>
              <text x="756" y="118" fontFamily="JetBrains Mono" fontSize="8" fill="#777771">HMAC 0x8F3A…</text>

              <rect x="740" y="278" width="180" height="72" fill="#fff" stroke="#252525" />
              <text x="756" y="306" fontFamily="JetBrains Mono" fontSize="11" fill="#252525" fontWeight="700">RETAIL GAMMA</text>
              <text x="756" y="326" fontFamily="JetBrains Mono" fontSize="8" fill="#777771">HMAC 0x8F3A…</text>

              <path d="M 220 186 C 320 186 360 210 426 210" stroke="#252525" strokeWidth="1" />
              <path d="M 740 106 C 640 106 560 160 534 190" stroke="#252525" strokeWidth="1" />
              <path d="M 740 314 C 640 314 560 260 534 230" stroke="#252525" strokeWidth="1" />

              {visible && (
                <>
                  <circle r="4" fill="#FF3218">
                    <animateMotion dur="2.8s" repeatCount="indefinite" path="M 220 186 C 320 186 360 210 426 210" />
                  </circle>
                  <circle r="4" fill="#252525">
                    <animateMotion dur="3.1s" begin="0.4s" repeatCount="indefinite" path="M 740 106 C 640 106 560 160 534 190" />
                  </circle>
                  <circle r="4" fill="#2A8F5D">
                    <animateMotion dur="3.4s" begin="0.8s" repeatCount="indefinite" path="M 740 314 C 640 314 560 260 534 230" />
                  </circle>
                </>
              )}
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
