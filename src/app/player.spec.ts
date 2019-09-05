import { TestBed } from '@angular/core/testing';

import { Player } from './player';
import { Piece } from './piece';
import { SharedService } from './shared.service';
import { BoardService } from './board.service';
import { MovesAnalyserService } from './moves-analyser.service';
import { ComputerMoveService } from './computer-move.service';
import { AttackService } from './attack.service';


describe('PlayerClass', () => {
  let mockPlayer: Player;
  const positions: string[] = [
    '01', '03', '05', '07',
    '10', '12', '14', '16',
    '21', '23', '25', '27'
  ];
  const sharedService = new SharedService();
  const movesAnalyser = new MovesAnalyserService();
  const cellsService = new BoardService(movesAnalyser, sharedService);
  const attack = new AttackService(movesAnalyser);
  const compMove = new ComputerMoveService(sharedService, movesAnalyser, cellsService, attack);


  beforeEach(() => {
    sharedService.resetGlobalVariables();
  });

  it('should create computer pieces', () => {
    mockPlayer = new Player(sharedService.computerPrefix, positions, sharedService,
      cellsService, movesAnalyser, compMove);
    mockPlayer.deal();
    const pieces = sharedService.computerPokers;
    expect(pieces.length).toEqual(positions.length);
  });

  it('should create player pieces', () => {
    mockPlayer = new Player(sharedService.playerPrefix, positions, sharedService,
      cellsService, movesAnalyser, compMove);
    mockPlayer.deal();
    const pieces = sharedService.playerPokers;
    expect(pieces.length).toEqual(positions.length);
  });
});
