import { Piece } from './piece';
import { SharedService } from './shared.service';
import { BoardService } from './board.service';
import { MovesAnalyserService } from './moves-analyser.service';
import { ComputerMoveService } from './computer-move.service';
import { AttackService } from './attack.service';

export class Player {
  constructor(private name: string, private positions: string[],
              private sharedService: SharedService, private boardService: BoardService,
              private movesAnalyser: MovesAnalyserService, private computerMove: ComputerMoveService) {
  }

  /**
   * Creates piece objects and allocate them to the players.
   */
  deal() {
      for (let i = 1; i <= this.positions.length; i++) {
          const [row, col] = this.positions[i - 1].split('');
          const piece = new Piece(`${this.name}-${i}`, +row, +col, false,
          this.sharedService, this.boardService, this.movesAnalyser, this.computerMove);
          if (this.name === this.sharedService.playerPrefix) {
            this.sharedService.playerPokers.push(piece);
          } else {
              if (this.name === this.sharedService.computerPrefix) {
                this.sharedService.computerPokers.push(piece);
              }
          }

          this.boardService.board[+row][+col].id = `${this.name}-${i}`;

      }
  }
}
