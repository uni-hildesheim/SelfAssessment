import { MaterialOverlayService } from './../../../shared/services/material-overlay.service';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './../../../material/material.module';
import { Journal } from 'src/app/shared/models/state/journal.model';
import { of, throwError } from 'rxjs';
import { ConfigService } from './../../../shared/services/config.service';
import { JournalLog } from 'src/app/shared/models/state/journal.log.model';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinComponent } from './pin.component';
import { Pipe, PipeTransform } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ResultSet } from 'src/app/shared/models/evaluation/result.set';
import { Router } from '@angular/router';
import { ResultService } from 'src/app/evaluation/services/result.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

const strings = {
  'lbl-pin-input': 'you can provide your pin',
  'btn-pin-input': 'pin input'
};

@Pipe({name: 'language'})
class MockPipe implements PipeTransform {
    transform(value: string): string {
        return strings[value];
    }
}

describe('PinComponent', () => {
  let component: PinComponent;
  let fixture: ComponentFixture<PinComponent>;
  let configService: ConfigService;
  let resultService: ResultService;
  let storageService: LocalStorageService;
  let overlayService: MaterialOverlayService;
  let router: Router;

  const mockResultSet = [ {}, {} ] as ResultSet[];

  const mockDataFromDialog = {
    pin: 78923457,
    journal: { log: {}, structure: {} },
  };

  class ConfigServiceMock {
    initEvaluationFromPin(journalLog: JournalLog) {}
    initJournalLogFromPin(resultSet: ResultSet[]) {}
  }


  beforeEach(async(() => {

     TestBed.configureTestingModule({
      declarations: [ PinComponent, MockPipe ],
      imports: [MaterialModule, RouterTestingModule, HttpClientModule],
      providers: [ ResultService, MaterialOverlayService, LocalStorageService,
        {provide: ConfigService, useClass: ConfigServiceMock},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinComponent);
    component = fixture.componentInstance;
    configService = TestBed.get(ConfigService);
    router = TestBed.get(Router);
    resultService = TestBed.get(ResultService);
    overlayService = TestBed.get(MaterialOverlayService);
    storageService = TestBed.get(LocalStorageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive data from dialog', () => {

    spyOn(component, 'showDialog').and.callThrough();
    spyOn(overlayService, 'openPinDialog').and.returnValue(of(mockDataFromDialog));
    spyOn(component, 'initateNavigation').and.callThrough();

    const buttonElement: HTMLElement = fixture.nativeElement.querySelector('button');
    buttonElement.click();
    fixture.detectChanges();

    expect(component.showDialog).toHaveBeenCalled();
    expect(overlayService.openPinDialog).toHaveBeenCalled();
    expect(component.initateNavigation).toHaveBeenCalledWith(mockDataFromDialog);

  });

  it('should do nothing if dialog data is empty', () => {

    spyOn(component, 'showDialog').and.callThrough();
    spyOn(overlayService, 'openPinDialog').and.returnValue(of(undefined));
    spyOn(component, 'initateNavigation').and.callThrough();

    const buttonElement: HTMLElement = fixture.nativeElement.querySelector('button');
    buttonElement.click();
    fixture.detectChanges();

    expect(component.showDialog).toHaveBeenCalled();
    expect(component.initateNavigation).not.toHaveBeenCalledWith();
  });


  it('should translate the text', () => {
    expect(fixture.nativeElement.querySelectorAll('p')[0].innerHTML).toEqual('you can provide your pin');
    expect(fixture.nativeElement.querySelector('button').innerText).toEqual('pin input');
  });

  it('should load data and navigate to evaluation page', () => {
    spyOn(resultService, 'loadResults').and.returnValue(of(mockResultSet));
    spyOn(configService, 'initEvaluationFromPin');
    spyOn(storageService, 'persistJournal');
    spyOn(router, 'navigate');

    component.initateNavigation(mockDataFromDialog);

    expect(resultService.loadResults).toHaveBeenCalledWith(78923457);
    expect(configService.initEvaluationFromPin).toHaveBeenCalledWith(mockResultSet);
    expect(storageService.persistJournal).toHaveBeenCalledWith(mockDataFromDialog['journal']);
    expect(router.navigate).toHaveBeenCalledWith(['/evaluation', {show: false}]);

  });

  it('should load data and navigate to test-panel page', () => {
    spyOn(resultService, 'loadResults').and.returnValue(throwError({status: 404}));
    spyOn(configService, 'initJournalLogFromPin');
    spyOn(storageService, 'persistJournal');
    spyOn(router, 'navigateByUrl');

    component.initateNavigation(mockDataFromDialog);

    expect(resultService.loadResults).toHaveBeenCalledWith(78923457);
    expect(configService.initJournalLogFromPin).toHaveBeenCalledWith(mockDataFromDialog['journal']['log']);
    expect(storageService.persistJournal).toHaveBeenCalledWith(mockDataFromDialog['journal']);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/testpanel');

  });


});
