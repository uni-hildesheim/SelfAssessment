import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ResultService } from './result.service';
import { StorageItem } from 'src/app/shared/services/local.storage.values.enum';
import { dummyJournalStructure, dummyJournalLog } from 'src/app/spec-helper/dummy.values';


describe('ResultService', () => {
  beforeEach(() => {

    const storageStub = {
      retrieveFromStorage(item: StorageItem) {
        if (item.valueOf() === StorageItem.JOURNAL_LOG.valueOf()) {
          return dummyJournalLog;
        } else if (item.valueOf() === StorageItem.JOURNAL_STRUCTURE.valueOf()) {
          return dummyJournalStructure;
        }
      }
    };


    TestBed.configureTestingModule({
    imports: [HttpClientModule],
    providers: [
      {provide: LocalStorageService, useValue: storageStub}
    ]
  });
});

  it('should be created', () => {
    const service: ResultService = TestBed.get(ResultService);
    expect(service).toBeTruthy();
  });
});
