import { JournalLog } from 'src/app/shared/models/state/journal.log.model';
import { JournalStructure } from 'src/app/shared/models/state/journal.structure.model';
import { JournalLogService } from './../../testpanel/services/journal-log.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService } from './config.service';
import { GlobalIndicator } from 'src/app/testpanel/global.indicators';
import { Course } from '../models/configuration/course.model';
import { ConfigFile } from '../models/configuration/config.file.model';
import { LocalStorageService } from './local-storage.service';

describe('TestDefinitionService', () => {
  let configService: ConfigService;
  let storageService: Partial<LocalStorageService>;
  let journalLogService: Partial<JournalLogService>;
  let httpTestingController: HttpTestingController;

  const dummyLanguage = 'English';
  const dummyCourse = 'IMIT';

  const dummyCourses: Course[] = [
    { name: 'IMIT', icon: 'imit.jpg', languages: ['English'] },
    { name: 'WINF', icon: 'winf.jpg', languages: ['English'] }
  ];

  const dummyConfigFile: ConfigFile = {
    title: 'IMIT',
    icon: 'imit.jpg',
    checksumRegex: '',
    tests: [''],
    testgroups: [],
    infopages: [],
    sets: [],
  };

  const dummyJournalStructure: JournalStructure = { sets: [] };
  const dummyJournalLog: JournalLog = { sets: [] };

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [GlobalIndicator, ConfigService, JournalLogService, LocalStorageService
      ]
    }).compileComponents();

    configService = TestBed.get(ConfigService);
    httpTestingController = TestBed.get(HttpTestingController);
    storageService = TestBed.get(LocalStorageService);
    journalLogService = TestBed.get(JournalLogService);

  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should get courses from api endpoint', () => {

    configService.getAllCourses()
      .subscribe(data => {
        expect(data).toEqual(dummyCourses);
        expect(data.length).toEqual(2);
      });

    const mockReq = httpTestingController.expectOne(ConfigService.SHOW_COURSES);

    expect(mockReq.request.method).toEqual('GET');
    expect(mockReq.request.responseType).toEqual('json');

    mockReq.flush(dummyCourses);
  });

  it('should throw error', () => {

    const emsg = 'dummy 404 error';

    configService.getAllCourses()
      .subscribe(
        data => fail('should have failed with 404 error'),
        error => {
          expect(error.status).toEqual(404, 'status');
          expect(error.error).toEqual(emsg, 'message');
        }
      );

    const mockReq = httpTestingController.expectOne(ConfigService.SHOW_COURSES);

    mockReq.flush(emsg, { status: 404, statusText: 'Not Found' });
  });



  it('should load course config from api endpoint', () => {

    configService.loadConfigFromCourse(dummyCourse, dummyLanguage)
      .subscribe(data => {
        expect(data).toEqual(dummyConfigFile);
      });

    const mockReq = httpTestingController.expectOne(ConfigService.LOAD_CONFIG);

    expect(mockReq.request.method).toEqual('POST');
    expect(mockReq.request.body).toEqual({name: dummyCourse, language: dummyLanguage});

    mockReq.flush(dummyConfigFile);

  });

  it('should init journal from config file', () => {

    spyOn(storageService, 'createJournalStructure').and.returnValue(dummyJournalStructure);
    spyOn(storageService, 'storeJournal').and.returnValue({});
    spyOn(journalLogService, 'initJournalLog').and.returnValue(dummyJournalLog);

    configService.initJournalFromConfigFile(dummyConfigFile);

    expect(storageService.createJournalStructure).toHaveBeenCalledWith(dummyConfigFile);
    expect(journalLogService.initJournalLog).toHaveBeenCalledWith(dummyJournalStructure);
    expect(storageService.storeJournal).toHaveBeenCalled();

  });

});
