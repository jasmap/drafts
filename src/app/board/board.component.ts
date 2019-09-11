import { Component, OnInit } from '@angular/core';
import { BoardService } from '../board.service';
import { SharedService } from '../shared.service';
import { MovesAnalyserService } from '../moves-analyser.service';
import { AttackService } from '../attack.service';
import { ComputerMoveService } from '../computer-move.service';
import { Player } from '../player';

@Component({
  selector: 'app-board',
  template: `
  <section>
  <div id="wrapper">
      <h1 class="chrome">DRAFTS</h1>
  </div>

  <table id="grid" (click) = "pieceManager($event)"></table>
  <div class="box">
      <a href="index.html" class="push_button blue">New Game</a>
  </div>
</section>
`,
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  cells: any[];
  element: HTMLTableElement;
  constructor(public cellsService: BoardService, public sharedService: SharedService,
              private movesAnalyser: MovesAnalyserService, private compMove: ComputerMoveService,
              private attack: AttackService) { }

  ngOnInit() {
    this.cells = this.cellsService.board;
    this.element = document.querySelector('#grid');
    this.element.appendChild(this.cellsService.fragement);
    this.boardSetup();
  }

  /**
   * Sets up the playing board
   */
  boardSetup() {
    const player = new Player(this.sharedService.playerPrefix,
      this.cellsService.playerInitialCells, this.sharedService, this.cellsService, this.movesAnalyser, this.compMove);
    player.deal();
    const computer = new Player(this.sharedService.computerPrefix,
      this.cellsService.computerInitialCells, this.sharedService, this.cellsService, this.movesAnalyser, this.compMove);
    computer.deal();
  }

  /**
   * Prevents a player who is out of turn from playing.
   */
  fairPlayEnforcer(event: any, cellOwner: string) {
    const antiCheating = (prefix: string) => {
        if (cellOwner.includes(prefix)) {
            event.preventDefault();
            this.cellsService.uncheckAllCells();
        } else if (cellOwner === 'empty') {
            for (const row of this.cells) {
                for (const cell of row) {
                    if (cell.checked === true &&
                        cell.hasAttribute('id') &&
                        cell.getAttribute('id').includes(prefix)) {
                        event.preventDefault();
                        this.cellsService.uncheckAllCells();
                    }
                }
            }
        }
    };
    if (!this.sharedService.computerTurn) {
        antiCheating(this.sharedService.computerPrefix);
    } else {
        antiCheating(this.sharedService.playerPrefix);
    }
  }

  /**
   * Listens to click events on the board and interprets the meaning.
   *
   * After interpreting and performing minor board GUI tweaking, it delegates action to be
   * taken to the responsible functions or methods.
   */
  pieceManager(event: any) {
    const target = event.target;

    // Filter events not coming from checkboxes
    if (target.getAttribute('type') !== 'checkbox') {
      event.preventDefault();
      return;
    }

    let [yRow, xCol] = target.getAttribute('class').split('-');
    yRow = +yRow;
    xCol = +xCol;
    let cellOwner = 'empty';
    if (target.hasAttribute('id')) {
        this.sharedService.currentPokerId = this.cells[yRow][xCol].getAttribute('id');
        [cellOwner, ] = this.sharedService.currentPokerId.split('-');
    }

    this.fairPlayEnforcer(event, cellOwner);

    switch (cellOwner) {
      case 'empty':
        for (let row = 0; row < this.cells.length; row++) {
          for (let col = 0; col < this.cells.length; col++) {
            const thisCell = this.cells[row][col];
            if (thisCell.disabled === true ||
                yRow === row && xCol === col) {
                continue;
            } else {
              if (!thisCell.hasAttribute('id')) {
                  // Deselect all other empty cells
                  thisCell.checked = false;
              }
            }

            // There is a piece already selected intended to be moved to the
            // empty cell just clicked.
            if (thisCell.hasAttribute('id') &&
              thisCell.checked === true) {

              // Check the identity of the piece and make a move
              if (this.sharedService.currentPokerId.includes(this.sharedService.playerPrefix)) {
                  for (const poker of this.sharedService.playerPokers) {
                    if (poker.id === this.sharedService.currentPokerId) {
                      poker.move(yRow, xCol);
                      return;
                    }
                  }
              } else if (this.sharedService.currentPokerId.includes(this.sharedService.computerPrefix)) {
                for (const poker of this.sharedService.computerPokers) {
                  if (poker.id === this.sharedService.currentPokerId) {
                    poker.move(yRow, xCol);
                    return;
                  }
                }
              }
            }
          }
        }
        break;
      case this.sharedService.playerPrefix:
        this.cellsService.uncheckOtherCells();
        break;
      case this.sharedService.computerPrefix:
        this.cellsService.uncheckOtherCells();
        break;
      case this.sharedService.computerPrefix + 'King':
        this.cellsService.uncheckOtherCells();
        break;
      case this.sharedService.playerPrefix + 'King':
        this.cellsService.uncheckOtherCells();
        break;
      default:
        alert('Ooops, this should not have happened');

    }
  }
}
