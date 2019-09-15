import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { BoardService } from './board.service';

@Injectable({
  providedIn: 'root'
})
export class MovesAnalyserService {
  kingSuffix = 'King';
  isEmpty = 'isEmpty';
  isEnemy = 'isEnemy';
  isFriend = 'isFriend';
  isEnemyKing = `${this.isEnemy}${this.kingSuffix}`;
  isFriendKing = `${this.isFriend}${this.kingSuffix}`;

  constructor(private shared: SharedService, private board: BoardService) {}

  /**
   * Checks and reports the status of a given cell
   */
  cellOwnerChecking(row: number, col: number, board: any[], enemyPrefix: string, initRow: number = null, initCol: number = null) {
    const thisCell = board[row][col];
    let status: string;
    if (thisCell.hasAttribute('id')) {
      const id = thisCell.getAttribute('id');
      if (id.includes(enemyPrefix)) {
        if (id.includes(this.kingSuffix)) {
          status = this.isEnemyKing;
        } else {
          status = this.isEnemy;
        }
      } else if (initRow === row && initCol === col) {
        // This means the computer piece will move from this cell, leaving it empty
        status = this.isEmpty;
      } else {
        if (id.includes(this.kingSuffix)) {
          status = this.isFriendKing;
        } else {
          status = this.isFriend;
        }
      }
    } else {
      status = this.isEmpty;
    }
    return status;
  }

  /**
   * Used by the King piece to spy if there are any pieces to capture
   * in a specified direction.
   */
  forwardRightSpy( row: number, col: number, board: any[], enemyPrefix: string) {
    let rowX: number;
    let colY: number;

    rowX = row - 1;
    colY = col + 1;
    while ( rowX >= 0 && colY <= 7) {
      const cellStatus = this.cellOwnerChecking( rowX, colY, board, enemyPrefix);
      if (cellStatus && cellStatus.includes(this.isEnemy)) {
        if ( rowX - 1 >= 0 && colY + 1 <= 7) {
          // Victim piece not on edge of board
          if (this.cellOwnerChecking( rowX - 1, colY + 1, board, enemyPrefix) === this.isEmpty) {
            // Empty cell behind the victim piece hence it can be captured

            return true;
          }
        }
      } else if (cellStatus && cellStatus.includes(this.isFriend)) {
        // Friendly piece, stop querying
        return false;
      }
      rowX--;
      colY++;
    }
    // No victim piece in line of fire
    return false;
  }

  /**
   * Used by the King piece to spy if there are any pieces to capture
   * in a specified direction.
   */
  backwardLeftSpy(row: number, col: number, board: any[], enemyPrefix: string) {
    let rowX: number;
    let colY: number;

    rowX = row + 1;
    colY = col - 1;
    while ( rowX <= 7 && colY >= 0) {
      const cellStatus = this.cellOwnerChecking( rowX, colY, board, enemyPrefix);
      if (cellStatus && cellStatus.includes(this.isEnemy)) {
        // Victim piece must not be on edge of board
        if ( rowX + 1 <= 7 && colY - 1 >= 0) {
          if (this.cellOwnerChecking( rowX + 1, colY - 1, board, enemyPrefix) === this.isEmpty) {
            // Empty cell behind the victim piece hence it can be captured
            return true;
          }
        }
      } else if (cellStatus && cellStatus.includes(this.isFriend)) {
        // Friendly piece, stop querying
        return false;
      }
      rowX++;
      colY--;
    }
    // No victim piece in line of fire
    return false;
  }

  /**
   * Used by the King piece to spy if there are any pieces to capture
   * in a specified direction.
   */
  forwardLeftSpy( row: number, col: number, board: any[], enemyPrefix: string) {
    let rowX: number;
    let colY: number;

    // Foward left
    rowX = row - 1;
    colY = col - 1;
    while ( rowX >= 0 && colY >= 0) {
      const cellStatus = this.cellOwnerChecking( rowX, colY, board, enemyPrefix);
      if (cellStatus && cellStatus.includes(this.isEnemy)) {
        // Victim piece must not be on edge of board
        if ( rowX - 1 >= 0 && colY - 1 >= 0) {
          if (this.cellOwnerChecking( rowX - 1, colY - 1, board, enemyPrefix) === this.isEmpty) {
            // Empty cell behind the victim piece hence it can be captured

            return true;
          }
        }
      } else if (cellStatus && cellStatus.includes(this.isFriend)) {
        // Friendly piece, stop querying
        return false;
      }
      rowX--;
      colY--;
    }
    // No victim piece in line of fire
    return false;
  }

  /**
   * Used by the King piece to spy if there are any pieces to capture
   * in a specified direction.
   */
  backwardRightSpy( row: number, col: number, board: any[], enemyPrefix: string) {
    let rowX: number;
    let colY: number;

    rowX = row + 1;
    colY = col + 1;
    while ( rowX <= 7 && colY <= 7) {
      const cellStatus = this.cellOwnerChecking( rowX, colY, board, enemyPrefix);
      if (cellStatus && cellStatus.includes(this.isEnemy)) {
        // Victim piece must not be on edge of board
        if ( rowX + 1 <= 7 && colY + 1 <= 7) {
          if (this.cellOwnerChecking( rowX + 1, colY + 1, board, enemyPrefix) === this.isEmpty) {
            // Empty cell behind the victim piece hence it can be captured
            return true;
          }
        }
      } else if (cellStatus && cellStatus.includes(this.isFriend)) {
        // Friendly piece, stop querying
        return false;
      }
      rowX++;
      colY++;
    }
    // No victim piece in line of fire
    return false;
  }

  /**
   * Used by the King piece to spy if there are any pieces to capture
   * in a specified direction.
   */
  positiveDiagonalSpy( row: number, col: number, board: any[], enemyPrefix: string) {
    return this.forwardRightSpy( row, col, board, enemyPrefix) ||
            this.backwardLeftSpy( row, col, board, enemyPrefix);
  }

  /**
   * Used by the King piece to spy if there are any pieces to capture
   * in a specified direction.
   */
  negativeDiagonalSpy( row: number, col: number, board: any[], enemyPrefix: string) {
    return this.forwardLeftSpy( row, col, board, enemyPrefix) ||
            this.backwardRightSpy( row, col, board, enemyPrefix);
  }

  /**
   * Spies and returns the status of the botom-left cell of the given coordinates.
   */
  bottomLeftCell( row: number, col: number, board: any[], enemyPrefix: string) {
    let status: string;
    // Piece not on left edge of board
    if (col > 0) {
      // Piece not on the bottom edge of board, check bottom left
      if (row < 7) {
        status = this.cellOwnerChecking(row + 1, col - 1, board, enemyPrefix);
      }
    }
    return status;
  }

  /**
   * Spies and returns the status of the botom-right cell of the given coordinates.
   */
  bottomRightCell( row: number, col: number, board: any[], enemyPrefix: string) {
    let status: string;
    // Piece not on right edge of board
    if (col < 7) {
      // Piece not on the bottom edge of board, check bottom right
      if (row < 7) {
        status = this.cellOwnerChecking(row + 1, col + 1, board, enemyPrefix);
      }
    }
    return status;
  }

  /**
   * Spies and returns the status of the top-left cell of the given coordinates.
   */
  topLeftCell(row: number, col: number, board: any[], enemyPrefix: string, initRow: number = null, initCol: number = null) {
		let status: string;
		// Piece not on left edge of board
		if (col > 0) {
			// Piece not on the top edge of board, check top left
			if (row > 0) {
				status = this.cellOwnerChecking(row - 1, col - 1, board, enemyPrefix, initRow, initCol);
			}
		}
		return status;
  }

  /**
   * Spies and returns the status of the top-right cell of the given coordinates.
   */
  topRightCell(row: number, col: number, board: any[], enemyPrefix: string, initRow: number = null, initCol: number = null) {
    let status: string;
    // Piece not on right edge of board
    if (col < 7) {
      // Piece not on the top edge of board, check top right
      if (row > 0) {
        status = this.cellOwnerChecking(row - 1, col + 1, board, enemyPrefix, initRow, initCol);
      }
    }
    return status;
  }

  rightSiblingCell( row: number, col: number, board: any[], enemyPrefix: string) {
    return this.bottomRightCell(row - 1, col + 1, board, enemyPrefix) ||
            this.topRightCell(row + 1, col + 1, board, enemyPrefix);
  }

  leftSiblingCell( row: number, col: number, board: any[], enemyPrefix: string) {
    return this.bottomLeftCell(row - 1, col - 1, board, enemyPrefix) ||
            this.topLeftCell(row + 1, col - 1, board, enemyPrefix);
  }

  topSiblingCell( row: number, col: number, board: any[], enemyPrefix: string) {
    return this.topRightCell(row - 1, col - 1, board, enemyPrefix) ||
            this.topLeftCell(row - 1, col + 1, board, enemyPrefix);
  }

  bottomSiblingCell( row: number, col: number, board: any[], enemyPrefix: string) {
    return this.bottomRightCell(row + 1, col - 1, board, enemyPrefix) ||
            this.bottomLeftCell(row + 1, col + 1, board, enemyPrefix);
  }

  bottomRightSniperL1Cell( row: number, col: number, board: any[], enemyPrefix: string) {
    return this.bottomRightCell(row, col + 2, board, enemyPrefix);
  }

  bottomRightSniperL2Cell( row: number, col: number, board: any[], enemyPrefix: string) {
    return this.bottomRightCell(row + 2, col, board, enemyPrefix);
  }

  bottomLeftSniperL1Cell( row: number, col: number, board: any[], enemyPrefix: string) {
    return this.bottomLeftCell(row, col - 2, board, enemyPrefix);
  }

  bottomLeftSniperL1AttackerCell( row: number, col: number, board: any[], enemyPrefix: string) {
    return this.bottomLeftSniperL1Cell(row + 1, col - 1, board, enemyPrefix);
  }

  bottomRightSniperL1AttackerCell( row: number, col: number, board: any[], enemyPrefix: string) {
    return this.bottomRightSniperL1Cell(row + 1, col + 1, board, enemyPrefix);
  }

  bottomLeftSniperL2Cell( row: number, col: number, board: any[], enemyPrefix: string) {
    return this.bottomLeftCell(row + 2, col, board, enemyPrefix);
  }

  topRightSniperL1Cell( row: number, col: number, board: any[], enemyPrefix: string) {
    return this.topRightCell(row, col + 2, board, enemyPrefix);
  }

  topRightSniperL2Cell( row: number, col: number, board: any[], enemyPrefix: string) {
    return this.topRightCell(row - 2, col, board, enemyPrefix);
  }

  topLeftSniperL1Cell( row: number, col: number, board: any[], enemyPrefix: string) {
    return this.topLeftCell(row, col - 2, board, enemyPrefix);
  }

  topLeftSniperL1AttackerCell( row: number, col: number, board: any[], enemyPrefix: string) {
    return this.topLeftSniperL1Cell(row - 1, col - 1, board, enemyPrefix);
  }

  topRightSniperL1AttackerCell( row: number, col: number, board: any[], enemyPrefix: string) {
    return this.topLeftSniperL1Cell(row + 1, col + 1, board, enemyPrefix);
  }

  topLeftSniperL2Cell( row: number, col: number, board: any[], enemyPrefix: string) {
    return this.topLeftCell(row - 2, col, board, enemyPrefix);
  }

  topLeftSniperL3Cell(row: number, col: number, board: any[], enemyPrefix: string) {
    return this.topLeftSniperL2Cell(row - 1, col - 1, board, enemyPrefix);
  }

  topRightSniperL3Cell(row: number, col: number, board: any[], enemyPrefix: string) {
    return this.topRightSniperL2Cell(row - 1, col + 1, board, enemyPrefix);
  }

  farTopLeftCell( row: number, col: number, board: any[], enemyPrefix: string) {
    return this.topLeftCell(row - 1, col - 1, board, enemyPrefix);
  }

  topLeftSniperSCell( row: number, col: number, board: any[], enemyPrefix: string) {
    return this.topLeftCell(row - 2, col - 2, board, enemyPrefix);
  }

  farTopRightCell( row: number, col: number, board: any[], enemyPrefix: string) {
    return this.topRightCell(row - 1, col + 1, board, enemyPrefix);
  }

  topRightSniperSCell( row: number, col: number, board: any[], enemyPrefix: string) {
    return this.topRightCell(row - 2, col + 2, board, enemyPrefix);
  }

  farBottomRightCell( row: number, col: number, board: any[], enemyPrefix: string) {
    return this.bottomRightCell(row + 1, col + 1, board, enemyPrefix);
  }

  bottomRightSniperSCell( row: number, col: number, board: any[], enemyPrefix: string) {
    return this.bottomRightCell(row + 2, col + 2, board, enemyPrefix);
  }

  farBottomLeftCell( row: number, col: number, board: any[], enemyPrefix: string) {
    return this.bottomLeftCell(row + 1, col - 1, board, enemyPrefix);
  }

  bottomLeftSniperSCell( row: number, col: number, board: any[], enemyPrefix: string) {
    return this.bottomLeftCell(row + 2, col - 2, board, enemyPrefix);
  }

  /**
   * Checks whether a move will result in the direct capture of the moving piece, or
   * any of the friendly pieces.
   */
  captureRisk(initRow: number, initCol: number, board: any[], enemyPrefix: string, finalRow: number, finalCol: number) {
    /* Investigate Direct Capture Risk */
    const bottomLeft = this.bottomLeftCell(finalRow, finalCol, board, enemyPrefix);
    const topLeft = this.topLeftCell(finalRow, finalCol, board, enemyPrefix, initRow, initCol);
    const bottomRight = this.bottomRightCell(finalRow, finalCol, board, enemyPrefix);
    const topRight = this.topRightCell(finalRow, finalCol, board, enemyPrefix, initRow, initCol);
    const farBottomLeft = this.farBottomLeftCell(finalRow, finalCol, board, enemyPrefix);
    const farTopLeft = this.farTopLeftCell(finalRow, finalCol, board, enemyPrefix);
    const farBottomRight = this.farBottomRightCell(finalRow, finalCol, board, enemyPrefix);
    const farTopRight = this.farTopRightCell(finalRow, finalCol, board, enemyPrefix);
    const rightSibling = this.rightSiblingCell(finalRow, finalCol, board, enemyPrefix);
    const bottomRightSniperL1 = this.bottomRightSniperL1Cell(finalRow, finalCol, board, enemyPrefix);
    const bottomLeftSniperL1 = this.bottomLeftSniperL1Cell(finalRow, finalCol, board, enemyPrefix);
    const leftSibling = this.leftSiblingCell(finalRow, finalCol, board, enemyPrefix);
    const bottomRightSniperL2 = this.bottomRightSniperL2Cell(finalRow, finalCol, board, enemyPrefix);
    const bottomSibling = this.bottomSiblingCell(finalRow, finalCol, board, enemyPrefix);
    const topSibling = this.topSiblingCell(finalRow, finalCol, board, enemyPrefix);
    const topLeftSniperL2 = this.topLeftSniperL2Cell(finalRow, finalCol, board, enemyPrefix);
    const topLeftSniperL1 = this.topLeftSniperL1Cell(finalRow, finalCol, board, enemyPrefix);
    const topRightSniperL1 = this.topRightSniperL1Cell(finalRow, finalCol, board, enemyPrefix);
    const bottomLeftSniperL2 = this.bottomLeftSniperL2Cell(finalRow, finalCol, board, enemyPrefix);
    const topRightSniperL2 = this.topRightSniperL2Cell(finalRow, finalCol, board, enemyPrefix);
    const topRightSniperS = this.topRightSniperSCell(finalRow, finalCol, board, enemyPrefix);
    const bottomLeftSniperS = this.bottomLeftSniperSCell(finalRow, finalCol, board, enemyPrefix);
    const bottomRightSniperS = this.bottomRightSniperSCell(finalRow, finalCol, board, enemyPrefix);
    const topLeftSniperS = this.topLeftSniperSCell(finalRow, finalCol, board, enemyPrefix);

    /**
     * Checks if the moving piece will be threatened by an enemy piece on its
     * landing position
     */
    const threatFromKing = () => {
      const opponentKings = [];
      let topLeftNum: number;
      let topRightNum: number;
      let bottomLeftNum: number;
      let bottomRightNum: number;

      // Check if there are any enemy kings in the game
      for (const poker of this.shared.playerPokers) {
        if (poker.isKing) {
          opponentKings.push(poker);
        }
      }

      if  (opponentKings.length > 0) {
        const positiveMagic = 9;
        const negativeMagic = 11;
        let kingNum: number;
        let delta: number;
        let kingRow: number;
        let kingCol: number;

        const pieceNum: number = finalRow === 0 ? +`${finalCol}` : +`${finalRow}${finalCol}`;
        for (const king of opponentKings) {
          [kingRow, kingCol] = king.currentPosition();
          if (kingRow !== 0) {
            kingNum = +`${kingRow}${kingCol}`;
          } else {
            kingNum = +`${kingCol}`;
          }

          /* Direct capture analysis */

          delta = Math.abs(kingNum - pieceNum);
          if (delta % positiveMagic === 0) {
            if (!this.positiveDiagonalSpy(kingRow, kingCol, this.board.board, this.shared.computerPrefix)) {
              this.board.board[finalRow][finalCol].setAttribute('id', this.shared.computerPrefix);
              if (this.positiveDiagonalSpy(kingRow, kingCol, this.board.board, this.shared.computerPrefix)) {
                this.board.board[finalRow][finalCol].removeAttribute('id');
                return true;
              }
              this.board.board[finalRow][finalCol].removeAttribute('id');
            }
          } else if (delta % negativeMagic === 0) {
            if (!this.negativeDiagonalSpy(kingRow, kingCol, this.board.board, this.shared.computerPrefix)) {
              this.board.board[finalRow][finalCol].setAttribute('id', this.shared.computerPrefix);
              if (this.negativeDiagonalSpy(kingRow, kingCol, this.board.board, this.shared.computerPrefix)) {
                this.board.board[finalRow][finalCol].removeAttribute('id');
                return true;
              }
              this.board.board[finalRow][finalCol].removeAttribute('id');
            }
          }
        }

        /* Indirect capture analysis */
        const friendNums: number[] = [];

        if (initRow !== 0 && initCol !== 0) {
          if (initRow === 1) {
            topLeftNum = +`${initCol - 1}`;
            friendNums.push(topLeftNum);
          } else {
            topLeftNum = +`${initRow - 1}${initCol - 1}`;
            friendNums.push(topLeftNum);
          }
        }

        if (initRow !== 0 && initCol !== 7) {
          if (initRow === 1) {
            topRightNum = +`${initCol + 1}`;
            friendNums.push(topRightNum);
          } else {
            topRightNum = +`${initRow - 1}${initCol + 1}`;
            friendNums.push(topRightNum);
          }
        }

        if (initRow !== 7 && initCol !== 7) {
          bottomRightNum = +`${initRow + 1}${initCol + 1}`;
          friendNums.push(bottomRightNum);
        }

        if (initRow !== 7 && initCol !== 0) {
          bottomLeftNum = +`${initRow + 1}${initCol - 1}`;
          friendNums.push(bottomLeftNum);
        }

        for (const friendNum of friendNums) {
          const deltaFriend = Math.abs(kingNum - friendNum);
          if (deltaFriend % positiveMagic === 0) {
            if (!this.positiveDiagonalSpy(kingRow, kingCol, this.board.board, this.shared.computerPrefix)) {
              const id = this.board.board[initRow][initCol].getAttribute('id');
              this.board.board[initRow][initCol].removeAttribute('id');
              this.board.board[finalRow][finalCol].setAttribute('id', id);
              if (this.positiveDiagonalSpy(kingRow, kingCol, this.board.board, this.shared.computerPrefix)) {
                this.board.board[finalRow][finalCol].removeAttribute('id');
                this.board.board[initRow][initCol].setAttribute('id', id);
                return true;
              }
              this.board.board[finalRow][finalCol].removeAttribute('id');
              this.board.board[initRow][initCol].setAttribute('id', id);
            }
          } else if (deltaFriend % negativeMagic === 0) {
            if (!this.negativeDiagonalSpy(kingRow, kingCol, this.board.board, this.shared.computerPrefix)) {
              const id = this.board.board[initRow][initCol].getAttribute('id');
              this.board.board[initRow][initCol].removeAttribute('id');
              this.board.board[finalRow][finalCol].setAttribute('id', id);
              if (this.negativeDiagonalSpy(kingRow, kingCol, this.board.board, this.shared.computerPrefix)) {
                this.board.board[finalRow][finalCol].removeAttribute('id');
                this.board.board[initRow][initCol].setAttribute('id', id);
                return true;
              }
              this.board.board[finalRow][finalCol].removeAttribute('id');
              this.board.board[initRow][initCol].setAttribute('id', id);
            }
          }

        }

      }
      return false;
    };

    if (threatFromKing()) {
      return true;
    }

    if ((topLeft === this.isEmpty && (bottomRight && bottomRight.includes(this.isEnemy))) ||
      (topRight === this.isEmpty && (bottomLeft && bottomLeft.includes(this.isEnemy))) ||
      (bottomRight === this.isEmpty && (topLeft && topLeft.includes(this.isEnemy))) ||
      (bottomLeft === this.isEmpty && (topRight && topRight.includes(this.isEnemy)))) {
      // The piece will be captured if it makes this move
      return true;
    } else {

      if (((bottomRightSniperL1 && rightSibling) &&
        (bottomRightSniperL1.includes(this.isEnemy) && rightSibling.includes(this.isFriend) && topRight === this.isEmpty)) ||
        ((bottomLeftSniperL1 && leftSibling) &&
        (bottomLeftSniperL1.includes(this.isEnemy) && leftSibling.includes(this.isFriend) && topLeft === this.isEmpty)) ||
        ((topLeftSniperL1 && rightSibling) &&
        (topLeftSniperL1.includes(this.isEnemy) && rightSibling.includes(this.isFriend) && bottomRight === this.isEmpty)) ||
        ((topRightSniperL1 && leftSibling) &&
        (topRightSniperL1.includes(this.isEnemy) && leftSibling.includes(this.isFriend) && bottomLeft === this.isEmpty)) ||
        ((bottomRightSniperL2 && bottomSibling) &&
        (bottomRightSniperL2.includes(this.isEnemy) && bottomSibling.includes(this.isFriend) && bottomLeft === this.isEmpty)) ||
        ((bottomLeftSniperL2 && bottomSibling) &&
        (bottomLeftSniperL2.includes(this.isEnemy) && bottomSibling.includes(this.isFriend) && bottomRight === this.isEmpty)) ||
        ((topRightSniperL2 && topSibling) &&
        (topRightSniperL2.includes(this.isEnemy) && topSibling.includes(this.isFriend) && topLeft === this.isEmpty)) ||
        ((topLeftSniperL2 && topSibling) &&
        (topLeftSniperL2.includes(this.isEnemy) && topSibling.includes(this.isFriend) && topRight === this.isEmpty)) ||
        ((topRightSniperS && farTopRight) &&
        (topRightSniperS.includes(this.isEnemy) && farTopRight.includes(this.isFriend) && topRight === this.isEmpty)) ||
        ((bottomLeftSniperS && farBottomLeft) &&
        (bottomLeftSniperS.includes(this.isEnemy) && farBottomLeft.includes(this.isFriend) && bottomLeft === this.isEmpty)) ||
        ((bottomRightSniperS && farBottomRight) &&
        (bottomRightSniperS.includes(this.isEnemy) && farBottomRight.includes(this.isFriend) && bottomRight === this.isEmpty)) ||
        ((topLeftSniperS && farTopLeft) &&
        (topLeftSniperS.includes(this.isEnemy) && farTopLeft.includes(this.isFriend) && topLeft === this.isEmpty))) {
        // This move will leave friend to be captured
        return true;
      }
    }
    return false;
  }
}
