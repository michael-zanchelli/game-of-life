
/**
 * Graphical "widget" for drawing Hilbert curves
 */

class GameOfLifeWidget {
  #gameOfLife; /** The handle to the Game Of Life class object */

  #canvasCtx; /** The canvas context used to draw the Hilbert curve */

  /** The GUI control that allows the user to set the size of the canvas */
  #sizeControl;

  /** The GUI control that allows the user to set the drawing speed */
  #speedControl;

  #clearButton; /** The Reset button */

  #startStopButton; /** The Start/Stop button */

  #timeOut; /** delay/timeout: the inverse of game speed */

  #isRunning; /** flag indicating that game is running */

  #stopRunning = false; /** async stop-the-game flag */

  #windowResized = false;

  /** window size to canvas size multiplier */
  static #CANVAS_SIZE_MAP = [
    0.3,  // 30% of window size
    0.6,  // 60% of window size
    0.9   // 90% of window size
  ];

  /** Values for delay/timeout when adjusting drawnig speed */
  static #SHORTEST_TIMEOUT = 100;
  static #LONGEST_TIMEOUT = 500;
  static #TIMEOUT_RANGE = GameOfLifeWidget.#LONGEST_TIMEOUT - GameOfLifeWidget.#SHORTEST_TIMEOUT;
  static #SPEED_RANGE = 2; // speed control max-min

  /** Contructor
   * Note: this is called after page DOM is full loaded
   */
  constructor() {
    this.#speedControl = document.querySelector("div#gameOfLifeWidget #speed");
    this.#sizeControl = document.querySelector("div#gameOfLifeWidget #size");
    this.#startStopButton = document.querySelector("div#gameOfLifeWidget #startButton");
    // this.#clearButton = document.querySelector("div#gameOfLifeWidget #clearButton");

    this.#sizeControl.onchange = () => this.sizeControlChangeHandler();
    // this.#clearButton.onclick = () => this.clearButtonClickHandler();
    this.#startStopButton.onclick = () => this.startStopButtonClickHandler();

    this.#gameOfLife = new GameOfLife();  // Create instance of GameOfLife class

    /* Get canvas context and initialize canvas size and associated grid size */
    this.#canvasCtx = document.querySelector("div#gameOfLifeWidget #canvas").getContext("2d");
    this.#setCanvasSize(this.#canvasCtx.canvas, this.#sizeControl);

    window.onresize = () => this.windowResizeHandler(); // Handle resize events
  }

  /** Set canvas size based on the window size and the value of the size
   * control (small, medium, large)
   */
  #setCanvasSize(canvas, sizeControl) {
    canvas.width = GameOfLifeWidget.#CANVAS_SIZE_MAP[sizeControl.value] * window.innerWidth;
    canvas.height = GameOfLifeWidget.#CANVAS_SIZE_MAP[sizeControl.value] * window.innerHeight;
  }

  #initGrid(canvas, gameOfLifeObj) {
    let numCols = Math.floor(canvas.width / Cell.size);
    let numRows = Math.floor(canvas.height / Cell.size);
    gameOfLifeObj.initGrid(numRows, numCols);

  }

  /** Map speed value to timeout/delay value (in msecs)
   *    Speed      |  Timeout
   *  0 (slowest)  |    longest delay
   *    ...        |       ...
   *  2 (fastest)  |    shortest delay
   */
  #mapSpeedToTimeout(speed) {
    return GameOfLifeWidget.#LONGEST_TIMEOUT -
      ((speed * GameOfLifeWidget.#TIMEOUT_RANGE) / GameOfLifeWidget.#SPEED_RANGE);
  }

  #afterStopRunning() {
    this.#startStopButton.innerHTML = "Start";
    this.#speedControl.disabled = false;
    this.#sizeControl.disabled = false;
    this.#isRunning = false;
    this.#stopRunning = false;
  }

  /** Draw the game */
  drawGameOfLife() {
    this.#canvasCtx.clearRect(0, 0, this.#canvasCtx.canvas.width, this.#canvasCtx.canvas.height);

    let grid = this.#gameOfLife.iterate();
    for (let row in grid) {
      for (let col in grid[row]) {
        // console.log("(" + row + ", " + col + "):" + grid[row][col].isAlive);
        Cell.draw(this.#canvasCtx, row, col, grid[row][col].isAlive);
      }
    }
    if (this.#stopRunning) {
      this.#afterStopRunning();
    } else {
      setTimeout(() => this.drawGameOfLife(), this.#timeOut);
    }
  }

  /** Handle Reset button click */
  clearButtonClickHandler() {
  }

  /** Handle Start/Stop button click */
  startStopButtonClickHandler() {
    if (this.#startStopButton.innerHTML === "Start") {
      this.#startStopButton.innerHTML = "Stop";
      this.#speedControl.disabled = true;
      this.#sizeControl.disabled = true;

      if (this.#windowResized) {
        this.#setCanvasSize(this.#canvasCtx.canvas, this.#sizeControl);
        this.#windowResized = false;
      }
      this.#initGrid(this.#canvasCtx.canvas, this.#gameOfLife);

      this.#timeOut = this.#mapSpeedToTimeout(this.#speedControl.value);
      this.#isRunning = true;
      // Note async: returns right away
      setTimeout(() => this.drawGameOfLife(), this.#timeOut);

    } else {
      this.#stopRunning = true; // handle actually stopping in async draw() func
    }
  }

  sizeControlChangeHandler() {
    this.#setCanvasSize(this.#canvasCtx.canvas, this.#sizeControl,);
  }

  windowResizeHandler() {
    if (this.#isRunning) {
      this.#windowResized = true;
    } else {
      this.#setCanvasSize(this.#canvasCtx.canvas, this.#sizeControl);
    }
  }

}

/** Cell class to encapsulate (especially) drawing */
class Cell {
  static size = 12;
  static draw(canvasCtx, row, col, isAlive) {
    canvasCtx.fillStyle = isAlive ? "steelblue" : "white";
    canvasCtx.fillRect(col * Cell.size, row * Cell.size, Cell.size, Cell.size);
  }
}

/* When page DOM is fully loaded, create an instance of the Game class */
window.onload = () => {
  let gameOfLifeWidget = new GameOfLifeWidget();
}