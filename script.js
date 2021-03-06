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

class Game {
  constructor(board) {
    this.board = board;
    this.previouslyGuessedCard = null;
  }

  askForGuess() {
    // let keepAskingForGuess = true;
    // let guess;

    // while (keepAskingForGuess) {
    const guess = prompt('Enter a position, i.e. 1 2');
    if (!guess) {
      throw Error('crashed');
    }
    console.log(guess);
    // if (guess != null) keepAskingForGuess = false;
    // }

    return guess;
  }

  play() {
    while (!this.board.isGameWon()) {
      this.board.render();

      const guess = this.askForGuess();
      const [r, c] = guess.split(' ');
      const card = this.board.reveal(r, c);
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

const game = new Game(board);
game.play();
