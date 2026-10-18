import { useEffect, useState } from 'react';
import useReveal from '../hooks/useReveal';

export default function LedgerSection({ ledgerBlocks = [], dpEpsilon = 0.85, contractStatus = 'Ready', systemLogs = [] }) {
  const [ref, visible] = useReveal();
  const [health, setHealth] = useState(null);
  const [remoteBlocks, setRemoteBlocks] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/health')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data) setHealth(data);
      })
      .catch(() => {});
    fetch('/api/ledger/blocks')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.blocks) setRemoteBlocks(data.blocks);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const blocks = remoteBlocks || ledgerBlocks;
  const latest = blocks[0];

  return (
    <section id="ledger" className="border-y border-lightgray px-4 sm:px-8 lg:px-12 py-20 lg:py-28">
      <div ref={ref} className="max-w-[1440px] mx-auto">
        <p className="font-mono text-[10px] text-signal tracking-[0.2em] uppercase mb-3">06 / Privacy ledger</p>
        <h2 className="text-[clamp(1.8rem,4.5vw,3.4rem)] font-bold uppercase tracking-tight text-charcoal leading-[0.95]">
          State, budget, audit.
        </h2>
        <p className="mt-3 font-mono text-[10px] text-muted uppercase tracking-widest">
          Live values from the application ledger{health ? ' · Node.js gateway connected' : ' · local session fallback'}
        </p>

        <div
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-px bg-lightgray border border-lightgray"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease' }}
        >
          <div className="bg-ivory p-8">
            <p className="font-mono text-[10px] text-muted uppercase tracking-widest">Head block</p>
            <p className="mt-3 text-[clamp(2.4rem,6vw,4.5rem)] font-bold tracking-tight text-charcoal leading-none">
              #{latest?.blockNumber ?? '—'}
            </p>
            <p className="mt-3 font-mono text-xs text-muted">{latest?.action || contractStatus}</p>
          </div>
          <div className="bg-ivory p-8">
            <p className="font-mono text-[10px] text-muted uppercase tracking-widest">Privacy budget</p>
            <p className="mt-3 text-[clamp(2.4rem,6vw,4.5rem)] font-bold tracking-tight text-charcoal leading-none">
              ε {dpEpsilon}
            </p>
            <p className="mt-3 font-mono text-xs text-muted">Laplace mechanism · remaining session budget</p>
          </div>
          <div className="bg-ivory p-8">
            <p className="font-mono text-[10px] text-muted uppercase tracking-widest">Node</p>
            <p className="mt-3 text-[clamp(1.4rem,3vw,2.2rem)] font-bold tracking-tight text-charcoal leading-none">
              {health?.status || 'STANDBY'}
            </p>
            <p className="mt-3 font-mono text-xs text-muted">{health?.nodeId || 'NODE_0x7A9B_ALPHA'}</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="arch-card bg-white">
            <div className="px-5 py-3 border-b border-lightgray font-mono text-[10px] uppercase tracking-widest text-muted">
              Recent blocks
            </div>
            <ul>
              {blocks.slice(0, 5).map((blk) => (
                <li key={blk.blockNumber} className="px-5 py-4 border-b border-lightgray last:border-0">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs font-bold text-charcoal">#{blk.blockNumber}</span>
                    <span className="font-mono text-[10px] text-muted">{blk.timestamp}</span>
                  </div>
                  <p className="mt-1 font-mono text-xs text-muted">{blk.action}</p>
                  <p className="mt-1 font-mono text-[10px] text-midgray truncate">{blk.hash}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="arch-card bg-white">
            <div className="px-5 py-3 border-b border-lightgray font-mono text-[10px] uppercase tracking-widest text-muted">
              Audit stream
            </div>
            <ul>
              {(systemLogs.length ? systemLogs : [
                { id: 1, time: '—', category: 'STANDBY', message: 'Awaiting workspace events in this session.' }
              ]).slice(0, 5).map((log) => (
                <li key={log.id} className="px-5 py-4 border-b border-lightgray last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-signal">{log.category}</span>
                    <span className="font-mono text-[10px] text-muted">{log.time}</span>
                  </div>
                  <p className="mt-1 font-mono text-xs text-charcoal leading-relaxed">{log.message}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
