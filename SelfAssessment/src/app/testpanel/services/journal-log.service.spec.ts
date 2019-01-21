import { TestBed } from '@angular/core/testing';

import { JournalLogService } from './journal-log.service';

xdescribe('JournalLogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JournalLogService = TestBed.get(JournalLogService);
    expect(service).toBeTruthy();
  });
});
