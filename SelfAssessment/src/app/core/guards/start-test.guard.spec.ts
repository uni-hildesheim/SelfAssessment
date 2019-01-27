import { TestBed, async, inject } from '@angular/core/testing';

import { StartTestGuard } from './start-test.guard';

xdescribe('StartTestGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StartTestGuard]
    });
  });

  it('should ...', inject([StartTestGuard], (guard: StartTestGuard) => {
    expect(guard).toBeTruthy();
  }));
});
