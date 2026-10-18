import { useEffect, useRef } from 'react';

export function Crosshair({ className = '', size = 12 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`text-midgray ${className}`}
    >
      <line x1="6" y1="0" x2="6" y2="12" stroke="currentColor" strokeWidth="0.75" />
      <line x1="0" y1="6" x2="12" y2="6" stroke="currentColor" strokeWidth="0.75" />
    </svg>
  );
}

export function TechTag({ label, code, signal = false }) {
  return (
    <div className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-widest uppercase py-0.5 px-2 border border-lightgray bg-white/70">
      {signal && <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />}
      <span className="text-muted">{label}</span>
      {code && (
        <>
          <span className="text-lightgray">|</span>
          <span className="text-charcoal font-semibold">{code}</span>
        </>
      )}
    </div>
  );
}

export function DrawPath({ d, className = '', stroke = '#252525', strokeWidth = 1.15, delay = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let length = 0;
    try {
      length = el.getTotalLength();
    } catch {
      length = 800;
    }

    el.style.strokeDasharray = `${length}`;
    el.style.strokeDashoffset = reduce ? '0' : `${length}`;
    el.style.transition = `stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.strokeDashoffset = '0';
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [d, delay]);

  return (
    <path
      ref={ref}
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      className={className}
    />
  );
}

export function HeroArchitecturalDrawing({ className = '' }) {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="absolute -top-3 left-0 measurement-tick">[ LAT 37.7749° N ]</div>
      <div className="absolute -top-3 right-0 measurement-tick">[ LONG 122.4194° W ]</div>
      <div className="absolute -bottom-3 left-0 measurement-tick">[ PROTOCOL EVM-POA ]</div>
      <div className="absolute -bottom-3 right-0 measurement-tick">[ REVISION 2.4.0 ]</div>

      <div className="absolute -top-1.5 -left-1.5"><Crosshair /></div>
      <div className="absolute -top-1.5 -right-1.5"><Crosshair /></div>
      <div className="absolute -bottom-1.5 -left-1.5"><Crosshair /></div>
      <div className="absolute -bottom-1.5 -right-1.5"><Crosshair /></div>

      <svg
        viewBox="0 0 1100 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <pattern id="archGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(37,37,37,0.04)" strokeWidth="0.75" />
          </pattern>
        </defs>

        <rect width="1100" height="520" fill="url(#archGrid)" />

        <DrawPath d="M 80 90 L 320 90 L 320 220 L 80 220 Z" stroke="#D7D7D2" delay={80} />
        <DrawPath d="M 120 130 L 280 130 L 280 310 L 120 310 Z" stroke="#252525" delay={180} />
        <DrawPath d="M 780 90 L 1020 90 L 1020 220 L 780 220 Z" stroke="#D7D7D2" delay={120} />
        <DrawPath d="M 820 130 L 980 130 L 980 310 L 820 310 Z" stroke="#252525" delay={220} />
        <DrawPath d="M 380 70 L 720 70 L 720 250 L 380 250 Z" stroke="#252525" strokeWidth={1.4} delay={60} />
        <DrawPath d="M 430 110 L 670 110 L 670 340 L 430 340 Z" stroke="#A7A7A1" delay={280} />

        <line x1="280" y1="220" x2="380" y2="160" stroke="#252525" strokeWidth="1" />
        <line x1="820" y1="220" x2="720" y2="160" stroke="#252525" strokeWidth="1" />
        <line x1="550" y1="340" x2="550" y2="430" stroke="#FF3218" strokeWidth="1.2" strokeDasharray="3 4" />

        <rect x="70" y="380" width="210" height="72" fill="#FFFFFF" stroke="#252525" strokeWidth="1" />
        <text x="86" y="404" fontFamily="JetBrains Mono" fontSize="10" fill="#252525" fontWeight="700">NODE 01 // BANK ALPHA</text>
        <text x="86" y="424" fontFamily="JetBrains Mono" fontSize="9" fill="#777771">SSN → HMAC COMMON KEY</text>
        <text x="86" y="440" fontFamily="JetBrains Mono" fontSize="9" fill="#FF3218">0x8F3A… PROTECTED</text>

        <rect x="445" y="430" width="210" height="56" fill="#FFFFFF" stroke="#252525" strokeWidth="1" />
        <text x="550" y="454" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#252525" fontWeight="700">PRIVACY BOUNDARY</text>
        <text x="550" y="472" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9" fill="#FF3218">COMMON_HASH_KEY</text>

        <rect x="820" y="380" width="210" height="72" fill="#FFFFFF" stroke="#252525" strokeWidth="1" />
        <text x="836" y="404" fontFamily="JetBrains Mono" fontSize="10" fill="#252525" fontWeight="700">NODE 02 // HEALTHCARE</text>
        <text x="836" y="424" fontFamily="JetBrains Mono" fontSize="9" fill="#777771">HIPAA SAFE HARBOR</text>
        <text x="836" y="440" fontFamily="JetBrains Mono" fontSize="9" fill="#2A8F5D">k-ANON ≥ 5 VERIFIED</text>

        <circle cx="550" cy="250" r="5" fill="#FF3218" />
        <circle cx="550" cy="250" r="16" stroke="#FF3218" strokeWidth="0.9" strokeDasharray="2 3" />

        <circle r="3.5" fill="#FF3218">
          <animateMotion dur="3.2s" repeatCount="indefinite" path="M 280 220 C 360 180 470 230 550 250" />
        </circle>
        <circle r="3.5" fill="#252525">
          <animateMotion dur="3.2s" begin="1.1s" repeatCount="indefinite" path="M 820 220 C 740 180 630 230 550 250" />
        </circle>
      </svg>
    </div>
  );
}

export function EngineDiagram({ variant = 'pii' }) {
  const drawings = {
    pii: 'M 40 80 H 260 V 160 H 40 Z M 80 40 H 200 V 200 H 80 Z',
    hmac: 'M 40 100 L 150 40 L 260 100 L 150 160 Z M 150 40 V 160',
    linkage: 'M 30 90 H 120 V 170 H 30 Z M 180 90 H 270 V 170 H 180 Z M 120 130 H 180',
    dp: 'M 40 60 H 260 V 180 H 40 Z M 70 90 H 230 M 70 120 H 200 M 70 150 H 160',
    ledger: 'M 50 40 H 230 V 80 H 50 Z M 50 90 H 230 V 130 H 50 Z M 50 140 H 230 V 180 H 50 Z'
  };

  return (
    <svg viewBox="0 0 300 220" className="w-full h-full" fill="none">
      <rect width="300" height="220" fill="rgba(255,255,255,0.4)" />
      <DrawPath d={drawings[variant] || drawings.pii} stroke="#252525" strokeWidth={1.2} />
      <circle cx="150" cy="110" r="4" fill="#FF3218" />
    </svg>
  );
}
