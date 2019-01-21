import { TestBed } from '@angular/core/testing';

import { JournalService } from './journal.service';

xdescribe('ProtocolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JournalService = TestBed.get(JournalService);
    expect(service).toBeTruthy();
  });
});
