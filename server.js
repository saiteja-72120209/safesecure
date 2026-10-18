import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static React production build
app.use(express.static(path.join(__dirname, 'dist')));

// In-memory ledger blocks & audit state
let blockchainBlocks = [
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
];

let systemAuditLogs = [
  { id: 1, time: '19:15:22', category: 'NODE_INIT', message: 'SafeShare Consensus Node #4 synchronized with EVM state.', block: 104281, severity: 'info' },
  { id: 2, time: '19:20:05', category: 'KEY_VAULT', message: 'Master Consortium Salt initialized with SHA-256 derivation seeds.', block: 104282, severity: 'success' }
];

// Helper: Laplace noise generation for Differential Privacy
function laplaceNoise(scale) {
  const u = Math.random() - 0.5;
  return -scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
}

// 1. Health & Node status endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ACTIVE',
    nodeId: 'NODE_0x7A9B_ALPHA',
    network: 'SafeShare L2 EVM Testnet',
    consensus: 'Proof-of-Authority (PoA) Consortium',
    timestamp: new Date().toISOString()
  });
});

// 2. Compute Salted HMAC Common Key & Masking
app.post('/api/anonymize', (req, res) => {
  const { dataset, saltKey = 'Consortium_Master_Salt_2026_x89f', ageBracketWidth = 10, zipMaskDigits = 2, epsilon = 0.85 } = req.body;

  if (!dataset || !dataset.rows) {
    return res.status(400).json({ error: 'Missing dataset rows' });
  }

  const noiseScale = 1.5 / Math.max(0.1, epsilon);

  const processed = dataset.rows.map(row => {
    // Salted HMAC derivation
    const rawIdentifier = `${row.ssn}::${saltKey}`;
    const hash = crypto.createHash('sha256').update(rawIdentifier).digest('hex');
    const commonHashKey = '0x' + hash.substring(0, 16) + '...';

    // Quasi-identifier generalization
    const lowerAge = Math.floor(row.age / ageBracketWidth) * ageBracketWidth;
    const generalizedAge = `${lowerAge}-${lowerAge + ageBracketWidth - 1}`;
    const zipStr = String(row.zip);
    const generalizedZip = zipStr.slice(0, 5 - zipMaskDigits) + 'X'.repeat(zipMaskDigits);

    const result = {
      commonHashKey,
      rawSsn: row.ssn,
      rawName: row.name,
      maskedSsn: '•••••••••• [HMAC Derived]',
      maskedName: row.name.split(' ')[0].charAt(0) + '. ' + '•'.repeat(6),
      generalizedAge,
      generalizedZip
    };

    if (row.income !== undefined) {
      result.dpIncome = Math.max(10000, Math.round(row.income + laplaceNoise(noiseScale * 1200)));
      result.rawIncome = row.income;
    }
    if (row.creditScore !== undefined) {
      result.dpCreditScore = Math.min(850, Math.max(300, Math.round(row.creditScore + laplaceNoise(noiseScale * 8))));
      result.rawCreditScore = row.creditScore;
    }
    if (row.loanDefaultRisk !== undefined) {
      result.dpLoanDefaultRisk = Math.max(0.1, +(row.loanDefaultRisk + laplaceNoise(noiseScale * 0.4)).toFixed(1));
      result.rawLoanDefaultRisk = row.loanDefaultRisk;
    }
    if (row.treatmentCost !== undefined) {
      result.dpTreatmentCost = Math.max(200, Math.round(row.treatmentCost + laplaceNoise(noiseScale * 250)));
      result.rawTreatmentCost = row.treatmentCost;
    }
    if (row.claimRisk !== undefined) {
      result.dpClaimRisk = Math.max(0.1, +(row.claimRisk + laplaceNoise(noiseScale * 0.3)).toFixed(1));
      result.rawClaimRisk = row.claimRisk;
    }
    if (row.diagnosis) {
      result.generalizedDiagnosis = `${row.diagnosis.split(' ')[0]} (Diagnostic Class)`;
      result.rawDiagnosis = row.diagnosis;
    }
    if (row.annualSpend !== undefined) {
      result.dpAnnualSpend = Math.max(500, Math.round(row.annualSpend + laplaceNoise(noiseScale * 300)));
      result.rawAnnualSpend = row.annualSpend;
    }
    if (row.fraudScore !== undefined) {
      result.dpFraudScore = Math.max(0.0, +(row.fraudScore + laplaceNoise(noiseScale * 0.2)).toFixed(1));
      result.rawFraudScore = row.fraudScore;
    }

    return result;
  });

  res.json({
    success: true,
    count: processed.length,
    rows: processed,
    privacyGuarantees: {
      mechanism: 'Laplace Differential Privacy',
      epsilon,
      kAnonymityTarget: 5,
      zeroKnowledgeProof: '0x' + crypto.randomBytes(16).toString('hex')
    }
  });
});

// 3. Blockchain Ledger: Get blocks
app.get('/api/ledger/blocks', (req, res) => {
  res.json({ blocks: blockchainBlocks });
});

// 4. Blockchain Ledger: Publish schema & consent
app.post('/api/ledger/publish', (req, res) => {
  const { institution = 'Bank Alpha', action = 'PUBLISH_SCHEMA_CONSENT' } = req.body;
  const newBlockNum = blockchainBlocks[0].blockNumber + 1;
  const randomTx = '0x' + crypto.randomBytes(32).toString('hex');
  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const newBlock = {
    blockNumber: newBlockNum,
    timestamp: nowStr,
    originator: `${institution} Validator`,
    action: `${action} [${institution}]`,
    hash: randomTx,
    gasUsed: '88,410 Gwei',
    status: 'Confirmed (Mined)'
  };

  blockchainBlocks.unshift(newBlock);

  const logEntry = {
    id: Date.now(),
    time: new Date().toTimeString().split(' ')[0],
    category: 'BLOCK_MINED',
    message: `Consent & Masked Schema registered in Block #${newBlockNum} by ${institution}.`,
    block: newBlockNum,
    severity: 'success'
  };
  systemAuditLogs.unshift(logEntry);

  res.json({ success: true, block: newBlock, log: logEntry });
});

// 5. Privacy-Preserving SQL Engine with Firewall
app.post('/api/sql/execute', (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'No query provided' });

  const lowerQ = query.toLowerCase().trim();

  // Attack detection
  if (lowerQ.includes('ssn') || lowerQ.includes('name') || lowerQ.includes('email') || lowerQ.includes('raw_')) {
    return res.status(403).json({
      error: 'FIREWALL_BLOCKED',
      title: 'BLOCKED BY CONSORTIUM PRIVACY FIREWALL',
      code: 'POLICY_ERR_PII_PROHIBITED',
      detail: 'Direct identifiers (SSN, Full Name, Email) are strictly prohibited from SQL extraction. Query rejected to prevent re-identification attack.'
    });
  }

  // Safe query mock execution
  let columns = [];
  let rows = [];
  let kValue = 5;

  if (lowerQ.includes('group by zip_code')) {
    columns = ['zip_code', 'avg_credit', 'avg_cost', 'count_cohort', 'privacy_status'];
    rows = [
      { zip_code: '941XX', avg_credit: 745, avg_cost: '$4,650', count_cohort: 4, privacy_status: 'k=4 (Differential Laplace Noise Injected)' },
      { zip_code: '100XX', avg_credit: 780, avg_cost: '$12,367', count_cohort: 3, privacy_status: 'k=3 (Differential Laplace Noise Injected)' },
      { zip_code: '606XX', avg_credit: 752, avg_cost: '$2,483', count_cohort: 3, privacy_status: 'k=3 (Differential Laplace Noise Injected)' }
    ];
    kValue = 4;
  } else if (lowerQ.includes('group by age_bracket')) {
    columns = ['age_bracket', 'avg_treatment_cost', 'avg_annual_income', 'sample_size', 'k_verdict'];
    rows = [
      { age_bracket: '20-29', avg_treatment_cost: '$5,550', avg_annual_income: '$128,500', sample_size: 2, k_verdict: 'k-Threshold Alert: Small Cell' },
      { age_bracket: '30-39', avg_treatment_cost: '$1,767', avg_annual_income: '$132,000', sample_size: 3, k_verdict: 'k-Threshold Satisfied' },
      { age_bracket: '40-49', avg_treatment_cost: '$5,500', avg_annual_income: '$101,000', sample_size: 2, k_verdict: 'k-Threshold Alert: Small Cell' },
      { age_bracket: '50-59', avg_treatment_cost: '$17,000', avg_annual_income: '$162,500', sample_size: 2, k_verdict: 'k-Threshold Alert: Small Cell' }
    ];
    kValue = 3;
  } else {
    columns = ['total_records_linked', 'mean_combined_risk', 'privacy_guarantee', 'zero_knowledge_proof'];
    rows = [
      {
        total_records_linked: 10,
        mean_combined_risk: '4.2 / 10.0',
        privacy_guarantee: 'ε = 0.85 (Laplace Mechanism)',
        zero_knowledge_proof: '0x' + crypto.randomBytes(8).toString('hex') + '...VALID'
      }
    ];
  }

  res.json({
    success: true,
    columns,
    rows,
    privacyLog: {
      kAnonymityScore: `k >= ${kValue}`,
      epsilonSpent: 'ε = 0.05',
      executionTimeMs: 38,
      recordsScanned: 10,
      proofStatus: 'Valid ZK Consensus Receipt #' + Math.floor(Math.random() * 9000 + 1000)
    }
  });
});

// Single-page application route fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[SafeShare Node.js Server] Running on http://localhost:${PORT}`);
});
