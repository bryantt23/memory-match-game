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

  populate(cards) {}
  render() {}
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
