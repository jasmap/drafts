import { Injectable } from '@angular/core';

import { SharedService } from './shared.service';
import { MovesAnalyserService } from './moves-analyser.service';
import { BoardService } from './board.service';
import { AttackService } from './attack.service';

@Injectable({
  providedIn: 'root'
})
export class ComputerMoveService {
  attackMoves: string[] = [];

  /**
   * Contains the piece that is preferred to be moved at a particular moment.
   *
   * Usually this comes about because of orchestrated moves that must follow
   * a preplanned attacking sequence
   */
  preferredResponse: string;

  /**
   * Primarily contains all the legal moves a player has. For the computer, this can
   * also contain filtered moves which are less than all the legal moves.
   */
  legalMovesBank: string[];

  /**
   * Contains possible defensive moves gleaned from the available moves array
   */
  evasiveMoves: string[] = [];

  constructor(private shared: SharedService,
              private movesAnalyser: MovesAnalyserService,
              private boardService: BoardService,
              private attack: AttackService) { }

  /**
   * Computer selects and moves an appropriate piece.
   */
  computerMove() {
    let safeMoves: boolean;
    this.attackMoves = [];
    this.legalMovesBank = [];
    const currentThreats = this.threats();
    /**
     * Contains indices of possible defensive moves inside the available moves array.
     */
    const priorityMoves: number[] = [];

    /**
     * Assembles a move from it's raw coordinates
     */
    const moveAssembler = (initRaw: any, finalRaw: any) => {
        return `${initRaw}:${finalRaw}`;
    };

    /**
     * Handles a capture prone move
     *
     * Does all the analysis of a move that results in an immediate direct capture,
     * including checking for baiting opportunites, tagging a baiting move
     * that will have multiple follow-up moves and filtering the available moves
     * array to reflect only beneficial moves. It returns a mutated move string and moves array if
     * the current final coordinates will result in a direct capture of that piece
     * or friendly pieces, otherwise it just spits the move and moves array as is.
     *
     * @param iRow - initial piece row coordinate
     * @param iCol - initial piece column coordinate
     * @param board - array[8][8], representing the playing board
     * @param opponentPrefix - opponent name
     * @param fRow - final piece row coordinate
     * @param fCol - final piece column coordinate
     * @param move - the complete raw move under scrutiny
     */
    const captureProneMoveHandler = (iRow: number, iCol: number, board: any[],
                                     opponentPrefix: string, fRow: number, fCol: number,
                                     move: string, moves: string[]) => {
      const isCaptureProne = this.movesAnalyser.captureRisk(iRow, iCol, board,
      opponentPrefix, fRow, fCol);
      if (isCaptureProne) {
        let numberOfAlternativeMoves: number;
        let index: number;
        const iCoordRaw = `${iRow}. ${iCol}`;
        const fCoordRaw = `${fRow}. ${fCol}`;
        safeMoves = true;

        // Check if this capture prone move can act as a baiting attack move instead
        if (this.attack.frontalBait(fRow, fCol, this.boardService.board,
                                    opponentPrefix, iRow, iCol)) {
          let prunedMove: string;
          if (this.attack.multiResponsesTag) {
            // Mark this baiting move as having multiple responses
            prunedMove = `${iCoordRaw}:${fCoordRaw}${this.attack.multiResponsesTag}`;
          } else {
            prunedMove = `${iCoordRaw}:${fCoordRaw}`;
          }
          this.attackMoves.push(prunedMove);
        }

        // Deduce the number of possible moves the identified capture prone piece can move
        for (const mv of this.legalMovesBank) {
          if (mv.startsWith(iCoordRaw + ':')) {
            const nMvUnpk = this.boardService.normalMoveUnpacker(mv);
            index = moves.indexOf(mv);
            numberOfAlternativeMoves = nMvUnpk.finalCoordsRaw.length;
            break;
          }
        }

        if (numberOfAlternativeMoves === 1) {
          // Just remove the whole move from the moves bank
          const x = moves.splice(index, 1);
        } else {
          // The piece has more than one alternative moves
          if (move.endsWith(fCoordRaw)) {
            // Remove this alternative final coordinates string together with its preceeding comma
            move = move.replace(',' + fCoordRaw, '');
            const x = moves.splice(index, 1, move);
          } else {
            // Remove this alternative final coordinates string together with its trailing comma
            move = move.replace(fCoordRaw + ',', '');
            const x = moves.splice(index, 1, move);
          }
        }
      }
      if (iRow === 6 && iCol === 5) {
        console.log('65 moves = ' + moves);
      }
      return {
        move,
        moves
      };
    };

    /**
     * Tries to save a friendly piece which is under fire, either by moving or
     * protecting the endangered piece.
     *
     * @param threatsBank - an array of enemy moves, that are capable of capturing friendly pieces
     * @param availableMoves - an array of legal moves at the disposal of friendly pieces
     */
    const directCaptureAvoidance = (threatsBank: string[], availableMoves: string[]) => {
      let threatenedPieceCoord: string;
      let landingCoordsAfterCapture: string[];
      for (const threat of threatsBank) {
        const cMoveUnpacker = this.boardService.captureMoveUnpacker(threat);
        threatenedPieceCoord = cMoveUnpacker.victimCoordRaw;
        console.log('threatenedPieceCoord = ' + threatenedPieceCoord);
        landingCoordsAfterCapture = cMoveUnpacker.finalCoordsRaw;
        console.log('availableMoves = ' + availableMoves);
        console.log('availableMoves.length = ' + availableMoves.length);
        for (const move of availableMoves) {
          for (const landingSpot of landingCoordsAfterCapture) {
            if (move.includes(landingSpot) && !move.includes(threatenedPieceCoord) && !move.includes('x')) {
              if (availableMoves.indexOf(move) !== -1) {
                // This move could protect the endangered piece by blocking the landing cell of
                // the capturing piece.
                priorityMoves.push(availableMoves.indexOf(move));
                // Replaces the move with a more direct one
                availableMoves.splice(availableMoves.indexOf(move), 1,
                  moveAssembler(this.boardService.normalMoveUnpacker(move).initCoordsRaw, landingSpot));
              }
            }
          }
          if (move.includes(threatenedPieceCoord)) {
            if (availableMoves.indexOf(move) !== -1) {
              // The piece is under fire but can move
              priorityMoves.push(availableMoves.indexOf(move));
            }
          }
        }
      }
    };

    /**
     * Launches a baiting attack if present
     */
    const launchBaitingAttack = () => {
      if (this.attackMoves.length > 0) {
        this.monkeyStyle(this.attackMoves);
        return true;
      }
      return false;
    };

    /**
     * Disects a move and decides what to do depending on the findings
     *
     * @param moves - moves to be disected
     * @param movesCopy - copy of moves
     */
    const moveDisector = (moves: string[], movesCopy: string[]) => {
      safeMoves = false;
      // Iterating over each move string, comprising of piece initial coords
      // with all possible final coords concatenated to it
      movesCopy.forEach((lMove) => {
        const nMoveUnpacker = this.boardService.normalMoveUnpacker(lMove);
        const [initRow, initCol] = nMoveUnpacker.initCoordinates;

        // Iterating over the concatenated final coords for each piece
        nMoveUnpacker.finalCoordsPure.forEach((fCoord) => {
          let dict: { move: string; moves: string[]; };
          const [finalRow, finalCol] = fCoord;
          dict = captureProneMoveHandler(initRow, initCol, this.boardService.board,
                                        this.shared.playerPrefix, finalRow, finalCol,
                                        lMove, moves);
          lMove = dict.move;
          moves = dict.moves;
        });
      });
      return { moves };
    };

    this.legalMovesCompilation(this.shared.computerPokers, this.legalMovesBank);

    if (this.legalMovesBank.length > 0) {
      if (this.shared.captureMoves.length > 0) {

        if (this.preferredResponse) {
          for (const move of this.shared.captureMoves) {
            if (move.includes(this.preferredResponse)) {
              this.forceCapture(this.shared.captureMoves.indexOf(move));
              this.preferredResponse = undefined;
              return;
            }
          }
        } else {

          directCaptureAvoidance(currentThreats, this.shared.captureMoves);
          if (priorityMoves.length > 0) {
              // Counter the intended capture by capturing the threatening piece.
              this.forceCapture(priorityMoves[Math.floor(Math.random() * priorityMoves.length)]);
          } else {
              // No threatening piece that can be captured; capture any piece.
              this.forceCapture(Math.floor(Math.random() * this.shared.captureMoves.length));
          }
        }

      } else {
        directCaptureAvoidance(currentThreats, this.legalMovesBank);
        if (priorityMoves.length > 0) {

          this.evasiveMoves = [];

          priorityMoves.forEach((num) => {
              this.evasiveMoves.push(this.legalMovesBank[num]);
          });

          const evasiveMovesCopy = this.evasiveMoves.slice(0);

          moveDisector(this.evasiveMoves, evasiveMovesCopy);

          if (launchBaitingAttack()) {
            return;
          }

          if (this.evasiveMoves.length > 0) {
            this.monkeyStyle(this.evasiveMoves);
          } else {
            // All attempted evasive moves will result in a capture, so just play any evasive move
            this.monkeyStyle(evasiveMovesCopy);
          }

        } else {
          const legalMovesCopy = this.legalMovesBank.slice(0);

          moveDisector(this.legalMovesBank, legalMovesCopy);

          if (launchBaitingAttack()) {
            return;
          }

          if (safeMoves) {
            if (this.legalMovesBank.length > 0) {
              // Capture prone moves have been filtered out
              this.monkeyStyle(this.legalMovesBank);
            } else {
              // All attempted moves will result in a capture, so just play any move
              this.monkeyStyle(legalMovesCopy);
            }
          } else {
            this.monkeyStyle(legalMovesCopy);
          }
          safeMoves = false;
        }
      }
    } else {
      alert('You did it! Next time I won\'t be easy on you.');
      this.boardService.disableAllCells();
    }
  }

  /**
   * Checks if player has any legal moves left.
   *
   * Ends the game if it is the players turn and the player does not have any legal moves left
   */
  playerHealthAnalysis() {
    const playerMoves = [];
    // Gather all player legal moves for the present turn
    this.legalMovesCompilation(this.shared.playerPokers, playerMoves);

    if (playerMoves.length === 0) {
      if (!this.shared.computerTurn) {
        alert('Sorry, you didn\'t make it this time!');
        this.boardService.disableAllCells();
      }
    }
  }

  /**
   * Does a rough compilation of legal moves for a player with the current turn.
   *
   * Its main purpose is to indirectly populate the captureMoves array. It also
   * prefixes all the moves with the coordinates of the piece making the move for identification
   * purposes. The status of captureMoves array is used by various functions and
   * methods to make decisions.
   */
  legalMovesCompilation(pokers: any[], movesPool: string[]) {
    for (const poker of pokers) {
      const lm = poker.legalMoves();
      if (lm.length > 0) {
        const [row, col] = poker.currentPosition();
        movesPool.push(`${row}. ${col}:${lm}`);
      }
    }
  }

  /**
   * Scans for and outputs an array of threats.
   */
  threats() {
    this.playerHealthAnalysis();
    const threats = this.shared.captureMoves.splice(0);
    this.shared.resetCaptureMoves();
    return threats;
  }

  /**
   * Forces a particular capture move to be played if captureMoves array is populated.
   *
   * @param index - the index of the move to be played in the captureMoves array
   */
  forceCapture(index: number) {
    console.log('index = ' + index);
    const capString = this.boardService.captureMoveUnpacker(this.shared.captureMoves[index]);
    const [rowInit, colInit] = capString.initCoordinates;
    const [rowFinal, colFinal] = capString.finalCoordsPure[
        Math.floor(Math.random() * capString.finalCoordsPure.length)];
    this.boardService.board[+rowInit][+colInit].click();
    this.boardService.board[+rowFinal][+colFinal].click();
  }

  /**
   * Randomly selects and plays a move given an array of available moves.
   */
  monkeyStyle(movesPool: string[]) {
    let direction: string;
    let needSpecificResponse = false;
    let tag = '';

    /**
     * Removes the multi-reponse tag from a move
     */
    const moveSanitiser = (move: string) => {
      if (move.includes(this.attack.multiResponsePrefix)) {
        tag += this.attack.multiResponsePrefix;
        move = move.replace(this.attack.multiResponsePrefix, '');
        if (move.includes(this.attack.parallelMove)) {
          direction = this.attack.parallelMove;
          tag += this.attack.parallelMove;
          move = move.replace(this.attack.parallelMove, '');
        } else if (move.includes(this.attack.crossMove)) {
          direction = this.attack.crossMove;
          tag += this.attack.crossMove;
          move = move.replace(this.attack.crossMove, '');
        }
        needSpecificResponse = true;
      }
      this.attack.resetMultipleResponseTag();
      return move;
    };

    const selectedMove = movesPool[Math.floor(Math.random() * movesPool.length)];

    const moveString = this.boardService.normalMoveUnpacker(moveSanitiser(selectedMove));
    const [rowInit, colInit] = moveString.initCoordinates;
    const [rowFinal, colFinal] = moveString.finalCoordsPure[
        Math.floor(Math.random() * moveString.finalCoordsPure.length)];

    if (needSpecificResponse) {
      const deltaMove = Math.abs(+`${rowFinal}${colFinal}` - +`${rowInit}${colInit}`);
      if (direction === this.attack.parallelMove) {
        if (deltaMove === 11) {
          this.preferredResponse = `${rowInit - 1}. ${colInit - 1}:`;
        } else if (deltaMove === 9) {
          this.preferredResponse = `${rowInit - 1}. ${colInit + 1}:`;
        }
      } else if (direction === this.attack.crossMove) {
        if (deltaMove === 11) {
          this.preferredResponse = `${rowInit - 1}. ${colInit + 1}:`;
        } else if (deltaMove === 9) {
          this.preferredResponse = `${rowInit - 1}. ${colInit - 1}:`;
        }
      }
    }

    this.boardService.board[+rowInit][+colInit].click();
    this.boardService.board[+rowFinal][+colFinal].click();
  }

}
