import { TestBed } from '@angular/core/testing';

import { JournalLogService } from './journal-log.service';
import { GlobalIndicator } from '../global.indicators';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { RouterTestingModule } from '@angular/router/testing';
import { dummyJournalLog } from 'src/app/spec-helper/dummy.values';
import { StorageItem } from 'src/app/shared/services/local.storage.values.enum';
import { of } from 'rxjs';

describe('JournalLogService', () => {
  let service: JournalLogService;
  let storage: LocalStorageService;
  beforeEach(() => {

    const storageStub = {
      retrieveFromStorage(item: StorageItem) {
        return dummyJournalLog;
      },
      persistInStorage(item: StorageItem, log) { }
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [GlobalIndicator,
        {provide: LocalStorageService, useValue: storageStub}
      ]
    });
    service = TestBed.get(JournalLogService);
    storage = TestBed.get(LocalStorageService);

  });

  it('should be created', () => {
    service.initJournalLog(dummyJournalLog);
    expect(service).toBeTruthy();
  });

  it('should get model by id', () => {
    service.initJournalLog(dummyJournalLog);
    expect(service.getModelByID(1001)).toEqual([false, true]);
  });


  it('should get log as observable', () => {
   expect(service.getJournalLogAsObservable()).toBeDefined();
   expect(service.journalLog).toBeDefined();
  });

  it('should refresh journal log', () => {

    service.initJournalLog(dummyJournalLog);

    service.journalLog.subscribe(data => {
      expect(data).toBeDefined();
    });

    spyOn(storage, 'persistInStorage');
    service.refreshJournalLog();

    expect(storage.persistInStorage).toHaveBeenCalledWith(StorageItem.JOURNAL_LOG, dummyJournalLog);
  });

});
