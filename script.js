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
  constructor() {
    this.type = 'computer';
    this.memoryOfCards = [];
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
      for (let i = 0; i < this.memoryOfCards.length; i++) {
        for (let j = 0; j < this.memoryOfCards[0].length; j++) {
          const card = this.memoryOfCards[i][j];
          if (card === previousFaceValue) {
            console.log(`The computer selects the position: ${i} ${j}`);
            return `${i} ${j}`;
          }
        }
      }
      const pos = this.getRandomPosition(matchedCardsForComputer);
      console.log(`The computer selects the position: ${pos}`);
      return pos;
    }
  }

  getRandomPosition(matchedCardsForComputer) {
    let m = this.memoryOfCards.length,
      n = this.memoryOfCards[0].length;
    let r = randomNum(0, m - 1),
      c = randomNum(0, n - 1);
    let elem = matchedCardsForComputer[r][c];
    while (elem === true) {
      r = randomNum(0, m - 1);
      c = randomNum(0, n - 1);
      elem = matchedCardsForComputer[r][c];
    }
    return `${r} ${c}`;
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
        // return;
        continue;
      }

      if (!this.previouslyGuessedCard) {
        this.previouslyGuessedCard = card;
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

const cards = [1, 2, 3];
const board = new Board(cards);
// console.log(JSON.stringify(board));
// board.render();
const humanPlayer = new HumanPlayer();
const computerPlayer = new ComputerPlayer();
const game = new Game(board, computerPlayer);
game.play();
