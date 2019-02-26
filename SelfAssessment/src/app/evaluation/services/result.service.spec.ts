import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ResultService } from './result.service';
import { StorageItem } from 'src/app/shared/services/local.storage.values.enum';
import { dummyJournalStructure, dummyJournalLog, resultSetDummy } from 'src/app/spec-helper/dummy.values';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


describe('ResultService', () => {

  let resultService: ResultService;
  let httpTestingController: HttpTestingController;
  const dummyPin = 12345678;
  const dataFromApi = [
    {
      'id': '1001',
      'score': 0,
      'maxScore': 1,
      'correctOptions': [
      ],
      'wrongOptions': [
        0
      ]
    },
    {
      'id': '1004',
      'score': 1,
      'maxScore': 2,
      'correctOptions': [
        1
      ],
      'wrongOptions': [0]
    },
    {
      'id': '1002',
      'score': 0,
      'maxScore': 2,
      'correctOptions': [
        1
      ],
      'wrongOptions': [0]
    },
    {
      'id': '1003',
      'score': 0,
      'maxScore': 2,
      'correctOptions': [],
      'wrongOptions': [0, 1]
    }

];

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
    imports: [HttpClientTestingModule],
    providers: [
      {provide: LocalStorageService, useValue: storageStub}
    ]
  });

  resultService = TestBed.get(ResultService);
  httpTestingController = TestBed.get(HttpTestingController);


});

  it('should be created', () => {
    const service: ResultService = TestBed.get(ResultService);
    expect(service).toBeTruthy();
  });

  it('should format the raw data from the api endpoint', () => {
    resultService.loadResults(dummyPin)
    .subscribe(data => {
      expect(data).toBeDefined();
    });

    const mockReq = httpTestingController.expectOne(ResultService.LOAD_RESULT);
    expect(mockReq.request.method).toEqual('POST');
    expect(mockReq.request.url).toEqual(ResultService.LOAD_RESULT);
    mockReq.flush(dataFromApi);
  });


});
