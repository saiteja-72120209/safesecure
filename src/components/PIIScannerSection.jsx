import { useEffect, useState } from 'react';
import { RAW_DATASETS } from '../data/datasets';
import useReveal from '../hooks/useReveal';

const TYPE_STYLES = {
  direct: { color: '#FF3218', bg: 'rgba(255,50,24,0.08)', label: 'Direct identifier' },
  quasi: { color: '#C88D28', bg: 'rgba(200,141,40,0.08)', label: 'Quasi-identifier' },
  numeric: { color: '#2A8F5D', bg: 'rgba(42,143,93,0.08)', label: 'Sensitive numeric' },
  categorical: { color: '#2A8F5D', bg: 'rgba(42,143,93,0.08)', label: 'Sensitive attribute' }
};

export default function PIIScannerSection() {
  const [ref, visible] = useReveal();
  const [datasetKey, setDatasetKey] = useState('bank');
  const [scanIndex, setScanIndex] = useState(-1);
  const [scanning, setScanning] = useState(false);
  const dataset = RAW_DATASETS[datasetKey];

  useEffect(() => {
    if (!visible) return undefined;
    setScanning(true);
    setScanIndex(-1);
    let i = 0;
    const timer = setInterval(() => {
      setScanIndex(i);
      i += 1;
      if (i >= dataset.columns.length) {
        clearInterval(timer);
        setScanning(false);
      }
    }, 220);
    return () => clearInterval(timer);
  }, [visible, datasetKey, dataset.columns.length]);

  const runScan = () => {
    setScanning(true);
    setScanIndex(-1);
    let i = 0;
    const timer = setInterval(() => {
      setScanIndex(i);
      i += 1;
      if (i >= dataset.columns.length) {
        clearInterval(timer);
        setScanning(false);
      }
    }, 180);
  };

  return (
    <section id="scanner" className="border-y border-lightgray px-4 sm:px-8 lg:px-12 py-20 lg:py-28">
      <div ref={ref} className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] text-signal tracking-[0.2em] uppercase mb-3">04 / Live PII scanner</p>
            <h2 className="text-[clamp(1.8rem,4.5vw,3.4rem)] font-bold uppercase tracking-tight text-charcoal leading-[0.95]">
              Classify before you share.
            </h2>
          </div>
          <p className="max-w-md font-mono text-xs text-muted">
            Uses the application’s real consortium sample schemas. Field values below are illustrative demo records from the local vault, not production customer data.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {Object.values(RAW_DATASETS).map((ds) => (
            <button
              key={ds.id}
              onClick={() => setDatasetKey(ds.id)}
              data-cursor-label="VIEW"
              className={`px-3 py-1.5 font-mono text-[10px] uppercase border ${
                datasetKey === ds.id ? 'bg-charcoal text-ivory border-charcoal' : 'border-lightgray text-muted'
              }`}
            >
              {ds.persona}
            </button>
          ))}
          <button onClick={runScan} data-cursor-label="SCAN" className="btn-arch-outline ml-auto">
            {scanning ? 'Scanning…' : 'Run classification'}
          </button>
        </div>

        <div className="mt-8 relative arch-card bg-white overflow-hidden">
          {scanning && <div className="animate-scanner-laser" />}
          <div className="grid grid-cols-2 md:grid-cols-4">
            {dataset.columns.map((col, i) => {
              const tone = TYPE_STYLES[col.type] || TYPE_STYLES.numeric;
              const revealed = scanIndex >= i;
              return (
                <div
                  key={col.key}
                  className="p-5 border-b border-r border-lightgray last:border-r-0"
                  style={{ background: revealed ? tone.bg : 'transparent' }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[9px] tracking-widest text-muted uppercase">Field {String(i + 1).padStart(2, '0')}</span>
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: revealed ? tone.color : '#D7D7D2' }}
                    />
                  </div>
                  <p className="font-sans text-lg font-bold text-charcoal">{col.label}</p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-widest" style={{ color: revealed ? tone.color : '#A7A7A1' }}>
                    {revealed ? tone.label : 'Pending'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 overflow-x-auto arch-card bg-white">
          <table className="w-full text-left text-xs">
            <thead className="font-mono uppercase tracking-wider text-[10px] text-muted border-b border-lightgray">
              <tr>
                {dataset.columns.map((col) => (
                  <th key={col.key} className="p-3 whitespace-nowrap">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataset.rows.slice(0, 4).map((row, idx) => (
                <tr key={idx} className="border-b border-lightgray last:border-0">
                  {dataset.columns.map((col) => {
                    const tone = TYPE_STYLES[col.type] || TYPE_STYLES.numeric;
                    const val = row[col.key];
                    return (
                      <td
                        key={col.key}
                        className="p-3 font-mono whitespace-nowrap"
                        style={{ color: scanIndex >= dataset.columns.indexOf(col) ? tone.color : '#777771' }}
                      >
                        {typeof val === 'number' && String(col.key).toLowerCase().includes('income')
                          ? `$${val.toLocaleString()}`
                          : val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
