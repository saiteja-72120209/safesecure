# SafeShare Ledger
### Consortium Big Data Clean Room — Editorial Awwwards Redesign
*A high-end, editorial-style cybersecurity and fintech clean room dashboard inspired by Belgrade Arbor (Square43 Studio / Awwwards).*

---

## 🎨 Color Palette — Belgrade Arbor Reference

The interface strictly adopts the muted, architectural color family from the Awwwards reference:

| Color Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Warm Off-White** | `#F2F0EC` | Main page background & base canvas |
| **Soft Light Gray** | `#E7E7E7` | Secondary backgrounds, pill capsules, search inputs |
| **Deep Charcoal** | `#202020` | Primary typography, headers, primary buttons, borders |
| **Muted Steel Blue** | `#527FA5` | Hero panels, highlighted sections, key visual anchors |
| **Dusty Blue** | `#7599B8` | Secondary gradients, card accents, secondary chart series |
| **Cream White** | `#FFFDF2` | Display text on steel blue surfaces, high-contrast labels |
| **Soft Gray** | `#D8D8D8` | Structural borders, dividers, inactive states, grid lines |

### Accessible Security Status Colors
- **Muted Red (`#C84B31` / `#F9ECE8`)**: Direct PII / Direct Identifiers (SSN, Full Name) & firewall rejection.
- **Amber (`#C88D28` / `#FAF4E8`)**: Quasi-Identifiers (Age, Zip Code) & small-cell alerts.
- **Muted Green (`#3B8B67` / `#EBF4F0`)**: Sensitive Numeric data, differential privacy noise pass, verified ledger consensus.

---

## 🏛️ Visual & Editorial Hierarchy

- **Top Navigation Bar**: Inspired by the Awwwards header with a minimalist monogram mark (`S.`), pill navigation, live search bar, and consensus validator status.
- **Site of the Day Ribbon**: Architectural metadata indicator (`Consortium Clean Room`, `Protocol v4.2.0`, `Privacy Score 9.94 / 10`).
- **Massive Architectural Headline**: Bold, high-tracking grotesque title (`SAFESHARE LEDGER`) paired with studio-style attribution (`Square43 Clean Room Architecture`).
- **Muted Steel Blue Editorial Hero Panel**: A large, tranquil hero panel (`#527FA5`) featuring cream-white editorial typography (`Where Confidential Computing Meets Provable Zero-Knowledge Data Collaboration`) with live consortium stats.
- **Pill Navigation Bar**: Rounded capsules in Soft Light Gray (`#E7E7E7`) and Deep Charcoal (`#202020`) for seamless 5-step navigation.
- **Clean Editorial Cards**: Crisp white surfaces framed with Soft Gray (`#D8D8D8`) borders, bold charcoal headers, and understated, refined micro-interactions.

---

## 🚀 5-Step Architectural Pipeline

1. **Persona & Data Ingestion**:
   - Institutional persona cards (*Bank Alpha*, *Healthcare Beta*, *Retail Gamma*).
   - Live PII Scanner: Direct IDs tagged in Muted Red (`#C84B31`), Quasi-IDs in Amber (`#C88D28`), and Sensitive Numeric in Green (`#3B8B67`).
2. **Anonymization & Common Key Engine**:
   - Salted HMAC-SHA256 derivation with custom salt generator.
   - $k$-Anonymity demographic generalization sliders.
   - Differential Privacy $\epsilon$-slider with calibrated Laplace noise injection.
   - Side-by-side comparison table featuring distinct `Common_Hash_Key` badges.
3. **Blockchain Audit & Access Governance**:
   - Smart contract deployment terminal (`0x8F3a...31F4`).
   - Partner access governance toggles and TTL expiration timer.
   - "Publish Schema & Consent to Ledger" button mining blocks into the Block Explorer.
4. **Cross-Institution Data Overlay & Analytics**:
   - Zero-Knowledge record linkage combining datasets on `Common_Hash_Key`.
   - Chart.js risk matrix and demographic trend line charts styled in Muted Steel Blue and Dusty Blue.
   - Cleanroom dataset export in JSON format.
5. **Privacy-Preserving SQL Sandbox & Audit Ledger**:
   - SQL console with preset safe query buttons and ⚠️ "Test Attack Query" demonstrating privacy firewall rejection.
   - Privacy guarantee logs ($k \ge 4$, $\epsilon = 0.05$).
   - Immutable audit event feed with downloadable certificate.

---

## 💻 How to Run

### Option 1: Full-Stack Node.js Server (Port 5000)
```bash
npm start
```
Open in browser:
```
http://localhost:5000/
```

### Option 2: Vite Hot-Reloading Dev Server (Port 5173)
```bash
npm run dev
```
Open in browser:
```
http://localhost:5173/
```
*(All API calls route to the Node.js backend on port 5000 via Vite proxy).*
