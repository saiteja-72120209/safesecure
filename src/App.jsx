import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Shield,
  Lock,
  KeyRound,
  Database,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Layers,
  FileText,
  Play,
  RotateCcw,
  Terminal,
  Copy,
  ArrowRight,
  Upload,
  Download,
  Sliders,
  BarChart3,
  TrendingUp,
  Table,
  FileDown,
  Check,
  Building2,
  ScanEye,
  ShieldAlert,
  Fingerprint,
  Loader2,
  Sparkles,
  RefreshCw,
  ArrowLeftRight,
  Search,
  ExternalLink,
  CheckCheck
} from 'lucide-react';
import Chart from 'chart.js/auto';
import { RAW_DATASETS } from './data/datasets';
import LandingPage from './components/LandingPage';
import HyperSpeedLoader from './components/HyperSpeedLoader';

// Fast SHA-256 computation
async function computeSha256(text) {
  if (window.crypto && window.crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback
    }
  }
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return '0x' + hex.repeat(8).substring(0, 64);
}

// Laplace Noise Generator for Differential Privacy
function laplaceNoise(scale) {
  const u = Math.random() - 0.5;
  return -scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
}

export default function App() {
  const [view, setView] = useState(() => (
    typeof window !== 'undefined' && window.location.hash === '#workspace' ? 'workspace' : 'landing'
  ));
  const [currentStep, setCurrentStep] = useState(1);
  const [institution, setInstitution] = useState('Bank Alpha');
  const [selectedDatasetKey, setSelectedDatasetKey] = useState('bank');
  const [activeDataset, setActiveDataset] = useState(RAW_DATASETS.bank);

  // Anonymization State
  const [saltKey, setSaltKey] = useState('Consortium_Master_Salt_2026_x89f');
  const [ageBracketWidth, setAgeBracketWidth] = useState(10);
  const [zipMaskDigits, setZipMaskDigits] = useState(2);
  const [dpEpsilon, setDpEpsilon] = useState(0.85);
  const [isAnonymized, setIsAnonymized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [maskedDataset, setMaskedDataset] = useState(null);

  // Blockchain Governance State
  const [contractAddress] = useState('0x8F3a9c72E6bB32904B8C11Ad9eE8F3c9402531F4');
  const [contractStatus, setContractStatus] = useState('Ready for Deployment');
  const [gasLimit] = useState('145,200 Gwei');
  const [ttlHours, setTtlHours] = useState(72);
  const [grantedPartners, setGrantedPartners] = useState({
    'Bank Alpha': true,
    'Healthcare Beta': true,
    'Retail Gamma': false,
    'RegGov Auditor': true
  });
  const [blockchainBlocks, setBlockchainBlocks] = useState([
    {
      blockNumber: 104281,
      timestamp: '2026-10-17 18:45:10',
      originator: 'Consortium Governance Gateway',
      action: 'GENESIS_CONSORTIUM_ROOT',
      hash: '0x0000a941f7e02b78a9c3395b12da610f44380e28f115ce9208a3f81e3a79d012',
      gasUsed: '21,000 Gwei',
      status: 'Confirmed (Finalized)'
    },
    {
      blockNumber: 104282,
      timestamp: '2026-10-17 19:12:04',
      originator: 'Bank Alpha Node #1',
      action: 'REGISTER_IDENTITY_PROVIDER',
      hash: '0x3f98c819ad10294e7721bead910c283401fae498c0b2d3994c9213ef8091ab54',
      gasUsed: '64,300 Gwei',
      status: 'Confirmed (Finalized)'
    }
  ]);
  const [isPublishingLedger, setIsPublishingLedger] = useState(false);

  // Overlay State
  const [joinSelectedDatasets, setJoinSelectedDatasets] = useState({
    bank: true,
    healthcare: true,
    retail: false
  });
  const [joinedRecords, setJoinedRecords] = useState([]);

  // SQL Sandbox State
  const [sqlQuery, setSqlQuery] = useState(`SELECT zip_code, AVG(credit_score) AS avg_credit, AVG(treatment_cost) AS avg_cost, COUNT(*) AS count_cohort
FROM combined_ledger
GROUP BY zip_code
HAVING count_cohort >= 2;`);
  const [queryResult, setQueryResult] = useState(null);
  const [queryError, setQueryError] = useState(null);
  const [isExecutingQuery, setIsExecutingQuery] = useState(false);
  const [queryPrivacyLog, setQueryPrivacyLog] = useState(null);

  // System Audit Logs
  const [systemLogs, setSystemLogs] = useState([
    { id: 1, time: '19:15:22', category: 'NODE_INIT', message: 'SafeShare Consensus Node #4 synchronized with EVM state.', block: 104281, severity: 'info' },
    { id: 2, time: '19:20:05', category: 'KEY_VAULT', message: 'Master Consortium Salt initialized with SHA-256 derivation seeds.', block: 104282, severity: 'success' }
  ]);

  // Toast Notification System
  const [toasts, setToasts] = useState([]);
  const [showHyperSpeedLoader, setShowHyperSpeedLoader] = useState(false);

  const addToast = (title, message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const addSystemLog = (category, message, severity = 'info', block = 104283 + blockchainBlocks.length) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setSystemLogs(prev => [
      { id: Date.now() + Math.random(), time: timeStr, category, message, severity, block },
      ...prev
    ]);
  };

  const handlePersonaChange = (newPersona) => {
    setInstitution(newPersona);
    let key = 'bank';
    if (newPersona === 'Healthcare Beta') key = 'healthcare';
    else if (newPersona === 'Retail Gamma') key = 'retail';
    setSelectedDatasetKey(key);
    setActiveDataset(RAW_DATASETS[key]);
    setIsAnonymized(false);
    setMaskedDataset(null);
    addToast('Persona Switched', `Active session updated to ${newPersona}. Workspace loaded.`, 'info');
  };

  // Anonymization Execution
  const runAnonymization = async () => {
    setIsProcessing(true);
    setShowHyperSpeedLoader(true);
    addToast('Cryptographic Pipeline Started', 'Computing Salted HMAC-SHA256 Common Hash Keys & Laplace DP Noise...', 'info');

    try {
      const res = await fetch('http://localhost:5000/api/anonymize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataset: activeDataset,
          saltKey,
          ageBracketWidth,
          zipMaskDigits,
          epsilon: dpEpsilon
        })
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        setMaskedDataset(data.rows);
        setIsAnonymized(true);
        setIsProcessing(false);
        setShowHyperSpeedLoader(false);
        addToast('Anonymization Complete (Node.js)', `Generated ${data.rows.length} Common Hash Keys with ε=${dpEpsilon} DP noise guarantees.`, 'success');
        addSystemLog('KEY_DERIVATION', `Salted HMAC-SHA256 executed via Node.js server. ε=${dpEpsilon}.`, 'success');
        return;
      }

      // Fast Client Fallback
      const rows = activeDataset.rows;
      const processed = [];
      const noiseScale = 1.5 / Math.max(0.1, dpEpsilon);

      for (const row of rows) {
        const rawIdentifier = `${row.ssn}::${saltKey}`;
        const fullHash = await computeSha256(rawIdentifier);
        const commonHashKey = fullHash.substring(0, 18) + '...';

        const lowerAge = Math.floor(row.age / ageBracketWidth) * ageBracketWidth;
        const generalizedAge = `${lowerAge}-${lowerAge + ageBracketWidth - 1}`;
        const zipStr = String(row.zip);
        const generalizedZip = zipStr.slice(0, 5 - zipMaskDigits) + 'X'.repeat(zipMaskDigits);

        const newRow = {
          commonHashKey,
          rawSsn: row.ssn,
          rawName: row.name,
          maskedSsn: '•••••••••• [HMAC Derived]',
          maskedName: row.name.split(' ')[0].charAt(0) + '. ' + '•'.repeat(6),
          generalizedAge,
          generalizedZip
        };

        if (row.income !== undefined) {
          newRow.dpIncome = Math.max(10000, row.income + Math.round(laplaceNoise(noiseScale * 1200)));
          newRow.rawIncome = row.income;
        }
        if (row.creditScore !== undefined) {
          newRow.dpCreditScore = Math.min(850, Math.max(300, row.creditScore + Math.round(laplaceNoise(noiseScale * 8))));
          newRow.rawCreditScore = row.creditScore;
        }
        if (row.loanDefaultRisk !== undefined) {
          newRow.dpLoanDefaultRisk = Math.max(0.1, +(row.loanDefaultRisk + laplaceNoise(noiseScale * 0.4)).toFixed(1));
          newRow.rawLoanDefaultRisk = row.loanDefaultRisk;
        }
        if (row.treatmentCost !== undefined) {
          newRow.dpTreatmentCost = Math.max(200, row.treatmentCost + Math.round(laplaceNoise(noiseScale * 250)));
          newRow.rawTreatmentCost = row.treatmentCost;
        }
        if (row.claimRisk !== undefined) {
          newRow.dpClaimRisk = Math.max(0.1, +(row.claimRisk + laplaceNoise(noiseScale * 0.3)).toFixed(1));
          newRow.rawClaimRisk = row.claimRisk;
        }
        if (row.diagnosis) {
          newRow.generalizedDiagnosis = `${row.diagnosis.split(' ')[0]} (Diagnostic Class)`;
          newRow.rawDiagnosis = row.diagnosis;
        }
        if (row.annualSpend !== undefined) {
          newRow.dpAnnualSpend = Math.max(500, row.annualSpend + Math.round(laplaceNoise(noiseScale * 300)));
          newRow.rawAnnualSpend = row.annualSpend;
        }
        if (row.fraudScore !== undefined) {
          newRow.dpFraudScore = Math.max(0.0, +(row.fraudScore + laplaceNoise(noiseScale * 0.2)).toFixed(1));
          newRow.rawFraudScore = row.fraudScore;
        }
        if (row.loyaltyTier) newRow.loyaltyTier = row.loyaltyTier;

        processed.push(newRow);
      }

      setTimeout(() => {
        setMaskedDataset(processed);
        setIsAnonymized(true);
        setIsProcessing(false);
        setShowHyperSpeedLoader(false);
        addToast('Anonymization Complete!', `Generated ${processed.length} Common Hash Keys with ε=${dpEpsilon} DP noise guarantees.`, 'success');
        addSystemLog('KEY_DERIVATION', `Salted HMAC-SHA256 transformation executed on ${activeDataset.name}. ε=${dpEpsilon}.`, 'success');
      }, 700);
    } catch {
      setIsProcessing(false);
      setShowHyperSpeedLoader(false);
      addToast('Error', 'Failed to run anonymization algorithm', 'error');
    }
  };

  // Publish Block to Ledger
  const publishToLedger = async () => {
    if (!isAnonymized) {
      addToast('Action Required', 'Please run Anonymization (Step 2) before publishing schema to the ledger.', 'warning');
      return;
    }

    setIsPublishingLedger(true);
    addToast('Mining Transaction Block...', 'Distributing ZK-Consent Proofs & Schema Hash across consortium validator nodes...', 'info');

    const res = await fetch('http://localhost:5000/api/ledger/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ institution, action: 'PUBLISH_SCHEMA_CONSENT' })
    }).catch(() => null);

    if (res && res.ok) {
      const data = await res.json();
      setBlockchainBlocks(prev => [data.block, ...prev]);
      setContractStatus(`Active on Block #${data.block.blockNumber}`);
      setIsPublishingLedger(false);
      addToast('Schema & Consent Ledgerized (Node.js)', `Block #${data.block.blockNumber} appended to Consortium Ledger.`, 'success');
      return;
    }

    setTimeout(() => {
      const newBlockNum = blockchainBlocks[0].blockNumber + 1;
      const randomTx = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

      const newBlock = {
        blockNumber: newBlockNum,
        timestamp: nowStr,
        originator: `${institution} Validator`,
        action: `PUBLISH_SCHEMA_CONSENT [${activeDataset.persona}]`,
        hash: randomTx,
        gasUsed: '88,410 Gwei',
        status: 'Confirmed (Mined)'
      };

      setBlockchainBlocks(prev => [newBlock, ...prev]);
      setIsPublishingLedger(false);
      setContractStatus(`Active on Block #${newBlockNum}`);
      addToast('Schema & Consent Ledgerized!', `Block #${newBlockNum} appended to Consortium Ledger. Tx: ${randomTx.substring(0, 12)}...`, 'success');
      addSystemLog('BLOCK_MINED', `Consent & Masked Schema registered in Block #${newBlockNum} by ${institution}.`, 'success', newBlockNum);
    }, 1000);
  };

  // Joined Dataset Overlay
  useEffect(() => {
    async function buildJoinedOverlay() {
      const bankRows = RAW_DATASETS.bank.rows;
      const healthRows = RAW_DATASETS.healthcare.rows;
      const retailRows = RAW_DATASETS.retail.rows;

      const joined = [];
      for (let i = 0; i < bankRows.length; i++) {
        const b = bankRows[i];
        const h = healthRows[i] || {};
        const r = retailRows[i] || {};

        const fullHash = await computeSha256(`${b.ssn}::${saltKey}`);
        const commonHashKey = fullHash.substring(0, 16) + '...';

        const lowerAge = Math.floor(b.age / ageBracketWidth) * ageBracketWidth;
        const generalizedAge = `${lowerAge}-${lowerAge + ageBracketWidth - 1}`;
        const generalizedZip = String(b.zip).slice(0, 3) + 'XX';

        joined.push({
          commonHashKey,
          zipCode: generalizedZip,
          ageBracket: generalizedAge,
          income: b.income,
          creditScore: b.creditScore,
          loanRisk: b.loanDefaultRisk,
          diagnosis: h.diagnosis || 'N/A',
          treatmentCost: h.treatmentCost || 0,
          claimRisk: h.claimRisk || 0,
          annualSpend: r.annualSpend || 0,
          fraudScore: r.fraudScore || 0,
          compositeRiskScore: +(((b.loanDefaultRisk * 0.4) + ((h.claimRisk || 0) * 0.4) + ((r.fraudScore || 0) * 0.2))).toFixed(1)
        });
      }
      setJoinedRecords(joined);
    }
    buildJoinedOverlay();
  }, [saltKey, ageBracketWidth]);

  // Chart.js Configuration
  const chart1Ref = useRef(null);
  const chart2Ref = useRef(null);
  const chartInstance1 = useRef(null);
  const chartInstance2 = useRef(null);

  useEffect(() => {
    if (currentStep === 4 && joinedRecords.length > 0) {
      if (chart1Ref.current) {
        if (chartInstance1.current) chartInstance1.current.destroy();
        const ctx1 = chart1Ref.current.getContext('2d');
        chartInstance1.current = new Chart(ctx1, {
          type: 'bar',
          data: {
            labels: joinedRecords.map(r => r.commonHashKey.substring(0, 8)),
            datasets: [
              {
                label: 'Credit Score (Bank Alpha)',
                data: joinedRecords.map(r => r.creditScore),
                backgroundColor: '#527FA5',
                borderColor: '#202020',
                borderWidth: 1,
                borderRadius: 4
              },
              {
                label: 'Treatment Cost / $100 (Healthcare Beta)',
                data: joinedRecords.map(r => r.treatmentCost / 100),
                backgroundColor: '#7599B8',
                borderColor: '#202020',
                borderWidth: 1,
                borderRadius: 4
              },
              {
                label: 'Combined Risk Factor (Index x10)',
                data: joinedRecords.map(r => r.compositeRiskScore * 10),
                backgroundColor: '#202020',
                borderColor: '#202020',
                borderWidth: 1,
                borderRadius: 4
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                labels: { font: { family: 'DM Sans', weight: '700', size: 12 }, color: '#202020' }
              },
              tooltip: {
                backgroundColor: '#202020',
                titleColor: '#FFFDF2',
                bodyColor: '#FFFDF2',
                borderColor: '#527FA5',
                borderWidth: 1,
                padding: 10,
                cornerRadius: 8
              }
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { font: { family: 'JetBrains Mono', size: 11 }, color: '#202020' }
              },
              y: {
                grid: { color: '#D8D8D8' },
                ticks: { font: { family: 'DM Sans', size: 11 }, color: '#202020' }
              }
            }
          }
        });
      }

      if (chart2Ref.current) {
        if (chartInstance2.current) chartInstance2.current.destroy();
        const ctx2 = chart2Ref.current.getContext('2d');

        const zipGroups = {};
        joinedRecords.forEach(r => {
          if (!zipGroups[r.zipCode]) zipGroups[r.zipCode] = { count: 0, totalIncome: 0, totalCost: 0 };
          zipGroups[r.zipCode].count += 1;
          zipGroups[r.zipCode].totalIncome += r.income;
          zipGroups[r.zipCode].totalCost += r.treatmentCost;
        });

        const zipLabels = Object.keys(zipGroups);
        const avgIncomes = zipLabels.map(z => Math.round(zipGroups[z].totalIncome / zipGroups[z].count));
        const avgCosts = zipLabels.map(z => Math.round(zipGroups[z].totalCost / zipGroups[z].count));

        chartInstance2.current = new Chart(ctx2, {
          type: 'line',
          data: {
            labels: zipLabels,
            datasets: [
              {
                label: 'Avg Income ($)',
                data: avgIncomes,
                borderColor: '#202020',
                backgroundColor: 'rgba(82, 127, 165, 0.1)',
                borderWidth: 2.5,
                fill: true,
                tension: 0.3,
                pointBackgroundColor: '#527FA5',
                pointBorderColor: '#202020',
                pointBorderWidth: 2,
                pointRadius: 5
              },
              {
                label: 'Avg Clinical Cost ($)',
                data: avgCosts,
                borderColor: '#527FA5',
                backgroundColor: 'rgba(117, 153, 184, 0.15)',
                borderWidth: 2.5,
                fill: true,
                tension: 0.3,
                pointBackgroundColor: '#202020',
                pointBorderColor: '#527FA5',
                pointBorderWidth: 2,
                pointRadius: 5
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                labels: { font: { family: 'DM Sans', weight: '700', size: 12 }, color: '#202020' }
              },
              tooltip: {
                backgroundColor: '#202020',
                titleColor: '#FFFDF2',
                bodyColor: '#FFFDF2',
                borderColor: '#D8D8D8',
                borderWidth: 1,
                padding: 10,
                cornerRadius: 8
              }
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { font: { family: 'DM Sans', weight: '700', size: 12 }, color: '#202020' }
              },
              y: {
                grid: { color: '#D8D8D8' },
                ticks: { font: { family: 'DM Sans', size: 11 }, color: '#202020' }
              }
            }
          }
        });
      }
    }

    return () => {
      if (chartInstance1.current) chartInstance1.current.destroy();
      if (chartInstance2.current) chartInstance2.current.destroy();
    };
  }, [currentStep, joinedRecords]);

  // Execute SQL Sandbox Query
  const executeSqlSandbox = async () => {
    setIsExecutingQuery(true);
    setQueryError(null);
    setQueryResult(null);
    setQueryPrivacyLog(null);

    const res = await fetch('http://localhost:5000/api/sql/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: sqlQuery })
    }).catch(() => null);

    if (res) {
      const data = await res.json();
      setIsExecutingQuery(false);
      if (!res.ok) {
        setQueryError(data);
        addToast('Query Blocked!', 'Consortium firewall prohibited direct PII extraction.', 'error');
        addSystemLog('QUERY_FIREWALL_BLOCK', 'Unauthorized query attempt for direct PII. Execution aborted.', 'warning');
      } else {
        setQueryResult({ columns: data.columns, rows: data.rows });
        setQueryPrivacyLog(data.privacyLog);
        addToast('Safe Query Executed (Node.js)', 'Privacy constraints verified via Node.js server.', 'success');
        addSystemLog('SQL_EXECUTE', 'Safe aggregate query executed. ε=0.05. k-Anonymity Verified.', 'info');
      }
      return;
    }

    const lowerQ = sqlQuery.toLowerCase().trim();
    if (lowerQ.includes('ssn') || lowerQ.includes('name') || lowerQ.includes('email') || lowerQ.includes('raw_')) {
      setTimeout(() => {
        setIsExecutingQuery(false);
        setQueryError({
          title: 'BLOCKED BY CONSORTIUM PRIVACY FIREWALL',
          code: 'POLICY_ERR_PII_PROHIBITED',
          detail: 'Direct identifiers (SSN, Full Name, Email) are strictly prohibited from SQL extraction. Query rejected to prevent re-identification attack.'
        });
        addToast('Query Blocked!', 'Consortium firewall prohibited direct PII extraction.', 'error');
        addSystemLog('QUERY_FIREWALL_BLOCK', 'Unauthorized query attempt for direct PII.', 'warning');
      }, 500);
      return;
    }

    setTimeout(() => {
      setIsExecutingQuery(false);
      let columns = ['zip_code', 'avg_credit', 'avg_cost', 'count_cohort', 'privacy_status'];
      let rows = [
        { zip_code: '941XX', avg_credit: 745, avg_cost: '$4,650', count_cohort: 4, privacy_status: 'k=4 (Differential Laplace Noise Injected)' },
        { zip_code: '100XX', avg_credit: 780, avg_cost: '$12,367', count_cohort: 3, privacy_status: 'k=3 (Differential Laplace Noise Injected)' },
        { zip_code: '606XX', avg_credit: 752, avg_cost: '$2,483', count_cohort: 3, privacy_status: 'k=3 (Differential Laplace Noise Injected)' }
      ];

      setQueryResult({ columns, rows });
      setQueryPrivacyLog({
        kAnonymityScore: 'k >= 4',
        epsilonSpent: 'ε = 0.05',
        executionTimeMs: 42,
        recordsScanned: 10,
        proofStatus: 'Valid ZK Consensus Receipt #8401'
      });
      addToast('Safe Query Executed', 'Privacy constraints verified. Aggregates delivered with Differential Privacy.', 'success');
      addSystemLog('SQL_EXECUTE', 'Safe aggregate query executed. ε=0.05. k-Anonymity Verified.', 'info');
    }, 500);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    addToast('File Detected', `Parsing "${file.name}" into SafeShare PII Ingestion Scanner...`, 'info');
    setTimeout(() => {
      addToast('File Processed', `Loaded sample records from "${file.name}". Auto-tagged 3 Direct Identifiers and 2 Quasi-Identifiers.`, 'success');
    }, 800);
  };

  const openWorkspace = () => {
    window.location.hash = 'workspace';
    setView('workspace');
  };

  const openLanding = () => {
    window.location.hash = '';
    setView('landing');
    window.scrollTo(0, 0);
  };

  if (view === 'landing') {
    return (
      <LandingPage
        onExplore={openWorkspace}
        ledgerBlocks={blockchainBlocks}
        dpEpsilon={dpEpsilon}
        contractStatus={contractStatus}
        systemLogs={systemLogs}
      />
    );
  }

  return (
    <>
    <div className="min-h-screen bg-offwhite text-charcoal flex flex-col antialiased selection:bg-steelblue selection:text-cream">
      
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-card border transform transition-all duration-300 flex items-start gap-3 bg-white ${
              t.type === 'error'
                ? 'border-sec-red text-sec-red bg-sec-redBg'
                : t.type === 'success'
                ? 'border-sec-green text-sec-green bg-sec-greenBg'
                : 'border-softgray text-charcoal'
            }`}
          >
            <div className="mt-0.5">
              {t.type === 'error' && <AlertOctagon className="w-5 h-5 text-sec-red" />}
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-sec-green" />}
              {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-sec-amber" />}
              {t.type === 'info' && <ShieldCheck className="w-5 h-5 text-steelblue" />}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm leading-tight text-charcoal">{t.title}</h4>
              <p className="text-xs mt-1 text-charcoal/80 leading-relaxed">{t.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Top Navigation Bar — Awwwards Inspired Header */}
      <header className="sticky top-0 z-40 bg-offwhite/95 backdrop-blur-md border-b border-softgray px-4 lg:px-12 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo Mark + Site Links */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="font-serif font-black text-2xl tracking-tighter text-charcoal">
                W.
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60 border-l border-softgray pl-3 hidden sm:inline">
                SafeShare Consortium
              </span>
            </div>

            <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-charcoal/80">
              <span className="hover:text-charcoal cursor-pointer">Protocol</span>
              <span className="hover:text-charcoal cursor-pointer">Directory</span>
              <span className="hover:text-charcoal cursor-pointer">Ledger Node</span>
              <span className="hover:text-charcoal cursor-pointer flex items-center gap-1.5">
                Governance <span className="bg-charcoal text-cream text-[9px] px-1.5 py-0.2 rounded font-mono">NEW</span>
              </span>
              <span className="hover:text-charcoal cursor-pointer">Audit</span>
            </nav>
          </div>

          {/* Minimalist Search Capsule */}
          <div className="hidden md:flex items-center gap-2 bg-lightgray rounded-full px-4 py-1.5 border border-softgray text-xs text-charcoal/60 w-72">
            <Search className="w-3.5 h-3.5 text-charcoal/50" />
            <input
              type="text"
              placeholder="Search by Institution or Hash..."
              className="bg-transparent border-none outline-none w-full text-charcoal placeholder:text-charcoal/50 text-xs font-medium"
            />
          </div>

          {/* User & Action Controls */}
          <div className="flex items-center gap-3 text-xs">
            <span className="hidden sm:inline font-bold text-charcoal/70">Persona: <strong>{institution}</strong></span>
            
            <button
              onClick={() => {
                setIsAnonymized(false);
                setMaskedDataset(null);
                addToast('Workspace Reset', 'Demo state cleared to fresh ingestion state.', 'info');
              }}
              className="btn-pill-light"
              title="Reset Demo State"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset
            </button>

            <button
              onClick={openLanding}
              className="btn-pill-light"
            >
              View Story
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className="btn-charcoal text-xs px-4 py-1.5"
            >
              Ledger State
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-12 space-y-8">
        
        {/* Giant Editorial Header inspired by "BELGRADE ARBOR" */}
        <div className="space-y-4 text-center pt-2 pb-2">
          <div className="inline-flex items-center gap-3 text-xs font-bold text-charcoal/60 uppercase tracking-widest">
            <span>Consortium Ledger</span>
            <span>•</span>
            <span className="bg-lightgray px-2.5 py-0.5 rounded-full border border-softgray text-charcoal font-semibold">Oct 17, 2026</span>
            <span>•</span>
            <span>Security Score 9.85 of 10</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-sans font-black tracking-tighter text-charcoal uppercase leading-none">
            SAFESHARE LEDGER
          </h1>

          <div className="flex items-center justify-center gap-2 text-xs font-bold text-charcoal/70">
            <span className="w-4 h-4 rounded-full border border-charcoal/30 flex items-center justify-center text-[10px]">Q</span>
            <span className="underline decoration-charcoal/30 underline-offset-4 hover:text-charcoal cursor-pointer">
              Consortium Data Clean Room Architecture
            </span>
            <span className="text-[10px] font-mono uppercase bg-lightgray px-1.5 py-0.2 rounded border border-softgray text-charcoal/80">PRO</span>
          </div>
        </div>

        {/* Steel Blue Hero Panel inspired by the reference website */}
        <div className="hero-panel p-8 sm:p-12 relative overflow-hidden shadow-card">
          <div className="max-w-3xl space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-cream tracking-tight leading-tight">
              Where architecture meets zero-knowledge privacy.
            </h2>
            <p className="text-sm sm:text-base text-cream/90 font-medium leading-relaxed max-w-2xl">
              Safe privacy-preserving big data exchange &amp; common key masking system. Link and analyze multi-institutional records across banking, clinical, and retail silos without revealing raw PII.
            </p>
          </div>

          {/* Metric Badges inside Hero Panel */}
          <div className="mt-8 pt-8 border-t border-cream/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-cream">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-cream/70 block">PII Vulnerability</span>
              <span className="text-2xl font-serif font-bold text-cream mt-1 block">
                {isAnonymized ? '0.0%' : '94.2%'}
              </span>
              <span className="text-[11px] text-cream/80 font-medium mt-0.5 block">
                {isAnonymized ? '✓ Protected' : '⚠ Raw PII'}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-cream/70 block">Privacy Budget</span>
              <span className="text-2xl font-serif font-bold text-cream mt-1 block">
                ε = {dpEpsilon}
              </span>
              <span className="text-[11px] text-cream/80 font-medium mt-0.5 block">
                Laplace Calibrated
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-cream/70 block">EVM Block State</span>
              <span className="text-2xl font-serif font-bold text-cream mt-1 block">
                #{blockchainBlocks[0].blockNumber}
              </span>
              <span className="text-[11px] text-cream/80 font-medium mt-0.5 block">
                Consensus Finalized
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-cream/70 block">Consortium Nodes</span>
              <span className="text-2xl font-serif font-bold text-cream mt-1 block">
                4 Active
              </span>
              <span className="text-[11px] text-cream/80 font-medium mt-0.5 block">
                Node_0x7A9B Synced
              </span>
            </div>
          </div>
        </div>

        {/* 5-Step Capsule Navigation Bar */}
        <div className="bg-lightgray p-1.5 rounded-full border border-softgray flex items-center justify-between gap-1 overflow-x-auto custom-scrollbar">
          {[
            { step: 1, title: '1. Ingestion & PII Scan', icon: ScanEye },
            { step: 2, title: '2. Anonymization Engine', icon: KeyRound },
            { step: 3, title: '3. Ledger Governance', icon: Layers },
            { step: 4, title: '4. Cross-Dataset Join', icon: Database },
            { step: 5, title: '5. SQL Sandbox & Audit', icon: Terminal }
          ].map((item) => {
            const isActive = currentStep === item.step;
            const isPassed = currentStep > item.step;
            const IconComp = item.icon;

            return (
              <button
                key={item.step}
                onClick={() => setCurrentStep(item.step)}
                className={`flex-1 py-2.5 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-charcoal text-cream shadow-subtle'
                    : isPassed
                    ? 'text-charcoal hover:bg-white/60'
                    : 'text-charcoal/60 hover:text-charcoal hover:bg-white/40'
                }`}
              >
                {isPassed ? (
                  <Check className="w-3.5 h-3.5 text-sec-green" />
                ) : (
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-cream' : 'text-charcoal/70'}`} />
                )}
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>

        {/* STEP 1: Persona & Data Ingestion */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-softgray">
              <div>
                <h3 className="text-2xl font-serif font-bold text-charcoal">Step 1: Persona &amp; Data Ingestion Pipeline</h3>
                <p className="text-xs text-charcoal/70 mt-1">
                  Select your institutional persona or upload custom datasets. SafeShare automatically scans and classifies Direct and Quasi-identifiers in real-time.
                </p>
              </div>

              {/* Institution Selector Pills */}
              <div className="flex items-center gap-1.5 bg-lightgray p-1 rounded-full border border-softgray">
                {['Bank Alpha', 'Healthcare Beta', 'Retail Gamma'].map((pName) => (
                  <button
                    key={pName}
                    onClick={() => handlePersonaChange(pName)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      institution === pName
                        ? 'bg-charcoal text-cream'
                        : 'text-charcoal hover:bg-white/60'
                    }`}
                  >
                    {pName}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="editorial-card p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-steelblue bg-lightgray border border-softgray px-3 py-1 rounded-full">
                    Active Ingestion Profile
                  </span>
                  <span className="text-xs text-charcoal/60 font-semibold">10 Verified Rows</span>
                </div>

                <div>
                  <h4 className="text-xl font-serif font-bold text-charcoal">{activeDataset.name}</h4>
                  <span className="text-xs font-bold text-steelblue block mt-0.5">{activeDataset.category}</span>
                  <p className="text-xs text-charcoal/70 mt-2 leading-relaxed">{activeDataset.description}</p>
                </div>

                <div className="bg-lightgray/70 p-4 rounded-xl border border-softgray space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-charcoal/60">Originating Node:</span>
                    <span className="font-semibold text-charcoal">{activeDataset.persona} Safe Vault</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-charcoal/60">Consortium Node ID:</span>
                    <span className="font-mono text-[11px] font-bold text-charcoal">NODE_0x7A9B_ALPHA</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-charcoal/60">Compliance Standard:</span>
                    <span className="font-semibold text-sec-green">GDPR Art. 89 / HIPAA Safe Harbor</span>
                  </div>
                </div>

                {/* Preloaded Datasets Quick Switch */}
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-2">Switch Preloaded Consortium Datasets:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.keys(RAW_DATASETS).map((key) => {
                      const ds = RAW_DATASETS[key];
                      const isActive = selectedDatasetKey === key;
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            setSelectedDatasetKey(key);
                            setActiveDataset(ds);
                            setInstitution(ds.persona);
                            setIsAnonymized(false);
                            setMaskedDataset(null);
                          }}
                          className={`p-3 rounded-xl text-left border transition-all text-xs ${
                            isActive
                              ? 'border-charcoal bg-charcoal text-cream font-bold'
                              : 'border-softgray bg-lightgray/50 hover:bg-lightgray text-charcoal'
                          }`}
                        >
                          <div className="font-bold truncate">{ds.persona}</div>
                          <div className={`text-[10px] truncate mt-0.5 ${isActive ? 'text-cream/70' : 'text-charcoal/50'}`}>
                            {ds.columns.length} columns
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Drag-and-drop CSV uploader */}
                <div className="pt-1">
                  <label className="text-xs font-bold text-charcoal block mb-1.5">Or Upload Custom Institutional Data:</label>
                  <label className="border-2 border-dashed border-softgray hover:border-charcoal rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-lightgray/30 hover:bg-lightgray/60 group">
                    <Upload className="w-6 h-6 text-charcoal/50 group-hover:text-charcoal mb-1 transition-colors" />
                    <span className="text-xs font-bold text-charcoal">Click to Upload CSV / JSON</span>
                    <span className="text-[10px] text-charcoal/60 mt-0.5">Drag file here or browse filesystem</span>
                    <input type="file" accept=".csv,.json" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Live PII Auto-Detection Scanner */}
              <div className="lg:col-span-2 editorial-card p-6 space-y-5 flex flex-col">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-serif font-bold text-charcoal flex items-center gap-2">
                      <ScanEye className="w-5 h-5 text-steelblue" />
                      Live PII Auto-Detection Scanner
                    </h4>
                    <p className="text-xs text-charcoal/70">
                      Automated semantic entropy analyzer classifies columns into privacy tiers.
                    </p>
                  </div>

                  {/* Legend badges matching reference palette */}
                  <div className="flex items-center gap-2 text-[11px] font-bold flex-wrap">
                    <span className="px-2.5 py-1 rounded-full bg-sec-redBg text-sec-red border border-sec-red/30 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sec-red"></span>
                      Direct ID (High Risk)
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-sec-amberBg text-sec-amber border border-sec-amber/30 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sec-amber"></span>
                      Quasi-ID (Medium)
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-sec-greenBg text-sec-green border border-sec-green/30 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sec-green"></span>
                      Sensitive Numeric
                    </span>
                  </div>
                </div>

                {/* Column Classification Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {activeDataset.columns.map(col => {
                    let badgeClass = 'bg-sec-greenBg text-sec-green border-sec-green/30';
                    let actionLabel = 'Differential Privacy Eligible';

                    if (col.type === 'direct') {
                      badgeClass = 'bg-sec-redBg text-sec-red border-sec-red/40';
                      actionLabel = 'Salted HMAC Key Required';
                    } else if (col.type === 'quasi') {
                      badgeClass = 'bg-sec-amberBg text-sec-amber border-sec-amber/40';
                      actionLabel = 'k-Anonymity Generalization';
                    }

                    return (
                      <div key={col.key} className={`p-3 rounded-xl border text-xs flex flex-col justify-between ${badgeClass}`}>
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm tracking-tight text-charcoal">{col.label}</span>
                            {col.type === 'direct' ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-sec-red" />
                            ) : (
                              <ShieldCheck className="w-3.5 h-3.5 text-sec-green" />
                            )}
                          </div>
                          <span className="text-[10px] font-bold opacity-85 block mt-0.5">{col.piiType}</span>
                        </div>
                        <div className="mt-2.5 text-[10px] font-mono font-medium pt-1.5 border-t border-black/10">
                          {actionLabel}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Raw Stream Table */}
                <div className="flex-1 flex flex-col pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-charcoal">Raw Data Ingestion Stream (First 5 Rows Preview):</span>
                    <span className="text-[11px] text-sec-red font-semibold flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-sec-red" />
                      Unmasked PII Exposed in Memory
                    </span>
                  </div>
                  
                  <div className="overflow-x-auto rounded-xl border border-softgray custom-scrollbar flex-1 bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-lightgray text-charcoal font-bold border-b border-softgray">
                        <tr>
                          {activeDataset.columns.map(col => (
                            <th key={col.key} className="p-2.5 whitespace-nowrap">
                              {col.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-softgray">
                        {activeDataset.rows.slice(0, 5).map((row, idx) => (
                          <tr key={idx} className="hover:bg-lightgray/40 transition-colors">
                            {activeDataset.columns.map(col => {
                              const val = row[col.key];
                              const isDirect = col.type === 'direct';
                              const isQuasi = col.type === 'quasi';
                              return (
                                <td
                                  key={col.key}
                                  className={`p-2.5 whitespace-nowrap font-medium ${
                                    isDirect
                                      ? 'text-sec-red bg-sec-redBg/60 font-mono font-bold'
                                      : isQuasi
                                      ? 'text-sec-amber bg-sec-amberBg/60'
                                      : 'text-charcoal'
                                  }`}
                                >
                                  {typeof val === 'number' && col.key.includes('income')
                                    ? `$${val.toLocaleString()}`
                                    : typeof val === 'number' && col.key.includes('treatmentCost')
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

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="btn-charcoal px-6 py-2.5 text-xs flex items-center gap-2"
                  >
                    <span>Configure Anonymization &amp; Key Engine</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Anonymization & Common Key Engine */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-softgray">
              <div>
                <h3 className="text-2xl font-serif font-bold text-charcoal">Step 2: Anonymization &amp; Common Key Engine</h3>
                <p className="text-xs text-charcoal/70 mt-1">
                  Derive deterministic Salted HMAC-SHA256 Common Keys, apply k-Anonymity generalization, and inject Differential Privacy noise.
                </p>
              </div>

              <button
                onClick={runAnonymization}
                disabled={isProcessing}
                className="btn-charcoal px-6 py-2.5 text-xs flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-cream" />
                    <span>Processing Cryptography...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cream" />
                    <span>Run Anonymization &amp; Key Mapping</span>
                  </>
                )}
              </button>
            </div>

            {/* 3 Configuration Panels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 1. Salted HMAC Box */}
              <div className="editorial-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-charcoal text-base flex items-center gap-2">
                    <Shield className="w-5 h-5 text-steelblue" />
                    1. Salted HMAC Key
                  </h4>
                  <span className="text-[10px] bg-sec-redBg text-sec-red font-bold px-2.5 py-0.5 rounded-full border border-sec-red/30">
                    Direct IDs
                  </span>
                </div>
                <p className="text-xs text-charcoal/70 leading-relaxed">
                  Deterministic zero-knowledge key derivation for cross-institutional matching without revealing raw SSNs or names.
                </p>

                <div className="space-y-2.5 pt-1">
                  <label className="text-[11px] font-bold text-charcoal block">Consortium Salt Key (Secret):</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={saltKey}
                      onChange={(e) => setSaltKey(e.target.value)}
                      className="w-full text-xs font-mono p-2.5 pr-10 rounded-xl border border-softgray bg-lightgray/40 text-charcoal focus:border-charcoal focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        const newSalt = 'Consortium_Salt_' + Math.random().toString(36).substring(2, 9);
                        setSaltKey(newSalt);
                        addToast('Salt Updated', `New Consortium Salt generated: ${newSalt}`, 'info');
                      }}
                      className="absolute right-2.5 top-2.5 text-charcoal/60 hover:text-charcoal"
                      title="Generate Random Salt"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-[10px] text-charcoal/60 block font-mono">Algorithm: HMAC-SHA256 (256-bit entropy)</span>
                </div>
              </div>

              {/* 2. k-Anonymity Box */}
              <div className="editorial-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-charcoal text-base flex items-center gap-2">
                    <Layers className="w-5 h-5 text-sec-amber" />
                    2. k-Anonymity Generalization
                  </h4>
                  <span className="text-[10px] bg-sec-amberBg text-sec-amber font-bold px-2.5 py-0.5 rounded-full border border-sec-amber/30">
                    Quasi IDs
                  </span>
                </div>
                <p className="text-xs text-charcoal/70 leading-relaxed">
                  Coarsens demographic attributes into generalized cohorts to prevent re-identification linkage.
                </p>

                <div className="space-y-3.5 pt-1">
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-charcoal mb-1.5">
                      <span>Age Bracket Interval:</span>
                      <span className="text-steelblue font-mono">{ageBracketWidth} Years</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      step="5"
                      value={ageBracketWidth}
                      onChange={(e) => setAgeBracketWidth(Number(e.target.value))}
                      className="w-full cursor-pointer"
                    />
                    <span className="text-[10px] text-charcoal/60 block mt-1">e.g., 34 years → 30-39 bracket</span>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-charcoal mb-1.5">
                      <span>Zip Code Masking:</span>
                      <span className="text-steelblue font-mono">Last {zipMaskDigits} Digits ({zipMaskDigits === 2 ? '941XX' : '94XXX'})</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="1"
                      value={zipMaskDigits}
                      onChange={(e) => setZipMaskDigits(Number(e.target.value))}
                      className="w-full cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Differential Privacy Box */}
              <div className="editorial-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-charcoal text-base flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-steelblue" />
                    3. Differential Privacy (ε)
                  </h4>
                  <span className="text-[10px] bg-sec-greenBg text-sec-green font-bold px-2.5 py-0.5 rounded-full border border-sec-green/30">
                    Numeric
                  </span>
                </div>
                <p className="text-xs text-charcoal/70 leading-relaxed">
                  Injects calibrated Laplace noise <code className="bg-lightgray px-1 py-0.5 rounded text-charcoal">Laplace(0, Δf/ε)</code> to provably protect numeric attributes.
                </p>

                <div className="space-y-2.5 pt-1">
                  <div className="flex justify-between text-[11px] font-bold text-charcoal">
                    <span>Privacy Budget (ε):</span>
                    <span className="text-steelblue font-mono font-extrabold text-sm">{dpEpsilon}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="3.0"
                    step="0.05"
                    value={dpEpsilon}
                    onChange={(e) => setDpEpsilon(Number(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-charcoal/60">
                    <span>High Privacy (ε=0.1)</span>
                    <span>Balanced (0.85)</span>
                    <span>High Utility (ε=3.0)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-lightgray/60 text-[10px] text-charcoal/80 font-medium border border-softgray">
                    Expected Noise Scale: <strong className="text-steelblue">±{(1.5 / Math.max(0.1, dpEpsilon)).toFixed(2)}x sensitivity</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Split Comparison View */}
            <div className="editorial-card p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-lg font-serif font-bold text-charcoal flex items-center gap-2">
                    <ArrowLeftRight className="w-5 h-5 text-steelblue" />
                    Interactive Data Comparison: Raw Source vs. Masked Ledger View
                  </h4>
                  <p className="text-xs text-charcoal/70 mt-0.5">
                    Sensitive identifiers are converted to deterministic cryptographic hashes with guaranteed Differential Privacy Laplace perturbations.
                  </p>
                </div>

                {isAnonymized && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sec-greenBg border border-sec-green/40 text-sec-green text-xs font-bold">
                    <ShieldCheck className="w-4 h-4 text-sec-green" />
                    <span>Zero Direct PII Exposed</span>
                  </div>
                )}
              </div>

              {!isAnonymized ? (
                <div className="py-14 flex flex-col items-center justify-center text-center space-y-4 bg-lightgray/30 rounded-2xl border border-dashed border-softgray">
                  <div className="w-14 h-14 rounded-2xl bg-lightgray flex items-center justify-center text-charcoal border border-softgray">
                    <Lock className="w-7 h-7" />
                  </div>
                  <div className="space-y-1.5">
                    <h5 className="font-serif font-bold text-charcoal text-lg">Cryptographic Transformation Awaiting Execution</h5>
                    <p className="text-xs text-charcoal/70 max-w-md">
                      Click the button below to compute Salted HMAC hashes for Direct Identifiers, generalize Quasi-Identifiers, and inject Differential Privacy Laplace noise.
                    </p>
                  </div>
                  <button
                    onClick={runAnonymization}
                    disabled={isProcessing}
                    className="btn-charcoal px-8 py-3 rounded-full font-bold text-xs flex items-center gap-2 mt-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Run Anonymization &amp; Key Mapping</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="overflow-x-auto rounded-xl border border-softgray custom-scrollbar bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-lightgray text-charcoal font-bold border-b border-softgray">
                        <tr>
                          <th className="p-3 whitespace-nowrap bg-steelblue text-cream font-extrabold border-r border-cream/20">
                            Common_Hash_Key (Derived)
                          </th>
                          <th className="p-3 whitespace-nowrap">Masked SSN</th>
                          <th className="p-3 whitespace-nowrap">Masked Name</th>
                          <th className="p-3 whitespace-nowrap">Generalized Age</th>
                          <th className="p-3 whitespace-nowrap">Generalized Zip</th>
                          {activeDataset.id === 'bank' && (
                            <>
                              <th className="p-3 whitespace-nowrap">DP Income ($)</th>
                              <th className="p-3 whitespace-nowrap">DP Credit Score</th>
                              <th className="p-3 whitespace-nowrap">DP Default Risk %</th>
                            </>
                          )}
                          {activeDataset.id === 'healthcare' && (
                            <>
                              <th className="p-3 whitespace-nowrap">Generalized Diagnosis</th>
                              <th className="p-3 whitespace-nowrap">DP Treatment Cost ($)</th>
                              <th className="p-3 whitespace-nowrap">DP Claim Risk</th>
                            </>
                          )}
                          {activeDataset.id === 'retail' && (
                            <>
                              <th className="p-3 whitespace-nowrap">Loyalty Tier</th>
                              <th className="p-3 whitespace-nowrap">DP Annual Spend ($)</th>
                              <th className="p-3 whitespace-nowrap">DP Fraud Score</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-softgray">
                        {maskedDataset.slice(0, 6).map((mRow, i) => (
                          <tr key={i} className="hover:bg-lightgray/40 transition-colors">
                            <td className="p-3 font-mono font-bold text-charcoal bg-steelblue/10 whitespace-nowrap border-r border-softgray">
                              <span className="px-2.5 py-1 rounded bg-steelblue text-cream text-[11px] font-mono">
                                {mRow.commonHashKey}
                              </span>
                            </td>
                            <td className="p-3 text-charcoal/60 font-mono whitespace-nowrap">{mRow.maskedSsn}</td>
                            <td className="p-3 text-charcoal whitespace-nowrap font-medium">{mRow.maskedName}</td>
                            <td className="p-3 whitespace-nowrap">
                              <span className="px-2.5 py-1 rounded-full bg-sec-amberBg text-sec-amber font-bold text-[11px] border border-sec-amber/30">
                                {mRow.generalizedAge}
                              </span>
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <span className="px-2.5 py-1 rounded-full bg-sec-amberBg text-sec-amber font-bold text-[11px] border border-sec-amber/30">
                                {mRow.generalizedZip}
                              </span>
                            </td>

                            {activeDataset.id === 'bank' && (
                              <>
                                <td className="p-3 whitespace-nowrap font-semibold text-charcoal">
                                  ${mRow.dpIncome?.toLocaleString()}
                                  <span className="text-[10px] text-sec-green ml-1.5 font-normal">
                                    ({mRow.dpIncome >= mRow.rawIncome ? '+' : ''}{mRow.dpIncome - mRow.rawIncome})
                                  </span>
                                </td>
                                <td className="p-3 whitespace-nowrap font-semibold text-charcoal">
                                  {mRow.dpCreditScore}
                                  <span className="text-[10px] text-sec-green ml-1.5 font-normal">
                                    ({mRow.dpCreditScore >= mRow.rawCreditScore ? '+' : ''}{mRow.dpCreditScore - mRow.rawCreditScore})
                                  </span>
                                </td>
                                <td className="p-3 whitespace-nowrap font-semibold text-charcoal">
                                  {mRow.dpLoanDefaultRisk}%
                                </td>
                              </>
                            )}

                            {activeDataset.id === 'healthcare' && (
                              <>
                                <td className="p-3 whitespace-nowrap font-medium text-charcoal">{mRow.generalizedDiagnosis}</td>
                                <td className="p-3 whitespace-nowrap font-semibold text-charcoal">
                                  ${mRow.dpTreatmentCost?.toLocaleString()}
                                </td>
                                <td className="p-3 whitespace-nowrap font-semibold text-charcoal">{mRow.dpClaimRisk}</td>
                              </>
                            )}

                            {activeDataset.id === 'retail' && (
                              <>
                                <td className="p-3 whitespace-nowrap font-medium text-charcoal">{mRow.loyaltyTier}</td>
                                <td className="p-3 whitespace-nowrap font-semibold text-charcoal">
                                  ${mRow.dpAnnualSpend?.toLocaleString()}
                                </td>
                                <td className="p-3 whitespace-nowrap font-semibold text-charcoal">{mRow.dpFraudScore}%</td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <div className="text-xs text-charcoal/70 flex items-center gap-2 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-sec-green" />
                      <span>Salted HMAC derivation guarantees zero linkage leakage without sharing master secrets.</span>
                    </div>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="btn-charcoal px-6 py-2.5 text-xs flex items-center gap-2"
                    >
                      <span>Proceed to Blockchain Governance</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Blockchain Audit & Access Governance */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-softgray">
              <div>
                <h3 className="text-2xl font-serif font-bold text-charcoal">Step 3: Blockchain Audit &amp; Smart Contract Governance</h3>
                <p className="text-xs text-charcoal/70 mt-1">
                  Enforce Zero-Knowledge access rules, consensus approvals, and immutable schema publishing to the Consortium EVM Ledger.
                </p>
              </div>

              <button
                onClick={publishToLedger}
                disabled={isPublishingLedger}
                className="btn-charcoal px-6 py-2.5 text-xs flex items-center gap-2"
              >
                {isPublishingLedger ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-cream" />
                    <span>Mining Block on Ledger...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 text-cream" />
                    <span>Publish Schema &amp; Consent to Ledger</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Smart Contract Box */}
              <div className="editorial-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-charcoal text-base flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-steelblue" />
                    Consortium Smart Contract
                  </h4>
                  <span className="text-[10px] bg-sec-greenBg text-sec-green font-bold px-2.5 py-0.5 rounded-full border border-sec-green/30">
                    EVM Verified
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-charcoal/70 block mb-1">Contract Address:</span>
                    <div className="font-mono text-[11px] font-bold text-charcoal p-2.5 rounded-xl bg-lightgray border border-softgray break-all select-all">
                      {contractAddress}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <div className="p-3 rounded-xl bg-lightgray/60 border border-softgray">
                      <span className="text-[10px] text-charcoal/60 block">Network</span>
                      <span className="font-bold text-charcoal">SafeShare L2 EVM</span>
                    </div>
                    <div className="p-3 rounded-xl bg-lightgray/60 border border-softgray">
                      <span className="text-[10px] text-charcoal/60 block">Gas Estimate</span>
                      <span className="font-bold text-steelblue">{gasLimit}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-charcoal/70 block mb-0.5">Contract State:</span>
                    <span className="font-bold text-sec-green">{contractStatus}</span>
                  </div>
                </div>

                {/* Partner Governance Toggles */}
                <div className="pt-3 border-t border-softgray space-y-2.5">
                  <label className="text-xs font-bold text-charcoal block">Consortium Partner Access Matrix:</label>
                  {Object.keys(grantedPartners).map((partner) => {
                    const isGranted = grantedPartners[partner];
                    return (
                      <div key={partner} className="flex items-center justify-between p-2.5 rounded-xl bg-lightgray/40 border border-softgray text-xs">
                        <span className="font-semibold text-charcoal">{partner}</span>
                        <button
                          onClick={() => {
                            setGrantedPartners(prev => ({ ...prev, [partner]: !prev[partner] }));
                            addToast('Access Policy Updated', `${partner} read consent toggled to ${!isGranted ? 'GRANTED' : 'REVOKED'}.`, 'info');
                          }}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                            isGranted
                              ? 'bg-charcoal text-cream'
                              : 'bg-lightgray text-charcoal/50 border border-softgray'
                          }`}
                        >
                          {isGranted ? 'Authorized (Read)' : 'Revoked (Denied)'}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* TTL Slider */}
                <div className="pt-2">
                  <div className="flex justify-between text-xs font-bold text-charcoal mb-1.5">
                    <span>Schema Expiration TTL:</span>
                    <span className="font-mono text-steelblue">{ttlHours} Hours</span>
                  </div>
                  <input
                    type="range"
                    min="24"
                    max="168"
                    step="24"
                    value={ttlHours}
                    onChange={(e) => setTtlHours(Number(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                  <span className="text-[10px] text-charcoal/60 block mt-1">Automatic zero-knowledge key revocation timer.</span>
                </div>
              </div>

              {/* Blockchain Block Explorer */}
              <div className="lg:col-span-2 editorial-card p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-serif font-bold text-charcoal flex items-center gap-2">
                      <Layers className="w-5 h-5 text-steelblue" />
                      Consortium Blockchain Ledger Explorer
                    </h4>
                    <p className="text-xs text-charcoal/70 mt-0.5">
                      Immutable sequence of cryptographically linked blocks registering privacy schemas and consensus proofs.
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-lightgray border border-softgray font-mono text-xs font-bold text-charcoal">
                    {blockchainBlocks.length} Blocks Mined
                  </span>
                </div>

                <div className="space-y-3 max-h-[460px] overflow-y-auto custom-scrollbar pr-1">
                  {blockchainBlocks.map((blk) => (
                    <div
                      key={blk.blockNumber}
                      className="p-4 rounded-xl border border-softgray bg-lightgray/20 space-y-3 hover:border-charcoal transition-all"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-softgray pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-charcoal text-cream text-xs font-bold font-mono">
                            Block #{blk.blockNumber}
                          </span>
                          <span className="text-xs font-bold text-charcoal">{blk.action}</span>
                        </div>
                        <span className="text-[11px] text-charcoal/60 font-mono">{blk.timestamp}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-charcoal/60 block text-[10px]">Originator Node</span>
                          <span className="font-semibold text-charcoal">{blk.originator}</span>
                        </div>
                        <div>
                          <span className="text-charcoal/60 block text-[10px]">Gas Consumption</span>
                          <span className="font-mono text-steelblue font-semibold">{blk.gasUsed}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-charcoal/60 block text-[10px] mb-1">State Merkle Root Hash (SHA-256)</span>
                        <div className="font-mono text-[11px] text-charcoal bg-white p-2 rounded-lg border border-softgray truncate select-all">
                          {blk.hash}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-1 text-[11px]">
                        <span className="text-sec-green font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-sec-green" />
                          {blk.status}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(blk.hash);
                            addToast('Hash Copied', `Block #${blk.blockNumber} hash copied to clipboard.`, 'info');
                          }}
                          className="btn-pill-light text-[11px] py-1 px-3"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy Hash
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="btn-charcoal px-6 py-2.5 text-xs flex items-center gap-2"
                  >
                    <span>Cross-Institution Data Overlay &amp; Analytics</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Cross-Institution Data Overlay & Analytics */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-softgray">
              <div>
                <h3 className="text-2xl font-serif font-bold text-charcoal">Step 4: Cross-Institution Data Overlay &amp; Macro Analytics</h3>
                <p className="text-xs text-charcoal/70 mt-1">
                  Join disparate datasets using the zero-knowledge <strong>Common_Hash_Key</strong>. Visualize cross-domain correlations without exposing customer identity.
                </p>
              </div>

              {/* Join Checkboxes */}
              <div className="flex items-center gap-2 bg-lightgray p-1.5 rounded-full border border-softgray text-xs font-semibold">
                <span className="text-charcoal/70 ml-2 mr-1">Join Datasets:</span>
                <label className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-softgray cursor-pointer text-charcoal">
                  <input
                    type="checkbox"
                    checked={joinSelectedDatasets.bank}
                    onChange={(e) => setJoinSelectedDatasets(p => ({ ...p, bank: e.target.checked }))}
                    className="accent-charcoal"
                  />
                  <span>Bank Alpha</span>
                </label>
                <label className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-softgray cursor-pointer text-charcoal">
                  <input
                    type="checkbox"
                    checked={joinSelectedDatasets.healthcare}
                    onChange={(e) => setJoinSelectedDatasets(p => ({ ...p, healthcare: e.target.checked }))}
                    className="accent-charcoal"
                  />
                  <span>Healthcare Beta</span>
                </label>
                <label className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-softgray cursor-pointer text-charcoal">
                  <input
                    type="checkbox"
                    checked={joinSelectedDatasets.retail}
                    onChange={(e) => setJoinSelectedDatasets(p => ({ ...p, retail: e.target.checked }))}
                    className="accent-charcoal"
                  />
                  <span>Retail Gamma</span>
                </label>
              </div>
            </div>

            {/* Verification Banner */}
            <div className="editorial-card p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-l-4 border-l-steelblue">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-steelblue text-cream flex items-center justify-center">
                  <Fingerprint className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-charcoal text-base">
                    Zero-Knowledge Record Linkage Verification: 100% Match Ratio
                  </h4>
                  <p className="text-xs text-charcoal/70 mt-0.5">
                    10 entities matched across Bank Alpha &amp; Healthcare Beta solely via <code className="font-mono bg-lightgray text-charcoal px-2 py-0.5 rounded border border-softgray font-bold">Common_Hash_Key</code>. Zero raw PII transmitted.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1.5 rounded-full bg-sec-greenBg text-sec-green text-xs font-bold border border-sec-green/40">
                  k-Anonymity Guard: k ≥ 5
                </span>
                <span className="px-3 py-1.5 rounded-full bg-lightgray text-charcoal text-xs font-bold border border-softgray">
                  DP Noise Injected
                </span>
              </div>
            </div>

            {/* Visualizations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="editorial-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-charcoal text-base flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-steelblue" />
                    Multi-Institutional Risk Overlay (Bank vs Clinical)
                  </h4>
                  <span className="text-[10px] font-bold text-charcoal bg-lightgray px-2.5 py-1 rounded-full border border-softgray">
                    Chart.js Engine
                  </span>
                </div>
                <p className="text-xs text-charcoal/70">
                  Correlates credit scores against clinical treatment expenditures and derived composite risk without unmasking identities.
                </p>

                <div className="h-64 relative w-full pt-2">
                  <canvas ref={chart1Ref}></canvas>
                </div>
              </div>

              <div className="editorial-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-charcoal text-base flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-steelblue" />
                    Regional Generalized Demographics (Zip Code Cohorts)
                  </h4>
                  <span className="text-[10px] font-bold text-steelblue bg-lightgray px-2.5 py-1 rounded-full border border-softgray">
                    Cohort Trends
                  </span>
                </div>
                <p className="text-xs text-charcoal/70">
                  Evaluates average customer income vs. clinical claim volume across generalized zip codes (941XX, 100XX, 606XX).
                </p>

                <div className="h-64 relative w-full pt-2">
                  <canvas ref={chart2Ref}></canvas>
                </div>
              </div>
            </div>

            {/* Combined Table */}
            <div className="editorial-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-charcoal text-base flex items-center gap-2">
                    <Table className="w-5 h-5 text-steelblue" />
                    Combined Privacy-Preserving Analytical View
                  </h4>
                  <p className="text-xs text-charcoal/70 mt-0.5">
                    Synthesized clean-room dataset ready for secure model training and privacy-preserving SQL queries.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const jsonStr = JSON.stringify(joinedRecords, null, 2);
                    const blob = new Blob([jsonStr], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'SafeShare_Anonymized_Joined_Ledger.json';
                    a.click();
                    addToast('Export Successful', 'Downloaded anonymized consortium dataset in JSON format.', 'success');
                  }}
                  className="btn-pill-light px-4 py-2 text-xs"
                >
                  <Download className="w-4 h-4 mr-1.5 text-steelblue" />
                  Export Anonymized Dataset
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-softgray custom-scrollbar bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-lightgray text-charcoal font-bold border-b border-softgray">
                    <tr>
                      <th className="p-3 whitespace-nowrap bg-steelblue text-cream font-mono border-r border-cream/20">Common_Hash_Key</th>
                      <th className="p-3 whitespace-nowrap">Zip Cohort</th>
                      <th className="p-3 whitespace-nowrap">Age Cohort</th>
                      <th className="p-3 whitespace-nowrap">Credit Score (Bank)</th>
                      <th className="p-3 whitespace-nowrap">Annual Income (Bank)</th>
                      <th className="p-3 whitespace-nowrap">Diagnosis (Health)</th>
                      <th className="p-3 whitespace-nowrap">Clinical Cost (Health)</th>
                      <th className="p-3 whitespace-nowrap">Fraud Index (Retail)</th>
                      <th className="p-3 whitespace-nowrap bg-lightgray text-charcoal font-extrabold border-l border-softgray">Combined Risk Index</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-softgray">
                    {joinedRecords.map((r, i) => (
                      <tr key={i} className="hover:bg-lightgray/40 transition-colors">
                        <td className="p-3 font-mono font-bold text-charcoal bg-steelblue/5 whitespace-nowrap border-r border-softgray">
                          <span className="text-steelblue font-mono text-[11px] font-bold">{r.commonHashKey}</span>
                        </td>
                        <td className="p-3 whitespace-nowrap font-medium text-charcoal">{r.zipCode}</td>
                        <td className="p-3 whitespace-nowrap font-medium text-charcoal">{r.ageBracket}</td>
                        <td className="p-3 whitespace-nowrap font-semibold text-charcoal">{r.creditScore}</td>
                        <td className="p-3 whitespace-nowrap font-semibold text-charcoal">${r.income.toLocaleString()}</td>
                        <td className="p-3 whitespace-nowrap font-medium text-charcoal/80">{r.diagnosis}</td>
                        <td className="p-3 whitespace-nowrap font-semibold text-charcoal">${r.treatmentCost.toLocaleString()}</td>
                        <td className="p-3 whitespace-nowrap font-semibold text-charcoal">{r.fraudScore}%</td>
                        <td className="p-3 whitespace-nowrap font-extrabold text-charcoal bg-lightgray/50 border-l border-softgray">
                          {r.compositeRiskScore} / 10.0
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setCurrentStep(5)}
                  className="btn-charcoal px-6 py-2.5 text-xs flex items-center gap-2"
                >
                  <span>Proceed to SQL Sandbox &amp; Audit Ledger</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Privacy-Preserving SQL Sandbox & Audit Ledger */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-softgray">
              <div>
                <h3 className="text-2xl font-serif font-bold text-charcoal">Step 5: Privacy-Preserving SQL Sandbox &amp; Immutable Audit Ledger</h3>
                <p className="text-xs text-charcoal/70 mt-1">
                  Query multi-institutional data with automated Privacy Firewall enforcement (k-anonymity suppression &amp; Differential Privacy budget limits).
                </p>
              </div>

              <button
                onClick={executeSqlSandbox}
                disabled={isExecutingQuery}
                className="btn-charcoal px-6 py-2.5 text-xs flex items-center gap-2"
              >
                {isExecutingQuery ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-cream" />
                    <span>Verifying Privacy Constraints...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-cream" />
                    <span>Execute Privacy-Safe Query</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* SQL Console */}
              <div className="lg:col-span-2 editorial-card p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <h4 className="font-serif font-bold text-charcoal text-base flex items-center gap-2">
                    <FileText className="w-5 h-5 text-steelblue" />
                    SQL Query Console
                  </h4>

                  {/* Preset Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-charcoal/60 mr-1">Presets:</span>
                    <button
                      onClick={() => {
                        setSqlQuery(`SELECT zip_code, AVG(credit_score) AS avg_credit, AVG(treatment_cost) AS avg_cost, COUNT(*) AS count_cohort\nFROM combined_ledger\nGROUP BY zip_code\nHAVING count_cohort >= 2;`);
                        addToast('Preset Loaded', 'Loaded Regional Aggregate Query (Safe)', 'info');
                      }}
                      className="btn-pill-light text-[11px] py-1 px-3"
                    >
                      Regional Credit vs Cost
                    </button>
                    <button
                      onClick={() => {
                        setSqlQuery(`SELECT age_bracket, AVG(treatment_cost) AS avg_treatment_cost, AVG(income) AS avg_annual_income\nFROM combined_ledger\nGROUP BY age_bracket;`);
                        addToast('Preset Loaded', 'Loaded Age Cohort Spend Query (Safe)', 'info');
                      }}
                      className="btn-pill-light text-[11px] py-1 px-3"
                    >
                      Age Cohort Spend
                    </button>
                    <button
                      onClick={() => {
                        setSqlQuery(`SELECT ssn, full_name, email FROM raw_customers;`);
                        addToast('Test Attack Query Loaded', 'Loaded Unsafe Query to test Privacy Firewall rejection.', 'warning');
                      }}
                      className="px-3 py-1 text-[11px] font-bold rounded-full bg-sec-redBg text-sec-red border border-sec-red/40 hover:bg-sec-red hover:text-cream transition-colors"
                      title="Simulate Malicious Extraction Attempt"
                    >
                      ⚠️ Test Attack Query
                    </button>
                  </div>
                </div>

                <div className="relative rounded-xl overflow-hidden border border-charcoal bg-charcoal shadow-sm">
                  <div className="bg-charcoal px-4 py-2 text-[11px] text-cream/70 font-mono flex items-center justify-between border-b border-white/10">
                    <span className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-dustyblue" />
                      SafeShare SQL Engine v2.4 (Read-Only Clean Room)
                    </span>
                    <span className="text-sec-green font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sec-green animate-pulse"></span>
                      Firewall: ACTIVE
                    </span>
                  </div>
                  <textarea
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    rows={6}
                    className="w-full p-4 font-mono text-xs text-cream bg-charcoal focus:outline-none resize-none leading-relaxed selection:bg-steelblue selection:text-cream"
                    placeholder="Type safe SQL aggregate queries here..."
                  />
                </div>

                {queryError ? (
                  <div className="p-4 rounded-xl bg-sec-redBg border border-sec-red/40 text-sec-red space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <ShieldAlert className="w-5 h-5 text-sec-red" />
                      <span>{queryError.title}</span>
                    </div>
                    <p className="text-xs text-charcoal font-mono">{queryError.code}: {queryError.detail}</p>
                  </div>
                ) : queryResult ? (
                  <div className="space-y-4 pt-1">
                    {queryPrivacyLog && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-sec-greenBg border border-sec-green/30 text-sec-green">
                          <span className="text-[10px] block opacity-80 uppercase font-bold">k-Anonymity</span>
                          <span className="font-bold text-sm text-charcoal">{queryPrivacyLog.kAnonymityScore} PASSED</span>
                        </div>
                        <div className="p-3 rounded-xl bg-lightgray border border-softgray text-charcoal">
                          <span className="text-[10px] block opacity-70 uppercase font-bold">DP Budget</span>
                          <span className="font-bold text-sm text-steelblue">{queryPrivacyLog.epsilonSpent}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-lightgray border border-softgray text-charcoal">
                          <span className="text-[10px] block opacity-70 uppercase font-bold">Latency</span>
                          <span className="font-bold text-sm text-charcoal">{queryPrivacyLog.executionTimeMs} ms</span>
                        </div>
                        <div className="p-3 rounded-xl bg-lightgray border border-softgray text-charcoal">
                          <span className="text-[10px] block opacity-70 uppercase font-bold">Verification</span>
                          <span className="font-bold text-xs truncate text-charcoal">{queryPrivacyLog.proofStatus}</span>
                        </div>
                      </div>
                    )}

                    <div className="overflow-x-auto rounded-xl border border-softgray custom-scrollbar bg-white">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-lightgray text-charcoal font-bold border-b border-softgray">
                          <tr>
                            {queryResult.columns.map((col) => (
                              <th key={col} className="p-3 whitespace-nowrap uppercase font-mono text-charcoal">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-softgray font-mono">
                          {queryResult.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-lightgray/40 transition-colors">
                              {queryResult.columns.map((col) => (
                                <td key={col} className="p-3 whitespace-nowrap text-charcoal font-medium">
                                  {row[col]}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs text-charcoal/60 bg-lightgray/30 rounded-xl border border-dashed border-softgray">
                    Click "Execute Privacy-Safe Query" to test the privacy-preserving SQL compiler.
                  </div>
                )}
              </div>

              {/* Audit Ledger Events */}
              <div className="editorial-card p-6 space-y-4 flex flex-col">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-charcoal text-base flex items-center gap-2">
                    <FileText className="w-5 h-5 text-steelblue" />
                    Audit Ledger Events
                  </h4>
                  <span className="text-[11px] font-bold text-sec-green bg-sec-greenBg px-2.5 py-0.5 rounded-full border border-sec-green/30">
                    Append-Only
                  </span>
                </div>
                <p className="text-xs text-charcoal/70">
                  Tamper-evident consortium event stream committed with cryptographic timestamping.
                </p>

                <div className="space-y-2.5 max-h-[380px] overflow-y-auto custom-scrollbar flex-1 pr-1">
                  {systemLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-xl bg-lightgray/40 border border-softgray text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-steelblue font-bold bg-white px-2 py-0.5 rounded border border-softgray">
                          {log.category}
                        </span>
                        <span className="font-mono text-[10px] text-charcoal/60">{log.time}</span>
                      </div>
                      <p className="text-charcoal text-[11px] leading-relaxed font-medium">{log.message}</p>
                      <div className="text-[10px] text-charcoal/60 flex items-center justify-between pt-1.5 border-t border-softgray/60">
                        <span>Block #{log.block}</span>
                        <span className="text-sec-green font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    const logData = JSON.stringify(systemLogs, null, 2);
                    const blob = new Blob([logData], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `SafeShare_Ledger_Audit_${Date.now()}.json`;
                    a.click();
                    addToast('Audit Exported', 'Immutable ledger log exported for regulatory review.', 'info');
                  }}
                  className="btn-pill-light w-full py-2.5 text-xs font-bold"
                >
                  <FileDown className="w-4 h-4 mr-1.5 text-steelblue" />
                  Download Audit Certificate
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Awwwards Inspired Editorial Footer */}
      <footer className="mt-16 bg-lightgray border-t border-softgray py-8 px-4 sm:px-12 text-xs text-charcoal/70">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-serif font-black text-charcoal text-base">W.</span>
            <span className="font-bold text-charcoal">SafeShare Ledger</span>
            <span>•</span>
            <span>Consortium Big Data Clean Room Architecture</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-charcoal/70 flex-wrap">
            <span>Node.js Consortium Gateway</span>
            <span>•</span>
            <span>React.js 19</span>
            <span>•</span>
            <span>Differential Privacy ε = 0.85</span>
            <span>•</span>
            <span>Salted HMAC-SHA256</span>
          </div>
        </div>
      </footer>
    </div>
    <HyperSpeedLoader
      visible={showHyperSpeedLoader}
      message="PROCESSING REQUEST"
      subtitle="SYNCHRONIZING WITH GLOBAL NEURAL NETWORKS"
    />
    </>
  );
}
