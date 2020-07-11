import { TestBed } from '@angular/core/testing';

import { ScriptProjectService } from './script-project.service';

describe('ScriptProjectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScriptProjectService = TestBed.get(ScriptProjectService);
    expect(service).toBeTruthy();
  });
});
