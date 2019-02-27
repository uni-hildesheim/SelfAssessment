import { TestDirective } from './test.directive';
import { MultipleChoiceComponent } from './categories/multiple-choice/multiple-choice.component';
import { MultipleOptionsComponent } from './categories/multiple-options/multiple-options.component';
import { RadioButtonsComponent } from './categories/radio-buttons/radio-buttons.component';
import { SpeedComponent } from './categories/speed/speed.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleTestCardComponent } from './single-test-card.component';
import { MaterialModule } from 'src/app/material/material.module';
import { GlobalIndicator } from '../../global.indicators';
import { DebugElement, Component, Input, ComponentFactoryResolver } from '@angular/core';
import { JournalLogService } from '../../services/journal-log.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { dummyTestRadioButtons } from 'src/app/spec-helper/dummy.values';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('SingleTestCardComponent', () => {
  let component: SingleTestCardComponent;
  let fixture: ComponentFixture<SingleTestCardComponent>;
  let de: DebugElement;
  let componentFactoryResolver: ComponentFactoryResolver;
  let journalLogService: JournalLogService;

  beforeEach(async(() => {

    const journalLogStub = {
      getModelByID(id: number): any { return []; }
    };


    TestBed.configureTestingModule({
      declarations: [TestDirective, SingleTestCardComponent,
        SpeedComponent, RadioButtonsComponent,
        MultipleOptionsComponent, MultipleChoiceComponent],
      providers: [GlobalIndicator, { provide: JournalLogService, useValue: journalLogStub }],
      imports: [MaterialModule, SharedModule, ]
    }).compileComponents();
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ SpeedComponent, RadioButtonsComponent, MultipleOptionsComponent, MultipleChoiceComponent ],
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
  });

});
