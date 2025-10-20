// ========== SNAKES AND LADDERS GAME ==========

import { BaseGame, PLAYER_COLORS } from './base.js';

export class SnakesAndLaddersGame extends BaseGame {
  constructor(players) {
    super(players, 'Snakes & Ladders');
    
    this.boardSize = 100;
    this.players = players.map((p, i) => ({
      ...p,
      position: 0,
      color: PLAYER_COLORS[i % PLAYER_COLORS.length],
      totalScore: 0,
      darts: 0
    }));
    
    // Define snakes (from -> to)
    this.snakes = {
      98: 28, 95: 24, 92: 51, 83: 19, 73: 1, 69: 33, 64: 36, 
      62: 18, 54: 31, 48: 9, 37: 3, 17: 7
    };
    
    // Define ladders (from -> to)
    this.ladders = {
      4: 25, 13: 46, 20: 70, 27: 84, 33: 49, 40: 77, 
      50: 91, 62: 96, 71: 89, 79: 81
    };
  }

  start() {
    this.render();
    this.updateStatus('Snakes & Ladders - In Progress', `${this.getCurrentPlayer().name}'s turn`);
  }

  processThrow(segment) {
    if (this.gameOver) return;

    const player = this.getCurrentPlayer();
    const score = segment.number * segment.multiplier;
    const oldPosition = player.position;
    
    player.totalScore += score;
    player.darts++;
    
    // Move player forward
    player.position = Math.min(player.position + score, this.boardSize);
    
    const eventText = document.getElementById('event-text');
    let message = `${player.name} scored ${score}! Moved to space ${player.position}`;
    
    // Check for snake
    if (this.snakes[player.position]) {
      const snakeEnd = this.snakes[player.position];
      message += ` 🐍 Snake! Slid down to ${snakeEnd}`;
      player.position = snakeEnd;
    }
    // Check for ladder
    else if (this.ladders[player.position]) {
      const ladderEnd = this.ladders[player.position];
      message += ` 🪜 Ladder! Climbed up to ${ladderEnd}`;
      player.position = ladderEnd;
    }
    
    eventText.textContent = message;
    
    // Check for win
    if (player.position >= this.boardSize) {
      this.gameOver = true;
      this.winner = player;
      this.showWinner();
    }
    
    this.render();
  }

  nextPlayer() {
    if (this.gameOver) return;
    
    this.nextPlayerIndex();
    const nextPlayer = this.getCurrentPlayer();
    this.updateStatus(null, `${nextPlayer.name}'s turn - Position: ${nextPlayer.position}`);
    this.render();
  }

  showWinner() {
    super.showWinner(`
      <p>Reached space 100 in ${this.winner.darts} darts!</p>
      <p>Total Score: ${this.winner.totalScore}</p>
    `);
  }

  render() {
    const gameBoard = document.getElementById('game-board');
    
    // Create board grid (10x10)
    let boardHTML = '<div class="snakes-board">';
    
    // Build board from 100 to 1 (snake pattern: right-to-left on even rows)
    for (let row = 9; row >= 0; row--) {
      boardHTML += '<div class="snakes-row">';
      
      const isEvenRow = row % 2 === 0;
      const start = row * 10 + 1;
      const end = start + 9;
      
      if (isEvenRow) {
        // Left to right
        for (let space = start; space <= end; space++) {
          boardHTML += this.renderSpace(space);
        }
      } else {
        // Right to left
        for (let space = end; space >= start; space--) {
          boardHTML += this.renderSpace(space);
        }
      }
      
      boardHTML += '</div>';
    }
    
    boardHTML += '</div>';
    
    // Add player info panel
    boardHTML += '<div class="snakes-players">';
    this.players.forEach((player, index) => {
      boardHTML += `
        <div class="snakes-player-info ${index === this.currentPlayerIndex ? 'active' : ''}">
          <div class="snakes-player-dot" style="background: ${player.color};"></div>
          <div class="snakes-player-details">
            <div class="snakes-player-name">${player.name}</div>
            <div class="snakes-player-pos">Space: ${player.position}</div>
          </div>
        </div>
      `;
    });
    boardHTML += '</div>';
    
    gameBoard.innerHTML = boardHTML;
  }

  renderSpace(spaceNum) {
    const isSnake = this.snakes[spaceNum];
    const isLadder = this.ladders[spaceNum];
    
    // Get players on this space
    const playersHere = this.players.filter(p => p.position === spaceNum);
    
    let spaceClass = 'snakes-space';
    if (isSnake) spaceClass += ' snake-space';
    if (isLadder) spaceClass += ' ladder-space';
    if (spaceNum === this.boardSize) spaceClass += ' finish-space';
    if (spaceNum === 0) spaceClass += ' start-space';
    
    let spaceContent = `<div class="space-number">${spaceNum}</div>`;
    
    // Add snake/ladder indicator
    if (isSnake) {
      spaceContent += `<div class="space-icon">🐍<br>→${this.snakes[spaceNum]}</div>`;
    } else if (isLadder) {
      spaceContent += `<div class="space-icon">🪜<br>→${this.ladders[spaceNum]}</div>`;
    }
    
    // Add players
    if (playersHere.length > 0) {
      spaceContent += '<div class="space-players">';
      playersHere.forEach(player => {
        spaceContent += `<div class="player-marker" style="background: ${player.color};" title="${player.name}"></div>`;
      });
      spaceContent += '</div>';
    }
    
    return `<div class="${spaceClass}">${spaceContent}</div>`;
  }
}

