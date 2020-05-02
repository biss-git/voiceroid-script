import { TestBed } from '@angular/core/testing';

import { CharactorsService } from './charactors.service';

describe('CharactorsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CharactorsService = TestBed.get(CharactorsService);
    expect(service).toBeTruthy();
  });
});
