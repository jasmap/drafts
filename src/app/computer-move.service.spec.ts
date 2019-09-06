import { TestBed } from '@angular/core/testing';

import { ComputerMoveService } from './computer-move.service';
import { SharedService } from './shared.service';
import { MovesAnalyserService } from './moves-analyser.service';
import { BoardService } from './board.service';
import { AttackService } from './attack.service';
import { Piece } from './piece';


describe('ComputerMoveService', () => {
  const sharedService = new SharedService();
  const movesAnalyser = new MovesAnalyserService();
  const attack = new AttackService(movesAnalyser);
  const boardService = new BoardService(movesAnalyser, sharedService);
  const compMoves = new ComputerMoveService(sharedService, movesAnalyser, boardService, attack);

  beforeEach(() => {
    sharedService.resetGlobalVariables();
    boardService.cleanBoard();
  });


  it('should be created', () => {
    const service: ComputerMoveService = TestBed.get(ComputerMoveService);
    expect(service).toBeTruthy();
  });

  it('should move the piece under fire', () => {
    boardService.board[4][5].setAttribute('id', 'player-2');
    boardService.board[5][4].setAttribute('id', 'player-3');
    boardService.board[6][1].setAttribute('id', 'player-4');
    boardService.board[7][0].setAttribute('id', 'player-5');
    boardService.board[6][3].setAttribute('id', 'computer-1'); // mainPiece
    const mainPiece = new Piece('computer-1', 6, 3, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const computeriece1 = new Piece('computer-7', 3, 0, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const computerPiece2 = new Piece('computer-8', 1, 4, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const playerPiece1 = new Piece('player-3', 5, 4, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const playerPiece2 = new Piece('player-2', 4, 5, false, sharedService,
    boardService, movesAnalyser, compMoves);
    sharedService.computerTurn = true;
    sharedService.computerPokers = [mainPiece, computeriece1, computerPiece2];
    sharedService.playerPokers = [playerPiece1, playerPiece2];
    compMoves.computerMove();
    expect(compMoves.evasiveMoves).toEqual(['6. 3:7. 2,7. 4']);
  });

  it('should detect capture moves even under competing priorities', () => {
    boardService.board[0][5].setAttribute('id', 'computer-2');
    boardService.board[0][7].setAttribute('id', 'computer-1');  // mainPiece
    boardService.board[1][4].setAttribute('id', 'computer-4');
    boardService.board[2][7].setAttribute('id', 'computer-5');
    boardService.board[3][6].setAttribute('id', 'computer-6');

    boardService.board[1][6].setAttribute('id', 'player-3');
    boardService.board[4][7].setAttribute('id', 'player-2');
    const mainPiece = new Piece('computer-1', 0, 7, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const computeriece1 = new Piece('computer-6', 3, 6, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const computerPiece2 = new Piece('computer-4', 1, 4, false, sharedService,
    boardService, movesAnalyser, compMoves);

    const playerPiece1 = new Piece('player-3', 1, 6, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const playerPiece2 = new Piece('player-2', 4, 7, false, sharedService,
    boardService, movesAnalyser, compMoves);
    sharedService.computerTurn = true;
    sharedService.computerPokers = [mainPiece, computeriece1, computerPiece2];
    sharedService.playerPokers = [playerPiece1, playerPiece2];
    compMoves.computerMove();
    expect(sharedService.captureMoves).toEqual(['0. 7:#2. 5xplayer-3']);
  });



});
