function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function isSamePosition(i, ii, j, jj) {
  return i === ii && j === jj;
}

class Card {
  constructor(faceValue) {
    this.faceValue = faceValue;
    this.isFaceup = false;
    this.isMatched = false;
  }

  hide() {
    this.isFaceup = false;
  }

  reveal() {
    this.isFaceup = true;
  }

  removeFromGame() {
    this.isMatched = true;
    this.faceValue = 'X';
  }
}

class Board {
  constructor(cards) {
    this.grid = this.populate(cards);
    this.finishedPositions = [];
  }

  populate(cards) {
    let cardsArray = [...cards, ...cards];
    shuffle(cardsArray);
    console.log(cardsArray);
    cardsArray = cardsArray.map(num => new Card(num));

    let grid = [
      cardsArray.slice(0, cards.length),
      cardsArray.slice(cards.length)
    ];
    return grid;
  }

  render() {
    // console.log(this.grid);
    for (let i = 0; i < this.grid.length; i++) {
      let row = '';
      for (let j = 0; j < this.grid[0].length; j++) {
        const card = this.grid[i][j];
        const value = card.isFaceup ? card.faceValue : '_';
        row += value + ' ';
      }
      console.log(row);
    }
  }

  renderForComputer() {
    let gridForComputer = [];
    for (let i = 0; i < this.grid.length; i++) {
      let row = [];
      for (let j = 0; j < this.grid[0].length; j++) {
        row.push('_');
      }
      gridForComputer.push(row);
    }
    return gridForComputer;
  }

  matchedCardsForComputer() {
    let matched = [];
    for (let i = 0; i < this.grid.length; i++) {
      let row = [];
      for (let j = 0; j < this.grid[0].length; j++) {
        const card = this.grid[i][j];
        if (!card.isMatched) {
          row.push(false);
        } else {
          row.push(true);
        }
      }
      matched.push(row);
    }
    return matched;
  }

  isGameWon() {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[0].length; j++) {
        const card = this.grid[i][j];
        if (!card.isMatched) return false;
      }
    }
    return true;
  }

  reveal(r, c) {
    if (!this.grid[r][c].isFaceup) {
      this.grid[r][c].isFaceup = true;
      return this.grid[r][c];
    }
    return null;
  }
}

class HumanPlayer {
  constructor() {
    this.type = 'human';
  }

  askForGuess() {
    const guess = prompt('Enter a position, i.e. 1 2');
    if (!guess) {
      throw Error('crashed');
    }
    // console.log(guess);
    return guess;
  }
}

class ComputerPlayer {
  totalCards;
  constructor() {
    this.type = 'computer';
    this.memoryOfCards = [];
    this.revealedCardsCount = 0;
  }

  askForGuess(previousGuess, matchedCardsForComputer) {
    // console.log(previousGuess, matchedCardsForComputer);

    // console.log('this.memoryOfCards', JSON.stringify(this.memoryOfCards));

    // console.log('The computer will enter a position, i.e. 1 2');
    if (!previousGuess) {
      const pos = this.getRandomPosition(matchedCardsForComputer);
      console.log(`The computer selects the position: ${pos}`);
      return pos;
    } else {
      const previousFaceValue = previousGuess.faceValue;

      // console.log(JSON.stringify(this.memoryOfCards));

      for (let i = 0; i < this.memoryOfCards.length; i++) {
        for (let j = 0; j < this.memoryOfCards[0].length; j++) {
          const card = this.memoryOfCards[i][j];
          // console.log(card, previousFaceValue);
          if (
            card === previousFaceValue &&
            !isSamePosition(previousGuess.r, i, previousGuess.c, j)
          ) {
            console.log(
              `From memory, The computer selects the position: ${i} ${j}`
            );
            return `${i} ${j}`;
          }
        }
      }
      const pos = this.getRandomPosition(
        matchedCardsForComputer,
        previousGuess.r,
        previousGuess.c
      );
      // console.log(previousGuess);
      console.log(`The computer selects the position: ${pos}`);
      return pos;
    }
  }

  getRandomPosition(matchedCardsForComputer, prevR = -1, prevC = -1) {
    let m = this.memoryOfCards.length,
      n = this.memoryOfCards[0].length;
    let r = randomNum(0, m - 1),
      c = randomNum(0, n - 1);

    let elem = this.memoryOfCards[r][c];

    console.log(JSON.stringify(matchedCardsForComputer));
    console.log('computer memory of cards', JSON.stringify(this.memoryOfCards));

    //look for _
    if (this.revealedCardsCount < this.totalCards) {
      while (elem !== '_') {
        r = randomNum(0, m - 1);
        c = randomNum(0, n - 1);
        elem = this.memoryOfCards[r][c];
      }
      this.revealedCardsCount++;
    } else {
      //grab anything
      while (
        matchedCardsForComputer[r][c] &&
        isSamePosition(prevR, r, prevC, c)
      ) {
        r = randomNum(0, m - 1);
        c = randomNum(0, n - 1);
      }
    }

    return `${r} ${c}`;
  }

  receiveRevealedCard(r, c, card) {
    // console.log(r, c, card);
    this.memoryOfCards[r][c] = Number(card.faceValue);
    // console.log(this);
  }
}

class Game {
  constructor(board, player) {
    this.board = board;
    this.previouslyGuessedCard = null;
    this.player = player;
  }

  play() {
    if (this.player.type === 'computer') {
      let memoryGrid = this.board.renderForComputer();
      this.player.memoryOfCards = memoryGrid;
      this.player.totalCards = memoryGrid.length * memoryGrid[0].length;
    }

    this.board.render();
    while (!this.board.isGameWon()) {
      // console.log(JSON.stringify(this.player));
      const guess = this.player.askForGuess(
        this.previouslyGuessedCard,
        this.board.matchedCardsForComputer()
      );
      // console.log(JSON.stringify(this.player));
      // debugger;

      const [r, c] = guess.split(' ');
      const card = this.board.reveal(r, c);

      this.board.render();
      if (!card) {
        continue;
      }

      if (this.player.type === 'computer') {
        this.player.receiveRevealedCard(r, c, card);
      }

      if (!this.previouslyGuessedCard) {
        this.previouslyGuessedCard = card;
        this.previouslyGuessedCard.r = Number(r);
        this.previouslyGuessedCard.c = Number(c);
      } else {
        if (this.previouslyGuessedCard.faceValue === card.faceValue) {
          console.log("It's a match!");
          this.previouslyGuessedCard.removeFromGame();
          card.removeFromGame();
        } else {
          console.log('Not a match!');
          card.hide();
          this.previouslyGuessedCard.hide();
        }
        this.previouslyGuessedCard = null;
      }
      this.board.isGameWon();
    }
    console.log('You win!');
  }
}

// https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const cards = [1, 2, 3, 4, 5, 6];
const board = new Board(cards);
// console.log(JSON.stringify(board));
// board.render();
const humanPlayer = new HumanPlayer();
const computerPlayer = new ComputerPlayer();
const game = new Game(board, computerPlayer);
game.play();
