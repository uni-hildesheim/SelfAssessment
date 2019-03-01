import { Journal } from './../../models/state/journal.model';
import { exampleFile, dummyJournal } from './../../../spec-helper/dummy.values';
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

    service.createJournal(exampleFile).structure.sets.forEach(set => {
      expect(dummyJournal.structure.sets.find(s => s.id === set.id)).toBeDefined();
    } );

  });

  // it('prepare the journal log for saving', () => {

  // });

  // it('should prepare journal structureForSaving', () => {

  // });

  // it('should extractSavedJournalLog', () => {

  // });

});
