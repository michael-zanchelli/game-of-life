"use strict";

/**
 * Conway's Game Of Life (cellular automata)
 * 
 * In a grid of cells, each cell checks its surrounding neighbors to see
 * whether its living area is underpopulated, overpopulated or suitable to
 * live in. Each cell has 8 neighbors (except for the ones at the edge of
 * the canvas).
 *  - A dead cell will come alive if exactly 3 neighbors are living
 *  - A living cell will stay alive if 2 or 3 neighbors are living
 *  - Cells with less than 2 alive neighbors will die of underpopulation;
 *    cells with 4 or more alive neighbours will die of overpopulation.
 *   Number of
 *    Alive    | Now:
 *   Neighbors | Alive  Dead
 *       0-1   |   D      D  : underpopulation
 *         2   |   A      D  : unchanged
 *         3   |   A      A  : stay alive/come alive
 *       4-8   |   D      D  : overpopulation
 */
class GameOfLife {
  #grid = [];

  /** Set grid size  */
  initGrid(numRows, numCols) {
    // console.log("initGrid: " + numRows + ", " + numCols);
    for (let row = 0; row < numRows; row++) {
      this.#grid[row] = [];
      for (let col = 0; col < numCols; col++) {
        this.#grid[row][col] = { isAlive: Math.random() > 0.5, nextAlive: true };
      }
    }
  }

  /** Reset to initial game setup - make a random set of cells "alive" */
  // reset() {
    // for (let row = 0; row < this.#grid.length; row++) {
      // for (let col = 0; col < this.#grid[row].length; col++) {
        // this.#grid[row][col] = { isAlive: Math.random() > 0.5, nextAlive: true };
      // }
    // }
  // }

  /** Return 1 if "alive" otherwise 0 so thst the number of alive cells may be counted */
  #isAlive(row, col) {
    if (row < 0 || row >= this.#grid.length || col < 0 || col >= this.#grid[0].length) {
      return 0;
    }
    return this.#grid[row][col].isAlive ? 1 : 0;
  }

  iterate() {
    // Loop over all cells
    for (let row = 0; row < this.#grid.length; row++) {
      for (let col = 0; col < this.#grid[row].length; col++) {
        // Count the surrounding population of cells        
        let numAlive =
          this.#isAlive(row - 1, col - 1)     /* below, left */
          + this.#isAlive(row, col - 1)       /* left */
          + this.#isAlive(row + 1, col - 1)   /* above, left */
          + this.#isAlive(row - 1, col)       /* below */
          + this.#isAlive(row + 1, col)       /* above */
          + this.#isAlive(row - 1, col + 1)   /* below, right */
          + this.#isAlive(row, col + 1)       /* right */
          + this.#isAlive(row + 1, col + 1);  /* above, right */

        if (numAlive == 2) {
          this.#grid[row][col].nextAlive = this.#grid[row][col].isAlive;  // No change
        } else if (numAlive == 3) {
          this.#grid[row][col].nextAlive = true; // Make alive
        } else {
          this.#grid[row][col].nextAlive = false; // Make dead
        }
      }
    }
    // Apply the new state to the cells
    for (let row in this.#grid) {
      for (let col in this.#grid[row]) {
        // console.log("(" + row + ", " + col + ") was:" + this.#grid[row][col].isAlive + " now:" + this.#grid[row][col].nextAlive);
        this.#grid[row][col].isAlive = this.#grid[row][col].nextAlive;
      }
    }
    return this.#grid;
  }

}