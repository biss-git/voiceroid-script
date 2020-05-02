import { TestBed } from '@angular/core/testing';

import { FileloadService } from './fileload.service';

describe('FileloadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileloadService = TestBed.get(FileloadService);
    expect(service).toBeTruthy();
  });
});
