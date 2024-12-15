class MemoryMatchGame {
  constructor() {
    this.level = 1; // Start at Level 1
    this.icons = [
      'redflag.png',
      'airhorn.png',
      'modHammer.png',
      'noEntry.png',
      'sword.png',
      'shield.png', // Level 2 icons
    ];
    this.cards = [];
    this.matchedPairs = 0;
    this.attemptsLeft = 3;
    this.firstCard = null;
    this.secondCard = null;
    this.locked = false;

    // DOM Elements
    this.gameBoard = document.querySelector('#gameBoard');
    this.attemptsLeftLabel = document.querySelector('#attemptsLeft');
    this.heroContainer = document.querySelector('#heroContainer');
    this.heroImage = document.querySelector('.hero-image');
    this.heroSpeechBubble = document.querySelector('.speech-bubble p');
    this.gameOverOverlay = document.querySelector('#gameOverOverlay');
    this.restartOverlayButton = document.querySelector('#restartButton');

    // Event Listeners
    this.restartOverlayButton.addEventListener('click', () => this.startGame());

    // Start the game
    this.startGame();
  }

  startGame() {
    this.resetGameState();
    this.level = 1; // Reset to Level 1 on game restart
    this.setHeroSize();
    this.heroSpeechBubble.innerText = 'Hurry! You must help save the subreddit by finding all the matching tools!';
    this.generateCards();
  }

  startLevel2() {
    this.resetGameState();
    this.level = 2; // Move to Level 2
    this.setHeroSize();
    this.heroSpeechBubble.innerText = 'Great job! Now match even more tools in Level 2!';
    this.generateCards();
  }

  resetGameState() {
    this.gameOverOverlay.style.display = 'none';
    this.gameBoard.innerHTML = '';
    this.cards = [];
    this.matchedPairs = 0;
    this.attemptsLeft = 3;
    this.firstCard = null;
    this.secondCard = null;
    this.locked = true; // Lock interactions during card reveal
    this.updateStats();

    // Set reveal duration based on the current level
    const revealDuration = this.level === 1 ? 3000 : 2000; // 3 seconds for Level 1, 2 seconds for Level 2

    // Reveal cards and then flip them back
    setTimeout(() => {
      this.flipAllCardsToBack();
      this.locked = false; // Unlock after reveal
    }, revealDuration);
  }

  updateStats() {
    this.attemptsLeftLabel.innerText = this.attemptsLeft;
  }

  setHeroSize() {
    if (this.level === 2) {
      this.heroContainer.style.padding = '0 40px'; // Reduce padding for Level 2
      this.heroImage.style.width = '100px'; // Smaller hero image
      this.heroSpeechBubble.style.fontSize = '14px'; // Smaller font size for speech bubble
    } else {
      this.heroContainer.style.padding = '0 80px'; // Default padding for Level 1
      this.heroImage.style.width = '130px'; // Default hero image size
      this.heroSpeechBubble.style.fontSize = '16px'; // Default font size for speech bubble
    }
  }

  generateCards() {
    const currentIcons = this.icons.slice(0, this.level === 1 ? 4 : 6);
    const cardIcons = [...currentIcons, ...currentIcons]; // Create pairs
    cardIcons.sort(() => Math.random() - 0.5); // Shuffle

    cardIcons.forEach((icon) => {
      const card = document.createElement('div');
      card.classList.add('card');
      if (this.level === 2) {
        card.classList.add('small-card'); // Smaller cards for Level 2
      }
      card.dataset.icon = icon;

      card.innerHTML = `
        <div class="card-front" style="background-image: url('images/back.png'); background-size: cover;">
          <img src="images/${icon}" alt="${icon}" class="card-image" />
        </div>
        <div class="card-back" style="background-image: url('images/back.png'); background-size: cover;"></div>
      `;

      card.addEventListener('click', () => this.flipCard(card));
      this.gameBoard.appendChild(card);
      this.cards.push(card);
    });
  }

  flipAllCardsToBack() {
    this.cards.forEach((card) => card.classList.add('flipped'));
  }

  flipCard(card) {
    if (this.locked || card.classList.contains('matched') || card === this.firstCard) return;

    card.classList.remove('flipped');

    if (!this.firstCard) {
      this.firstCard = card;
      return;
    }

    this.secondCard = card;
    this.checkMatch();
  }

  checkMatch() {
    this.locked = true;

    const firstIcon = this.firstCard.dataset.icon;
    const secondIcon = this.secondCard.dataset.icon;

    if (firstIcon === secondIcon) {
      this.firstCard.classList.add('matched');
      this.secondCard.classList.add('matched');
      this.matchedPairs++;
      this.resetTurn();

      if (this.matchedPairs === (this.level === 1 ? 4 : 6)) {
        this.level === 1 ? this.startLevel2() : this.handleGameCompletion();
      }
    } else {
      this.attemptsLeft--;
      this.updateStats();

      setTimeout(() => {
        this.firstCard.classList.add('flipped');
        this.secondCard.classList.add('flipped');
        this.resetTurn();
      }, 1000);

      if (this.attemptsLeft <= 0) {
        setTimeout(() => this.showGameOver(), 1000);
      }
    }
  }

  resetTurn() {
    this.firstCard = null;
    this.secondCard = null;
    this.locked = false;
  }

  handleGameCompletion() {
    this.heroSpeechBubble.innerText = 'Congratulations! You saved the subreddit!';
    this.gameOverOverlay.style.display = 'flex';
    document.querySelector('#gameOverMessage').innerText = 'Congratulations! You won!';
  }

  showGameOver() {
    this.gameOverOverlay.style.display = 'flex';
    this.heroSpeechBubble.innerText = 'Oh no! Try again to save the subreddit!';
  }
}

new MemoryMatchGame();
