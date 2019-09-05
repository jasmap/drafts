import { Player } from './player';
import { Piece } from './piece';
import { SharedService } from './shared.service';
import { BoardService } from './board.service';
import { MovesAnalyserService } from './moves-analyser.service';
import { ComputerMoveService } from './computer-move.service';
import { AttackService } from './attack.service';


describe('PieceClass', () => {
  const sharedService = new SharedService();
  const movesAnalyser = new MovesAnalyserService();
  const boardService = new BoardService(movesAnalyser, sharedService);
  const attack = new AttackService(movesAnalyser);
  const compMoves = new ComputerMoveService(sharedService, movesAnalyser, boardService, attack);

  beforeEach(() => {
    sharedService.resetGlobalVariables();
    boardService.cleanBoard();
  });

  describe('King piece', () => {
    it('should detect all it\'s non-capture moves on a clear board', () => {
      const piece = new Piece('computerKing-1', 3, 4, true, sharedService,
      boardService, movesAnalyser, compMoves);
      const moves = [
        '2. 5', '1. 6', '0. 7', '4. 5', '5. 6', '6. 7',
        '2. 3', '1. 2', '0. 1', '4. 3', '5. 2', '6. 1', '7. 0'
      ];
      expect(moves.sort()).toEqual(piece.legalMoves().sort());
    });

    it('should detect all it\'s non-capture moves on a board with friendly pieces', () => {
      boardService.board[2][3].setAttribute('id', 'computer-2');
      boardService.board[1][6].setAttribute('id', 'computer-3');
      boardService.board[6][7].setAttribute('id', 'computer-4');
      const piece = new Piece('computerKing-1', 3, 4, true, sharedService,
      boardService, movesAnalyser, compMoves);
      const moves = [
        '2. 5', '4. 5', '5. 6', '4. 3', '5. 2', '6. 1', '7. 0'
      ];
      expect(moves.sort()).toEqual(piece.legalMoves().sort());
    });

    it('should detect all it\'s moves on a board with enemy pieces', () => {
      boardService.board[2][3].setAttribute('id', 'player-2');
      boardService.board[1][6].setAttribute('id', 'player-3');
      boardService.board[6][7].setAttribute('id', 'player-4');
      const piece = new Piece('computerKing-1', 3, 4, true, sharedService,
      boardService, movesAnalyser, compMoves);
      const moves = ['0. 7', '1. 2', '0. 1'];
      expect(moves.sort()).toEqual(piece.legalMoves().sort());
    });

    it('should detect all it\'s cross capture moves', () => {
      boardService.board[2][3].setAttribute('id', 'player-2');
      boardService.board[2][1].setAttribute('id', 'player-3');
      boardService.board[4][5].setAttribute('id', 'player-4');
      boardService.board[6][5].setAttribute('id', 'player-5');
      const piece = new Piece('computerKing-1', 3, 4, true, sharedService,
      boardService, movesAnalyser, compMoves);
      const moves = ['1. 2', '5. 6'];
      expect(moves.sort()).toEqual(piece.legalMoves().sort());
    });

  });

  describe('Normal piece', () => {
    it('should detect all it\'s non-capture moves on a clear board', () => {
      const piece = new Piece('computer-1', 3, 4, false, sharedService,
      boardService, movesAnalyser, compMoves);
      const moves = ['4. 3', '4. 5'];
      expect(moves.sort()).toEqual(piece.legalMoves().sort());
    });

    it('should detect all it\'s non-capture moves on a board with friendly pieces', () => {
      boardService.board[4][3].setAttribute('id', 'computer-2');
      const piece = new Piece('computer-1', 3, 4, false, sharedService,
      boardService, movesAnalyser, compMoves);
      const moves = ['4. 5'];
      expect(moves.sort()).toEqual(piece.legalMoves().sort());
    });

    it('should detect all it\'s moves on a board with enemy pieces', () => {
      boardService.board[2][3].setAttribute('id', 'player-2');
      boardService.board[2][5].setAttribute('id', 'player-3');
      boardService.board[4][5].setAttribute('id', 'player-4');
      boardService.board[4][3].setAttribute('id', 'player-4');
      const piece = new Piece('computer-1', 3, 4, false, sharedService,
      boardService, movesAnalyser, compMoves);
      const moves = ['1. 2', '1. 6', '5. 6', '5. 2'];
      expect(moves.sort()).toEqual(piece.legalMoves().sort());
    });

  });



  // it('should be created', () => {
  //   const service: PieceService = TestBed.get(PieceService);
  //   expect(service).toBeTruthy();
  // });
});
