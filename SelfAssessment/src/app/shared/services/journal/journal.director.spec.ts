import { dummyJournalLog } from 'src/app/spec-helper/dummy.values';
import { JournalStructure } from './../../models/state/journal.structure.model';
import { Journal } from './../../models/state/journal.model';
import { dummyJournal } from './../../../spec-helper/dummy.values';
import { JournalDirectorService } from './journal.director';
import { TestBed } from '@angular/core/testing';
import { file, randTestgroupsFile, infopageFile, minJournalStruc,
   formattedJournalLog, extractedJournalLog } from 'src/app/spec-helper/journal.director.dummy';


describe('JournalDirectorService', () => {
  let service: JournalDirectorService;

  beforeEach(() => {

    TestBed.configureTestingModule({});
  }
);

  it('should be created', () => {
    service = TestBed.get(JournalDirectorService);
    expect(service).toBeTruthy();
  });

  it('should create the journal', () => {
    const journal = service.createJournal(file);
  });


  it('should create from minimal structure', () => {
    const journalStruc: JournalStructure = service.createJournalStructure(randTestgroupsFile, minJournalStruc);
    const elements = journalStruc.sets[0].elements;
    expect(elements[0].id === '1002' || elements[0].id === '1003').toBeTruthy();
    expect(elements[1].id === '1002' || elements[1].id === '1003').toBeTruthy();
    expect(journalStruc.sets[0].elements[2].id).toEqual('1005');
  });

  it('should assign the testgroup random tests if select attribute is choosen', () => {
    const journalStruc: JournalStructure = service.createJournal(randTestgroupsFile).structure;
    expect(journalStruc.sets[0].elements.length).toEqual(3);
  });

  it('should assign infopage to: set, test, testgroup', () => {
    const journalStruc: JournalStructure = service.createJournal(infopageFile).structure;
    expect(journalStruc.sets[0].elements[0].id).toEqual('4003');
    expect(journalStruc.sets[0].elements[1].id).toEqual('4002');
    expect(journalStruc.sets[0].elements[2].id).toEqual('1001');
    expect(journalStruc.sets[0].elements[3].id).toEqual('4001');
    expect(journalStruc.sets[0].elements[4].id).toEqual('1002');
    expect(journalStruc.sets[0].elements[5].id).toEqual('4004');
    expect(journalStruc.sets[0].elements[6].id).toEqual('1003');
  });


  it('should extract saved journalLog', () => {
    expect(service.extractSavedJournalLog(formattedJournalLog)).toEqual(extractedJournalLog);
  });

  it('should prepare journal log for saving', () => {
    expect(service.prepareJournalLogForSaving(extractedJournalLog)).toEqual(formattedJournalLog);
  });

});
