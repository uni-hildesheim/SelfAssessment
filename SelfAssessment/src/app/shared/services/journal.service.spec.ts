import { TestBed } from '@angular/core/testing';

import { JournalService } from './journal.service';
import { GlobalIndicator } from 'src/app/testpanel/global.indicators';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { Journal } from '../models/state/journal.model';
import { JournalLog } from '../models/state/journal.log.model';
import { JournalStructure } from '../models/state/journal.structure.model';
import { ConfigService } from './config.service';
import { ConfigFile } from '../models/config.file.model';
import { of, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('ProtocolService', () => {
  let journalService: JournalService;
  let httpTestingController: HttpTestingController;

  const dummyConfigFile: ConfigFile = {
    title: 'IMIT',
    icon: 'imit.jpg',
    checksumRegex: '',
    tests: [],
    testgroups: [],
    infopages: [],
    sets: [],
  };

  class MockConfigService {
    loadConfigFromCourse(course: string): Observable<ConfigFile> {
      return of(dummyConfigFile);
    }
  }

  const dummyJournalLog: JournalLog = { sets: [] };

  const dummyJournalStructure: JournalStructure = { sets: [] };

  const dummyJournal: Journal = {
    log: dummyJournalLog,
    structure: dummyJournalStructure
  };

  const dummyPin = 61315427;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [GlobalIndicator, JournalService, { provide: ConfigService, useClass: MockConfigService }]
    }).compileComponents();

    journalService = TestBed.get(JournalService);
    httpTestingController = TestBed.get(HttpTestingController);

  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should load and create journal', () => {

    journalService.loadJournal(dummyPin)
      .subscribe((data: Journal) => {
        expect(data).toBeDefined();
        expect(data).toEqual(jasmine.any(Journal));
      });

    const mockReq = httpTestingController.expectOne(JournalService.LOAD_JOURNAL);
    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.url).toEqual(JournalService.LOAD_JOURNAL);
    mockReq.flush(dummyJournal);

  });

  it('should store journal log', () => {
    journalService.saveJournalLog(dummyJournalLog)
      .subscribe(data => {
        expect(data).toBeNull();
      });

    const mockReq = httpTestingController.expectOne(JournalService.SAVE_JOURNAL_LOG);
    expect(mockReq.request.method).toEqual('POST');
    expect(mockReq.request.url).toEqual(JournalService.SAVE_JOURNAL_LOG);
    mockReq.flush(null);

  });

  it('should throw error if request failed', () => {

    const emsg = 'dummy 404 error occurred';

    journalService.saveJournalLog(dummyJournalLog)
      .subscribe(
        data => fail('should have failed'),
        (error: HttpErrorResponse) => {
          expect(error.status).toEqual(404, 'status');
          expect(error.error).toEqual(emsg, 'message');
        }
      );

      const mockReq = httpTestingController.expectOne(JournalService.SAVE_JOURNAL_LOG);
      mockReq.flush(emsg, { status: 404, statusText: emsg });

  });

});
