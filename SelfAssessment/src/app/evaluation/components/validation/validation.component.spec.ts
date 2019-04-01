import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { MaterialModule } from 'src/app/material/material.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationComponent } from './validation.component';
import { CodeService } from 'src/app/shared/services/code.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PipeTransform, Pipe } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

describe('ValidationComponent', () => {
  let component: ValidationComponent;
  let fixture: ComponentFixture<ValidationComponent>;
  let pinService: CodeService;
  let storageService: LocalStorageService;
  let router: Router;

  const dummyValidationCode = 'ABC';
  const dummyPin = 12345678;

  const strings = {
    'text-validation': 'example text'
  };

  @Pipe({ name: 'language'})
  class MockLangPipe implements PipeTransform {
    transform(value: string): string {
      return strings[value];
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, RouterTestingModule, HttpClientTestingModule, SharedModule],
      declarations: [ValidationComponent, MockLangPipe ],
      providers: [LocalStorageService, CodeService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationComponent);
    component = fixture.componentInstance;
    storageService = TestBed.get(LocalStorageService);
    pinService = TestBed.get(CodeService);
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
