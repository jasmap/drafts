import { TestBed } from '@angular/core/testing';

import { MovesAnalyserService } from './moves-analyser.service';

describe('MovesAnalyserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MovesAnalyserService = TestBed.get(MovesAnalyserService);
    expect(service).toBeTruthy();
  });
});
