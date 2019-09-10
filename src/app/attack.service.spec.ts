import { TestBed, ComponentFixture, async } from '@angular/core/testing';

import { AttackService } from './attack.service';
import { MovesAnalyserService } from './moves-analyser.service';
import { BoardService } from './board.service';
import { Piece } from './piece';
import { SharedService } from './shared.service';
import { ComputerMoveService } from './computer-move.service';
import { BoardComponent } from './board/board.component';

describe('AttackService', () => {
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
    const service: AttackService = TestBed.get(AttackService);
    expect(service).toBeTruthy();
  });

  it('should detect backward left cross bait attack with enemies', () => {
    boardService.board[1][0].setAttribute('id', 'computer-2');
    // boardService.board[1][2].setAttribute('id', 'player-3');
    boardService.board[2][1].setAttribute('id', 'computer-4');
    boardService.board[3][0].setAttribute('id', 'player-9');
    boardService.board[5][0].setAttribute('id', 'player-5');
    boardService.board[5][2].setAttribute('id', 'player-6');
    const mainPiece = new Piece('computer-1', 3, 2, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const piece1 = new Piece('computer-7', 0, 5, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const piece2 = new Piece('computer-8', 0, 7, false, sharedService,
    boardService, movesAnalyser, compMoves);
    sharedService.computerTurn = true;
    sharedService.computerPokers = [mainPiece, piece1, piece2];
    compMoves.computerMove();
    expect(compMoves.attackMoves).toEqual(['3. 2:4. 1']);
  });

  it('should detect backward left cross bait attack with enemies part 2', () => {
    boardService.board[1][0].setAttribute('id', 'computer-2');
    boardService.board[1][2].setAttribute('id', 'computer-3');
    boardService.board[2][1].setAttribute('id', 'computer-4');
    boardService.board[3][0].setAttribute('id', 'player-9');
    boardService.board[5][0].setAttribute('id', 'player-5');
    boardService.board[5][2].setAttribute('id', 'player-6');
    boardService.board[5][4].setAttribute('id', 'player-7');
    boardService.board[6][3].setAttribute('id', 'player-8');
    boardService.board[6][5].setAttribute('id', 'player-9');
    boardService.board[7][0].setAttribute('id', 'player-10');
    boardService.board[7][2].setAttribute('id', 'player-11');
    const mainPiece = new Piece('computer-1', 3, 2, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const piece1 = new Piece('computer-7', 0, 5, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const piece2 = new Piece('computer-8', 0, 7, false, sharedService,
    boardService, movesAnalyser, compMoves);
    sharedService.computerTurn = true;
    sharedService.computerPokers = [mainPiece, piece1, piece2];
    compMoves.computerMove();
    expect(compMoves.attackMoves).toEqual(['3. 2:4. 1']);
  });

  it('should detect backward left cross bait attack with friends', () => {
    boardService.board[1][0].setAttribute('id', 'computer-2');
    // boardService.board[1][2].setAttribute('id', 'computer-3');
    boardService.board[2][1].setAttribute('id', 'computer-4');
    boardService.board[3][0].setAttribute('id', 'computer-6');
    boardService.board[5][0].setAttribute('id', 'player-5');
    boardService.board[5][2].setAttribute('id', 'player-6');
    const mainPiece = new Piece('computer-1', 3, 2, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const piece1 = new Piece('computer-7', 0, 5, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const piece2 = new Piece('computer-8', 0, 7, false, sharedService,
    boardService, movesAnalyser, compMoves);
    sharedService.computerTurn = true;
    sharedService.computerPokers = [mainPiece, piece1, piece2];
    compMoves.computerMove();
    expect(compMoves.attackMoves).toEqual(['3. 2:4. 1']);
  });

  it('should detect backward left cross bait attack on board edge', () => {
    boardService.board[1][0].setAttribute('id', 'computer-2');
    boardService.board[0][1].setAttribute('id', 'computer-3');
    boardService.board[3][0].setAttribute('id', 'player-6');
    boardService.board[3][2].setAttribute('id', 'player-5');
    const mainPiece = new Piece('computer-1', 1, 2, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const piece1 = new Piece('computer-7', 0, 5, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const piece2 = new Piece('computer-8', 0, 7, false, sharedService,
    boardService, movesAnalyser, compMoves);
    sharedService.computerTurn = true;
    sharedService.computerPokers = [mainPiece, piece1, piece2];
    compMoves.computerMove();
    expect(compMoves.attackMoves).toEqual(['1. 2:2. 1']);
  });

  it('should detect backward right parallel bait attack', () => {
    boardService.board[1][0].setAttribute('id', 'computer-2');
    boardService.board[1][2].setAttribute('id', 'computer-3');
    boardService.board[2][1].setAttribute('id', 'computer-4');
    boardService.board[3][0].setAttribute('id', 'computer-6');
    boardService.board[5][2].setAttribute('id', 'player-6');
    boardService.board[3][4].setAttribute('id', 'player-7');
    boardService.board[5][4].setAttribute('id', 'player-8');
    const mainPiece = new Piece('computer-1', 3, 2, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const piece1 = new Piece('computer-7', 0, 5, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const piece2 = new Piece('computer-8', 0, 7, false, sharedService,
    boardService, movesAnalyser, compMoves);
    sharedService.computerTurn = true;
    sharedService.computerPokers = [mainPiece, piece1, piece2];
    compMoves.computerMove();
    expect(compMoves.attackMoves).toEqual(['3. 2:4. 3']);
  });

  it('should detect backward right parallel bait attack with 2 choices', () => {
    boardService.board[1][0].setAttribute('id', 'computer-2');
    boardService.board[1][2].setAttribute('id', 'computer-3');
    boardService.board[1][4].setAttribute('id', 'computer-4');
    boardService.board[2][1].setAttribute('id', 'computer-5');
    boardService.board[2][3].setAttribute('id', 'computer-6');
    boardService.board[5][2].setAttribute('id', 'computer-11');

    boardService.board[3][4].setAttribute('id', 'player-1');
    boardService.board[5][4].setAttribute('id', 'player-2');
    // boardService.board[4][1].setAttribute('id', 'player-8');
    const mainPiece = new Piece('computer-1', 3, 2, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const piece1 = new Piece('computer-9', 0, 5, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const piece2 = new Piece('computer-10', 0, 7, false, sharedService,
    boardService, movesAnalyser, compMoves);
    sharedService.computerTurn = true;
    sharedService.computerPokers = [mainPiece, piece1, piece2];
    compMoves.computerMove();
    expect(compMoves.attackMoves[0]).toContain('3. 2:4. 3');
  });

  it('should detect a perfect backward Right cross bait attack without flankers', () => {
    boardService.board[2][7].setAttribute('id', 'computer-2');
    boardService.board[3][6].setAttribute('id', 'computer-3');
    boardService.board[4][7].setAttribute('id', 'computer-4');
    boardService.board[6][5].setAttribute('id', 'player-5');
    boardService.board[6][7].setAttribute('id', 'player-6');
    const mainPiece = new Piece('computer-1', 4, 5, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const piece1 = new Piece('computer-7', 0, 5, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const piece2 = new Piece('computer-8', 0, 7, false, sharedService,
    boardService, movesAnalyser, compMoves);
    sharedService.computerTurn = true;
    sharedService.computerPokers = [mainPiece, piece1, piece2];
    compMoves.computerMove();
    expect(compMoves.attackMoves).toEqual(['4. 5:5. 6']);
  });

  it('should detect backward Right cross bait attack with bait under fire', () => {
    boardService.board[2][7].setAttribute('id', 'computer-2');
    boardService.board[3][6].setAttribute('id', 'computer-3');
    boardService.board[3][4].setAttribute('id', 'player-1');
    boardService.board[2][3].setAttribute('id', 'player-3');
    boardService.board[4][7].setAttribute('id', 'computer-4');
    boardService.board[6][5].setAttribute('id', 'player-5');
    boardService.board[6][7].setAttribute('id', 'player-6');
    const mainPiece = new Piece('computer-1', 4, 5, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const piece1 = new Piece('computer-7', 0, 5, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const piece2 = new Piece('computer-8', 0, 7, false, sharedService,
    boardService, movesAnalyser, compMoves);
    sharedService.computerTurn = true;
    sharedService.computerPokers = [mainPiece, piece1, piece2];
    compMoves.computerMove();
    expect(compMoves.attackMoves).toEqual(['4. 5:5. 6']);
  });

  it('should detect backward left bait attack on board edge', () => {
    boardService.board[2][7].setAttribute('id', 'computer-2');
    boardService.board[4][7].setAttribute('id', 'computer-4');
    // boardService.board[3][6].setAttribute('id', 'computer-3');
    boardService.board[3][4].setAttribute('id', 'player-1');
    boardService.board[5][4].setAttribute('id', 'player-3');
    boardService.board[5][6].setAttribute('id', 'player-4');
    boardService.board[6][5].setAttribute('id', 'player-5');
    boardService.board[6][7].setAttribute('id', 'player-6');
    const mainPiece = new Piece('computer-1', 3, 6, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const piece1 = new Piece('computer-7', 0, 5, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const piece2 = new Piece('computer-8', 0, 7, false, sharedService,
    boardService, movesAnalyser, compMoves);
    sharedService.computerTurn = true;
    sharedService.computerPokers = [mainPiece, piece1, piece2];
    compMoves.computerMove();
    expect(compMoves.attackMoves[0]).toContain('3. 6:4. 5');
  });

  it('should detect backward left bait attack on board edge with friends', () => {
    boardService.board[1][4].setAttribute('id', 'computer-6');
    boardService.board[2][5].setAttribute('id', 'computer-9');
    boardService.board[2][7].setAttribute('id', 'computer-2');
    boardService.board[3][4].setAttribute('id', 'computer-5');
    boardService.board[4][7].setAttribute('id', 'computer-4');

    boardService.board[5][4].setAttribute('id', 'player-3');
    boardService.board[5][6].setAttribute('id', 'player-4');
    boardService.board[6][5].setAttribute('id', 'player-5');
    const mainPiece = new Piece('computer-1', 3, 6, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const piece1 = new Piece('computer-7', 0, 5, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const piece2 = new Piece('computer-8', 0, 7, false, sharedService,
    boardService, movesAnalyser, compMoves);
    sharedService.computerTurn = true;
    sharedService.computerPokers = [mainPiece, piece1, piece2];
    compMoves.computerMove();
    expect(compMoves.attackMoves[0]).toContain('3. 6:4. 5');
  });

  it('should detect backward left skewed bait attack', () => {
    boardService.board[2][7].setAttribute('id', 'computer-2');
    boardService.board[3][6].setAttribute('id', 'computer-5');
    // boardService.board[4][7].setAttribute('id', 'computer-4');

    boardService.board[4][3].setAttribute('id', 'player-3');
    boardService.board[6][7].setAttribute('id', 'player-5');
    const mainPiece = new Piece('computer-1', 4, 7, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const piece1 = new Piece('computer-7', 0, 5, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const piece2 = new Piece('computer-8', 0, 7, false, sharedService,
    boardService, movesAnalyser, compMoves);
    sharedService.computerTurn = true;
    sharedService.computerPokers = [mainPiece, piece1, piece2];
    compMoves.computerMove();
    expect(compMoves.attackMoves[0]).toContain('4. 7:5. 6');
  });

  it('should not launch a bait attack if it endangers friendly pieces', () => {
    // boardService.board[0][5].setAttribute('id', 'computer-2');
    boardService.board[1][6].setAttribute('id', 'computer-3');
    boardService.board[0][7].setAttribute('id', 'computer-2');
    boardService.board[2][3].setAttribute('id', 'computer-4');
    boardService.board[2][5].setAttribute('id', 'computer-1');  // mainPiece
    boardService.board[2][7].setAttribute('id', 'computer-5');
    boardService.board[3][4].setAttribute('id', 'computer-6');

    boardService.board[6][7].setAttribute('id', 'player-3');
    boardService.board[4][7].setAttribute('id', 'player-2');
    boardService.board[4][5].setAttribute('id', 'player-1');
    boardService.board[5][6].setAttribute('id', 'player-4');
    const mainPiece = new Piece('computer-1', 2, 5, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const computeriece1 = new Piece('computer-6', 3, 4, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const computerPiece2 = new Piece('computer-4', 2, 3, false, sharedService,
    boardService, movesAnalyser, compMoves);

    sharedService.computerTurn = true;
    sharedService.computerPokers = [mainPiece, computeriece1, computerPiece2];
    compMoves.computerMove();
    expect(compMoves.attackMoves[0]).toEqual(undefined);
  });

  it('should not launch a bait attack if there is no double capturing possible', () => {
    boardService.board[1][2].setAttribute('id', 'computer-7');
    boardService.board[1][4].setAttribute('id', 'computer-3');
    boardService.board[2][3].setAttribute('id', 'computer-4');
    boardService.board[3][2].setAttribute('id', 'computer-1');  // mainPiece
    boardService.board[2][7].setAttribute('id', 'computer-5');
    boardService.board[3][4].setAttribute('id', 'computer-6');

    boardService.board[3][0].setAttribute('id', 'player-5');
    boardService.board[4][5].setAttribute('id', 'player-1');
    boardService.board[5][0].setAttribute('id', 'player-6');
    boardService.board[5][2].setAttribute('id', 'player-3');
    boardService.board[5][4].setAttribute('id', 'player-2');
    boardService.board[5][6].setAttribute('id', 'player-4');
    boardService.board[6][3].setAttribute('id', 'player-7');
    boardService.board[7][2].setAttribute('id', 'player-8');

    const mainPiece = new Piece('computer-1', 3, 2, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const computeriece1 = new Piece('computer-6', 1, 4, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const computerPiece2 = new Piece('computer-4', 3, 6, false, sharedService,
    boardService, movesAnalyser, compMoves);

    sharedService.computerTurn = true;
    sharedService.computerPokers = [mainPiece, computeriece1, computerPiece2];
    compMoves.computerMove();
    expect(compMoves.attackMoves[0]).toEqual(undefined);
  });

  it('should not cross bait a king piece if the king piece has multiple landing positions', () => {
    boardService.board[1][0].setAttribute('id', 'computer-7');
    boardService.board[1][2].setAttribute('id', 'computer-6');
    boardService.board[2][1].setAttribute('id', 'computer-4');
    boardService.board[2][3].setAttribute('id', 'computer-5');
    boardService.board[3][0].setAttribute('id', 'computer-1');  // mainPiece

    boardService.board[5][4].setAttribute('id', 'player-6');
    boardService.board[5][0].setAttribute('id', 'playerKing-4');

    const mainPiece = new Piece('computer-1', 3, 0, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const computeriece1 = new Piece('computer-6', 1, 2, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const computerPiece2 = new Piece('computer-4', 2, 1, false, sharedService,
    boardService, movesAnalyser, compMoves);

    const playerPiece = new Piece('playerKing-4', 5, 0, true, sharedService,
    boardService, movesAnalyser, compMoves);

    sharedService.computerTurn = true;
    sharedService.computerPokers = [mainPiece, computeriece1, computerPiece2];
    compMoves.computerMove();
    expect(compMoves.attackMoves[0]).toEqual(undefined);
  });

  it('should set a specific follow up piece if cross baiting results in multiple possible responses', () => {
    boardService.board[0][1].setAttribute('id', 'computer-7');
    boardService.board[1][2].setAttribute('id', 'computer-6');
    boardService.board[0][5].setAttribute('id', 'computer-4');
    boardService.board[1][4].setAttribute('id', 'computer-5');
    boardService.board[2][3].setAttribute('id', 'computer-1');  // mainPiece

    boardService.board[4][1].setAttribute('id', 'player-6');
    boardService.board[4][5].setAttribute('id', 'player-4');
    boardService.board[5][6].setAttribute('id', 'player-5');

    const mainPiece = new Piece('computer-1', 2, 3, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const computeriece1 = new Piece('computer-6', 1, 2, false, sharedService,
    boardService, movesAnalyser, compMoves);
    const computerPiece2 = new Piece('computer-4', 1, 4, false, sharedService,
    boardService, movesAnalyser, compMoves);

    sharedService.computerTurn = true;
    sharedService.computerPokers = [mainPiece, computeriece1, computerPiece2];
    compMoves.computerMove();
    expect(compMoves.preferredResponse).toEqual('1. 4:');
  });


});
