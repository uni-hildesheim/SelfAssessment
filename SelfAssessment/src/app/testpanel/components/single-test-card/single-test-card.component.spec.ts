import { TestDirective } from './test.directive';
import { MultipleChoiceComponent } from './categories/multiple-choice/multiple-choice.component';
import { MultipleOptionsComponent } from './categories/multiple-options/multiple-options.component';
import { RadioButtonsComponent } from './categories/radio-buttons/radio-buttons.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleTestCardComponent } from './single-test-card.component';
import { MaterialModule } from 'src/app/material/material.module';
import { GlobalIndicator } from '../../global.indicators';
import { DebugElement, Component, Input, ComponentFactoryResolver } from '@angular/core';
import { JournalLogService } from '../../services/journal-log.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { dummyTestRadioButtons, dummyTestMultipleChoice, dummyTestMultipleOptions, dummyMatchTest } from 'src/app/spec-helper/dummy.values';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { MatchComponent } from './categories/match/match.component';

describe('SingleTestCardComponent', () => {
  let component: SingleTestCardComponent;
  let fixture: ComponentFixture<SingleTestCardComponent>;
  let de: DebugElement;
  let componentFactoryResolver: ComponentFactoryResolver;
  let journalLogService: JournalLogService;

  beforeEach(async(() => {

    const journalLogStub = {
      getModelByID(id: string): any { return []; }
    };


    TestBed.configureTestingModule({
      declarations: [TestDirective, SingleTestCardComponent,
        MatchComponent, RadioButtonsComponent,
        MultipleOptionsComponent, MultipleChoiceComponent],
      providers: [GlobalIndicator, { provide: JournalLogService, useValue: journalLogStub }],
      imports: [MaterialModule, SharedModule, ]
    }).compileComponents();
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ MatchComponent, RadioButtonsComponent, MultipleOptionsComponent, MultipleChoiceComponent ],
      }
    });
      TestBed.compileComponents();
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(SingleTestCardComponent);
    component = fixture.componentInstance;
    journalLogService = TestBed.get(JournalLogService);
    componentFactoryResolver = TestBed.get(ComponentFactoryResolver);
    component.singleTest = dummyTestRadioButtons;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dynamicly update the test component', () => {
    component.ngOnChanges();
    component.singleTest = dummyTestMultipleChoice;
    component.ngOnChanges();
    component.singleTest = dummyTestMultipleOptions;
    component.ngOnChanges();
    component.singleTest = dummyMatchTest;
    component.ngOnChanges();

  });


  it('should check the model', () => {

    // check one dimensional model

    let fakeModel: any[] = [null, null, false, null, null];
    expect(component.checkModel(fakeModel)).toBeFalsy();

    fakeModel = [null, null, null, null, null];
    expect(component.checkModel(fakeModel)).toBeTruthy();

    // check two dimensional model

    fakeModel = [ [null, null, false], [ null, null, null], [null, null, null] ];
    expect(component.checkModel(fakeModel)).toBeFalsy();

    fakeModel = [ [null, null, null], [ null, null, null], [null, null, null] ];
    expect(component.checkModel(fakeModel)).toBeTruthy();

  });

  it('should fill the model', () => {

    // fill one dimensional model

    let fakeModel: any[] = [null, null, null, null, null];
    component.fillModel(false, fakeModel);
    expect(fakeModel.every(e => e === false)).toBeTruthy();

    // fill two dimensional model

    fakeModel = [[null, null, null], [null, null, null], [null, null, null]];
    component.fillModel(false, fakeModel);
    expect(fakeModel[0].every(e => e === false)).toBeTruthy();
    expect(fakeModel[1].every(e => e === false)).toBeTruthy();
    expect(fakeModel[2].every(e => e === false)).toBeTruthy();

  });

});
