import { TestBed } from '@angular/core/testing';

import { MovesAnalyserService } from './moves-analyser.service';
import { SharedService } from './shared.service';
import { BoardService } from './board.service';
import { ComputerMoveService } from './computer-move.service';
import { AttackService } from './attack.service';
import { Piece } from './piece';



describe('MovesAnalyserService', () => {
  const sharedService = new SharedService();
  const boardService = new BoardService(sharedService);
  const movesAnalyser = new MovesAnalyserService(sharedService, boardService);
  const attack = new AttackService(movesAnalyser, sharedService);
  const compMoves = new ComputerMoveService(sharedService, movesAnalyser, boardService, attack);

  beforeEach(() => {
    sharedService.resetGlobalVariables();
    boardService.cleanBoard();
  });

  it('should be created', () => {
    const service: MovesAnalyserService = TestBed.get(MovesAnalyserService);
    expect(service).toBeTruthy();
  });

  it('should not move a piece that endangers other normal pieces if safer moves are available', () => {
    boardService.board[0][5].setAttribute('id', 'computer-2');
    boardService.board[1][4].setAttribute('id', 'computer-3');
    boardService.board[2][3].setAttribute('id', 'computer-4');
    boardService.board[2][7].setAttribute('id', 'computer-5');
    boardService.board[2][5].setAttribute('id', 'computer-1'); // mainPiece
    boardService.board[3][6].setAttribute('id', 'computer-6');

    boardService.board[4][5].setAttribute('id', 'player-1');
    boardService.board[4][7].setAttribute('id', 'player-2');
    boardService.board[5][4].setAttribute('id', 'player-3');

    const mainPiece = new Piece('computer-1', 2, 5, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const computeriece1 = new Piece('computer-4', 2, 3, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const computerPiece2 = new Piece('computer-2', 0, 5, false, sharedService,
    boardService, movesAnalyser, compMoves);

    sharedService.computerTurn = true;
    sharedService.computerPokers = [mainPiece, computeriece1, computerPiece2];
    compMoves.computerMove();
    expect(compMoves.legalMovesBank.sort()).toEqual(['2. 3:3. 2', '0. 5:1. 6'].sort());
  });

  it('should not move a piece that endangers any friendly piece (normal or king) if safer moves are available', () => {
    boardService.board[3][0].setAttribute('id', 'computer-4');
    boardService.board[3][2].setAttribute('id', 'computer-5');
    boardService.board[4][1].setAttribute('id', 'computerKing-1'); // mainPiece

    boardService.board[5][0].setAttribute('id', 'player-3');

    const mainPiece = new Piece('computerKing-1', 4, 1, true, sharedService,
    boardService, movesAnalyser, compMoves);
    const computeriece1 = new Piece('computer-5', 3, 2, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const computerPiece2 = new Piece('computer-4', 3, 0, false, sharedService,
    boardService, movesAnalyser, compMoves);

    sharedService.computerTurn = true;
    sharedService.computerPokers = [mainPiece, computeriece1, computerPiece2];
    compMoves.computerMove();
    expect(compMoves.legalMovesBank).toEqual(['4. 1:5. 2,6. 3,7. 4']);
  });

  it('should not move a piece that endangers any friendly piece even if the threat is coming from a distant enemy king', () => {
    boardService.board[0][1].setAttribute('id', 'computer-1'); // mainPiece
    boardService.board[1][0].setAttribute('id', 'computer-2');
    boardService.board[3][2].setAttribute('id', 'computer-3');
    boardService.board[2][3].setAttribute('id', 'computer-4');
    boardService.board[4][3].setAttribute('id', 'computer-5');
    boardService.board[3][4].setAttribute('id', 'computer-6');

    boardService.board[0][7].setAttribute('id', 'playerKing-1');
    boardService.board[3][0].setAttribute('id', 'player-2');
    boardService.board[5][0].setAttribute('id', 'player-3');
    boardService.board[5][2].setAttribute('id', 'player-4');
    boardService.board[5][6].setAttribute('id', 'player-5');
    boardService.board[6][1].setAttribute('id', 'player-6');

    const mainPiece = new Piece('computerKing-1', 0, 1, true, sharedService,
    boardService, movesAnalyser, compMoves);
    const computeriece1 = new Piece('computer-2', 1, 0, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const computerPiece2 = new Piece('computer-3', 3, 2, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const computerPiece3 = new Piece('computer-4', 2, 3, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const computerPiece4 = new Piece('computer-5', 4, 3, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const computerPiece5 = new Piece('computer-3', 3, 4, false, sharedService,
    boardService, movesAnalyser, compMoves);

    const playerPiece1 = new Piece('playerKing-1', 0, 7, true, sharedService,
    boardService, movesAnalyser, compMoves);
    const playerPiece2 = new Piece('player-2', 3, 0, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const playerPiece3 = new Piece('player-3', 5, 0, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const playerPiece4 = new Piece('player-4', 5, 2, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const playerPiece5 = new Piece('player-5', 5, 6, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const playerPiece6 = new Piece('player-6', 6, 1, false, sharedService,
    boardService, movesAnalyser, compMoves);

    sharedService.computerTurn = true;
    sharedService.computerPokers = [mainPiece, computeriece1, computerPiece2];
    compMoves.computerMove();
    expect(compMoves.legalMovesBank).toEqual(['0. 1:1. 2']);
  });

});
