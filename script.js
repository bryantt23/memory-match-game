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
  }

  hide() {
    this.isFaceup = false;
  }

  reveal() {
    this.isFaceup = true;
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

    let grid = [cardsArray.slice(0, 3), cardsArray.slice(cards.length)];
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

  isGameWon() {}

  reveal(r, c) {
    if (!this.grid[r][c].isFaceup) {
      this.grid[r][c].isFaceup = true;
      return this.grid[r][c].faceValue;
    }
    return null;
  }
}

class Game {
  constructor(board) {
    this.board = board;
    this.previouslyGuessedPosition = null;
  }

  askForGuess() {
    const guess = prompt('Enter a position, i.e. 1 2');
    if (!guess) {
      throw Error('crashed');
    }
    return guess;
  }

  play() {
    this.board.render();
    const guess = this.askForGuess();
    const [r, c] = guess.split(' ');
    this.board.reveal(r, c);
    this.board.render();

    /*
You may want a play loop that runs until the game is over. Inside the loop, you should render the board, prompt the player for input, and get a guessed pos. Pass this pos to a make_guess method, where you will handle the actual memory/matching logic. Some tips on implementing this:
    */
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
