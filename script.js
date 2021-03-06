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
  }

  populate(cards) {
    let cardsArray = [...cards, ...cards].map(num => new Card(num));
    shuffle(cardsArray);
    let grid = [cardsArray.slice(0, 3), cardsArray.slice(cards.length)];

    console.log(JSON.stringify(grid));

    return grid;
  }

  render() {
    console.log(this.grid);
    for (let i = 0; i < this.grid.length; i++) {
      let row = '';
      for (let j = 0; j < this.grid[0].length; j++) {
        row += this.grid[i][j] + ' ';
      }
      console.log(row);
    }
  }
  isGameWon() {}
  reveal() {}
}

class Game {
  constructor(board) {
    this.board = board;
    this.previouslyGuessedPosition = null;
  }

  play() {
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
console.log(JSON.stringify(board));

board.render();
