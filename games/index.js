// ========== GAME SYSTEM ==========

import { KillerGame } from './killer.js';
import { X01Game } from './x01.js';
import { CricketGame } from './cricket.js';
import { SnakesAndLaddersGame } from './snakes-ladders.js';

let currentGame = null;
let setupPlayers = [];
let selectedGameType = 'killer';
let throwsInCurrentTurn = 0;
let lastThrowCount = 0;

// Modal elements
let modal, newGameBtn, endGameBtn, startGameBtn, cancelGameBtn;
let addPlayerBtn, playerNameInput, playerList, gameBoard;

// Initialize game system
export function initGameSystem() {
  // Get DOM elements
  modal = document.getElementById('game-modal');
  newGameBtn = document.getElementById('new-game-btn');
  endGameBtn = document.getElementById('end-game-btn');
  startGameBtn = document.getElementById('start-game-btn');
  cancelGameBtn = document.getElementById('cancel-game-btn');
  addPlayerBtn = document.getElementById('add-player-btn');
  playerNameInput = document.getElementById('player-name-input');
  playerList = document.getElementById('player-list');
  gameBoard = document.getElementById('game-board');

  // Game type selection
  document.querySelectorAll('.game-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.game-type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedGameType = btn.dataset.game;
      
      // Show/hide game options based on game type
      updateGameOptions();
    });
  });

  // Modal controls
  newGameBtn.addEventListener('click', openGameSetup);
  cancelGameBtn.addEventListener('click', closeGameSetup);
  endGameBtn.addEventListener('click', endGame);
  startGameBtn.addEventListener('click', startGame);
  
  addPlayerBtn.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    if (name) {
      addPlayer(name);
      playerNameInput.value = '';
    }
  });

  playerNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const name = playerNameInput.value.trim();
      if (name) {
        addPlayer(name);
        playerNameInput.value = '';
      }
    }
  });

  // Make removePlayer available globally
  window.removePlayer = removePlayer;
}

function updateGameOptions() {
  const killerOptions = document.getElementById('killer-options');
  const x01Options = document.getElementById('x01-options');
  
  // Hide all game-specific options first
  if (killerOptions) killerOptions.style.display = 'none';
  if (x01Options) x01Options.style.display = 'none';
  
  // Show relevant options
  if (selectedGameType === 'killer') {
    if (killerOptions) killerOptions.style.display = 'block';
  } else if (selectedGameType === '301' || selectedGameType === '501') {
    if (x01Options) x01Options.style.display = 'block';
  }
}

function openGameSetup() {
  modal.classList.add('active');
  setupPlayers = [];
  updatePlayerList();
}

function closeGameSetup() {
  modal.classList.remove('active');
}

function addPlayer(name) {
  if (setupPlayers.length >= 8) {
    alert('Maximum 8 players allowed');
    return;
  }
  setupPlayers.push({ name, id: Date.now() });
  updatePlayerList();
}

function removePlayer(id) {
  setupPlayers = setupPlayers.filter(p => p.id !== id);
  updatePlayerList();
}

function updatePlayerList() {
  if (setupPlayers.length === 0) {
    playerList.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">No players added yet</div>';
    startGameBtn.disabled = true;
    return;
  }

  playerList.innerHTML = setupPlayers.map(p => `
    <div class="player-item">
      <span class="player-item-name">${p.name}</span>
      <button class="player-item-remove" onclick="removePlayer(${p.id})">Remove</button>
    </div>
  `).join('');

  startGameBtn.disabled = setupPlayers.length < 2;
}

function startGame() {
  if (setupPlayers.length < 2) {
    alert('Need at least 2 players');
    return;
  }

  closeGameSetup();

  if (selectedGameType === 'killer') {
    // Get game options
    const startingLives = parseInt(document.getElementById('starting-lives').value);
    const hitsToKiller = parseInt(document.getElementById('hits-to-killer').value);
    
    currentGame = new KillerGame(setupPlayers, {
      startingLives,
      hitsToKiller
    });
    currentGame.start();
  } else if (selectedGameType === '301') {
    const startingScore = 301;
    const doubleOut = document.getElementById('double-out')?.checked || false;
    
    currentGame = new X01Game(setupPlayers, {
      startingScore,
      doubleOut
    });
    currentGame.start();
  } else if (selectedGameType === 'cricket') {
    currentGame = new CricketGame(setupPlayers);
    currentGame.start();
  } else if (selectedGameType === 'snakes') {
    currentGame = new SnakesAndLaddersGame(setupPlayers);
    currentGame.start();
  }

  newGameBtn.style.display = 'none';
  endGameBtn.style.display = 'inline-block';
  gameBoard.style.display = 'block';
}

function endGame() {
  if (confirm('Are you sure you want to end the current game?')) {
    currentGame = null;
    newGameBtn.style.display = 'inline-block';
    endGameBtn.style.display = 'none';
    gameBoard.style.display = 'none';
    
    const statusText = document.getElementById('status-text');
    const eventText = document.getElementById('event-text');
    statusText.textContent = 'Waiting for game...';
    eventText.textContent = '';
  }
}

// ========== INTEGRATE GAME WITH AUTODARTS ==========

export function handleGameThrow(data) {
  if (!currentGame) return;

  // New throw detected
  if (data.numThrows > lastThrowCount && data.throws && data.throws.length > 0) {
    const latestThrow = data.throws[data.throws.length - 1];
    currentGame.processThrow(latestThrow.segment);
    throwsInCurrentTurn++;
  }
  lastThrowCount = data.numThrows;

  // When takeout happens (darts removed), move to next player
  if (data.event === 'Takeout finished') {
    if (throwsInCurrentTurn > 0) {
      setTimeout(() => {
        currentGame.nextPlayer();
        throwsInCurrentTurn = 0;
      }, 1000);
    }
  }

  // Reset throw count when new turn starts
  if (data.numThrows === 0) {
    lastThrowCount = 0;
  }
}

export function isGameActive() {
  return currentGame !== null;
}

