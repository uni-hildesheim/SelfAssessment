import { Journal } from './../../models/state/journal.model';
import { exampleFile, dummyJournal } from './../../../spec-helper/dummy.values';
import { ConfigFile } from './../../models/configuration/config.file.model';
import { JournalDirectorService } from './journal.director';
import { TestBed } from '@angular/core/testing';


xdescribe('JournalDirectorService', () => {
  let service: JournalDirectorService;

  beforeEach(() => {

    TestBed.configureTestingModule({});
  }
);

  it('should be created', () => {
    service = TestBed.get(JournalDirectorService);
    expect(service).toBeTruthy();
  });

  it('should create the journal structure', () => {
    expect(service.createJournal(exampleFile)).toEqual(dummyJournal as Journal);
  });

  it('prepare the journal log for saving', () => {

  });

  it('should prepare journal structureForSaving', () => {

  });

  it('should extractSavedJournalLog', () => {

  });

});
