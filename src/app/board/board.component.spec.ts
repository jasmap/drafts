import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardComponent } from './board.component';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let compiled: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it(`should have a full playing board`, () => {
    expect(compiled.querySelectorAll('table input[type="checkbox"]').length).toEqual(64);
  });

  describe('Playing board', () => {
    const computerPieces = [
      'computer-1', 'computer-2', 'computer-3', 'computer-4',
      'computer-5', 'computer-6', 'computer-7', 'computer-8',
      'computer-9', 'computer-10', 'computer-11', 'computer-12'
    ];

    const playerPieces = [
      'player-1', 'player-2', 'player-3', 'player-4',
      'player-5', 'player-6', 'player-7', 'player-8',
      'player-9', 'player-10', 'player-11', 'player-12'
    ];

    computerPieces.forEach(element => {
      it(`should have piece '${element}' on game start`, () => {
          expect(compiled.querySelector(`#${element}`)).toBeTruthy();
      });
    });

    playerPieces.forEach(element => {
      it(`should have piece '${element}' on game start`, () => {
          expect(compiled.querySelector(`#${element}`)).toBeTruthy();
      });
    });
  });
});
