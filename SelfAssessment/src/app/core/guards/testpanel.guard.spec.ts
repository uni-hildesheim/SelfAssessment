import { TestBed, async, inject } from '@angular/core/testing';

import { TestpanelGuard } from './testpanel.guard';

xdescribe('TestpanelGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestpanelGuard]
    });
  });

  it('should ...', inject([TestpanelGuard], (guard: TestpanelGuard) => {
    expect(guard).toBeTruthy();
  }));
});
