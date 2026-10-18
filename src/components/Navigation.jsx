import { ArrowUpRight } from 'lucide-react';

export default function Navigation({ activeSection, onNavigate, onLaunchCleanRoom, isCleanRoomOpen }) {
  const navItems = [
    { id: 'hero', label: 'Product' },
    { id: 'engine', label: 'Privacy Engine' },
    { id: 'ledger', label: 'Ledger' },
    { id: 'scanner', label: 'Resources' },
    { id: 'contact', label: 'Contact', accent: true }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-ivory/95 backdrop-blur-sm border-b border-lightgray">
      <div className="max-w-[1440px] mx-auto flex items-stretch h-14">
        <div className="flex items-center gap-3 px-4 sm:px-5 border-r border-lightgray bg-white/50">
          <button
            onClick={() => onNavigate('hero')}
            className="flex items-center gap-2.5 text-left"
            data-cursor-label="HOME"
            aria-label="SafeShare Ledger home"
          >
            <div className="w-6 h-6 border border-charcoal bg-charcoal text-ivory flex items-center justify-center font-mono font-bold text-xs">
              S
            </div>
            <div className="hidden sm:block">
              <div className="font-mono text-[11px] font-bold tracking-tight text-charcoal">
                SAFESHARE <span className="text-signal">LEDGER</span>
              </div>
              <div className="font-mono text-[8px] tracking-[0.18em] text-muted uppercase">
                Consortium clean room
              </div>
            </div>
          </button>
        </div>

        <nav className="hidden lg:flex items-stretch flex-1" aria-label="Primary">
          {navItems.map((item) => {
            const isActive = activeSection === item.id || (item.id === 'hero' && activeSection === 'problem');
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                data-cursor-label="VIEW"
                className={`group relative flex-1 flex items-center justify-center px-3 border-r border-lightgray font-mono text-[11px] tracking-[0.14em] uppercase transition-colors ${
                  item.accent
                    ? 'text-signal hover:bg-white'
                    : isActive
                    ? 'text-charcoal bg-white'
                    : 'text-muted hover:text-charcoal hover:bg-white/50'
                }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-3 right-3 h-px origin-left transition-transform duration-300 ${
                    isActive && !item.accent ? 'bg-signal scale-x-100' : 'bg-charcoal scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex items-stretch">
          <div className="hidden md:flex items-center gap-2 px-4 border-l border-lightgray font-mono text-[10px] text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-signal" />
            <span className="text-charcoal font-semibold">BLOCK #104283</span>
          </div>
          <button
            onClick={onLaunchCleanRoom}
            data-cursor-label="LAUNCH"
            data-magnetic="true"
            className="flex items-center gap-2 px-4 sm:px-6 bg-signal text-white font-mono text-[11px] font-bold tracking-wider uppercase hover:bg-[#E02812] transition-colors"
          >
            {isCleanRoomOpen ? 'View story' : 'Explore SafeShare'}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
