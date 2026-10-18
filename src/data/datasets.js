export const RAW_DATASETS = {
  bank: {
    id: 'bank',
    name: 'Bank Alpha Financial Vault',
    persona: 'Bank Alpha',
    category: 'Commercial Banking Node',
    description: 'Customer credit scores, annual income, loan default risk with sensitive SSN & identifiers.',
    columns: [
      { key: 'ssn', label: 'SSN', type: 'direct', piiType: 'Direct Identifier' },
      { key: 'name', label: 'Full Name', type: 'direct', piiType: 'Direct Identifier' },
      { key: 'email', label: 'Email Address', type: 'direct', piiType: 'Direct Identifier' },
      { key: 'age', label: 'Age', type: 'quasi', piiType: 'Quasi-Identifier' },
      { key: 'zip', label: 'Zip Code', type: 'quasi', piiType: 'Quasi-Identifier' },
      { key: 'income', label: 'Annual Income', type: 'numeric', piiType: 'Sensitive Numeric' },
      { key: 'creditScore', label: 'Credit Score', type: 'numeric', piiType: 'Sensitive Numeric' },
      { key: 'loanDefaultRisk', label: 'Default Risk', type: 'numeric', piiType: 'Sensitive Numeric' }
    ],
    rows: [
      { ssn: '901-23-4567', name: 'Eleanor Vance', email: 'e.vance@apex.com', age: 34, zip: '94107', income: 142000, creditScore: 785, loanDefaultRisk: 3.2 },
      { ssn: '812-34-5678', name: 'Marcus Sterling', email: 'm.sterling@globex.org', age: 47, zip: '94107', income: 98000, creditScore: 660, loanDefaultRisk: 14.8 },
      { ssn: '723-45-6789', name: 'Sophia Chen', email: 'sophia.c@techcorp.io', age: 29, zip: '94102', income: 185000, creditScore: 810, loanDefaultRisk: 1.5 },
      { ssn: '634-56-7890', name: 'David Kim', email: 'dkim@summit.net', age: 52, zip: '10001', income: 115000, creditScore: 720, loanDefaultRisk: 6.7 },
      { ssn: '545-67-8901', name: 'Amara Okafor', email: 'amara.o@horizon.edu', age: 31, zip: '10001', income: 89000, creditScore: 690, loanDefaultRisk: 9.4 },
      { ssn: '456-78-9012', name: 'Julian Rossi', email: 'jrossi@artisan.co', age: 41, zip: '60601', income: 130000, creditScore: 750, loanDefaultRisk: 4.1 },
      { ssn: '367-89-0123', name: 'Zara Al-Mansoor', email: 'zara.m@aerospace.ae', age: 38, zip: '60601', income: 165000, creditScore: 795, loanDefaultRisk: 2.3 },
      { ssn: '278-90-1234', name: 'Carlos Mendez', email: 'carlos.m@solardyne.es', age: 26, zip: '94107', income: 72000, creditScore: 640, loanDefaultRisk: 18.2 },
      { ssn: '189-01-2345', name: 'Hannah Schmidt', email: 'hannah.s@biovault.de', age: 58, zip: '10001', income: 210000, creditScore: 830, loanDefaultRisk: 0.9 },
      { ssn: '090-12-3456', name: 'Liam O’Connor', email: 'liam.oc@celtic.ie', age: 44, zip: '60601', income: 104000, creditScore: 710, loanDefaultRisk: 7.8 }
    ]
  },
  healthcare: {
    id: 'healthcare',
    name: 'Healthcare Beta Clinical Core',
    persona: 'Healthcare Beta',
    category: 'Clinical Research Node',
    description: 'Electronic health records, ICD-10 diagnosis codes, and treatment costs linked by identity.',
    columns: [
      { key: 'ssn', label: 'SSN', type: 'direct', piiType: 'Direct Identifier' },
      { key: 'name', label: 'Patient Name', type: 'direct', piiType: 'Direct Identifier' },
      { key: 'email', label: 'Contact Email', type: 'direct', piiType: 'Direct Identifier' },
      { key: 'age', label: 'Age', type: 'quasi', piiType: 'Quasi-Identifier' },
      { key: 'zip', label: 'Zip Code', type: 'quasi', piiType: 'Quasi-Identifier' },
      { key: 'diagnosis', label: 'Diagnosis (ICD-10)', type: 'categorical', piiType: 'Health Record' },
      { key: 'treatmentCost', label: 'Treatment Cost ($)', type: 'numeric', piiType: 'Sensitive Numeric' },
      { key: 'claimRisk', label: 'Claim Risk Index', type: 'numeric', piiType: 'Sensitive Numeric' }
    ],
    rows: [
      { ssn: '901-23-4567', name: 'Eleanor Vance', email: 'e.vance@apex.com', age: 34, zip: '94107', diagnosis: 'Z00 (Routine Checkup)', treatmentCost: 1250, claimRisk: 1.1 },
      { ssn: '812-34-5678', name: 'Marcus Sterling', email: 'm.sterling@globex.org', age: 47, zip: '94107', diagnosis: 'I10 (Hypertension)', treatmentCost: 8400, claimRisk: 6.4 },
      { ssn: '723-45-6789', name: 'Sophia Chen', email: 'sophia.c@techcorp.io', age: 29, zip: '94102', diagnosis: 'M54 (Lumbago / Spine)', treatmentCost: 4300, claimRisk: 2.8 },
      { ssn: '634-56-7890', name: 'David Kim', email: 'dkim@summit.net', age: 52, zip: '10001', diagnosis: 'E11 (Type 2 Diabetes)', treatmentCost: 14200, claimRisk: 8.9 },
      { ssn: '545-67-8901', name: 'Amara Okafor', email: 'amara.o@horizon.edu', age: 31, zip: '10001', diagnosis: 'J45 (Asthma Care)', treatmentCost: 3100, claimRisk: 3.5 },
      { ssn: '456-78-9012', name: 'Julian Rossi', email: 'jrossi@artisan.co', age: 41, zip: '60601', diagnosis: 'K21 (Acid Reflux)', treatmentCost: 2600, claimRisk: 2.1 },
      { ssn: '367-89-0123', name: 'Zara Al-Mansoor', email: 'zara.m@aerospace.ae', age: 38, zip: '60601', diagnosis: 'Z00 (Wellness Scan)', treatmentCost: 950, claimRisk: 0.8 },
      { ssn: '278-90-1234', name: 'Carlos Mendez', email: 'carlos.m@solardyne.es', age: 26, zip: '94107', diagnosis: 'S83 (Knee Sprain)', treatmentCost: 6800, claimRisk: 7.2 },
      { ssn: '189-01-2345', name: 'Hannah Schmidt', email: 'hannah.s@biovault.de', age: 58, zip: '10001', diagnosis: 'I25 (CAD Cardiology)', treatmentCost: 19800, claimRisk: 9.6 },
      { ssn: '090-12-3456', name: 'Liam O’Connor', email: 'liam.oc@celtic.ie', age: 44, zip: '60601', diagnosis: 'G43 (Migraine Cluster)', treatmentCost: 3900, claimRisk: 4.0 }
    ]
  },
  retail: {
    id: 'retail',
    name: 'Retail Gamma Omnichannel Log',
    persona: 'Retail Gamma',
    category: 'E-Commerce & Loyalty Node',
    description: 'Omnichannel retail purchase frequencies, basket sizes, and transaction fraud anomalies.',
    columns: [
      { key: 'ssn', label: 'SSN', type: 'direct', piiType: 'Direct Identifier' },
      { key: 'name', label: 'Customer Name', type: 'direct', piiType: 'Direct Identifier' },
      { key: 'email', label: 'Account Email', type: 'direct', piiType: 'Direct Identifier' },
      { key: 'age', label: 'Age', type: 'quasi', piiType: 'Quasi-Identifier' },
      { key: 'zip', label: 'Zip Code', type: 'quasi', piiType: 'Quasi-Identifier' },
      { key: 'loyaltyTier', label: 'Loyalty Tier', type: 'categorical', piiType: 'Commercial Data' },
      { key: 'annualSpend', label: 'Annual Spend ($)', type: 'numeric', piiType: 'Sensitive Numeric' },
      { key: 'fraudScore', label: 'Merchant Fraud %', type: 'numeric', piiType: 'Sensitive Numeric' }
    ],
    rows: [
      { ssn: '901-23-4567', name: 'Eleanor Vance', email: 'e.vance@apex.com', age: 34, zip: '94107', loyaltyTier: 'Platinum Elite', annualSpend: 18400, fraudScore: 0.2 },
      { ssn: '812-34-5678', name: 'Marcus Sterling', email: 'm.sterling@globex.org', age: 47, zip: '94107', loyaltyTier: 'Silver Member', annualSpend: 5200, fraudScore: 4.8 },
      { ssn: '723-45-6789', name: 'Sophia Chen', email: 'sophia.c@techcorp.io', age: 29, zip: '94102', loyaltyTier: 'Diamond VIP', annualSpend: 24500, fraudScore: 0.1 },
      { ssn: '634-56-7890', name: 'David Kim', email: 'dkim@summit.net', age: 52, zip: '10001', loyaltyTier: 'Gold Partner', annualSpend: 9100, fraudScore: 2.1 },
      { ssn: '545-67-8901', name: 'Amara Okafor', email: 'amara.o@horizon.edu', age: 31, zip: '10001', loyaltyTier: 'Bronze Tier', annualSpend: 3400, fraudScore: 1.5 },
      { ssn: '456-78-9012', name: 'Julian Rossi', email: 'jrossi@artisan.co', age: 41, zip: '60601', loyaltyTier: 'Gold Partner', annualSpend: 11200, fraudScore: 0.9 },
      { ssn: '367-89-0123', name: 'Zara Al-Mansoor', email: 'zara.m@aerospace.ae', age: 38, zip: '60601', loyaltyTier: 'Platinum Elite', annualSpend: 19800, fraudScore: 0.3 },
      { ssn: '278-90-1234', name: 'Carlos Mendez', email: 'carlos.m@solardyne.es', age: 26, zip: '94107', loyaltyTier: 'Bronze Tier', annualSpend: 2800, fraudScore: 6.4 },
      { ssn: '189-01-2345', name: 'Hannah Schmidt', email: 'hannah.s@biovault.de', age: 58, zip: '10001', loyaltyTier: 'Diamond VIP', annualSpend: 32000, fraudScore: 0.1 },
      { ssn: '090-12-3456', name: 'Liam O’Connor', email: 'liam.oc@celtic.ie', age: 44, zip: '60601', loyaltyTier: 'Silver Member', annualSpend: 6700, fraudScore: 1.8 }
    ]
  }
};
