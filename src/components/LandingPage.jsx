import { useMemo } from 'react';
import CustomCursor from './CustomCursor';
import Navigation from './Navigation';
import ScrollProgress from './ScrollProgress';
import MeasurementFrame from './MeasurementFrame';
import HeroSection from './HeroSection';
import ProblemSection from './ProblemSection';
import PrivacyEngineSection from './PrivacyEngineSection';
import PIIScannerSection from './PIIScannerSection';
import ConsortiumNetwork from './ConsortiumNetwork';
import LedgerSection from './LedgerSection';
import FinalCTA from './FinalCTA';
import Footer from './Footer';
import useActiveSection from '../hooks/useActiveSection';

export default function LandingPage({
  onExplore,
  ledgerBlocks,
  dpEpsilon,
  contractStatus,
  systemLogs
}) {
  const sectionIds = useMemo(
    () => ['hero', 'problem', 'engine', 'scanner', 'network', 'ledger', 'contact'],
    []
  );
  const activeSection = useActiveSection(sectionIds, 110);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="relative min-h-screen bg-ivory text-charcoal">
      <CustomCursor />
      <ScrollProgress />
      <MeasurementFrame />
      <Navigation
        activeSection={activeSection}
        onNavigate={scrollTo}
        onLaunchCleanRoom={onExplore}
        isCleanRoomOpen={false}
      />
      <main>
        <HeroSection onExplore={onExplore} onScrollToProblem={() => scrollTo('problem')} />
        <ProblemSection onProceedToEngine={() => scrollTo('engine')} />
        <PrivacyEngineSection />
        <PIIScannerSection />
        <ConsortiumNetwork />
        <LedgerSection
          ledgerBlocks={ledgerBlocks}
          dpEpsilon={dpEpsilon}
          contractStatus={contractStatus}
          systemLogs={systemLogs}
        />
        <FinalCTA onExplore={onExplore} />
      </main>
      <Footer onNavigate={scrollTo} onExplore={onExplore} />
    </div>
  );
}
