import { TestBed } from '@angular/core/testing';

import { MaterialOverlayService } from './material-overlay.service';

xdescribe('MaterialOverlayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MaterialOverlayService = TestBed.get(MaterialOverlayService);
    expect(service).toBeTruthy();
  });
});
