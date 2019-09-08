import { SharedService } from './shared.service';
import { BoardService } from './board.service';
import { MovesAnalyserService } from './moves-analyser.service';
import { ComputerMoveService } from './computer-move.service';

export class Piece {
  constructor(public id: string, private row: number, private col: number,
              private isKing: boolean = false, private sharedService: SharedService,
              private cellsService: BoardService, private movesAnalyser: MovesAnalyserService,
              private compMoves: ComputerMoveService) {}

  /**
   * Coordinates of the piece on the board
   */
  currentPosition() {
      return [this.row, this.col];
  }

  /**
   * Consolidate all the legal moves of a King piece.
   */
  kingMovesCompiler(victimPrefix: string, movesContainer: string[]) {
      let rowX: number;
      let  colY: number;
      let done = false;

      /**
       * Checks for capturing opportunities pependicular to a given direction
       */
      const crossCaptureSpy = (row: number, col: number, board: number[], enemyPrefix: string, direction: string) => {
          if (this.movesAnalyser.cellOwnerChecking(row, col, board, enemyPrefix) === this.movesAnalyser.isEmpty) {
            if (direction === 'neg') {
              return this.movesAnalyser.negativeDiagonalSpy(row, col, board, enemyPrefix);
            } else if (direction === 'pos') {
              return this.movesAnalyser.positiveDiagonalSpy(row, col, board, enemyPrefix);
            }
          }
          return false;
      };

      // Foward right
      rowX = this.row - 1;
      colY = this.col + 1;
      while (rowX >= 0 && colY <= 7) {
          const cellStatus = this.movesAnalyser.cellOwnerChecking(rowX, colY, this.cellsService.board, victimPrefix);
          if (cellStatus === this.movesAnalyser.isEmpty) {
              if (this.sharedService.captureMoves.length === 0) {
                  movesContainer.push(`${rowX}. ${colY}`);
              }

          } else {
              const rightForkId = this.cellsService.board[rowX][colY].getAttribute('id');
              if (cellStatus.includes(this.movesAnalyser.isEnemy)) {
                  // Victim piece must not be on edge of board
                  if (rowX - 1 >= 0 && colY + 1 <= 7) {
                      if (this.movesAnalyser.cellOwnerChecking(
                        rowX - 1, colY + 1, this.cellsService.board, victimPrefix) === this.movesAnalyser.isEmpty
                        ) {
                          // Empty cell behind the victim piece
                          // Build possible landing positions beyond the victim piece
                          let innerRow = rowX - 1;
                          let innerCol = colY + 1;
                          let capMove = `${this.row}. ${this.col}:`; // Init position of capturing piece
                          let crossCapture = false;

                          // Checking for the presence of cross capture
                          while (innerRow >= 0 && innerCol <= 7) {
                              crossCapture = crossCaptureSpy(innerRow, innerCol,
                              this.cellsService.board, victimPrefix, 'neg');
                              if (crossCapture) { break; }
                              innerRow--;
                              innerCol++;
                          }

                          // Reset counters
                          innerRow = rowX - 1;
                          innerCol = colY + 1;

                          while (innerRow >= 0 && innerCol <= 7) {

                              if (this.movesAnalyser.cellOwnerChecking(innerRow, innerCol, this.cellsService.board,
                                victimPrefix) === this.movesAnalyser.isEmpty) {
                                  if (this.movesAnalyser.forwardRightSpy(innerRow, innerCol, this.cellsService.board, victimPrefix) ||
                                      !crossCapture) {

                                      // Any empty cell after the victim piece is permissable
                                      capMove += `#${innerRow}. ${innerCol}`;
                                      movesContainer.push(`${innerRow}. ${innerCol}`);
                                      this.sharedService.kingCaptureMoves.push(`${innerRow}. ${innerCol}`);
                                  } else {
                                      // No further inline chain capture, check for crossline capture
                                      if (crossCapture) {
                                          if (this.movesAnalyser.negativeDiagonalSpy(innerRow, innerCol, this.cellsService.board,
                                              victimPrefix)) {
                                              capMove += `#${innerRow}. ${innerCol}`;
                                              movesContainer.push(`${innerRow}. ${innerCol}`);
                                              this.sharedService.kingCaptureMoves.push(`${innerRow}. ${innerCol}`);
                                          }
                                      }

                                  }
                              } else {
                                  // There is a piece blocking the path, therefore clean up and stop
                                  capMove += `x${rightForkId}`;
                                  this.sharedService.captureMoves.push(capMove);
                                  done = true;
                                  break;
                              }
                              innerRow--;
                              innerCol++;
                          }
                          if (done) { break; }
                          // Reached end of board, therefore clean up and stop
                          capMove += `x${rightForkId}`;
                          this.sharedService.captureMoves.push(capMove);
                      } else {
                          break;
                      }
                  } else {
                      break;
                  }
              } else {
                  break;
              }
          }
          rowX--;
          colY++;
      }

      // Backward right
      rowX = this.row + 1;
      colY = this.col + 1;
      done = false;
      while (rowX <= 7 && colY <= 7) {
          if (!this.cellsService.board[rowX][colY].hasAttribute('id')) {
              // Cell is empty
              if (this.sharedService.captureMoves.length === 0) {
                  movesContainer.push(`${rowX}. ${colY}`);
              }

          } else {
              const rightForkId = this.cellsService.board[rowX][colY].getAttribute('id');
              if (rightForkId.startsWith(victimPrefix)) {
                  // Victim piece must not be on edge of board
                  if (rowX + 1 <= 7 && colY + 1 <= 7) {
                      // Empty cell behind the victim piece
                      if (!this.cellsService.board[rowX + 1][colY + 1].hasAttribute('id')) {
                          // Build possible landing positions beyond the victim piece
                          let innerRow = rowX + 1;
                          let innerCol = colY + 1;
                          let capMove = `${this.row}. ${this.col}:`; // Init position of capturing piece
                          let crossCapture = false;

                          // Checking for the presence of cross capture
                          while (innerRow <= 7 && innerCol <= 7) {
                              crossCapture = crossCaptureSpy(innerRow, innerCol,
                                this.cellsService.board, victimPrefix,
                                'pos');
                              if (crossCapture) { break; }
                              innerRow++;
                              innerCol++;
                          }

                          // Reset counters
                          innerRow = rowX + 1;
                          innerCol = colY + 1;

                          while (innerRow <= 7 && innerCol <= 7) {

                              if (!this.cellsService.board[innerRow][innerCol].hasAttribute('id')) {
                                  // Cell is empty

                                  if (this.movesAnalyser.backwardRightSpy(innerRow, innerCol, this.cellsService.board, victimPrefix) ||
                                      !crossCapture) {

                                      // Any empty cell after the victim piece is permissable
                                      capMove += `#${innerRow}. ${innerCol}`;
                                      movesContainer.push(`${innerRow}. ${innerCol}`);
                                      this.sharedService.kingCaptureMoves.push(`${innerRow}. ${innerCol}`);
                                  } else {
                                      // No further inline chain capture, check for crossline capture

                                      if (crossCapture) {
                                          if (this.movesAnalyser.positiveDiagonalSpy(innerRow, innerCol,
                                              this.cellsService.board, victimPrefix)) {
                                              capMove += `#${innerRow}. ${innerCol}`;
                                              movesContainer.push(`${innerRow}. ${innerCol}`);
                                              this.sharedService.kingCaptureMoves.push(`${innerRow}. ${innerCol}`);
                                          }
                                      }

                                  }
                              } else {
                                  // There is a piece blocking the path, therefore clean up and stop
                                  capMove += `x${rightForkId}`;
                                  this.sharedService.captureMoves.push(capMove);
                                  done = true;
                                  break;
                              }
                              innerRow++;
                              innerCol++;
                          }
                          if (done) { break; }
                          // Reached end of board, therefore clean up and stop
                          capMove += `x${rightForkId}`;
                          this.sharedService.captureMoves.push(capMove);
                      } else {
                          break;
                      }
                  } else {
                      break;
                  }
              } else {
                  break;
              }
          }
          rowX++;
          colY++;
      }

      // Foward left
      rowX = this.row - 1;
      colY = this.col - 1;
      done = false;
      while (rowX >= 0 && colY >= 0) {
          if (!this.cellsService.board[rowX][colY].hasAttribute('id')) {
              // Cell is empty
              if (this.sharedService.captureMoves.length === 0) {
                  movesContainer.push(`${rowX}. ${colY}`);
              }

          } else {
              const leftForkId = this.cellsService.board[rowX][colY].getAttribute('id');
              if (leftForkId.startsWith(victimPrefix)) {
                  // Victim piece must not be on edge of board
                  if (rowX - 1 >= 0 && colY - 1 >= 0) {
                      // Empty cell behind the victim piece
                      if (!this.cellsService.board[rowX - 1][colY - 1].hasAttribute('id')) {
                          // Build possible landing positions beyond the victim piece
                          let innerRow = rowX - 1;
                          let innerCol = colY - 1;
                          let capMove = `${this.row}. ${this.col}:`; // Init position of capturing piece
                          let crossCapture = false;

                          // Checking for the presence of cross capture
                          while (innerRow >= 0 && innerCol >= 0) {
                              crossCapture = crossCaptureSpy(innerRow, innerCol,
                                this.cellsService.board, victimPrefix,
                                'pos');
                              if (crossCapture) { break; }
                              innerRow--;
                              innerCol--;
                          }

                          // Reset counters
                          innerRow = rowX - 1;
                          innerCol = colY - 1;

                          while (innerRow >= 0 && innerCol >= 0) {

                              if (!this.cellsService.board[innerRow][innerCol].hasAttribute('id')) {
                                  // Cell is empty

                                  if (this.movesAnalyser.forwardLeftSpy(innerRow, innerCol, this.cellsService.board, victimPrefix) ||
                                      !crossCapture) {

                                      // Any empty cell after the victim piece is permissable
                                      capMove += `#${innerRow}. ${innerCol}`;
                                      movesContainer.push(`${innerRow}. ${innerCol}`);
                                      this.sharedService.kingCaptureMoves.push(`${innerRow}. ${innerCol}`);
                                  } else {
                                      // No further inline chain capture, check for crossline capture

                                      if (crossCapture) {
                                          if (this.movesAnalyser.positiveDiagonalSpy(innerRow, innerCol, this.cellsService.board,
                                              victimPrefix)) {

                                              capMove += `#${innerRow}. ${innerCol}`;
                                              movesContainer.push(`${innerRow}. ${innerCol}`);
                                              this.sharedService.kingCaptureMoves.push(`${innerRow}. ${innerCol}`);
                                          }
                                      }

                                  }
                              } else {
                                  // There is a piece blocking the path, therefore clean up and stop
                                  capMove += `x${leftForkId}`;
                                  this.sharedService.captureMoves.push(capMove);
                                  done = true;
                                  break;
                              }
                              innerRow--;
                              innerCol--;
                          }
                          if (done) { break; }
                          // Reached end of board, therefore clean up and stop
                          capMove += `x${leftForkId}`;
                          this.sharedService.captureMoves.push(capMove);
                      } else {
                          break;
                      }
                  } else {
                      break;
                  }
              } else {
                  break;
              }
          }
          rowX--;
          colY--;
      }

      // Backward left
      rowX = this.row + 1;
      colY = this.col - 1;
      done = false;
      while (rowX <= 7 && colY >= 0) {
          if (!this.cellsService.board[rowX][colY].hasAttribute('id')) {
              // Cell is empty
              if (this.sharedService.captureMoves.length === 0) {
                  movesContainer.push(`${rowX}. ${colY}`);
              }

          } else {
              const leftForkId = this.cellsService.board[rowX][colY].getAttribute('id');
              if (leftForkId.startsWith(victimPrefix)) {
                  // Victim piece must not be on edge of board
                  if (rowX + 1 <= 7 && colY - 1 >= 0) {
                      // Empty cell behind the victim piece
                      if (!this.cellsService.board[rowX + 1][colY - 1].hasAttribute('id')) {
                          // Build possible landing positions beyond the victim piece
                          let innerRow = rowX + 1;
                          let innerCol = colY - 1;
                          let capMove = `${this.row}. ${this.col}:`; // Init position of capturing piece
                          let crossCapture = false;

                          // Checking for the presence of cross capture
                          while (innerRow <= 7 && innerCol >= 0) {
                              crossCapture = crossCaptureSpy(innerRow, innerCol,
                                this.cellsService.board, victimPrefix,
                                'neg');
                              if (crossCapture) { break; }
                              innerRow++;
                              innerCol--;
                          }

                          // Reset counters
                          innerRow = rowX + 1;
                          innerCol = colY - 1;

                          while (innerRow <= 7 && innerCol >= 0) {
                              if (!this.cellsService.board[innerRow][innerCol].hasAttribute('id')) {
                                  // Cell is empty

                                  if (this.movesAnalyser.backwardLeftSpy(innerRow, innerCol, this.cellsService.board, victimPrefix) ||
                                      !crossCapture) {

                                      // Any empty cell after the victim piece is permissable
                                      capMove += `#${innerRow}. ${innerCol}`;
                                      movesContainer.push(`${innerRow}. ${innerCol}`);
                                      this.sharedService.kingCaptureMoves.push(`${innerRow}. ${innerCol}`);
                                  } else {
                                      // No further inline chain capture, check for crossline capture

                                      if (crossCapture) {
                                          if (this.movesAnalyser.negativeDiagonalSpy(innerRow, innerCol, this.cellsService.board,
                                              victimPrefix)) {

                                              capMove += `#${innerRow}. ${innerCol}`;
                                              movesContainer.push(`${innerRow}. ${innerCol}`);
                                              this.sharedService.kingCaptureMoves.push(`${innerRow}. ${innerCol}`);
                                          }
                                      }

                                  }
                              } else {
                                  // There is a piece blocking the path, therefore clean up and stop
                                  capMove += `x${leftForkId}`;
                                  this.sharedService.captureMoves.push(capMove);
                                  done = true;
                                  break;
                              }
                              innerRow++;
                              innerCol--;
                          }
                          if (done) { break; }
                          // Reached end of board, therefore clean up and stop
                          capMove += `x${leftForkId}`;
                          this.sharedService.captureMoves.push(capMove);
                      } else {
                          break;
                      }
                  } else {
                      break;
                  }
              } else {
                  break;
              }
          }
          rowX++;
          colY--;
      }
  }

  captureMoveFowardLeft(victimPrefix: string, movesContainer: string[]) {
      let leftForkId: string;
      if (this.row >= 2) {
          if (this.cellsService.board[this.row - 1][this.col - 1] &&
              this.cellsService.board[this.row - 1][this.col - 1].hasAttribute('id')) {
              leftForkId = this.cellsService.board[this.row - 1][this.col - 1].getAttribute('id');
          } else {
              return;
          }
          if (leftForkId && leftForkId.startsWith(victimPrefix)) {
              // Not within 2 squares to the left edge of board
              if (this.col - 2 >= 0) {
                  // Cell is empty
                  if (!this.cellsService.board[this.row - 2][this.col - 2].hasAttribute('id')) {
                      // Capture move
                      this.sharedService.captureMoves.push(`${this.row}. ${this.col}:#${this.row - 2}. ${this.col - 2}x${leftForkId}`);
                      movesContainer.push(`${this.row - 2}. ${this.col - 2}`);
                  }
              }
          }
      }
  }

  captureMoveFowardRight(victimPrefix: string, movesContainer: string[]) {
      let rightForkId: string;
      if (this.row >= 2) {
          if (this.cellsService.board[this.row - 1][this.col + 1] &&
              this.cellsService.board[this.row - 1][this.col + 1].hasAttribute('id')) {
              rightForkId = this.cellsService.board[this.row - 1][this.col + 1].getAttribute('id');
          } else {
              return;
          }
          if (rightForkId && rightForkId.startsWith(victimPrefix)) {
              // Not within 2 squares to the left edge of board
              if (this.col + 2 <= 7) {
                  // Cell is empty
                  if (!this.cellsService.board[this.row - 2][this.col + 2].hasAttribute('id')) {
                      // Capture move
                      this.sharedService.captureMoves.push(`${this.row}. ${this.col}:#${this.row - 2}. ${this.col + 2}x${rightForkId}`);
                      movesContainer.push(`${this.row - 2}. ${this.col + 2}`);
                  }
              }
          }
      }
  }

  captureMoveBackLeft(victimPrefix: string, movesContainer: string[]) {
      let leftForkId: string;
      if (this.row <= 5) {
          if (this.cellsService.board[this.row + 1][this.col - 1] &&
              this.cellsService.board[this.row + 1][this.col - 1].hasAttribute('id')) {
              leftForkId = this.cellsService.board[this.row + 1][this.col - 1].getAttribute('id');
          } else {
              return;
          }
          if (leftForkId && leftForkId.startsWith(victimPrefix)) {
              // Not within 2 squares to the left edge of board
              if (this.col - 2 >= 0) {
                  // Cell is empty
                  if (!this.cellsService.board[this.row + 2][this.col - 2].hasAttribute('id')) {
                      // Capture move
                      this.sharedService.captureMoves.push(`${this.row}. ${this.col}:#${this.row + 2}. ${this.col - 2}x${leftForkId}`);
                      movesContainer.push(`${this.row + 2}. ${this.col - 2}`);
                  }
              }
          }
      }
  }

  captureMoveBackRight(victimPrefix: string, movesContainer: string[]) {
      let rightForkId: string;
      if (this.row <= 5) {
          if (this.cellsService.board[this.row + 1][this.col + 1] &&
              this.cellsService.board[this.row + 1][this.col + 1].hasAttribute('id')) {
              rightForkId = this.cellsService.board[this.row + 1][this.col + 1].getAttribute('id');
          } else {
              return;
          }
          if (rightForkId && rightForkId.startsWith(victimPrefix)) {
              // Not within 2 squares to the left edge of board
              if (this.col + 2 <= 7) {
                  // Cell is empty
                  if (!this.cellsService.board[this.row + 2][this.col + 2].hasAttribute('id')) {
                      // Capture move
                      this.sharedService.captureMoves.push(`${this.row}. ${this.col}:#${this.row + 2}. ${this.col + 2}x${rightForkId}`);
                      movesContainer.push(`${this.row + 2}. ${this.col + 2}`);
                  }
              }
          }
      }
  }

  /**
   * Compiles the possible moves of this non-king piece and adds it to a moves container of the player.
   */
  playerPokerNormalMoves(movesContainer: string[]) {
      // Calculating the left moves
      // Not on left edge of board
      if (this.col !== 0) {
          if (this.row > 0 && !this.cellsService.board[this.row - 1][this.col - 1].hasAttribute('id')) {
              // Cell is empty
              movesContainer.push(`${this.row - 1}. ${this.col - 1}`);
          }
      }

      // Not on right edge of board
      // Calculating right moves
      if (this.col !== 7) {
          // Cell is empty
          if (this.row > 0 && !this.cellsService.board[+this.row - 1][+this.col + 1].hasAttribute('id')) {
              movesContainer.push(`${this.row - 1}. ${this.col + 1}`);
          }
      }
  }

  /**
   * Compiles the possible moves of this non-king piece and adds it to a moves container of the computer.
   */
  computerPokerNormalMoves(movesContainer: string[]) {
      // Calculating the left moves
      // Not on left edge of board
      if (this.col !== 0) {
          if (this.row < 7 && !this.cellsService.board[this.row + 1][this.col - 1].hasAttribute('id')) {
              // Cell is empty
              movesContainer.push(`${this.row + 1}. ${this.col - 1}`);
          }
      }

      // Not on right edge of board
      // Calculating right moves
      if (this.col !== 7) {
          // Cell is empty
          if (this.row < 7 && !this.cellsService.board[this.row + 1][this.col + 1].hasAttribute('id')) {
              movesContainer.push(`${this.row + 1}. ${this.col + 1}`);
          }
      }
  }

  /**
   * Calculates all the legal moves for a single selected piece.
   *
   * If this.sharedService.captureMoves array is populated, calling this method will return only capturing moves.
   * Non-capturing moves will only be included if this.sharedService.captureMoves array is empty when this
   * method is called.
   */
  legalMoves() {
      const moves = [];
      let victimPrefix: string;
      if (this.id.includes(this.sharedService.playerPrefix)) {
          victimPrefix = this.sharedService.computerPrefix;
      } else {
          victimPrefix = this.sharedService.playerPrefix;
      }
      if (!this.id.includes('King')) {
          this.captureMoveFowardLeft(victimPrefix, moves);
          this.captureMoveBackLeft(victimPrefix, moves);
          this.captureMoveFowardRight(victimPrefix, moves);
          this.captureMoveBackRight(victimPrefix, moves);
          if (this.sharedService.captureMoves.length === 0) {
              // Only consider normal moves if there are no capturing moves
              if (victimPrefix === this.sharedService.computerPrefix) {
                  this.playerPokerNormalMoves(moves);
              } else {
                  this.computerPokerNormalMoves(moves);
              }
          }

      } else {
          this.kingMovesCompiler(victimPrefix, moves);
          if (this.sharedService.kingCaptureMoves.length > 0) {
              return this.sharedService.kingCaptureMoves;
          }
      }
      return moves;
  }

  /**
   * Approves/rejects a requested move after checking it's legality.
   *
   * At this point if captureMove array is populated, then calling legalMoves will
   * filter off all non-capturing moves. Non-capturing moves will only be allowed if
   * captureMove array is empty.
   */
  move(newRow: number, newCol: number) {
      if (this.legalMoves().includes(`${newRow}. ${newCol}`)) {
          this.update(newRow, newCol);
      } else {
          alert(`Illegal move`);
          this.cellsService.uncheckOtherCells();
      }

  }

  /**
   * Checks whether a given piece object has any capturing moves at its disposal.
   */
  captureMoveAvailable() {
    this.legalMoves();
    if (this.sharedService.captureMoves.length > 0) {
        return true;
    }
    return false;
  }

  /**
   * Updates the board after receiving the new coordinates of a piece being moved.
   */
  update(newRow: number, newCol: number) {
      const currentStyle = this.cellsService.board[this.row][this.col].style.background;
      const currentId = this.cellsService.board[this.row][this.col].getAttribute('id');
      let capturedId: string;
      let captureMovePlayed = false;
      const movePrefix = `${newRow}. ${newCol}`;

      this.cellsService.board[this.row][this.col].style.background = this.cellsService.defaultBackground;
      this.cellsService.board[this.row][this.col].removeAttribute('id');

      this.cellsService.board[newRow][newCol].style.background = currentStyle;
      this.cellsService.board[newRow][newCol].setAttribute('id', currentId);

      this.sharedService.captureMoves.forEach(cm => {
          const [attacker, xString] = cm.split(':');
          const [atckRow, atckCol] = attacker.split('. ');
          if (xString.includes(movePrefix) &&
              +atckRow === this.row &&
              +atckCol === this.col) {
              // Capture move was played
              captureMovePlayed = true;
              [, capturedId] = xString.split('x');
              if (capturedId.startsWith(this.sharedService.playerPrefix)) {
                this.sharedService.playerPokers.forEach(poker => {
                      if (poker.id === capturedId) {
                          poker.kill();
                      }
                  });
              } else if (capturedId.startsWith(this.sharedService.computerPrefix)) {
                this.sharedService.computerPokers.forEach(poker => {
                      if (poker.id === capturedId) {
                          poker.kill();
                      }
                  });
              }
          }
      });
      this.sharedService.resetCaptureMoves();

      this.row = newRow;
      this.col = newCol;

      // Check if there is a possible chain capture
      if (captureMovePlayed) {
          if (this.captureMoveAvailable()) {
              if (this.sharedService.computerTurn) {
                  setTimeout(() => this.compMoves.forceCapture(0), 250);
                  this.cellsService.uncheckAllCells();
                  return;
              } else {
                  return;
              }
          }
      }

      // Promoting the piece that reaches the end row to a King.
      if (!this.isKing && this.row === 0 && this.id.startsWith(this.sharedService.playerPrefix)) {
          this.isKing = true;
          const pieceId = this.id.replace(this.sharedService.playerPrefix, this.sharedService.playerPrefix + 'King');
          this.cellsService.board[this.row][this.col].style.background = this.cellsService.playerKing;
          this.cellsService.board[newRow][newCol].setAttribute('id', pieceId);
          this.id = pieceId;
      } else if (!this.isKing && this.row === 7 && this.id.startsWith(this.sharedService.computerPrefix)) {
          this.isKing = true;
          const pieceId = this.id.replace(this.sharedService.computerPrefix, this.sharedService.computerPrefix + 'King');
          this.cellsService.board[this.row][this.col].style.background = this.cellsService.computerKing;
          this.cellsService.board[newRow][newCol].setAttribute('id', pieceId);
          this.id = pieceId;
      }

      if (this.sharedService.isComputerTurn()) {
          setTimeout(() => this.compMoves.computerMove(), 500);
      } else {
          // Check if player have valid moves
          this.compMoves.playerHealthAnalysis();
      }
  }

  /**
   * Removes the captured piece from the array of active pieces and
   * adjust the board display accordingly.
   */
  kill() {
      if (this.id.startsWith(this.sharedService.computerPrefix)) {
          const index = this.sharedService.computerPokers.indexOf(this);
          this.sharedService.computerPokers.splice(index, 1);
      } else if (this.id.startsWith(this.sharedService.playerPrefix)) {
          const index = this.sharedService.playerPokers.indexOf(this);
          this.sharedService.playerPokers.splice(index, 1);
      }
      this.cellsService.board[this.row][this.col].removeAttribute('id');
      this.cellsService.board[this.row][this.col].style.background = this.cellsService.defaultBackground;
  }

}
