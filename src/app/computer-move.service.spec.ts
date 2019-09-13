import { TestBed } from '@angular/core/testing';

import { ComputerMoveService } from './computer-move.service';
import { SharedService } from './shared.service';
import { MovesAnalyserService } from './moves-analyser.service';
import { BoardService } from './board.service';
import { AttackService } from './attack.service';
import { Piece } from './piece';


describe('ComputerMoveService', () => {
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

  it('king piece should detect capture moves', () => {
    boardService.board[0][7].setAttribute('id', 'computer-2');
    boardService.board[7][0].setAttribute('id', 'computerKing-1');  // mainPiece

    boardService.board[2][5].setAttribute('id', 'playerKing-3');
    boardService.board[2][7].setAttribute('id', 'player-2');
    const mainPiece = new Piece('computerKing-1', 7, 0, true, sharedService,
    boardService, movesAnalyser, compMoves);
    const computeriece1 = new Piece('computer-6', 0, 7, false, sharedService,
    boardService, movesAnalyser, compMoves);

    const playerPiece1 = new Piece('playerKing-3', 2, 5, true, sharedService,
    boardService, movesAnalyser, compMoves);
    const playerPiece2 = new Piece('player-2', 2, 7, false, sharedService,
    boardService, movesAnalyser, compMoves);
    sharedService.computerTurn = true;
    sharedService.computerPokers = [mainPiece, computeriece1];
    sharedService.playerPokers = [playerPiece1, playerPiece2];
    compMoves.computerMove();
    expect(sharedService.captureMoves).toEqual(['7. 0:#1. 6xplayerKing-3']);
  });

  it('should detect a line guarded by an enemy king, and avoid it if possible, even from a distance', () => {
    boardService.board[0][5].setAttribute('id', 'computer-2');
    boardService.board[0][7].setAttribute('id', 'computer-3');
    boardService.board[1][6].setAttribute('id', 'computer-8');
    boardService.board[2][3].setAttribute('id', 'computer-1'); // mainPiece
    boardService.board[2][7].setAttribute('id', 'computer-5');

    boardService.board[3][6].setAttribute('id', 'playerKing-3');
    boardService.board[4][5].setAttribute('id', 'player-2');

    const mainPiece = new Piece('computer-1', 2, 3, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const computeriece1 = new Piece('computer-2', 0, 5, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const computerPiece2 = new Piece('computer-8', 1, 6, false, sharedService,
    boardService, movesAnalyser, compMoves);

    const playerPiece1 = new Piece('playerKing-3', 3, 6, true, sharedService,
    boardService, movesAnalyser, compMoves);
    const playerPiece2 = new Piece('player-2', 4, 5, false, sharedService,
    boardService, movesAnalyser, compMoves);
    sharedService.computerTurn = true;
    sharedService.computerPokers = [mainPiece, computeriece1, computerPiece2];
    sharedService.playerPokers = [playerPiece1, playerPiece2];
    compMoves.computerMove();
    expect(compMoves.legalMovesBank).toEqual(['2. 3:3. 2']);
  });

  it('King piece should avoid endangering itself when moving from a safe position', () => {
    boardService.board[1][2].setAttribute('id', 'computer-2');
    boardService.board[2][1].setAttribute('id', 'computer-3');
    boardService.board[1][6].setAttribute('id', 'computer-8');
    boardService.board[2][3].setAttribute('id', 'computer-4');
    boardService.board[2][7].setAttribute('id', 'computer-5');
    boardService.board[3][2].setAttribute('id', 'computer-6');
    boardService.board[7][4].setAttribute('id', 'computerKing-1'); // mainPiece

    boardService.board[0][3].setAttribute('id', 'playerKing-3');
    boardService.board[3][0].setAttribute('id', 'player-1');
    boardService.board[4][1].setAttribute('id', 'player-3');
    boardService.board[4][3].setAttribute('id', 'player-4');
    boardService.board[5][0].setAttribute('id', 'player-5');
    boardService.board[5][4].setAttribute('id', 'player-2');
    boardService.board[6][1].setAttribute('id', 'player-6');
    boardService.board[6][7].setAttribute('id', 'player-8');
    boardService.board[7][0].setAttribute('id', 'player-7');

    const mainPiece = new Piece('computerKing-1', 7, 4, true, sharedService,
    boardService, movesAnalyser, compMoves);
    const computeriece1 = new Piece('computer-4', 2, 3, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const computerPiece2 = new Piece('computer-8', 1, 6, false, sharedService,
    boardService, movesAnalyser, compMoves);

    const playerPiece1 = new Piece('playerKing-3', 0, 3, true, sharedService,
    boardService, movesAnalyser, compMoves);
    const playerPiece2 = new Piece('player-2', 5, 4, false, sharedService,
    boardService, movesAnalyser, compMoves);
    sharedService.computerTurn = true;
    sharedService.computerPokers = [mainPiece, computeriece1, computerPiece2];
    sharedService.playerPokers = [playerPiece1, playerPiece2];
    compMoves.computerMove();
    expect(compMoves.legalMovesBank).toEqual(['7. 4:4. 7']);
  });

  it('King piece should avoid endangering itself even when moving away from a fired position', () => {
    boardService.board[6][5].setAttribute('id', 'computerKing-1'); // mainPiece

    boardService.board[0][3].setAttribute('id', 'playerKing-1');
    boardService.board[0][7].setAttribute('id', 'playerKing-2');
    boardService.board[3][0].setAttribute('id', 'player-5');
    boardService.board[4][5].setAttribute('id', 'player-4');
    boardService.board[4][7].setAttribute('id', 'playerKing-3');
    boardService.board[7][4].setAttribute('id', 'player-6');

    const mainPiece = new Piece('computerKing-1', 6, 5, true, sharedService,
    boardService, movesAnalyser, compMoves);

    const playerPiece1 = new Piece('playerKing-1', 0, 3, true, sharedService,
    boardService, movesAnalyser, compMoves);
    const playerPiece2 = new Piece('playerKing-2', 0, 7, true, sharedService,
    boardService, movesAnalyser, compMoves);
    const playerPiece3 = new Piece('playerKing-3', 4, 7, true, sharedService,
    boardService, movesAnalyser, compMoves);
    const playerPiece4 = new Piece('player-5', 3, 0, true, sharedService,
    boardService, movesAnalyser, compMoves);
    const playerPiece5 = new Piece('player-4', 4, 5, true, sharedService,
    boardService, movesAnalyser, compMoves);
    const playerPiece6 = new Piece('player-6', 7, 4, true, sharedService,
    boardService, movesAnalyser, compMoves);

    sharedService.computerTurn = true;
    sharedService.computerPokers = [mainPiece];
    sharedService.playerPokers = [
      playerPiece1, playerPiece2, playerPiece3,
      playerPiece4, playerPiece5, playerPiece6
    ];
    compMoves.computerMove();
    expect(compMoves.evasiveMoves).toEqual(['6. 5:7. 6,3. 2,1. 0']);
  });

  it('King piece should not throw an error when moving away from a fired position', () => {
    boardService.board[5][6].setAttribute('id', 'computerKing-1'); // mainPiece
    boardService.board[2][7].setAttribute('id', 'computer-2');

    boardService.board[3][0].setAttribute('id', 'playerKing-1');
    boardService.board[4][7].setAttribute('id', 'playerKing-2');
    boardService.board[5][4].setAttribute('id', 'player-6');

    const mainPiece = new Piece('computerKing-1', 5, 6, true, sharedService,
    boardService, movesAnalyser, compMoves);
    const computerPiece1 = new Piece('computer-2', 2, 7, false, sharedService,
    boardService, movesAnalyser, compMoves);

    const playerPiece1 = new Piece('playerKing-1', 3, 0, true, sharedService,
    boardService, movesAnalyser, compMoves);
    const playerPiece2 = new Piece('playerKing-2', 4, 7, true, sharedService,
    boardService, movesAnalyser, compMoves);
    const playerPiece3 = new Piece('player-6', 5, 4, false, sharedService,
    boardService, movesAnalyser, compMoves);

    sharedService.computerTurn = true;
    sharedService.computerPokers = [mainPiece, computerPiece1];
    sharedService.playerPokers = [
      playerPiece1, playerPiece2, playerPiece3
    ];
    compMoves.computerMove();
    expect(compMoves.evasiveMoves).toEqual(['5. 6:6. 7,3. 4,2. 3,0. 1']);
  });

});
