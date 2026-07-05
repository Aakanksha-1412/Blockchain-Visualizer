/**
  Arbitrum Builder Pods - Blockchain Visualizer
  Script: simulator.js
  Vanilla JavaScript - Blockchain Simulator Sandbox
*/

// Cryptographic SHA-256 function
async function computeSHA256(blockNum, prevHash, data, nonce) {
  const payload = `${blockNum}${prevHash}${data}${nonce}`;
  const buffer = new TextEncoder().encode(payload);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Sandbox Blockchain State (4 Blocks)
const sandboxChain = [
  {
    num: 1,
    data: "Arbitrum Builder Pods - Assignment Sandbox",
    prevHash: "0000000000000000000000000000000000000000000000000000000000000000",
    hash: "",
    nonce: 0,
    valid: false
  },
  {
    num: 2,
    data: "Smart Contract deployed at 0x71C...4a3",
    prevHash: "",
    hash: "",
    nonce: 0,
    valid: false
  },
  {
    num: 3,
    data: "Gas optimized: Layer 2 rollups bundle transactions",
    prevHash: "",
    hash: "",
    nonce: 0,
    valid: false
  },
  {
    num: 4,
    data: "L2 Batch submitted to Ethereum L1 successfully",
    prevHash: "",
    hash: "",
    nonce: 0,
    valid: false
  }
];

document.addEventListener('DOMContentLoaded', async () => {
  setupMobileNav();
  initParticles();

  if (document.getElementById('sandbox-block-1')) {
    await initSandboxChain();
    setupSandboxListeners();
    setupRepairBtn();
  }
});

// Setup Mobile Navigation Menu
function setupMobileNav() {
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-active');
      mobileBtn.innerHTML = navMenu.classList.contains('mobile-active') ? '✕' : '☰';
    });
  }
}

// Floating Particles in Background
function initParticles() {
  const container = document.getElementById('particles-container');
  if (!container) return;

  const particleCount = 20;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = `${Math.random() * 4 + 2}px`;
    particle.style.height = particle.style.width;
    particle.style.background = Math.random() > 0.5 ? '#2563EB' : '#7C3AED';
    particle.style.borderRadius = '50%';
    particle.style.opacity = Math.random() * 0.3 + 0.1;
    particle.style.top = `${Math.random() * 100}vh`;
    particle.style.left = `${Math.random() * 100}%`;
    
    const duration = Math.random() * 30 + 20;
    const delay = Math.random() * -20;
    particle.style.animation = `float-particles-sim ${duration}s linear infinite`;
    particle.style.animationDelay = `${delay}s`;

    container.appendChild(particle);
  }

  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes float-particles-sim {
      0% {
        transform: translateY(100vh) translateX(0);
        opacity: 0;
      }
      10% { opacity: 0.3; }
      90% { opacity: 0.3; }
      100% {
        transform: translateY(-10vh) translateX(${Math.random() * 100 - 50}px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// Pre-Mine and Initialize the Sandbox Chain
async function initSandboxChain() {
  console.log("Initializing Sandbox Chain...");

  for (let i = 0; i < sandboxChain.length; i++) {
    const block = sandboxChain[i];
    
    // Set previous hash linking
    if (i > 0) {
      block.prevHash = sandboxChain[i - 1].hash;
    }

    // Solve Proof of Work puzzle
    let nonce = 0;
    let hash = "";
    while (true) {
      hash = await computeSHA256(block.num, block.prevHash, block.data, nonce);
      if (hash.startsWith("00")) {
        break;
      }
      nonce++;
    }

    block.nonce = nonce;
    block.hash = hash;
    block.valid = true;

    // Set DOM fields
    document.getElementById(`sim-block-${block.num}-prev`).value = block.prevHash;
    document.getElementById(`sim-block-${block.num}-data`).value = block.data;
    document.getElementById(`sim-block-${block.num}-nonce`).textContent = block.nonce;
    document.getElementById(`sim-block-${block.num}-hash`).textContent = block.hash;
  }

  updateSandboxUI();
}

// Set up DOM interaction event listeners
function setupSandboxListeners() {
  for (let i = 1; i <= 4; i++) {
    const dataField = document.getElementById(`sim-block-${i}-data`);
    if (dataField) {
      dataField.addEventListener('input', async (e) => {
        const index = i - 1;
        sandboxChain[index].data = e.target.value;

        // Immediately update this specific block's hash display
        sandboxChain[index].hash = await computeSHA256(
          sandboxChain[index].num,
          sandboxChain[index].prevHash,
          sandboxChain[index].data,
          sandboxChain[index].nonce
        );

        document.getElementById(`sim-block-${i}-hash`).textContent = sandboxChain[index].hash;
        
        // Validate whole chain cascading
        await validateSandboxChain();
      });
    }

    // Individual Mine Buttons
    const mineBtn = document.getElementById(`sim-block-${i}-mine`);
    if (mineBtn) {
      mineBtn.addEventListener('click', async () => {
        await mineSandboxBlock(i);
      });
    }
  }
}

// Cascade validation of Sandbox Chain
async function validateSandboxChain() {
  for (let i = 0; i < sandboxChain.length; i++) {
    const block = sandboxChain[i];
    
    let isPrevHashMatching = true;
    let isPrevValid = true;

    if (i > 0) {
      const prevBlock = sandboxChain[i - 1];
      const displayedPrevHash = document.getElementById(`sim-block-${block.num}-prev`).value;
      
      isPrevHashMatching = (displayedPrevHash === prevBlock.hash);
      isPrevValid = prevBlock.valid;
    }

    const hasPowPrefix = block.hash.startsWith("00");
    block.valid = hasPowPrefix && isPrevHashMatching && isPrevValid;
    
    // Render dynamic explanatory log texts for this block in the Sandbox Explainer column
    updateExplanatoryLogs(block, i);
  }

  updateSandboxUI();
}

// Generate human-friendly diagnostic alerts detailing exact cryptographic breaks
function updateExplanatoryLogs(block, i) {
  const logEl = document.getElementById(`sim-block-${block.num}-explain`);
  if (!logEl) return;

  if (block.valid) {
    logEl.innerHTML = `
      <div style="color: #4ade80; font-size: 0.85rem; display: flex; align-items: flex-start; gap: 0.5rem;">
        <span style="font-weight: bold;">✔ Healthy Link:</span>
        <span>Block ${block.num} is fully secure. Stored hash starts with required 00 prefix, and maps properly to parent record.</span>
      </div>
    `;
    return;
  }

  // Determine failure triggers
  let breakdownHTML = `<div style="color: #fca5a5; font-size: 0.85rem; display: flex; flex-direction: column; gap: 0.4rem;">`;
  breakdownHTML += `<span style="font-weight: bold; color: var(--red-danger);">❌ Cryptographic Link Severed:</span>`;

  const hasPowPrefix = block.hash.startsWith("00");
  if (!hasPowPrefix) {
    breakdownHTML += `<span>• Hash does not start with Proof-of-Work difficulty prefix (<strong>00</strong>). Current: <code style="font-family: var(--font-mono); font-size: 0.75rem; background: rgba(0,0,0,0.2); padding: 1px 4px; border-radius:3px; word-break: break-all;">${block.hash.substring(0,8)}...</code>. Block must be mined again to find a valid nonce.</span>`;
  }

  if (i > 0) {
    const prevBlock = sandboxChain[i - 1];
    const displayedPrevHash = document.getElementById(`sim-block-${block.num}-prev`).value;
    
    if (displayedPrevHash !== prevBlock.hash) {
      breakdownHTML += `<span>• Previous Hash mismatch! Block expects <strong>${displayedPrevHash.substring(0,8)}...</strong> from Block ${prevBlock.num}, but parent's actual hash is <strong>${prevBlock.hash.substring(0,8)}...</strong>. Chain integrity is compromised.</span>`;
    }

    if (!prevBlock.valid) {
      breakdownHTML += `<span>• Ancestor Link broken! Block ${block.num} cannot be trusted because the preceding Block ${prevBlock.num} is currently invalid.</span>`;
    }
  }

  breakdownHTML += `</div>`;
  logEl.innerHTML = breakdownHTML;
}

// Update Sandbox Blocks CSS Theme Styles in real-time
function updateSandboxUI() {
  for (let i = 0; i < sandboxChain.length; i++) {
    const block = sandboxChain[i];
    const blockEl = document.getElementById(`sandbox-block-${block.num}`);
    const statusEl = document.getElementById(`sim-block-${block.num}-status`);
    const arrowEl = document.getElementById(`sim-arrow-${block.num}`);

    if (block.valid) {
      blockEl.classList.remove('invalid-block');
      blockEl.classList.add('valid-block');
      statusEl.className = "block-status status-valid";
      statusEl.innerHTML = "✔ VALID";
      
      if (arrowEl) {
        arrowEl.classList.remove('line-invalid');
      }
    } else {
      blockEl.classList.remove('valid-block');
      blockEl.classList.add('invalid-block');
      statusEl.className = "block-status status-invalid";
      statusEl.innerHTML = "❌ INVALID";
      
      if (arrowEl) {
        arrowEl.classList.add('line-invalid');
      }
    }
  }
}

// Mine Sandbox Block
async function mineSandboxBlock(blockNum) {
  const index = blockNum - 1;
  const block = sandboxChain[index];
  
  // Update previous hash to match previous block's actual current hash
  if (index > 0) {
    block.prevHash = sandboxChain[index - 1].hash;
    const prevInput = document.getElementById(`sim-block-${blockNum}-prev`);
    if (prevInput) {
      prevInput.value = block.prevHash;
    }
  }

  const mineBtn = document.getElementById(`sim-block-${blockNum}-mine`);
  const nonceDisplay = document.getElementById(`sim-block-${blockNum}-nonce`);
  const hashDisplay = document.getElementById(`sim-block-${blockNum}-hash`);
  const blockEl = document.getElementById(`sandbox-block-${blockNum}`);

  mineBtn.disabled = true;
  const originalText = mineBtn.innerHTML;
  mineBtn.innerHTML = `<span class="spinner" style="width:14px; height:14px; border-width:2px; margin:0; display:inline-block;"></span> Mining...`;

  let nonce = 0;
  let hash = "";
  const startTime = performance.now();

  const searchChunk = () => {
    return new Promise(async (resolve) => {
      for (let j = 0; j < 50; j++) {
        hash = await computeSHA256(block.num, block.prevHash, block.data, nonce);
        if (hash.startsWith("00")) {
          resolve({ found: true, nonce, hash });
          return;
        }
        nonce++;
      }
      resolve({ found: false, nonce });
    });
  };

  let done = false;
  while (!done) {
    const result = await searchChunk();
    nonceDisplay.textContent = result.nonce;
    hashDisplay.textContent = result.hash || "Hashing...";

    if (result.found) {
      done = true;
      block.nonce = result.nonce;
      block.hash = result.hash;
      break;
    }
    await new Promise(r => setTimeout(r, 0));
  }

  mineBtn.disabled = false;
  mineBtn.innerHTML = originalText;

  // Add scale animation pop on mine finish
  blockEl.style.transform = "scale(1.02)";
  setTimeout(() => { blockEl.style.transform = ""; }, 150);

  await validateSandboxChain();
}

// Repair Chain Button logic
function setupRepairBtn() {
  const repairBtn = document.getElementById('sandbox-repair-btn');
  if (!repairBtn) return;

  repairBtn.addEventListener('click', async () => {
    repairBtn.disabled = true;
    const originalText = repairBtn.innerHTML;
    repairBtn.innerHTML = `<span class="spinner" style="width:16px; height:16px; border-width:2px; margin:0; display:inline-block;"></span> Re-mining & Repairing Chain...`;

    for (let i = 0; i < sandboxChain.length; i++) {
      const block = sandboxChain[i];
      const num = block.num;

      // 1. Re-link Previous Hash if needed
      if (i > 0) {
        block.prevHash = sandboxChain[i - 1].hash;
        document.getElementById(`sim-block-${num}-prev`).value = block.prevHash;
      }

      // Check current validity
      block.hash = await computeSHA256(block.num, block.prevHash, block.data, block.nonce);

      // If invalid, we mine it
      if (!block.hash.startsWith("00")) {
        let nonce = 0;
        let hash = "";
        while (true) {
          hash = await computeSHA256(block.num, block.prevHash, block.data, nonce);
          if (hash.startsWith("00")) {
            break;
          }
          nonce++;
        }
        block.nonce = nonce;
        block.hash = hash;

        // Render straight into UI
        document.getElementById(`sim-block-${num}-nonce`).textContent = block.nonce;
        document.getElementById(`sim-block-${num}-hash`).textContent = block.hash;

        // Visual flash
        const blockEl = document.getElementById(`sandbox-block-${num}`);
        blockEl.style.boxShadow = "var(--glow-green)";
        await new Promise(r => setTimeout(r, 300));
        blockEl.style.boxShadow = "";
      }

      block.valid = true;
      await validateSandboxChain();
    }

    repairBtn.disabled = false;
    repairBtn.innerHTML = originalText;
  });
}
