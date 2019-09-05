import { Injectable } from '@angular/core';

import { MovesAnalyserService } from './moves-analyser.service';

@Injectable({
  providedIn: 'root'
})
export class AttackService {

  /**
   * A flag that marks a baiting attack as having multi possible responses after the bait
   * has been captured
   */
  hasMultiResponses: boolean;

  constructor(private movesAnalyser: MovesAnalyserService) { }

  frontalBait = (finalRow: number, finalCol: number, board: any[], enemyPrefix: string, initRow: number, initCol: number) => {
    const bottomLeft = this.movesAnalyser.bottomLeftCell(finalRow, finalCol, board, enemyPrefix);
    const topLeft = this.movesAnalyser.topLeftCell(finalRow, finalCol, board, enemyPrefix, initRow, initCol);
    const bottomRight = this.movesAnalyser.bottomRightCell(finalRow, finalCol, board, enemyPrefix);
    const topRight = this.movesAnalyser.topRightCell(finalRow, finalCol, board, enemyPrefix, initRow, initCol);
    const farTopLeft = this.movesAnalyser.farTopLeftCell(finalRow, finalCol, board, enemyPrefix);
    const farBottomRight = this.movesAnalyser.farBottomRightCell(finalRow, finalCol, board, enemyPrefix);
    const farTopRight = this.movesAnalyser.farTopRightCell(finalRow, finalCol, board, enemyPrefix);
    const topRightSniperS = this.movesAnalyser.topRightSniperSCell(finalRow, finalCol, board, enemyPrefix);
    const rightSibling = this.movesAnalyser.rightSiblingCell(finalRow, finalCol, board, enemyPrefix);
    const topSibling = this.movesAnalyser.topSiblingCell(finalRow, finalCol, board, enemyPrefix);
    const bottomSibling = this.movesAnalyser.bottomSiblingCell(finalRow, finalCol, board, enemyPrefix);
    const bottomRightSniperL1 = this.movesAnalyser.bottomRightSniperL1Cell(finalRow, finalCol, board, enemyPrefix);
    const topLeftSniperL2 = this.movesAnalyser.topLeftSniperL2Cell(finalRow, finalCol, board, enemyPrefix);
    const topLeftSniperS = this.movesAnalyser.topLeftSniperSCell(finalRow, finalCol, board, enemyPrefix);
    const leftSibling = this.movesAnalyser.leftSiblingCell(finalRow, finalCol, board, enemyPrefix);
    const bottomLeftSniperL1 = this.movesAnalyser.bottomLeftSniperL1Cell(finalRow, finalCol, board, enemyPrefix);
    const topRightSniperL2 = this.movesAnalyser.topRightSniperL2Cell(finalRow, finalCol, board, enemyPrefix);
    const farBottomLeft = this.movesAnalyser.farBottomLeftCell(finalRow, finalCol, board, enemyPrefix);
    const topRightSniperL1 = this.movesAnalyser.topRightSniperL1Cell(finalRow, finalCol, board, enemyPrefix);
    const topLeftSniperL1 = this.movesAnalyser.topLeftSniperL1Cell(finalRow, finalCol, board, enemyPrefix);
    const topLeftSniperL3 = this.movesAnalyser.topLeftSniperL3Cell(finalRow, finalCol, board, enemyPrefix);
    const topRightSniperL3 = this.movesAnalyser.topRightSniperL3Cell(finalRow, finalCol, board, enemyPrefix);
    const topRightSniperL1Attacker = this.movesAnalyser.topRightSniperL1AttackerCell(finalRow, finalCol, board, enemyPrefix);
    const topLeftSniperL1Attacker = this.movesAnalyser.topLeftSniperL1AttackerCell(finalRow, finalCol, board, enemyPrefix);
    const bottomRightSniperL1Attacker = this.movesAnalyser.bottomRightSniperL1AttackerCell(finalRow, finalCol, board, enemyPrefix);
    const bottomLeftSniperL1Attacker = this.movesAnalyser.bottomLeftSniperL1AttackerCell(finalRow, finalCol, board, enemyPrefix);

    this.hasMultiResponses = false;

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
        transitCrossAttackCell = leftSibling;
        if (direction === 'parallel') {
          bottomEdgeProtector = farBottomLeft;
        } else if (direction === 'cross') {
          bottomEdgeProtector = bottomSibling;
        }
      } else if (pointing === 'left') {
        arrowTip = bottomLeft;
        arrowBottomEdge = bottomRight;
        arrowTopEdge = topLeft;
        topEdgeParallelAttackProtector = farTopLeft;
        transitCrossAttackCell = rightSibling;
        if (direction === 'parallel') {
          bottomEdgeProtector = farBottomRight;
        } else if (direction === 'cross') {
          bottomEdgeProtector = bottomSibling;
        }
      }

      /**
       * Checks for the availability of transit and final landing positions
       * required for a parallel attack
       */
      const arrowEdgesParallelAttackCheck = () => {
        return (arrowBottomEdge === 'isEnemy' && bottomEdgeProtector === 'isEmpty') ||
              (arrowTopEdge === 'isEnemy' && topEdgeParallelAttackProtector === 'isEmpty');
      };

      /**
       * Checks for the availability of transit and final landing positions
       * required for a cross attack
       */
      const arrowEdgesCrossAttackCheck = () => {
        return transitCrossAttackCell === 'isEmpty' && bottomEdgeProtector === 'isEmpty';
      };

      /**
       * Decides which attack formation to use in the parent function return evaluation
       */
      const attackDirection = () => {
        if (direction === 'parallel') {
          return arrowEdgesParallelAttackCheck();
        } else if (direction === 'cross') {
          return arrowEdgesCrossAttackCheck();
        }
      };


      return arrowTip === 'isEnemy' && arrowBottomEdge !== 'isEmpty' && arrowTopEdge !== 'isEmpty' && attackDirection();
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

      if (direction === 'parallel') {
        initialSpot = topLeft;
        supporter = farTopLeft;
        sniper = topLeftSniperS;
      } else if (direction === 'cross') {
        initialSpot = topRight;
        supporter = topSibling;
        sniper = topLeftSniperL2;
      }
      return initialSpot === 'isEmpty' && supporter === 'isFriend' &&
      (sniper === 'isFriend' || sniper === undefined);
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

      if (direction === 'parallel') {
        initialSpot = topRight;
        supporter = farTopRight;
        sniper = topRightSniperS;
      } else if (direction === 'cross') {
        initialSpot = topLeft;
        supporter = topSibling;
        sniper = topRightSniperL2;
      }
      return initialSpot === 'isEmpty' && supporter === 'isFriend' &&
      (sniper === 'isFriend' || sniper === undefined);
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

      if (pointing === 'right') {
        bottomFlanker = leftSibling;
        bottomFlankerGuard = bottomLeftSniperL1;
        if (direction === 'parallel') {
          topFlanker = topSibling;
          topFlankerGuard = topRightSniperL2;
        } else if (direction === 'cross') {
          topFlanker = farTopLeft;
          topFlankerGuard = topLeftSniperS;

        }
      } else if (pointing === 'left') {
        bottomFlanker = rightSibling;
        bottomFlankerGuard = bottomRightSniperL1;
        if (direction === 'parallel') {
          topFlanker = topSibling;
          topFlankerGuard = topLeftSniperL2;
        } else if (direction === 'cross') {
          topFlanker = farTopRight;
          topFlankerGuard = topRightSniperS;
        }
      }

      /**
       * The perfect parallel bait attacking formation, i.e one without
       * flanking pieces, that are either supporting the baiting piece or endangered
       * by the baiting piece move
       */
      const parallelAttackNoFlankers = () => {
        return bottomFlanker === 'isEmpty' && topFlanker === 'isEmpty';
      };

      /**
       * The perfect cross bait attacking formation, i.e one without
       * an inline piece, that is either supporting the baiting piece or endangered
       * by the baiting piece move
       */
      const crossAttackNoFlankers = () => {
        return topFlanker === 'isEmpty';
      };


      /**
       * Parallel attack with baiting piece flanked and hence shielded by enemy
       * pieces on its initial position
       */
      const parallelAttackEnemyFlankers = () => {
        return bottomFlanker === 'isEnemy' && topFlanker === 'isEnemy';
      };

      /**
       * Making a counter attack by parallel baiting the piece under attack
       */
      const parallelAttackBaitFired = () => {
        return bottomFlanker === 'isEnemy' && topFlanker === 'isEmpty' ||
                bottomFlanker === 'isEmpty' && topFlanker === 'isEnemy';
      };

      /**
       * Making a counter attack by cross baiting the piece under attack
       */
      const crossAttackBaitFired = () => {
        return topFlanker === 'isEnemy' && topFlankerGuard !== 'isEmpty';
      };

      /**
       * Parallel attack with baiting piece flanked by protected friendly
       * pieces on its initial position
       */
      const parallelAttackFriendlyFlankers = () => {
        return bottomFlanker === 'isFriend' && topFlanker === 'isFriend' &&
              (bottomFlankerGuard === 'isFriend' || bottomFlankerGuard === undefined) &&
              (topFlankerGuard === 'isFriend' || topFlankerGuard === undefined);
      };

    // } else if (pointing === 'left') {
    //   bottomFlanker = rightSibling;
    //   bottomFlankerGuard = bottomLeftSniperL1;
    //   if (direction === 'parallel') {
    //     topFlanker = topSibling;
    //     topFlankerGuard = topLeftSniperL2;
    //   } else if (direction === 'cross') {
    //     topFlanker = farTopRight;
    //     topFlankerGuard = topRightSniperS;
    //   }
    // }

      /**
       * Parallel attack with baiting piece flanked by a protected friendly
       * piece and and enemy piece on its initial position
       */
      const parallelAttackMixedFlankers = () => {
        return (bottomFlanker === 'isEnemy' && topFlanker === 'isFriend' &&
        (topFlankerGuard === 'isFriend' || topFlankerGuard === undefined)) ||
      (bottomFlanker === 'isFriend' && topFlanker === 'isEnemy' &&
        (bottomFlankerGuard === 'isFriend' || bottomFlankerGuard === undefined));
      };

      if (direction === 'parallel') {
        return parallelAttackNoFlankers() ||
              parallelAttackFriendlyFlankers() ||
              parallelAttackEnemyFlankers() ||
              parallelAttackBaitFired() ||
              parallelAttackMixedFlankers();
      } else if (direction === 'cross') {
        return crossAttackNoFlankers() || crossAttackBaitFired();
      }
    };


    /**
     * Parallel attack with baiting piece supported by 2 friendly
     * pieces, both capable of capturing the baited enemy piece
     *
     * @param pointing - the direction at which the arrow is pointing (left or right)
     * @param direction - The baiting piece move direction in respect to the responding
     * piece follow up capture move (parallel or cross)
     */
    const parallelAttackDoubleResponse = (pointing: string, direction: string) => {
      let topFlanker: string;
      let bottomFlanker: string;
      let bottomFlankerGuard: string;
      let topFlankerGuard: string;

      if (pointing === 'right') {
        bottomFlanker = leftSibling;
        bottomFlankerGuard = bottomLeftSniperL1;
        topFlanker = topSibling;
        topFlankerGuard = topRightSniperL2;

      } else if (pointing === 'left') {
        bottomFlanker = rightSibling;
        bottomFlankerGuard = bottomRightSniperL1;
        topFlanker = topSibling;
        topFlankerGuard = topLeftSniperL2;
      }

      return (topFlanker === 'isFriend' && bottomFlanker === 'isEmpty') &&
            (topFlankerGuard === 'isFriend' || topFlankerGuard === undefined) ||
            (topFlanker === 'isEmpty' && bottomFlanker === 'isFriend') &&
            (bottomFlankerGuard === 'isFriend' || bottomFlankerGuard === undefined);
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

      }

      /**
       * Checks for the attacking formation of friendly pieces necessary
       * for this skewed bait attack
       */
      const attackingFormationCheck = () => {
        return responder === 'isFriend' && sniper === 'isFriend' &&
          (sniperGuard === 'isFriend' || sniperGuard === undefined);
      };

      /**
       * Checks for the enemy pieces formation necessary for a skewed bait attack
       */
      const enemyFormationCheck = () => {
        return shortArmTop === 'isEnemy' &&
          ((longArmTop === 'isEnemy' && longArmGuard === 'isEmpty' ) ||
            (seriesCrossFire === 'isEnemy' && seriesCrossFireGuard === 'isEmpty'));
      };

      return transitCell === 'isEmpty' &&
            (baitSpoilerCell === 'isEmpty' || baitSpoilerCell === 'isFriend') &&
            attackingFormationCheck() && enemyFormationCheck();
    };

    if (arrowHeadCheck('right', 'parallel')) {
      if (negativeDiagonalAttackFormationCheck('parallel')) {
        if (flankingCheck('right', 'parallel')) {
          return true;
        } else if (parallelAttackDoubleResponse('right', 'parallel')) {
          this.hasMultiResponses = true;
          return true;
        }
      } else if (positiveDiagonalAttackFormationCheck('cross')) {
        if (flankingCheck('right', 'cross')) {
          return true;
        }
      }
    }

    if (bigLCheck('right', 'down')) {
      return true;
    } else if (bigLCheck('left', 'down')) {
      return true;
    }

    if (arrowHeadCheck('left', 'parallel')) {
      console.log('Arrowhead Left');
      if (positiveDiagonalAttackFormationCheck('parallel')) {
        console.log('Attack pos diagonal');
        if (flankingCheck('left', 'parallel')) {
          console.log('Flanking check left & parallel');
          return true;
        } else if (parallelAttackDoubleResponse('left', 'parallel')) {
          console.log('Double response Left parallel');
          this.hasMultiResponses = true;
          return true;
        }
      } else if (negativeDiagonalAttackFormationCheck('cross')) {
        if (flankingCheck('left', 'cross')) {
          return true;
        }
      }
    }
    return false;
  }
}
