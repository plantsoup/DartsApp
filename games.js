// ========== GAME SYSTEM ==========

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
      if (btn.dataset.game === '301' || btn.dataset.game === 'cricket') return;
      
      document.querySelectorAll('.game-type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedGameType = btn.dataset.game;
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

// ========== KILLER GAME ==========

class KillerGame {
  constructor(players, options = {}) {
    // Game options with defaults
    this.startingLives = options.startingLives || 3;
    this.hitsToKiller = options.hitsToKiller || 1;
    
    // Shuffle numbers for random assignment
    const availableNumbers = this.shuffleNumbers();
    
    this.players = players.map((p, i) => ({
      ...p,
      number: availableNumbers[i],
      lives: this.startingLives,
      isKiller: false,
      hitsOnOwnNumber: 0,
      eliminated: false
    }));
    this.currentPlayerIndex = 0;
    this.gameOver = false;
    this.winner = null;
  }

  shuffleNumbers() {
    // All dartboard numbers in standard order
    const numbers = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
    // Fisher-Yates shuffle
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers;
  }

  start() {
    this.render();
    const statusText = document.getElementById('status-text');
    const eventText = document.getElementById('event-text');
    statusText.textContent = 'Killer - In Progress';
    eventText.textContent = `${this.getCurrentPlayer().name}'s turn`;
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  processThrow(segment) {
    if (this.gameOver) return;

    const currentPlayer = this.getCurrentPlayer();
    const hitNumber = segment.number;
    const eventText = document.getElementById('event-text');

    // Check if player hit their own number (to become killer)
    if (hitNumber === currentPlayer.number && !currentPlayer.isKiller) {
      currentPlayer.hitsOnOwnNumber++;
      
      if (currentPlayer.hitsOnOwnNumber >= this.hitsToKiller) {
        currentPlayer.isKiller = true;
        eventText.textContent = `${currentPlayer.name} is now a KILLER! 💀`;
      } else {
        const remaining = this.hitsToKiller - currentPlayer.hitsOnOwnNumber;
        eventText.textContent = `${currentPlayer.name} hit their number! ${remaining} more to become killer`;
      }
      
      this.render();
      return;
    }

    // If player is a killer, check if they hit another player's number
    if (currentPlayer.isKiller) {
      const targetPlayer = this.players.find(p => 
        p.number === hitNumber && 
        !p.eliminated && 
        p.id !== currentPlayer.id
      );

      if (targetPlayer) {
        targetPlayer.lives--;
        eventText.textContent = `${currentPlayer.name} hit ${targetPlayer.name}! `;
        
        if (targetPlayer.lives <= 0) {
          targetPlayer.eliminated = true;
          eventText.textContent += `${targetPlayer.name} is eliminated! 💀`;
        } else {
          eventText.textContent += `${targetPlayer.name} has ${targetPlayer.lives} life/lives left`;
        }

        this.checkWinner();
        this.render();
        return;
      }
    }

    // Miss or invalid hit
    eventText.textContent = `${currentPlayer.name} ${currentPlayer.isKiller ? 'missed' : 'needs to hit ' + currentPlayer.number}`;
  }

  nextPlayer() {
    if (this.gameOver) return;

    // Find next non-eliminated player
    let attempts = 0;
    do {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
      attempts++;
    } while (this.getCurrentPlayer().eliminated && attempts < this.players.length);

    if (attempts >= this.players.length) {
      this.gameOver = true;
      return;
    }

    const nextPlayer = this.getCurrentPlayer();
    const eventText = document.getElementById('event-text');
    eventText.textContent = `${nextPlayer.name}'s turn`;
    this.render();
  }

  checkWinner() {
    const activePlayers = this.players.filter(p => !p.eliminated);
    
    if (activePlayers.length === 1) {
      this.gameOver = true;
      this.winner = activePlayers[0];
      this.showWinner();
    }
  }

  showWinner() {
    const statusText = document.getElementById('status-text');
    const eventText = document.getElementById('event-text');
    
    gameBoard.innerHTML = `
      <div class="winner-banner">
        <h2>🏆 ${this.winner.name} Wins! 🏆</h2>
        <p>Congratulations!</p>
      </div>
    ` + gameBoard.innerHTML;
    
    statusText.textContent = 'Game Over';
    eventText.textContent = `${this.winner.name} is the Killer champion!`;
  }

  render() {
    const html = `
      <div class="killer-board">
        ${this.players.map((player, index) => `
          <div class="killer-player ${index === this.currentPlayerIndex ? 'active' : ''} ${player.eliminated ? 'eliminated' : ''}">
            <div class="killer-player-header">
              <div class="killer-player-name">${player.name}</div>
              ${player.isKiller && !player.eliminated ? '<div class="killer-badge">KILLER 💀</div>' : ''}
              ${player.eliminated ? '<div style="color: #666;">ELIMINATED</div>' : ''}
              ${!player.isKiller && !player.eliminated && player.hitsOnOwnNumber > 0 ? 
                `<div class="killer-progress">${player.hitsOnOwnNumber}/${this.hitsToKiller}</div>` : ''}
            </div>
            <div class="killer-player-stats">
              <div class="killer-number">${player.number}</div>
              <div class="killer-lives">
                ${Array(this.startingLives).fill('').map((_, i) => 
                  `<span class="life-icon ${i >= player.lives ? 'lost' : ''}">❤️</span>`
                ).join('')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    gameBoard.innerHTML = html;
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

