// ========== BASE GAME CLASS ==========

export const PLAYER_COLORS = [
  '#00ff88', '#00aaff', '#ff00ff', '#ffaa00', 
  '#ff4444', '#44ff44', '#ff8800', '#8800ff'
];

export class BaseGame {
  constructor(players, gameName) {
    this.gameName = gameName;
    this.players = players;
    this.currentPlayerIndex = 0;
    this.gameOver = false;
    this.winner = null;
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  updateStatus(statusMsg, eventMsg) {
    const statusText = document.getElementById('status-text');
    const eventText = document.getElementById('event-text');
    if (statusMsg) statusText.textContent = statusMsg;
    if (eventMsg) eventText.textContent = eventMsg;
  }

  nextPlayerIndex() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
  }

  showWinner(additionalInfo = '') {
    const statusText = document.getElementById('status-text');
    const eventText = document.getElementById('event-text');
    const gameBoard = document.getElementById('game-board');
    
    gameBoard.innerHTML = `
      <div class="winner-banner winner-flash">
        <h2>🏆 ${this.winner.name} Wins! 🏆</h2>
        ${additionalInfo}
      </div>
    ` + gameBoard.innerHTML;
    
    statusText.textContent = 'Game Over';
    eventText.textContent = `${this.winner.name} is the champion!`;
  }
}

