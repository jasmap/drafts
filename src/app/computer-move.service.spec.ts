import { TestBed } from '@angular/core/testing';

import { ComputerMoveService } from './computer-move.service';

describe('ComputerMoveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComputerMoveService = TestBed.get(ComputerMoveService);
    expect(service).toBeTruthy();
  });
});
