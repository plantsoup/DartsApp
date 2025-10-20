// ========== 301 GAME ==========

import { BaseGame } from './base.js';

export class X01Game extends BaseGame {
  constructor(players, options = {}) {
    super(players, '301');
    
    this.startingScore = options.startingScore || 301;
    this.doubleOut = options.doubleOut || false;
    
    this.players = players.map(p => ({
      ...p,
      score: this.startingScore,
      darts: 0,
      average: 0,
      highestScore: 0,
      checkouts: 0,
      eliminated: false
    }));
    
    this.currentTurnScore = 0;
    this.currentTurnDarts = [];
  }

  start() {
    this.render();
    this.updateStatus(
      `${this.startingScore} - In Progress`,
      `${this.getCurrentPlayer().name}'s turn`
    );
  }

  processThrow(segment) {
    if (this.gameOver) return;

    const player = this.getCurrentPlayer();
    const score = segment.number * segment.multiplier;
    
    this.currentTurnDarts.push({ segment, score });
    this.currentTurnScore += score;
    player.darts++;

    const eventText = document.getElementById('event-text');
    eventText.textContent = `${player.name} scored ${score}! Turn total: ${this.currentTurnScore}`;

    this.render();
  }

  nextPlayer() {
    if (this.gameOver) return;

    const player = this.getCurrentPlayer();
    
    // Calculate new score
    const newScore = player.score - this.currentTurnScore;
    
    // Check for bust (went below 0 or need double out)
    if (newScore < 0 || (this.doubleOut && newScore === 0 && this.currentTurnDarts[this.currentTurnDarts.length - 1]?.segment.multiplier !== 2)) {
      const eventText = document.getElementById('event-text');
      eventText.textContent = `${player.name} BUST! Score stays at ${player.score}`;
    } else {
      player.score = newScore;
      
      // Update stats
      if (this.currentTurnScore > player.highestScore) {
        player.highestScore = this.currentTurnScore;
      }
      
      // Calculate average
      const totalScoreThrown = (this.startingScore - player.score);
      player.average = player.darts > 0 ? (totalScoreThrown / player.darts * 3).toFixed(2) : 0;
      
      // Check for win
      if (player.score === 0) {
        this.gameOver = true;
        this.winner = player;
        player.checkouts++;
        this.showWinner();
        return;
      }
    }
    
    // Reset turn
    this.currentTurnScore = 0;
    this.currentTurnDarts = [];
    
    // Next player
    this.nextPlayerIndex();
    
    const nextPlayer = this.getCurrentPlayer();
    this.updateStatus(null, `${nextPlayer.name}'s turn - ${nextPlayer.score} remaining`);
    
    this.render();
  }

  showWinner() {
    super.showWinner(`
      <p>Finished in ${this.winner.darts} darts</p>
      <p>Average: ${this.winner.average}</p>
    `);
  }

  render() {
    const gameBoard = document.getElementById('game-board');
    const html = `
      <div class="x01-board">
        ${this.players.map((player, index) => `
          <div class="x01-player ${index === this.currentPlayerIndex ? 'active' : ''} ${player.eliminated ? 'eliminated' : ''}">
            <div class="x01-player-header">
              <div class="x01-player-name">${player.name}</div>
              ${player.average > 0 ? `<div class="x01-average">Avg: ${player.average}</div>` : ''}
            </div>
            <div class="x01-player-body">
              <div class="x01-score ${player.score < 170 ? 'checkout-range' : ''}">${player.score}</div>
              <div class="x01-stats">
                <div class="x01-stat">
                  <span class="x01-stat-label">Darts:</span>
                  <span class="x01-stat-value">${player.darts}</span>
                </div>
                <div class="x01-stat">
                  <span class="x01-stat-label">High:</span>
                  <span class="x01-stat-value">${player.highestScore}</span>
                </div>
              </div>
            </div>
            ${index === this.currentPlayerIndex && this.currentTurnScore > 0 ? `
              <div class="x01-turn-score">
                <div class="turn-indicator">This turn: ${this.currentTurnScore}</div>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
    
    gameBoard.innerHTML = html;
  }
}

