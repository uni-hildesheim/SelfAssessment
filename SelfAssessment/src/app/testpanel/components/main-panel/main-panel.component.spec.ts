import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPanelComponent } from './main-panel.component';
import { JournalService } from 'src/app/shared/services/journal.service';
import { MaterialModule } from 'src/app/material/material.module';
import { GlobalIndicator } from '../../global.indicators';
import { InfopageComponent } from '../infopage/infopage.component';
import { HttpClientModule } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { JournalLog } from 'src/app/shared/models/state/journal.log.model';
import { JournalLogService } from '../../services/journal-log.service';
import { JournalStructure } from 'src/app/shared/models/state/journal.structure.model';
import { Component, Pipe, PipeTransform, Input } from '@angular/core';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingComponentDirective } from 'src/app/shared/directives/loading-component.directive';
import { Test } from 'src/app/shared/models/procedure/test.model';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { Router } from '@angular/router';
import { MatStepper } from '@angular/material';
import { SetElementType } from 'src/app/shared/models/procedure/enums/element.type.enum';



describe('MainPanelComponent', () => {
  let component: MainPanelComponent;
  let fixture: ComponentFixture<MainPanelComponent>;
  let journalLogService: JournalLogService;
  let journalSerivce: JournalService;
  let router: Router;

  class MockMatStepper extends MatStepper {
    next() { }
    previous() { }
  }


  const journalStructureDummy: JournalStructure = {
    sets: [
      {
       id: 0,
       elements: [
         { id: 1, elementType: SetElementType.TEST},
         { id: 2, elementType: SetElementType.TEST}
       ],
       scoreIndepentText: '',
       scoreDependentTexts: []
      },
      {
        id: 1,
        elements: [
          { id: 3, elementType: SetElementType.TEST },
          { id: 4, elementType: SetElementType.TEST }
        ],
        scoreIndepentText: '',
        scoreDependentTexts: []
       }
    ]
   };

  const journalLogDummy: JournalLog = { sets: [] };


  beforeEach(async(() => {

    class JournalLogServiceMock {

      journalLog = new BehaviorSubject(journalLogDummy);

      getJournalLogAsObservable(): Observable<JournalLog> {
        return this.journalLog.asObservable();
      }

      get journalLogInstance(): JournalLog {
        return this.journalLog.getValue();
      }
    }

    const strings = {
      'lbl-set-progess': 'Fortschritt des Kapitels:'
    };

    @Pipe({name: 'language'})
    class MockPipe implements PipeTransform {
        transform(value: string): string {
            return strings[value];
        }
    }

    @Component({
      selector: 'app-single-test-card',
      template: ''
    })
    class SingleTestCardMockComponent {
      @Input() singleTest: Test;
    }

    const journalServiceMock = {
      saveJournalLog(log: JournalLog): Observable<any>  {
        return of('DONE');
      }
    };

    const storageServiceStub = {
      getJournalStructure(): JournalStructure { return journalStructureDummy; },
      prepareJournalLogForSaving(journalLog: JournalLog): Object {
        return new Object();
      }
    };


    TestBed.configureTestingModule({
      declarations: [MainPanelComponent, InfopageComponent, LoadingComponentDirective, SingleTestCardMockComponent, MockPipe],
      providers: [GlobalIndicator, GlobalIndicator, LoggingService,
        {provide: JournalLogService, useClass: JournalLogServiceMock},
        {provide: JournalService, useValue: journalServiceMock},
        {provide: LocalStorageService, useValue: storageServiceStub}
      ],
      imports: [MaterialModule, HttpClientModule, RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MainPanelComponent);
    journalLogService = TestBed.get(JournalLogService);
    router = TestBed.get(Router);
    journalSerivce = TestBed.get(JournalService);
    component = fixture.componentInstance;
    component.setIndex = 0;
    component.setElemIndex = 0;
    fixture.detectChanges();

  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should be notified if the journal is changend', () => {
    // The behaviour subject should have fired at least once because it needs an inital value
    // which leads to the inital notification of the main panel
    expect(component.updateProtocol).toBeTruthy();

    // change to false so that a change can be tested
    component.updateProtocol = false;
    fixture.detectChanges();
    expect(component.updateProtocol).toBeFalsy();

    // change the value of the journallogs behaviour subject so that it notifies the main-panel
    journalLogService.journalLog.next(journalLogDummy);
    fixture.detectChanges();
    expect(component.updateProtocol).toBeTruthy();
  });

  it('should navigate to evaluation if user is at last test', () => {

    // adjust indices accordingly, see: dummySet above
    component.setIndex = 1;
    component.setElemIndex = 1;
    component.updateProtocol = false;

    fixture.detectChanges();
    spyOn(router, 'navigateByUrl');
    spyOn(component, 'adjustIndices').and.callThrough();
    spyOn(component, 'moveToNextSetElement').and.callThrough();

    const forwardBtn = fixture.debugElement.nativeElement.querySelectorAll('button')[1];

    forwardBtn.click();

    fixture.whenStable().then(() => {
      expect(component.moveToNextSetElement).toHaveBeenCalled();
      expect(component.adjustIndices).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/evaluation');
    });

  });

  it('should adjust the element indices going forward/backward', () => {

    component.setIndex = 0;
    component.setElemIndex = 0;

    const stepper = new MockMatStepper(null, null);
    fixture.detectChanges();

    // going forward
    component.adjustIndices(true, stepper);
    expect(component.setElemIndex).toBe(1);
    expect(component.setIndex).toBe(0);

    // going backward
    component.adjustIndices(false, stepper);
    expect(component.setElemIndex).toBe(0);
    expect(component.setIndex).toBe(0);

  });


  it('should jump sets if last/first test of a set is reached', () => {

    component.setIndex = 0;
    component.setElemIndex = 1;

    const stepper = new MockMatStepper(null, null);
    spyOn(stepper, 'next');
    spyOn(stepper, 'previous');
    spyOn(component, 'jumpToNextSet').and.callThrough();
    fixture.detectChanges();

    // going forward
    component.adjustIndices(true, stepper);
    expect(stepper.next).toHaveBeenCalled();
    expect(component.setElemIndex).toBe(1);
    expect(component.setIndex).toBe(0);

    component.jumpToNextSet(component.setIndex + 1);
    expect(component.jumpToNextSet).toHaveBeenCalledWith(1);
    expect(component.setElemIndex).toBe(0);
    expect(component.setIndex).toBe(1);

    // going backward
    component.adjustIndices(false, stepper);
    expect(stepper.previous).toHaveBeenCalled();
    expect(component.setElemIndex).toBe(0);
    expect(component.setIndex).toBe(1);

    component.jumpToNextSet(component.setIndex - 1);
    expect(component.jumpToNextSet).toHaveBeenCalledWith(1);
    expect(component.setElemIndex).toBe(1);
    expect(component.setIndex).toBe(0);

  });

  it('should save journal log if user navigates with an updated journal', () => {
    component.updateProtocol = true;
    fixture.detectChanges();

    spyOn(journalSerivce, 'saveJournalLog').and.callThrough();
    spyOn(component, 'moveToNextSetElement').and.callThrough();
    spyOn(component, 'adjustIndices');

    const forwardBtn = fixture.debugElement.nativeElement.querySelectorAll('button')[1];

    forwardBtn.click();

    fixture.whenStable().then(() => {
      expect(component.moveToNextSetElement).toHaveBeenCalled();
      expect(journalSerivce.saveJournalLog).toHaveBeenCalledWith(journalLogDummy);
      expect(component.adjustIndices).toHaveBeenCalled();
    });

  });


  it('should throw error if journal log could not be stored', () => {
    component.updateProtocol = true;
    fixture.detectChanges();

    spyOn(journalSerivce, 'saveJournalLog').and.returnValue(throwError({status: 500}));
    spyOn(component, 'moveToNextSetElement').and.callThrough();
    spyOn(component, 'adjustIndices');

    const forwardBtn = fixture.debugElement.nativeElement.querySelectorAll('button')[1];

    forwardBtn.click();

    fixture.whenStable().then(() => {
      expect(component.moveToNextSetElement).toHaveBeenCalled();
      expect(journalSerivce.saveJournalLog).toHaveBeenCalledWith(journalLogDummy);
      expect(component.adjustIndices).not.toHaveBeenCalled();
    });
  });

  it('should disable backward button', () => {
    component.setIndex = 0;
    component.setElemIndex = 0;
    fixture.detectChanges();
    const backwardBtn = fixture.debugElement.nativeElement.querySelectorAll('button')[0];
    expect(backwardBtn.disabled).toBeTruthy();
  });

  it('should translate progress text', () => {
    expect( fixture.nativeElement.querySelector('.main-test p:first-child').innerHTML).toEqual('Fortschritt des Kapitels:');
  });


});
