import { TestBed } from '@angular/core/testing';

import { CodeService } from './code.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LocalStorageService } from './local-storage.service';
import { GlobalIndicator } from 'src/app/testpanel/global.indicators';
import { StorageItem } from './local.storage.values.enum';
import { RouterTestingModule } from '@angular/router/testing';

describe('CodeService', () => {
  let pinService: CodeService;
  let storageService: LocalStorageService;
  let httpTestingController: HttpTestingController;
  let spyGetPin: jasmine.Spy;
  let spyStorePin: jasmine.Spy;

  const dummyPin = 61315427;



  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, RouterTestingModule
      ],
      providers: [GlobalIndicator, LocalStorageService]
    }).compileComponents();

    pinService = TestBed.get(CodeService);
    storageService = TestBed.get(LocalStorageService);
    httpTestingController = TestBed.get(HttpTestingController);
    spyGetPin = spyOn(storageService, 'checkPinInStorage');
    spyStorePin = spyOn(storageService, 'persistInStorage');
  });


  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create a new pin', () => {

    pinService.createNewPin().subscribe(
      data => {
        expect(data).toEqual(dummyPin);
      }
    );

    const mockReq = httpTestingController.expectOne(CodeService.CREATE_PIN);
    expect(mockReq.request.method).toEqual('GET');

    mockReq.flush(dummyPin);

    expect(spyStorePin).toHaveBeenCalledTimes(1);
    expect(spyGetPin).toHaveBeenCalledTimes(1);
    expect(spyStorePin).toHaveBeenCalledWith(StorageItem.PIN, dummyPin);

  });

});
