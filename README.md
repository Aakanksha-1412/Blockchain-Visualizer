# Blockchain Visualizer Sandbox — Arbitrum Builder Pods Assignment

A premium, interactive, dark-themed Web3 educational classroom visualizer and blockchain simulator sandbox. This application teaches students and developers how blocks connect cryptographically, why transaction tampering invalidates distributed ledger records, how Proof-of-Work consensus operates, and how Layer 2 solutions (like Arbitrum) scale Ethereum.

**Portfolio URL:** [Blockchain Visualizer Sandbox](https://ai.studio/build)

---

## 🌟 Core Features

### 1. Interactive Blockchain Linkage
- Renders **four interconnected blocks** in real-time.
- Displays key cryptographic components: Block Number, Transaction Data, Previous Hash, Current Hash, and Nonce.
- Connecting arrows utilize **pulsing sliding node particles** to visualize transaction processing flows.

### 2. Live Cryptographic Hashing (SHA-256)
- Computes actual **SHA-256 secure signatures** character-by-character as users type.
- Demonstrates the **Avalanche Effect**: Editing a single symbol or letter in transaction logs results in an entirely different, unpredictable 64-character hash.

### 3. Real-Time Chain Integrity Verification
- Highlights the **tamper-evident seals** of blockchain architectures.
- Editing a historical block (e.g., Block 2) immediately breaks the subsequent links.
- Broken blocks shake dynamically and turn glowing crimson (`status-invalid`), while connection pathways light up red to denote a fractured link.

### 4. Proof-of-Work (PoW) Mining Simulation
- Integrates dedicated **Mine Block** execution buttons.
- Simulates mathematical mining by incrementing nonces at speed, stopping only when a hash satisfies the network difficulty target (prefixed with `00`).
- Provides asynchronous, non-blocking mining chunks to keep browser tabs completely responsive.

### 5. Multi-Block Consensus Healing Loop
- Contains a global **Repair Blockchain** control.
- Automatically and sequentially re-links previous block hashes and mines subsequent blocks to restore full network trust (all indicators turn green).

### 6. Live Crypto Price Feeds with API Fail-Safe
- Queries live token rates for **Bitcoin (BTC)**, **Ethereum (ETH)**, **Arbitrum (ARB)**, and **Polygon (MATIC)** directly from the CoinGecko public API.
- Implements a **dual-system fail-safe model**: If CoinGecko enforces public rate limits (HTTP 429), the page automatically falls back to simulated pricing tickers, preserving visual uptime.

### 7. Rich Conceptual Syllabus
- Renders high-fidelity, interactive cards explaining:
  - Web2 Centralization vs. Web3 Decentralization
  - Bitcoin Store of Value vs. Ethereum Virtual Machines
  - Public Key (Addresses) vs. Private Key (Signing Seals)
  - Append-Only Blockchains vs. Relational databases (SQL)
  - Smart Contracts (Solidity), Consensus (PoW vs. PoS), and Gas Fees (Gwei)
  - Layer 1 vs. Layer 2 Rollup structures (Arbitrum suite)

---

## 📂 Project Structure

```bash
Blockchain-Visualizer/
│
├── index.html          # Home Visualizer, Avalanche Demo, & Timelines
├── concepts.html       # Web3 Concepts Cheat Sheets
├── prices.html         # Live Cryptocurrency Feeds
├── simulator.html      # Sandbox Lab Simulator & Terminal Diagnostics
│
├── css/
│   └── style.css       # Premium Web3 Styling, Gradients, and Glassmorphism
│
├── js/
│   ├── app.js          # Core Hashing, Linking, and Particle Animation
│   ├── prices.js       # CoinGecko Feed & Fallback Controllers
│   └── simulator.js    # Sandbox Sandbox Engine & Diagnostics Logger
│
├── server.ts           # Custom Express Server to serve assets
├── package.json        # Dependencies, bundling scripts, and launch config
├── tsconfig.json       # TypeScript configuration
└── README.md           # Documentation (This File)
```

---

## 🛠️ Built With

- **Markup:** Semantic HTML5
- **Style:** Modern CSS3 Custom Properties (Variables, Flexbox, CSS Grid, Transitions, Keyframe Animations)
- **Engine:** Vanilla JavaScript (ES6+ Module-free, async/await, Asymmetric Web Crypto API)
- **Backend hosting:** Node.js Express Server
- **Compiler/Bundler:** tsx, esbuild
- **Icons:** Lucide Icons CDN

---

## 🚀 Installation & Local Development

### Prerequisites
- [Node.js](https://nodejs.org) (v18 or higher recommended)
- [npm](https://www.npmjs.com) (packaged with Node.js)

### 1. Install Dependencies
Initialize the backend framework packages (Express, TypeScript compiler, esbuild):
```bash
npm install
```

### 2. Run Development Server
Boot the live testing server (running on port 3000):
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 3. Build for Production
Bundle the TS server and duplicate static assets to `/dist` to deploy:
```bash
npm run build
```

### 4. Start Production Server
Launch compiled CJS backend assets directly:
```bash
npm run start
```

---

## 📺 Screenshots (Placeholders)

| Primary Visualizer | Sandbox Lab Simulator |
|---|---|
| ![Visual Linkage Layout](https://via.placeholder.com/600x350/18181b/ffffff?text=Interactive+Connected+Blocks) | ![Sandbox Logs](https://via.placeholder.com/600x350/18181b/ffffff?text=Terminal+Diagnostic+Logs+Sandbox) |

---

## 🔮 Future Enhancements

1. **Custom Difficulty Slider:** Allow students to adjust block difficulty from `0` to `0000`, demonstrating hash computation exponentiation.
2. **Interactive Transaction Creator:** Support sending transactions between mock addresses within the block sandbox (sending custom ARB or ETH).
3. **Decentralized Node Cluster:** Create a multi-node peer-to-peer view to show how a single tampered node gets rejected by consensus majorities.
