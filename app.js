// ========== WEBSOCKET CONNECTION ==========

let ws;
let reconnectTimeout;

// Default connection settings
const DEFAULT_IP = "192.168.0.224";
const DEFAULT_PORT = "3180";

// Load settings from localStorage
function loadSettings() {
  return {
    ip: localStorage.getItem('autodarts-ip') || DEFAULT_IP,
    port: localStorage.getItem('autodarts-port') || DEFAULT_PORT
  };
}

// Save settings to localStorage
function saveSettings(ip, port) {
  localStorage.setItem('autodarts-ip', ip);
  localStorage.setItem('autodarts-port', port);
}

// Get WebSocket URL from settings
function getWebSocketUrl() {
  const settings = loadSettings();
  // Use ws:// for local development, allow wss:// if configured
  const protocol = settings.ip.startsWith('localhost') || settings.ip.startsWith('127.0.0.1') ? 'ws' : 'ws';
  return `${protocol}://${settings.ip}:${settings.port}/api/events`;
}

// State
let gameState = {
  throws: [],
  status: '',
  event: '',
  totalScore: 0
};

// DOM Elements
let connectionStatus, statusText, eventText, throwList, totalScore;
let canvas, ctx;
let settingsModal, settingsBtn, saveSettingsBtn, cancelSettingsBtn;
let ipAddressInput, portInput;

// Initialize app
export function init() {
  // Get DOM elements
  connectionStatus = document.getElementById('connection-status');
  statusText = document.getElementById('status-text');
  eventText = document.getElementById('event-text');
  throwList = document.getElementById('throw-list');
  totalScore = document.getElementById('total-score');
  canvas = document.getElementById('dartboard');
  ctx = canvas.getContext('2d');
  
  // Settings modal elements
  settingsModal = document.getElementById('settings-modal');
  settingsBtn = document.getElementById('settings-btn');
  saveSettingsBtn = document.getElementById('save-settings-btn');
  cancelSettingsBtn = document.getElementById('cancel-settings-btn');
  ipAddressInput = document.getElementById('ip-address');
  portInput = document.getElementById('port');

  // Settings modal controls
  settingsBtn.addEventListener('click', openSettings);
  saveSettingsBtn.addEventListener('click', saveAndReconnect);
  cancelSettingsBtn.addEventListener('click', closeSettings);

  // Load saved settings into inputs
  const settings = loadSettings();
  ipAddressInput.value = settings.ip;
  portInput.value = settings.port;

  // Connect to WebSocket
  connect();
  drawDartboard();
}

function openSettings() {
  settingsModal.classList.add('active');
}

function closeSettings() {
  settingsModal.classList.remove('active');
}

function saveAndReconnect() {
  const ip = ipAddressInput.value.trim();
  const port = portInput.value.trim();
  
  if (!ip || !port) {
    alert('Please enter both IP address and port');
    return;
  }
  
  // Save settings
  saveSettings(ip, port);
  
  // Close modal
  closeSettings();
  
  // Reconnect with new settings
  disconnect();
  setTimeout(() => connect(), 500);
}

function disconnect() {
  if (ws) {
    clearTimeout(reconnectTimeout);
    ws.close();
    ws = null;
  }
}

function connect() {
  const url = getWebSocketUrl();
  ws = new WebSocket(url);

  ws.onopen = () => {
    connectionStatus.textContent = '🟢 Connected';
    connectionStatus.className = 'status-badge status-connected';
    clearTimeout(reconnectTimeout);
  };

  ws.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      handleMessage(message);
    } catch (err) {
      console.error('Error parsing message:', err);
    }
  };

  ws.onerror = (err) => {
    connectionStatus.textContent = '🔴 Connection Error';
    connectionStatus.className = 'status-badge status-disconnected';
  };

  ws.onclose = () => {
    connectionStatus.textContent = '🔴 Disconnected';
    connectionStatus.className = 'status-badge status-disconnected';
    reconnectTimeout = setTimeout(connect, 3000);
  };
}

function handleMessage(message) {
  const { type, data } = message;

  switch (type) {
    case 'state':
      handleStateMessage(data);
      break;
    case 'motion_state':
      handleMotionState(data);
      break;
  }
}

function handleStateMessage(data) {
  gameState.status = data.status || '';
  gameState.event = data.event || '';
  gameState.throws = data.throws || [];
  
  // Update UI (only if no game is active)
  // Import from games.js
  const isGameActive = window.isGameActive ? window.isGameActive() : false;
  
  if (!isGameActive) {
    statusText.textContent = data.status || 'Waiting...';
    eventText.textContent = data.event || '';
  }

  // Calculate total score
  gameState.totalScore = gameState.throws.reduce((sum, t) => {
    return sum + (t.segment.number * t.segment.multiplier);
  }, 0);
  totalScore.textContent = gameState.totalScore;

  // Game integration - let games.js handle it
  if (window.handleGameThrow) {
    window.handleGameThrow(data);
  }

  // Update throw list
  updateThrowList();

  // Draw dartboard
  drawDartboard();
}

function handleMotionState(data) {
  updateIndicator('dot-dart', data.dartIsInFrame);
  updateIndicator('dot-hand', data.handIsInFrame);
  updateIndicator('dot-stable', data.isStable);
  updateIndicator('dot-updating', data.updating);
  updateIndicator('dot-waiting', data.isWaiting);
  updateIndicator('dot-darts-removed', data.allDartsRemoved);
}

function updateIndicator(id, isActive) {
  const dot = document.getElementById(id);
  if (dot) {
    dot.classList.toggle('active', isActive);
  }
}

function updateThrowList() {
  if (gameState.throws.length === 0) {
    throwList.innerHTML = '<div style="text-align: center; color: #666; padding: 40px;">No throws yet</div>';
    return;
  }

  throwList.innerHTML = gameState.throws.map((t, i) => {
    const score = t.segment.number * t.segment.multiplier;
    const color = getThrowColor(i);
    return `
      <div class="throw-item" style="border-left-color: ${color};">
        <div>
          <div class="throw-segment">${t.segment.name}</div>
          <div style="font-size: 0.85rem; color: #999;">
            ${t.segment.bed} (x${t.segment.multiplier})
          </div>
        </div>
        <div class="throw-score">${score}</div>
      </div>
    `;
  }).join('');
}

// ========== DARTBOARD RENDERING ==========

function drawDartboard() {
  // Clear canvas
  ctx.clearRect(0, 0, 400, 400);

  const centerX = 200;
  const centerY = 200;
  const radius = 180;

  // Draw dartboard background
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  // Draw basic dartboard segments (simplified)
  const segments = 20;
  
  for (let i = 0; i < segments; i++) {
    const startAngle = (i * Math.PI * 2 / segments) - Math.PI / 2;
    const endAngle = ((i + 1) * Math.PI * 2 / segments) - Math.PI / 2;
    
    ctx.fillStyle = i % 2 === 0 ? '#2a2a2a' : '#1a1a1a';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
  }

  // Draw rings
  ctx.strokeStyle = '#444';
  ctx.lineWidth = 2;
  [40, 80, 120, 160, 180].forEach(r => {
    ctx.beginPath();
    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Draw bullseye
  ctx.fillStyle = '#ff0000';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#00ff00';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
  ctx.fill();

  // Draw darts
  gameState.throws.forEach((t, i) => {
    const x = centerX + (t.coords.x * radius);
    const y = centerY - (t.coords.y * radius); // Invert Y axis
    
    const color = getThrowColor(i);
    
    // Draw dart marker
    ctx.fillStyle = color;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Draw dart number
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((i + 1).toString(), x, y);
  });
}

function getThrowColor(index) {
  const colors = ['#00ff88', '#00aaff', '#ff00ff', '#ffaa00'];
  return colors[index % colors.length];
}
