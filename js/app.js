/**
  Arbitrum Builder Pods - Blockchain Visualizer
  Script: app.js
  Vanilla JavaScript - Clean, Modular, and Interactive
*/

// SHA-256 Utility using Web Crypto API
async function calculateHash(blockNumber, previousHash, data, nonce) {
  const message = `${blockNumber}${previousHash}${data}${nonce}`;
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Simple SHA-256 for plain text (used in Avalanche demonstration)
async function calculatePlainHash(text) {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Global Blockchain State for Home Page
const blockchain = [
  {
    number: 1,
    data: "Genesis Block - Arbitrum Builder Pods",
    previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
    hash: "",
    nonce: 0,
    valid: false
  },
  {
    number: 2,
    data: "Alice pays Bob 10 ETH",
    previousHash: "",
    hash: "",
    nonce: 0,
    valid: false
  },
  {
    number: 3,
    data: "Bob pays Charlie 5.5 ETH",
    previousHash: "",
    hash: "",
    nonce: 0,
    valid: false
  },
  {
    number: 4,
    data: "Charlie pays Dave 1.2 ETH",
    previousHash: "",
    hash: "",
    nonce: 0,
    valid: false
  }
];

// Document Elements
document.addEventListener('DOMContentLoaded', async () => {
  // Mobile Nav Toggle
  setupMobileNav();

  // Background Particles
  initParticles();

  // Initialize Home Page Visualizer
  if (document.getElementById('block-1-data')) {
    await initBlockchain();
    setupVisualizerListeners();
    setupHashDemo();
    setupRepairListener();
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

// Initialize Particles on Background
function initParticles() {
  const container = document.getElementById('particles-container');
  if (!container) return;

  const particleCount = 25;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = `${Math.random() * 4 + 2}px`;
    particle.style.height = particle.style.width;
    particle.style.background = Math.random() > 0.5 ? '#2563EB' : '#7C3AED';
    particle.style.borderRadius = '50%';
    particle.style.opacity = Math.random() * 0.4 + 0.1;
    particle.style.top = `${Math.random() * 100}vh`;
    particle.style.left = `${Math.random() * 100}%`;
    
    // Animation properties
    const duration = Math.random() * 30 + 20;
    const delay = Math.random() * -20;
    particle.style.animation = `float-particles ${duration}s linear infinite`;
    particle.style.animationDelay = `${delay}s`;

    container.appendChild(particle);
  }

  // Inject animation keyframes dynamically
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes float-particles {
      0% {
        transform: translateY(100vh) translateX(0);
        opacity: 0;
      }
      10% {
        opacity: 0.4;
      }
      90% {
        opacity: 0.4;
      }
      100% {
        transform: translateY(-10vh) translateX(${Math.random() * 100 - 50}px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// Quick Mining on Startup to present a perfectly VALID green chain
async function initBlockchain() {
  console.log("Initializing valid blockchain...");
  
  for (let i = 0; i < blockchain.length; i++) {
    const block = blockchain[i];
    
    // Set previous hash
    if (i > 0) {
      block.previousHash = blockchain[i - 1].hash;
    }
    
    // Find valid nonce starting with "00"
    let nonce = 0;
    let hash = "";
    while (true) {
      hash = await calculateHash(block.number, block.previousHash, block.data, nonce);
      if (hash.startsWith("00")) {
        break;
      }
      nonce++;
    }
    
    block.nonce = nonce;
    block.hash = hash;
    block.valid = true;

    // Update DOM fields
    document.getElementById(`block-${block.number}-prev`).value = block.previousHash;
    document.getElementById(`block-${block.number}-data`).value = block.data;
    document.getElementById(`block-${block.number}-nonce`).textContent = block.nonce;
    document.getElementById(`block-${block.number}-hash`).textContent = block.hash;
  }

  updateUIIntegrity();
}

// Setup Event Listeners for Blocks User Typing Input
function setupVisualizerListeners() {
  for (let i = 1; i <= 4; i++) {
    const dataInput = document.getElementById(`block-${i}-data`);
    if (dataInput) {
      dataInput.addEventListener('input', async (e) => {
        const blockIndex = i - 1;
        blockchain[blockIndex].data = e.target.value;
        
        // Recalculate this block's hash immediately
        blockchain[blockIndex].hash = await calculateHash(
          blockchain[blockIndex].number,
          blockchain[blockIndex].previousHash,
          blockchain[blockIndex].data,
          blockchain[blockIndex].nonce
        );
        
        document.getElementById(`block-${i}-hash`).textContent = blockchain[blockIndex].hash;
        
        // Run full chain validation
        await validateChain();
      });
    }

    // Individual block mine buttons
    const mineBtn = document.getElementById(`block-${i}-mine`);
    if (mineBtn) {
      mineBtn.addEventListener('click', async () => {
        await mineBlockUI(i);
      });
    }
  }
}

// Validation Logic
async function validateChain() {
  // Validate block by block
  for (let i = 0; i < blockchain.length; i++) {
    const block = blockchain[i];
    
    // In our simplified logic:
    // Block 1: Valid if hash starts with "00"
    // Other blocks: Valid if:
    //   - previous hash stored matches previous block's actual hash
    //   - own hash starts with "00"
    //   - previous block is also valid
    
    let isPrevHashCorrect = true;
    let isPrevBlockValid = true;

    if (i > 0) {
      const prevBlock = blockchain[i - 1];
      const displayedPrevHash = document.getElementById(`block-${block.number}-prev`).value;
      
      isPrevHashCorrect = (displayedPrevHash === prevBlock.hash);
      isPrevBlockValid = prevBlock.valid;
    }

    const hashStartsCorrectly = block.hash.startsWith("00");

    block.valid = hashStartsCorrectly && isPrevHashCorrect && isPrevBlockValid;
  }

  updateUIIntegrity();
}

// Update DOM based on block validity states
function updateUIIntegrity() {
  for (let i = 0; i < blockchain.length; i++) {
    const block = blockchain[i];
    const blockEl = document.getElementById(`block-${block.number}`);
    const statusEl = document.getElementById(`block-${block.number}-status`);
    const arrowEl = document.getElementById(`arrow-${block.number}`);

    if (block.valid) {
      // Set to Valid UI
      blockEl.classList.remove('invalid-block');
      blockEl.classList.add('valid-block');
      statusEl.className = "block-status status-valid";
      statusEl.innerHTML = "✔ VALID";
      
      if (arrowEl) {
        arrowEl.classList.remove('line-invalid');
      }
    } else {
      // Set to Invalid UI
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

// Mine block via UI triggers (Proof-of-work)
async function mineBlockUI(blockNum) {
  const blockIndex = blockNum - 1;
  const block = blockchain[blockIndex];
  
  // Update previous hash to match previous block's actual current hash
  if (blockIndex > 0) {
    block.previousHash = blockchain[blockIndex - 1].hash;
    const prevInput = document.getElementById(`block-${blockNum}-prev`);
    if (prevInput) {
      prevInput.value = block.previousHash;
    }
  }

  const mineBtn = document.getElementById(`block-${blockNum}-mine`);
  const nonceDisplay = document.getElementById(`block-${blockNum}-nonce`);
  const hashDisplay = document.getElementById(`block-${blockNum}-hash`);
  const blockEl = document.getElementById(`block-${blockNum}`);
  
  // Disable button and input during mining animation
  mineBtn.disabled = true;
  const originalBtnText = mineBtn.innerHTML;
  mineBtn.innerHTML = `<span class="spinner" style="width:14px; height:14px; border-width:2px; margin:0; display:inline-block;"></span> Mining...`;
  
  let nonce = 0;
  let hash = "";
  const startTime = performance.now();
  
  // Repeatedly hash in small chunks to allow UI render thread to remain unfrozen
  const chunkSearch = () => {
    return new Promise(async (resolve) => {
      for (let j = 0; j < 50; j++) {
        hash = await calculateHash(block.number, block.previousHash, block.data, nonce);
        if (hash.startsWith("00")) {
          resolve({ found: true, nonce, hash });
          return;
        }
        nonce++;
      }
      // Return false to do another chunk
      resolve({ found: false, nonce });
    });
  };

  let miningDone = false;
  while (!miningDone) {
    const result = await chunkSearch();
    nonceDisplay.textContent = result.nonce;
    hashDisplay.textContent = result.hash || "Searching...";
    
    if (result.found) {
      miningDone = true;
      block.nonce = result.nonce;
      block.hash = result.hash;
      break;
    }
    // Briefly release main thread
    await new Promise(r => setTimeout(r, 0));
  }

  const endTime = performance.now();
  const miningTime = ((endTime - startTime) / 1000).toFixed(2);
  
  // Restore button UI
  mineBtn.disabled = false;
  mineBtn.innerHTML = originalBtnText;

  // Visual success indicator
  blockEl.style.transform = "scale(1.03)";
  setTimeout(() => { blockEl.style.transform = ""; }, 200);

  console.log(`Block ${blockNum} mined in ${miningTime}s. Nonce: ${block.nonce}, Hash: ${block.hash}`);
  
  // Validate and update chain
  await validateChain();
}

// Repair Blockchain sequentially (re-linking previous hashes & re-mining)
async function setupRepairListener() {
  const repairBtn = document.getElementById('repair-chain-btn');
  if (!repairBtn) return;

  repairBtn.addEventListener('click', async () => {
    repairBtn.disabled = true;
    const originalText = repairBtn.innerHTML;
    repairBtn.innerHTML = `<span class="spinner" style="width:16px; height:16px; border-width:2px; margin:0; display:inline-block;"></span> Repairing Blockchain...`;
    
    // Sequentially fix and mine blocks
    for (let i = 0; i < blockchain.length; i++) {
      const block = blockchain[i];
      const blockNum = block.number;
      
      // 1. Update previous hash for blocks > 1
      if (i > 0) {
        block.previousHash = blockchain[i - 1].hash;
        document.getElementById(`block-${blockNum}-prev`).value = block.previousHash;
      }
      
      // 2. Compute current hash with current nonce to check if it's already valid
      block.hash = await calculateHash(block.number, block.previousHash, block.data, block.nonce);
      
      // 3. If block is not valid (doesn't start with "00"), we must mine it
      if (!block.hash.startsWith("00")) {
        // Run mining simulation
        let nonce = 0;
        let hash = "";
        while (true) {
          hash = await calculateHash(block.number, block.previousHash, block.data, nonce);
          if (hash.startsWith("00")) {
            break;
          }
          nonce++;
        }
        block.nonce = nonce;
        block.hash = hash;
        
        // Update DOM displays
        document.getElementById(`block-${blockNum}-nonce`).textContent = block.nonce;
        document.getElementById(`block-${blockNum}-hash`).textContent = block.hash;
        
        // Add animated glow pulse
        const blockEl = document.getElementById(`block-${blockNum}`);
        blockEl.style.boxShadow = "var(--glow-green)";
        await new Promise(r => setTimeout(r, 400));
        blockEl.style.boxShadow = "";
      }
      
      block.valid = true;
      await validateChain();
    }
    
    repairBtn.disabled = false;
    repairBtn.innerHTML = originalText;
  });
}

// Hash Demonstration (Avalanche Effect Section)
function setupHashDemo() {
  const inputArea = document.getElementById('hash-input-demo');
  const oldHashEl = document.getElementById('hash-old-output');
  const newHashEl = document.getElementById('hash-new-output');
  
  if (!inputArea || !oldHashEl || !newHashEl) return;

  const defaultText = "Alice pays Bob 10 ETH";
  let oldHash = "";
  
  // Calculate initial hash for defaultText
  calculatePlainHash(defaultText).then(hash => {
    oldHash = hash;
    oldHashEl.textContent = oldHash;
    newHashEl.textContent = oldHash;
  });

  inputArea.addEventListener('input', async (e) => {
    const text = e.target.value;
    const currentHash = await calculatePlainHash(text);
    
    // Animate the text transition in hash box
    newHashEl.style.color = '#ef4444';
    newHashEl.style.textShadow = '0 0 10px rgba(239, 68, 68, 0.5)';
    newHashEl.textContent = currentHash;
    
    setTimeout(() => {
      newHashEl.style.color = '';
      newHashEl.style.textShadow = '';
    }, 300);
  });
}
