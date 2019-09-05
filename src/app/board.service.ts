import { Injectable } from '@angular/core';

import { Player } from './player';
import { SharedService } from './shared.service';
import { MovesAnalyserService } from './moves-analyser.service';
import { ComputerMoveService } from './computer-move.service';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  computerInitialCells: string[] = [];
  playerInitialCells: string[] = [];
  defaultBackground = 'black';
  computerPiece = 'radial-gradient(red 40%, black 20%)';
  playerPiece = 'radial-gradient(blue 40%, black 20%)';
  computerKing = 'radial-gradient(black 40%, red 20%)';
  playerKing = 'radial-gradient(black 40%, blue 20%)';
  boxes: any[] = [];
  board: any[];
  player: Player;
  fragement = document.createDocumentFragment();
  constructor(
    public movesAnalyser: MovesAnalyserService, public shared: SharedService) {
    this.board = this.createBoard();
  }

  /**
   * Creates a playing board off the DOM.
   *
   * It also places the visual positioning of player and computer pieces. At this point
   * the real piece objects haven't been created as yet.
   */
  createBoard() {
    for (let row = 0; row < 8; row++) {
      this.boxes[row] = [];
      const tr = document.createElement('tr');
      for (let col = 0; col < 8; col++) {
        const td = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.setAttribute('class', `${row}-${col}`);
        td.appendChild(checkbox);
        tr.appendChild(td);
        this.boxes[row][col] = checkbox;
        if (row % 2 === 0 && col % 2 === 0 || row % 2 !== 0 && col % 2 !== 0) {
          this.boxes[row][col].style.background = 'white';
          this.boxes[row][col].disabled = true;
        } else {
          if (row < 3) {
            this.computerInitialCells.push(`${row}${col}`);
            this.boxes[row][col].style.background = this.computerPiece;
          } else if (row > 4) {
            this.playerInitialCells.push(`${row}${col}`);
            this.boxes[row][col].style.background = this.playerPiece;
          } else {
            this.boxes[row][col].style.background = this.defaultBackground;
          }
        }
      }
      this.fragement.appendChild(tr);
    }
    return this.boxes;
  }

  disableAllCells() {
    for (const row of this.board) {
      for (const cell of row) {
        cell.disabled = true;
      }
    }
  }

  uncheckAllCells() {
    for (const row of this.board) {
      for (const cell of row) {
        if (cell.disabled === false) {
          cell.checked = false;
        }
      }
    }
  }

  uncheckOtherCells() {
    for (const row of this.board) {
      for (const cell of row) {
        if (cell.disabled === false && cell.id !== this.shared.currentPokerId) {
         // Deselect all other cells except the recently clicked
         cell.checked = false;
        }
      }
    }
  }

  cleanBoard() {
    for (const row of this.board) {
      for (const cell of row) {
        if (cell.hasAttribute('id')) {
          cell.removeAttribute('id');
          cell.style.background = this.defaultBackground;
        }
      }
    }
  }


  /**
   * Unpacks a capture move string into its basic components.
   *
   * Capture move string to be unpacked is in the form:
   *
   * 'initRow. initCol:#capRow1. capCol1#capRow2. capCol2xVictimID'
   */
captureMoveUnpacker(captureMoveString: string) {
      let victimCoordPure: number[];
      let victimCoordRaw: string;
      let done = false;
      const finalCoordsPure = [];
      const [initPosition, xString] = captureMoveString.split(':'); // ['initRow. initCol', '#capRow1. capCol1#capRow2. capCol2xVictimID']
      const [xMovesString, xId] = xString.split('x'); // ['#capRow1. capCol1#capRow2. capCol2', 'VictimID']
      const [, ...xMoves] = xMovesString.split('#'); // ['', ['capRow1. capCol1', 'capRow2. capCol2']]
      const [rowInit, colInit] = initPosition.split('. ');


      for (let row = 0; row < this.board.length; row++) {
        for (let col = 0; col < this.board[row].length; col++) {
          if (this.board[row][col].id === xId) {
            victimCoordPure = [+row, +col];
            victimCoordRaw = `${row}. ${col}`;
            done = true;
            break;
          }
        }
        if (done) { break; }
      }

      xMoves.forEach((xMove) => {
        const [rowFinal, colFinal] = xMove.split('. ');
        finalCoordsPure.push([+rowFinal, +colFinal]);
      });

      return {
        initCoordinates: [+rowInit, +colInit],
        finalCoordsRaw: xMoves,
        finalCoordsPure,
        victimCoordPure,
        victimCoordRaw,
        victimId: xId
      };
  }

  /**
   * Unpacks a normal move string into its basic components.
   *
   * String to be unpacked is in the form:
   *
   * 'initRow. initCol:finRow1. finCol1,finRow2. finCol2'
   */
  normalMoveUnpacker(normalMoveString: string) {
    const finalCoordsPure = [];
    const [initPosition, finalPosStr] = normalMoveString.split(':'); // ['initRow. initCol', 'finRow1. finCol1,finRow2. finCol2']
    const [rowInit, colInit] = initPosition.split('. '); // ['initRow', 'initCol']
    const finalPositions = finalPosStr.split(','); // ['finRow1. finCol1', 'finRow2. finCol2']

    finalPositions.forEach((move) => {
      const [rowFinal, colFinal] = move.split('. '); // ['finRow', 'finCol']
      finalCoordsPure.push([+rowFinal, +colFinal]);
    });

    return {
      initCoordinates: [+rowInit, +colInit],
      initCoordsRaw: initPosition,
      finalCoordsRaw: finalPositions,
      finalCoordsPure
    };
  }

}
