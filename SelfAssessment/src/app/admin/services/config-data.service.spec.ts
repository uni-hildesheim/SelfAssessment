import { TestBed } from '@angular/core/testing';

import { ConfigDataService } from './config-data.service';

xdescribe('ConfigDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfigDataService = TestBed.get(ConfigDataService);
    expect(service).toBeTruthy();
  });
});
