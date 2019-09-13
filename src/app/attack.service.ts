import { Injectable } from '@angular/core';

import { MovesAnalyserService } from './moves-analyser.service';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class AttackService {
  /**
   * A tag signifying that this attacking move will result in multiple possible responses
   * after the enemy has responded
   */
  multiResponsePrefix = 'multiple';

  /**
   * A tag to signify that the baiting and the responding piece moves are in parallel to each other
   */
  parallelMove = 'parallel';

  /**
   * A tag to signify that the baiting and the responding piece moves are perpendicular
   * to each other
   */
  crossMove = 'cross';


  /**
   * A flag that marks a baiting attack as having multi possible responses after the bait
   * has been captured
   */
  multiResponsesTag: string;

  constructor(private moves: MovesAnalyserService, private shared: SharedService) { }

  /**
   * Checks for the possibility of front baiting the concerned piece for a gain
   */
  frontalBait = (finalRow: number, finalCol: number, board: any[], enemyPrefix: string, initRow: number, initCol: number) => {
    const moves = this.moves;
    const shared = this.shared;

    const bottomLeft = moves.bottomLeftCell(finalRow, finalCol, board, enemyPrefix);
    const topLeft = moves.topLeftCell(finalRow, finalCol, board, enemyPrefix, initRow, initCol);
    const bottomRight = moves.bottomRightCell(finalRow, finalCol, board, enemyPrefix);
    const topRight = moves.topRightCell(finalRow, finalCol, board, enemyPrefix, initRow, initCol);
    const farTopLeft = moves.farTopLeftCell(finalRow, finalCol, board, enemyPrefix);
    const farBottomRight = moves.farBottomRightCell(finalRow, finalCol, board, enemyPrefix);
    const farTopRight = moves.farTopRightCell(finalRow, finalCol, board, enemyPrefix);
    const topRightSniperS = moves.topRightSniperSCell(finalRow, finalCol, board, enemyPrefix);
    const rightSibling = moves.rightSiblingCell(finalRow, finalCol, board, enemyPrefix);
    const topSibling = moves.topSiblingCell(finalRow, finalCol, board, enemyPrefix);
    const bottomSibling = moves.bottomSiblingCell(finalRow, finalCol, board, enemyPrefix);
    const bottomRightSniperL1 = moves.bottomRightSniperL1Cell(finalRow, finalCol, board, enemyPrefix);
    const topLeftSniperL2 = moves.topLeftSniperL2Cell(finalRow, finalCol, board, enemyPrefix);
    const topLeftSniperS = moves.topLeftSniperSCell(finalRow, finalCol, board, enemyPrefix);
    const leftSibling = moves.leftSiblingCell(finalRow, finalCol, board, enemyPrefix);
    const bottomLeftSniperL1 = moves.bottomLeftSniperL1Cell(finalRow, finalCol, board, enemyPrefix);
    const topRightSniperL2 = moves.topRightSniperL2Cell(finalRow, finalCol, board, enemyPrefix);
    const farBottomLeft = moves.farBottomLeftCell(finalRow, finalCol, board, enemyPrefix);
    const topRightSniperL1 = moves.topRightSniperL1Cell(finalRow, finalCol, board, enemyPrefix);
    const topLeftSniperL1 = moves.topLeftSniperL1Cell(finalRow, finalCol, board, enemyPrefix);
    const topLeftSniperL3 = moves.topLeftSniperL3Cell(finalRow, finalCol, board, enemyPrefix);
    const topRightSniperL3 = moves.topRightSniperL3Cell(finalRow, finalCol, board, enemyPrefix);
    const topRightSniperL1Attacker = moves.topRightSniperL1AttackerCell(finalRow, finalCol, board, enemyPrefix);
    const topLeftSniperL1Attacker = moves.topLeftSniperL1AttackerCell(finalRow, finalCol, board, enemyPrefix);
    const bottomRightSniperL1Attacker = moves.bottomRightSniperL1AttackerCell(finalRow, finalCol, board, enemyPrefix);
    const bottomLeftSniperL1Attacker = moves.bottomLeftSniperL1AttackerCell(finalRow, finalCol, board, enemyPrefix);

    const isEmpty: string = moves.isEmpty;
    const isEnemy: string = moves.isEnemy;
    const isFriend: string = moves.isFriend;
    const isEnemyKing: string = moves.isEnemyKing;
    const isFriendKing: string = moves.isFriendKing;
    const kingSuffix: string = moves.kingSuffix;

    this.multiResponsesTag = undefined;

    // Essential coordinates
    const topLeftRow = finalRow - 1;
    const topLeftCol = finalCol - 1;
    const topRightRow = finalRow - 1;
    const topRightCol = finalCol + 1;

    /**
     * Checks for the signature arrow-head formation,
     * one of the options required arrangement for possible baiting
     *
     * @param pointing - the direction at which the arrow is pointing (left or right)
     * @param direction - The baiting piece move direction in respect to the responding
     * piece follow up capture move (parallel or cross)
     */
    const arrowHeadCheck = (pointing: string, direction: string) => {
      let arrowTip: string;
      let arrowBottomEdge: string;
      let arrowTopEdge: string;
      let bottomEdgeProtector: string;
      let topEdgeParallelAttackProtector: string;
      let transitCrossAttackCell: string;

      if (pointing === 'right') {
        arrowTip = bottomRight;
        arrowBottomEdge = bottomLeft;
        arrowTopEdge = topRight;
        topEdgeParallelAttackProtector = farTopRight;
        if (direction === this.parallelMove) {
          bottomEdgeProtector = farBottomLeft;
        } else if (direction === this.crossMove) {
          bottomEdgeProtector = bottomSibling;
          transitCrossAttackCell = leftSibling;
        }
      } else if (pointing === 'left') {
        arrowTip = bottomLeft;
        arrowBottomEdge = bottomRight;
        arrowTopEdge = topLeft;
        topEdgeParallelAttackProtector = farTopLeft;
        if (direction === this.parallelMove) {
          bottomEdgeProtector = farBottomRight;
        } else if (direction === this.crossMove) {
          bottomEdgeProtector = bottomSibling;
          transitCrossAttackCell = rightSibling;
        }
      }

      /**
       * Checks for the availability of transit and final landing positions
       * required for a parallel attack
       */
      const arrowEdgesParallelAttackCheck = () => {
        return (arrowBottomEdge.includes(isEnemy) && bottomEdgeProtector === isEmpty) ||
              (arrowTopEdge.includes(isEnemy) && topEdgeParallelAttackProtector === isEmpty);
      };

      /**
       * Checks for the availability of transit and final landing positions
       * required for a cross attack
       */
      const arrowEdgesCrossAttackCheck = () => {
        return transitCrossAttackCell === isEmpty &&
          bottomEdgeProtector === isEmpty &&
          arrowBottomEdge.includes(isEnemy);
      };

      /**
       * Decides which attack formation to use in the parent function return evaluation
       */
      const attackDirection = () => {
        if (direction === this.parallelMove) {
          return arrowEdgesParallelAttackCheck();
        } else if (direction === this.crossMove) {
          return arrowEdgesCrossAttackCheck();
        }
      };

      return (arrowTip !== undefined && arrowTip.includes(isEnemy)) &&
              arrowBottomEdge !== isEmpty && arrowTopEdge !== isEmpty && attackDirection();
    };

    /**
     * Checks for the basic formation of the attacking pieces necessary to launch
     * any baiting attack, i.e at least one baiting piece supported by a friendly
     * piece on its back
     *
     * @param direction - The baiting piece move direction in respect to the responding
     * piece follow up capture move (parallel or cross)
     */
    const negativeDiagonalAttackFormationCheck = (direction: string) => {
      let initialSpot: string;
      let supporter: string;
      let sniper: string;

      if (direction === this.parallelMove) {
        initialSpot = topLeft;
        supporter = farTopLeft;
        sniper = topLeftSniperS;
      } else if (direction === this.crossMove) {
        initialSpot = topRight;
        supporter = topSibling;
        sniper = topLeftSniperL2;
      }
      return initialSpot === isEmpty &&
      (supporter !== undefined && supporter.includes(isFriend)) &&
      (sniper === undefined || sniper.includes(isFriend));
    };

    /**
     * Checks for the basic formation of the attacking pieces necessary to launch
     * any baiting attack, i.e at least one baiting piece supported by a friendly
     * piece on its back
     *
     * @param direction - The baiting piece move direction in respect to the responding
     * piece follow up capture move (parallel or cross)
     */
    const positiveDiagonalAttackFormationCheck = (direction: string) => {
      let initialSpot: string;
      let supporter: string;
      let sniper: string;

      if (direction === this.parallelMove) {
        initialSpot = topRight;
        supporter = farTopRight;
        sniper = topRightSniperS;
      } else if (direction === this.crossMove) {
        initialSpot = topLeft;
        supporter = topSibling;
        sniper = topRightSniperL2;
      }
      return initialSpot === isEmpty &&
      (supporter !== undefined && supporter.includes(isFriend)) &&
      (sniper === undefined || sniper.includes(isFriend));
    };

    /**
     * Checks for favourable flanking conditions to launch a baiting attack
     *
     * @param pointing - the direction at which the arrow is pointing (left or right)
     * @param direction - The baiting piece move direction in respect to the responding
     * piece follow up capture move (parallel or cross)
     */
    const flankingCheck = (pointing: string, direction: string) => {
      let topFlanker: string;
      let bottomFlanker: string;
      let bottomFlankerGuard: string;
      let topFlankerGuard: string;
      let transitCell: string;
      let bottomEdgeProtector: string;
      let arrowBottomEdge: string;
      let crossFireSeriesGuard: string;
      let crossFireSeries: string;
      let crossFireTop: string;
      let crossFireTopGuard: string;

      if (pointing === 'right') {
        bottomFlanker = leftSibling;
        bottomFlankerGuard = bottomLeftSniperL1;
        if (direction === this.parallelMove) {
          topFlanker = topSibling;
          topFlankerGuard = topRightSniperL2;
        } else if (direction === this.crossMove) {
          topFlanker = farTopLeft;
          topFlankerGuard = topLeftSniperS;
          transitCell = leftSibling;
          bottomEdgeProtector = bottomSibling;
          arrowBottomEdge = bottomLeft;
          crossFireSeries = bottomLeftSniperL1;
          crossFireSeriesGuard = bottomLeftSniperL1Attacker;
          crossFireTop = topLeftSniperL1;
          crossFireTopGuard = topLeftSniperL1Attacker;

        }
      } else if (pointing === 'left') {
        bottomFlanker = rightSibling;
        bottomFlankerGuard = bottomRightSniperL1;
        if (direction === this.parallelMove) {
          topFlanker = topSibling;
          topFlankerGuard = topLeftSniperL2;
        } else if (direction === this.crossMove) {
          topFlanker = farTopRight;
          topFlankerGuard = topRightSniperS;
          transitCell = rightSibling;
          bottomEdgeProtector = bottomSibling;
          arrowBottomEdge = bottomRight;
          crossFireSeries = bottomRightSniperL1;
          crossFireSeriesGuard =  bottomRightSniperL1Attacker;
          crossFireTop = topRightSniperL1;
          crossFireTopGuard = topRightSniperL1Attacker;

        }
      }

      /**
       * The perfect parallel bait attacking formation, i.e one without
       * flanking pieces, that are either supporting the baiting piece or endangered
       * by the baiting piece move
       */
      const parallelAttackNoFlankers = () => {
        return bottomFlanker === isEmpty && topFlanker === isEmpty;
      };

      /**
       * The perfect cross bait attacking formation, i.e one without
       * an inline piece, that is either supporting the baiting piece or endangered
       * by the baiting piece move
       */
      const crossAttackNoFlankers = () => {
        return topFlanker === isEmpty && transitCell === isEmpty;
      };


      /**
       * Parallel attack with baiting piece flanked and hence shielded by enemy
       * pieces on its initial position
       */
      const parallelAttackEnemyFlankers = () => {
        return bottomFlanker.includes(isEnemy) && topFlanker.includes(isEnemy);
      };

      /**
       * Making a counter attack by parallel baiting the piece under attack
       */
      const parallelAttackBaitFired = () => {
        return bottomFlanker.includes(isEnemy) && topFlanker === isEmpty ||
                bottomFlanker === isEmpty && topFlanker.includes(isEnemy);
      };

      /**
       * Making a counter attack by cross baiting the piece under attack
       */
      const crossAttackBaitFired = () => {
        return topFlanker.includes(isEnemy) && topFlankerGuard !== isEmpty;
      };

      /**
       * Parallel attack with baiting piece flanked by protected friendly
       * pieces on its initial position
       */
      const parallelAttackFriendlyFlankers = () => {
        return bottomFlanker.includes(isFriend) && topFlanker.includes(isFriend) &&
              (bottomFlankerGuard === undefined || bottomFlankerGuard.includes(isFriend)) &&
              (topFlankerGuard === undefined || topFlankerGuard.includes(isFriend));
      };

      /**
       * Parallel attack with baiting piece flanked by a protected friendly
       * piece and and enemy piece on its initial position
       */
      const parallelAttackMixedFlankers = () => {
        return (bottomFlanker.includes(isEnemy) && topFlanker.includes(isFriend) &&
        (topFlankerGuard === undefined || topFlankerGuard.includes(isFriend))) ||
      (bottomFlanker.includes(isFriend) && topFlanker.includes(isEnemy) &&
        (bottomFlankerGuard === undefined || bottomFlankerGuard.includes(isFriend)));
      };

      /**
       * Checks for the availability of transit and final landing positions
       * required for a cross attack
       */
      const crossTransitAndFinalPosCheck = () => {
        return transitCell === isEmpty && (
          (bottomEdgeProtector === isEmpty && arrowBottomEdge.includes(isEnemy)) ||
          (crossFireSeries.includes(isEnemy) && crossFireSeriesGuard === isEmpty) ||
          (crossFireTop.includes(isEnemy) && crossFireTopGuard === isEmpty)
          );
      };

      if (direction === this.parallelMove) {
        return parallelAttackNoFlankers() ||
              parallelAttackFriendlyFlankers() ||
              parallelAttackEnemyFlankers() ||
              parallelAttackBaitFired() ||
              parallelAttackMixedFlankers();
      } else if (direction === this.crossMove) {
        // console.log('crossTransitAndFinalPosCheck()');
        return crossTransitAndFinalPosCheck() && (crossAttackNoFlankers() || crossAttackBaitFired());
      }
    };


    /**
     * Baiting attack with baiting piece supported by 2 friendly
     * pieces, both capable of capturing the baited enemy piece
     *
     * @param direction - the direction at which the baiting piece will move.
     * For an arrow formation, this is the same as the direction at which
     * the arrow is pointing (left or right)
     */
    const baitingAttackDoubleResponse = (direction: string) => {
      let topFlanker: string;
      let bottomFlanker: string;
      let bottomFlankerGuard: string;
      let topFlankerGuard: string;
      let temptedPiece: string;

      if (direction === 'right') {
        bottomFlanker = leftSibling;
        bottomFlankerGuard = bottomLeftSniperL1;
        topFlanker = topSibling;
        topFlankerGuard = topRightSniperL2;
        temptedPiece = bottomRight;

      } else if (direction === 'left') {
        bottomFlanker = rightSibling;
        bottomFlankerGuard = bottomRightSniperL1;
        topFlanker = topSibling;
        topFlankerGuard = topLeftSniperL2;
        temptedPiece = bottomLeft;
      }

      /**
       * Checks if the tempted piece is a King and if so checks if it will only have one
       * legal move when baited
       */
      const restictionCheck = () => {
        let crossCaptureSpy: boolean;

        if (temptedPiece.includes(kingSuffix)) {
          if (direction === 'right') {
            crossCaptureSpy = moves.positiveDiagonalSpy(topLeftRow, topLeftCol, board, shared.playerPrefix);
          } else if (direction === 'left') {
            crossCaptureSpy = moves.negativeDiagonalSpy(topRightRow, topRightCol, board, shared.playerPrefix);
          }
          return !crossCaptureSpy;
        }
        return true;
      };

      return restictionCheck() && (topFlanker.includes(isFriend) && bottomFlanker === isEmpty) &&
            (topFlankerGuard === undefined || topFlankerGuard.includes(isFriend)) ||
            (topFlanker === isEmpty && bottomFlanker.includes(isFriend)) &&
            (bottomFlankerGuard === undefined || bottomFlankerGuard.includes(isFriend));
    };

    /**
     * Checks for the signature letter 'L' formation,
     * one of the options required, for possible baiting
     *
     * @param baitDirection - The baiting piece move direction (left or right)
     * @param facing -  the direction where the 'L' formation is facing (up, down)
     * piece follow up capture move (parallel or cross)
     */
    const bigLCheck = (baitDirection: string, facing: string) => {
      let cornerL: string;
      let longArmTop: string;
      let shortArmTop: string;
      let responder: string;
      let sniper: string;
      let sniperGuard: string;
      let transitCell: string;
      let longArmGuard: string;
      let seriesCrossFire: string;
      let seriesCrossFireGuard: string;
      let baitSpoilerCell: string;
      /**
       * The cell that block the tempted piece from propagating it's moves.
       * The tempted piece must have only one legal landing position after
       * capturing the baited piece.
       */
      let restrictorCell: string;
      let restrictorCellGuard: string;

      responder = topSibling;

      if (baitDirection === 'right') {
        cornerL = topLeft;
        longArmTop = topRightSniperL1;
        shortArmTop = bottomLeft;
        sniper = topLeftSniperL2;
        sniperGuard = topLeftSniperL3;
        transitCell = rightSibling;
        longArmGuard = topRightSniperL1Attacker;
        seriesCrossFire = bottomRightSniperL1;
        seriesCrossFireGuard = bottomRightSniperL1Attacker;
        baitSpoilerCell = bottomRight;
        restrictorCell = farTopRight;
        restrictorCellGuard = topRightSniperS;

      } else if (baitDirection === 'left') {
        cornerL = topRight;
        longArmTop = topLeftSniperL1;
        shortArmTop = bottomRight;
        sniper = topRightSniperL2;
        sniperGuard = topRightSniperL3;
        transitCell = leftSibling;
        longArmGuard = topLeftSniperL1Attacker;
        seriesCrossFire = bottomLeftSniperL1;
        seriesCrossFireGuard = bottomLeftSniperL1Attacker;
        baitSpoilerCell = bottomLeft;
        restrictorCell = farTopLeft;
        restrictorCellGuard = topLeftSniperS;

      }

      /**
       * Checks for the attacking formation of friendly pieces necessary
       * for this skewed bait attack
       */
      const attackingFormationCheck = () => {
        return (responder !== undefined && responder === 'isFriend') &&
          (sniperGuard === undefined || sniper.includes(isFriend)) &&
          (sniperGuard === undefined || sniperGuard.includes(isFriend));
      };

      /**
       * Checks if the tempted piece is a King and if so checks if it will only have one
       * legal move when baited
       */
      const restictorCellCheck = () => {
        let crossCaptureSpy: boolean;
        if (baitDirection === 'left') {
          crossCaptureSpy = moves.positiveDiagonalSpy(topLeftRow, topLeftCol, board, shared.playerPrefix);
        } else if (baitDirection === 'right') {
          crossCaptureSpy = moves.negativeDiagonalSpy(topRightRow, topRightCol, board, shared.playerPrefix);
        }

        if (shortArmTop.includes(kingSuffix)) {
          return !crossCaptureSpy && (restrictorCell.includes(isEnemy) ||
                restrictorCell.includes(isFriend) &&
                (restrictorCellGuard === undefined || restrictorCellGuard.includes(isFriend)));
        }
        return false;
      };

      /**
       * Checks for the enemy pieces formation necessary for a skewed bait attack
       */
      const enemyFormationCheck = () => {
        if (shortArmTop !== undefined && shortArmTop.includes(isEnemy)) {
          const normalPieceRequirement = ((longArmTop !== undefined && longArmTop.includes(isEnemy)) && longArmGuard === isEmpty ) ||
            (seriesCrossFire !== undefined && seriesCrossFire.includes(isEnemy) && seriesCrossFireGuard === isEmpty);
          if (shortArmTop === isEnemy) {
            return normalPieceRequirement;
          } else {
            return normalPieceRequirement && restictorCellCheck();
          }
        }
        return false;
      };

      return transitCell === isEmpty &&
            (baitSpoilerCell !== undefined && (baitSpoilerCell === isEmpty || baitSpoilerCell.includes(isFriend))) &&
            attackingFormationCheck() && enemyFormationCheck();
    };

    if (bigLCheck('right', 'down')) {
      if (baitingAttackDoubleResponse('right')) {
        this.multiResponsesTag = this.multiResponsePrefix + this.crossMove;
      }
      console.log('bigL, right, down');
      return true;
    } else if (bigLCheck('left', 'down')) {
      if (baitingAttackDoubleResponse('right')) {
        this.multiResponsesTag = this.multiResponsePrefix + this.crossMove;
      }

      return true;
    }

    if (arrowHeadCheck('right', this.parallelMove)) {
      console.log('arrowHeadCheck, right, parallel');
      if (negativeDiagonalAttackFormationCheck(this.parallelMove)) {
        if (flankingCheck('right', this.parallelMove)) {
          return true;
        } else if (baitingAttackDoubleResponse('right')) {
          this.multiResponsesTag = this.multiResponsePrefix + this.parallelMove;
          return true;
        }
      } else if (positiveDiagonalAttackFormationCheck(this.crossMove)) {
        console.log('positiveDiagonalAttackFormationCheck 1');
        if (flankingCheck('right', this.crossMove)) {
          return true;
        }
      }
    } else if (arrowHeadCheck('right', this.crossMove)) {
      console.log('arrowHeadCheck right cross');
      if (positiveDiagonalAttackFormationCheck(this.crossMove)) {
        console.log('positiveDiagonalAttackFormationCheck');
        if (flankingCheck('right', this.crossMove)) {
          return true;
        // TODO: Implement the below else if

        // } else if (crossAttackDoubleResponse('right', crossMove)) {
        //   this.hasMultiResponses = true;
        //   return true;
        }
      }
    }


    if (arrowHeadCheck('left', this.parallelMove)) {
      console.log('arrowHeadCheck left parallel');
      if (positiveDiagonalAttackFormationCheck(this.parallelMove)) {
        if (flankingCheck('left', this.parallelMove)) {
          return true;
        } else if (baitingAttackDoubleResponse('left')) {
          this.multiResponsesTag = this.multiResponsePrefix + this.parallelMove;
          return true;
        }
      } else if (negativeDiagonalAttackFormationCheck(this.crossMove)) {
        if (flankingCheck('left', this.crossMove)) {
          return true;
        }
      }
    } else if (arrowHeadCheck('left', this.crossMove)) {
      console.log('arrowHeadCheck left cross');
      if (negativeDiagonalAttackFormationCheck(this.crossMove)) {
        if (flankingCheck('left', this.crossMove)) {
          return true;

          // TODO: Implement the below else if

        // } else if (crossAttackDoubleResponse('left', crossMove)) {
        //     console.log('Double response Left cross');
        //     this.hasMultiResponses = true;
        //     return true;
        }
      }
    }

    return false;
  }

  resetMultipleResponseTag() {
    this.multiResponsesTag = undefined;
  }
}
