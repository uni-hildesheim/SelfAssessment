import { TestBed } from '@angular/core/testing';

import { PinService } from './pin.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LocalStorageService } from './local-storage.service';
import { GlobalIndicator } from 'src/app/testpanel/global.indicators';
import { Observable, of } from 'rxjs';

describe('PinService', () => {
  let pinService: PinService;
  let storageService: LocalStorageService;
  let httpTestingController: HttpTestingController;
  let spyGetPin: jasmine.Spy;
  let spyStorePin: jasmine.Spy;

  const dummyPin = 61315427;

  class MockLocalStorageService {

    fakeLocalStorage;

    storePin(pin) {
      this.fakeLocalStorage = pin;
    }

    getPin() {
      return this.fakeLocalStorage;
    }

  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [GlobalIndicator, {provide: LocalStorageService, useClass: MockLocalStorageService}]
    }).compileComponents();

    pinService = TestBed.get(PinService);
    storageService = TestBed.get(LocalStorageService);
    httpTestingController = TestBed.get(HttpTestingController);
    spyGetPin = spyOn(storageService, 'getPin');
    spyStorePin = spyOn(storageService, 'storePin');
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

    const mockReq = httpTestingController.expectOne(PinService.CREATE_PIN);
    expect(mockReq.request.method).toEqual('GET');

    mockReq.flush(dummyPin);

    expect(spyStorePin).toHaveBeenCalledTimes(1);
    expect(spyGetPin).toHaveBeenCalledTimes(1);
    expect(spyStorePin).toHaveBeenCalledWith(dummyPin);

  });

});
