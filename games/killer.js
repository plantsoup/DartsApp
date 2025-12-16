// ========== KILLER GAME ==========

import { BaseGame } from './base.js';

export class KillerGame extends BaseGame {
  constructor(players, options = {}) {
    super(players, 'Killer');
    
    // Game options with defaults
    this.startingLives = options.startingLives || 3;
    this.hitsToKiller = options.hitsToKiller || 1;
    const startAsKiller = options.startAsKiller || false;
    
    // Shuffle numbers for random assignment
    const availableNumbers = this.shuffleNumbers();
    
    this.players = players.map((p, i) => ({
      ...p,
      number: availableNumbers[i],
      lives: this.startingLives,
      isKiller: startAsKiller,
      hitsOnOwnNumber: startAsKiller ? this.hitsToKiller : 0,
      eliminated: false
    }));
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
    this.updateStatus('Killer - In Progress', `${this.getCurrentPlayer().name}'s turn`);
  }

  processThrow(segment) {
    if (this.gameOver) return;

    const currentPlayer = this.getCurrentPlayer();
    const hitNumber = segment.number;
    const multiplier = segment.multiplier || 1; // 1 = single, 2 = double, 3 = treble
    const eventText = document.getElementById('event-text');

    // Check if player hit their own number
    if (hitNumber === currentPlayer.number) {
      // If not a killer yet, work toward becoming killer
      if (!currentPlayer.isKiller) {
        currentPlayer.hitsOnOwnNumber += multiplier;
        
        if (currentPlayer.hitsOnOwnNumber >= this.hitsToKiller) {
          currentPlayer.isKiller = true;
          const hitType = multiplier === 2 ? 'double' : multiplier === 3 ? 'treble' : '';
          eventText.textContent = `${currentPlayer.name} hit ${hitType} ${hitNumber}! They are now a KILLER! 💀`;
        } else {
          const remaining = this.hitsToKiller - currentPlayer.hitsOnOwnNumber;
          const hitType = multiplier === 2 ? 'double' : multiplier === 3 ? 'treble' : '';
          eventText.textContent = `${currentPlayer.name} hit ${hitType} ${hitNumber}! ${remaining} more to become killer`;
        }
        
        this.render();
        return;
      } else {
        // Killer hit their own number - take lives off themselves
        currentPlayer.lives -= multiplier;
        const hitType = multiplier === 2 ? 'double' : multiplier === 3 ? 'treble' : '';
        eventText.textContent = `${currentPlayer.name} hit ${hitType} ${hitNumber} on themselves! `;
        
        if (currentPlayer.lives <= 0) {
          currentPlayer.eliminated = true;
          eventText.textContent += `${currentPlayer.name} is eliminated! 💀`;
        } else {
          eventText.textContent += `${currentPlayer.name} has ${currentPlayer.lives} life/lives left`;
        }

        this.checkWinner();
        this.render();
        return;
      }
    }

    // If player is a killer, check if they hit another player's number
    if (currentPlayer.isKiller) {
      const targetPlayer = this.players.find(p => 
        p.number === hitNumber && 
        !p.eliminated && 
        p.id !== currentPlayer.id
      );

      if (targetPlayer) {
        targetPlayer.lives -= multiplier;
        const hitType = multiplier === 2 ? 'double' : multiplier === 3 ? 'treble' : '';
        eventText.textContent = `${currentPlayer.name} hit ${hitType} ${hitNumber} on ${targetPlayer.name}! `;
        
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
      this.nextPlayerIndex();
      attempts++;
    } while (this.getCurrentPlayer().eliminated && attempts < this.players.length);

    if (attempts >= this.players.length) {
      this.gameOver = true;
      return;
    }

    this.updateStatus(null, `${this.getCurrentPlayer().name}'s turn`);
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
    super.showWinner('<p>Congratulations!</p>');
  }

  render() {
    const gameBoard = document.getElementById('game-board');
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

