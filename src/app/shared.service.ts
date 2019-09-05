import { Injectable } from '@angular/core';

import { Piece } from './piece';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  currentPokerId: string;
  computerTurn = false;
  playerPokers: Piece[] = [];
  computerPokers: Piece[] = [];
  captureMoves: string[] = [];
  kingCaptureMoves: string[] = [];
  playerPrefix = 'player';
  computerPrefix = 'computer';

  constructor() { }

  /**
   * Clears capture moves arrays
   */
  resetCaptureMoves() {
    this.captureMoves = [];
    this.kingCaptureMoves = [];
  }

  /**
   * Clears poker arrays
   */
  resetPokersArrays() {
    this.playerPokers.forEach((poker) => poker = undefined);
    this.computerPokers.forEach((poker) => poker = undefined);
    this.playerPokers = [];
    this.computerPokers = [];
  }

  /**
   * Initialise global variables and containers
   */
  resetGlobalVariables() {
    this.resetCaptureMoves();
    this.resetPokersArrays();
    this.currentPokerId = undefined;
    this.computerTurn = false;
  }

  /**
   * Toggles computerTurn flag.
   */
  isComputerTurn() {
    this.computerTurn = !this.computerTurn;
    return this.computerTurn;
  }

}

