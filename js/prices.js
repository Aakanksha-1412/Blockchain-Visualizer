/**
  Arbitrum Builder Pods - Blockchain Visualizer
  Script: prices.js
  Vanilla JavaScript - CoinGecko API Integration with Fail-safe Mock Fallbacks
*/

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,arbitrum,matic-network&vs_currencies=usd&include_24hr_change=true&include_market_cap=true";

// Fail-safe mock data in case CoinGecko rate limits (very common for public APIs)
const MOCK_COIN_DATA = {
  "bitcoin": {
    "usd": 63450.25,
    "usd_24h_change": 2.45,
    "usd_market_cap": 1250320440210
  },
  "ethereum": {
    "usd": 3482.60,
    "usd_24h_change": -1.12,
    "usd_market_cap": 418290530900
  },
  "arbitrum": {
    "usd": 0.8245,
    "usd_24h_change": 8.76,
    "usd_market_cap": 2390451012
  },
  "matic-network": {
    "usd": 0.4522,
    "usd_24h_change": -3.40,
    "usd_market_cap": 4482093412
  }
};

let currentCoins = [];

document.addEventListener('DOMContentLoaded', () => {
  setupMobileNav();
  initParticles();

  if (document.getElementById('prices-container')) {
    fetchPrices();
    setupPriceListeners();
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

// Background Floating Particles
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
    particle.style.animation = `float-particles-prices ${duration}s linear infinite`;
    particle.style.animationDelay = `${delay}s`;

    container.appendChild(particle);
  }

  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes float-particles-prices {
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

// Fetch Prices from API or Fallback
async function fetchPrices() {
  const container = document.getElementById('prices-container');
  const statusLabel = document.getElementById('api-status-label');
  const timestampEl = document.getElementById('last-updated-time');
  
  if (!container) return;

  // Show Loading Spinner
  container.innerHTML = `
    <div class="spinner-container" id="price-loader">
      <div class="spinner"></div>
      <p>Fetching real-time market feeds from CoinGecko...</p>
    </div>
  `;

  try {
    const response = await fetch(COINGECKO_API_URL);
    
    if (!response.ok) {
      throw new Error(`API response error: ${response.status}`);
    }

    const data = await response.json();
    processAndRender(data, false);
    
    if (statusLabel) {
      statusLabel.innerHTML = '● LIVE FEED';
      statusLabel.style.color = '#22C55E';
    }

  } catch (error) {
    console.warn("CoinGecko API error (using fail-safe high-fidelity mock fallback):", error);
    
    // Simulate slight fluctuations in mock data to make it look active
    const simulatedData = JSON.parse(JSON.stringify(MOCK_COIN_DATA));
    for (const key in simulatedData) {
      const delta = (Math.random() * 0.04 - 0.02); // -2% to +2%
      simulatedData[key].usd *= (1 + delta);
      simulatedData[key].usd_24h_change += (Math.random() * 0.5 - 0.25);
    }

    processAndRender(simulatedData, true);
    
    if (statusLabel) {
      statusLabel.innerHTML = '● SIMULATED FEED (API Rate Limited)';
      statusLabel.style.color = '#EF4444';
    }
  }

  // Update last-updated time
  if (timestampEl) {
    const now = new Date();
    timestampEl.textContent = now.toLocaleTimeString();
  }
}

// Map CoinGecko IDs to our clean metadata structures
function processAndRender(data, isSimulated) {
  const mapping = {
    "bitcoin": { name: "Bitcoin", symbol: "btc", logo: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png" },
    "ethereum": { name: "Ethereum", symbol: "eth", logo: "https://assets.coingecko.com/coins/images/279/large/ethereum.png" },
    "arbitrum": { name: "Arbitrum", symbol: "arb", logo: "https://assets.coingecko.com/coins/images/16547/large/photo_2023-03-29_21.47.00.jpeg" },
    "matic-network": { name: "Polygon", symbol: "pol", logo: "https://assets.coingecko.com/coins/images/4713/large/polygon.png" }
  };

  currentCoins = [];

  for (const apiId in data) {
    const item = data[apiId];
    const meta = mapping[apiId];
    
    if (meta) {
      currentCoins.push({
        id: apiId,
        name: meta.name,
        symbol: meta.symbol,
        logo: meta.logo,
        price: item.usd,
        change24h: item.usd_24h_change,
        marketCap: item.usd_market_cap
      });
    }
  }

  renderCoins(currentCoins);
}

// Render Coin list onto the Grid
function renderCoins(coins) {
  const container = document.getElementById('prices-container');
  if (!container) return;

  if (coins.length === 0) {
    container.innerHTML = `
      <div class="error-message">
        <h3>No Cryptocurrencies Found</h3>
        <p>No coins matched your search criteria. Try a different search term.</p>
      </div>
    `;
    return;
  }

  let html = "";
  coins.forEach(coin => {
    const isPositive = coin.change24h >= 0;
    const changeClass = isPositive ? "change-positive" : "change-negative";
    const changeSign = isPositive ? "+" : "";
    
    // Formatting numbers elegantly
    const formattedPrice = coin.price >= 1 
      ? coin.price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : coin.price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 4, maximumFractionDigits: 4 });
      
    const formattedMcap = formatLargeNumber(coin.marketCap);

    html += `
      <div class="price-card ${coin.id}-card" id="coin-${coin.id}">
        <div class="coin-header">
          <div class="coin-identity">
            <img class="coin-logo" src="${coin.logo}" alt="${coin.name}" referrerpolicy="no-referrer">
            <div>
              <div class="coin-name">${coin.name}</div>
              <div class="coin-symbol">${coin.symbol}</div>
            </div>
          </div>
          <span class="coin-change ${changeClass}">
            ${isPositive ? '▲' : '▼'} ${changeSign}${coin.change24h.toFixed(2)}%
          </span>
        </div>
        <div class="coin-price">
          ${formattedPrice}
        </div>
        <div class="coin-stats">
          <div class="coin-mcap">
            Market Cap
            <span>${formattedMcap}</span>
          </div>
          <div class="coin-mcap" style="text-align: right;">
            Network
            <span style="color: #60a5fa; font-size: 0.75rem; text-transform: uppercase; font-weight: bold;">
              ${coin.id === 'arbitrum' ? 'L2 Scaling' : coin.id === 'matic-network' ? 'Polygon L2' : 'Layer 1'}
            </span>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Formatting large money amounts
function formatLargeNumber(num) {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
}

// Setup Interaction Handlers (Search and Refresh)
function setupPriceListeners() {
  const refreshBtn = document.getElementById('refresh-prices-btn');
  const searchInput = document.getElementById('price-search');

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      fetchPrices();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      const filtered = currentCoins.filter(coin => 
        coin.name.toLowerCase().includes(term) || 
        coin.symbol.toLowerCase().includes(term)
      );
      renderCoins(filtered);
    });
  }
}
