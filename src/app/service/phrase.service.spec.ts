import { TestBed } from '@angular/core/testing';

import { PhraseService } from './phrase.service';

describe('PhraseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PhraseService = TestBed.get(PhraseService);
    expect(service).toBeTruthy();
  });
});
