// ========== CRICKET GAME ==========

import { BaseGame } from './base.js';

export class CricketGame extends BaseGame {
  constructor(players) {
    super(players, 'Cricket');
    
    this.numbers = [20, 19, 18, 17, 16, 15, 25]; // 25 is bull
    
    this.players = players.map(p => ({
      ...p,
      marks: {20: 0, 19: 0, 18: 0, 17: 0, 16: 0, 15: 0, 25: 0},
      score: 0
    }));
  }

  start() {
    this.render();
    this.updateStatus('Cricket - In Progress', `${this.getCurrentPlayer().name}'s turn`);
  }

  processThrow(segment) {
    if (this.gameOver) return;

    const player = this.getCurrentPlayer();
    const number = segment.number;
    const marks = segment.multiplier;

    // Only count valid cricket numbers
    if (!this.numbers.includes(number)) {
      return;
    }

    player.marks[number] += marks;

    // If over 3 marks and all other players have < 3, add points
    if (player.marks[number] > 3) {
      const othersHaveOpen = this.players.some(p => 
        p.id !== player.id && p.marks[number] < 3
      );
      
      if (othersHaveOpen) {
        const extraMarks = marks;
        player.score += number * extraMarks;
      }
    }

    // Cap at reasonable value
    if (player.marks[number] > 6) player.marks[number] = 6;

    const eventText = document.getElementById('event-text');
    eventText.textContent = `${player.name} hit ${segment.name}!`;

    this.checkWinner();
    this.render();
  }

  nextPlayer() {
    if (this.gameOver) return;
    
    this.nextPlayerIndex();
    this.updateStatus(null, `${this.getCurrentPlayer().name}'s turn`);
    this.render();
  }

  checkWinner() {
    const activePlayers = this.players.filter(p => !p.eliminated);
    
    for (const player of activePlayers) {
      const allClosed = this.numbers.every(num => player.marks[num] >= 3);
      
      if (allClosed) {
        const highestScore = Math.max(...activePlayers.map(p => p.score));
        if (player.score >= highestScore) {
          this.gameOver = true;
          this.winner = player;
          this.showWinner();
          return;
        }
      }
    }
  }

  showWinner() {
    super.showWinner(`<p>Score: ${this.winner.score}</p>`);
  }

  render() {
    const gameBoard = document.getElementById('game-board');
    const html = `
      <div class="cricket-board">
        <div class="cricket-numbers">
          ${this.numbers.map(num => `
            <div class="cricket-number">${num === 25 ? 'Bull' : num}</div>
          `).join('')}
        </div>
        ${this.players.map((player, index) => `
          <div class="cricket-player ${index === this.currentPlayerIndex ? 'active' : ''}">
            <div class="cricket-player-header">
              <div class="cricket-player-name">${player.name}</div>
              <div class="cricket-player-score">${player.score}</div>
            </div>
            <div class="cricket-marks">
              ${this.numbers.map(num => {
                const marks = player.marks[num];
                let display = '';
                if (marks >= 3) display = 'X';
                else if (marks === 2) display = '⧸⧸';
                else if (marks === 1) display = '⧸';
                return `<div class="cricket-mark ${marks >= 3 ? 'closed' : ''}">${display}</div>`;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    gameBoard.innerHTML = html;
  }
}

