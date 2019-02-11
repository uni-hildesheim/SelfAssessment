import { TestBed } from '@angular/core/testing';

import { ResourceService } from './resource.service';

xdescribe('LanguageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResourceService = TestBed.get(ResourceService);
    expect(service).toBeTruthy();
  });
});
