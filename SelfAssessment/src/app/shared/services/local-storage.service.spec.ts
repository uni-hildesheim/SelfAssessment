import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';
import { JournalDirectorService } from './journal/journal.director';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggingService } from '../logging/logging.service';
import { Router } from '@angular/router';
import { StorageItem } from './local.storage.values.enum';
import { JournalLog } from '../models/state/journal.log.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LocalStorageService', () => {
  let service: LocalStorageService;
  let router: Router;
  let director: JournalDirectorService;
  beforeEach(() => {

    const directorStub = {
      extractSavedJournalLog(log) {
        return 'dummy';
      },
      prepareJournalLogForSaving(journalLog: JournalLog): Object {
        return 'dummy';
      }
    };

    TestBed.configureTestingModule({
      providers: [{provide: JournalDirectorService, useValue: directorStub}, LoggingService],
      imports: [RouterTestingModule, HttpClientTestingModule]
    });
    service = TestBed.get(LocalStorageService);
    router = TestBed.get(Router);
    director = TestBed.get(JournalDirectorService);
    const store = {};

    spyOn(localStorage, 'getItem').and.callFake(function (key) {
      return store[key];
    });
    spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
      return store[key] = value + '';
    });


  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return to dashboard if retrieved object does not exist', () => {
    spyOn(router, 'navigateByUrl');
    service.retrieveFromStorage(StorageItem.COURSE);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should retrieve object from local storage', () => {
    service.persistInStorage(StorageItem.LANGUAGE, 'English');
    expect(service.retrieveFromStorage(StorageItem.LANGUAGE)).toEqual('English');
  });


  it('should retrieve journal log from local storage', () => {
    spyOn(director, 'extractSavedJournalLog').and.callThrough();
    spyOn(director, 'prepareJournalLogForSaving').and.callThrough();
    service.persistInStorage(StorageItem.JOURNAL_LOG, 'dummy');
    expect(director.prepareJournalLogForSaving).toHaveBeenCalledWith('dummy');
    expect(service.retrieveFromStorage(StorageItem.JOURNAL_LOG)).toEqual('dummy');
    expect(director.extractSavedJournalLog).toHaveBeenCalledWith('dummy');
  });


});
