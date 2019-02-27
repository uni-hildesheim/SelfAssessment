import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { MaterialModule } from 'src/app/material/material.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationComponent } from './validation.component';
import { PinService } from 'src/app/shared/services/pin.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ValidationComponent', () => {
  let component: ValidationComponent;
  let fixture: ComponentFixture<ValidationComponent>;
  let pinService: PinService;
  let storageService: LocalStorageService;
  let router: Router;

  const dummyValidationCode = 'ABC';
  const dummyPin = 12345678;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, RouterTestingModule, HttpClientTestingModule],
      declarations: [ ValidationComponent ],
      providers: [LocalStorageService, PinService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationComponent);
    component = fixture.componentInstance;
    storageService = TestBed.get(LocalStorageService);
    pinService = TestBed.get(PinService);
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive new validation code', () => {
    spyOn(storageService, 'retrieveFromStorage').and.returnValue(dummyPin);
    spyOn(pinService, 'createNewValidationCode').and.returnValue(of(dummyValidationCode));
    component.createValidationCode();
    expect(pinService.createNewValidationCode).toHaveBeenCalledWith(dummyPin);
    expect(storageService.retrieveFromStorage).toHaveBeenCalled();

  });

  it('should navigate back to evaluation', () => {
    spyOn(router, 'navigate');
    component.backToEval();
    expect(router.navigate).toHaveBeenCalledWith(['/evaluation', {show: false }]);
  });


});
