import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JournalLogService } from 'src/app/testpanel/services/journal-log.service';
import { GlobalIndicator } from 'src/app/testpanel/global.indicators';
import { MaterialModule } from './../../../../../material/material.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioButtonsComponent } from './radio-buttons.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RadioButtons } from 'src/app/shared/models/procedure/categories/radio.buttons.test';
import { Category } from 'src/app/shared/models/procedure/enums/category.enum';
import { SetElementType } from 'src/app/shared/models/procedure/enums/element.type.enum';
import { RouterTestingModule } from '@angular/router/testing';

describe('RadioButtonsComponent', () => {
  let component: RadioButtonsComponent;
  let fixture: ComponentFixture<RadioButtonsComponent>;
  let journalLogService: Partial<JournalLogService>;


  const modelsDummy = [false, false, false];

  const radioButtonsTestDummy: RadioButtons = {
    category: Category.RADIO_BUTTONS,
    elementType: SetElementType.TEST,
    description: '',
    task: '',
    evaluated: true,
    id: '0',
    type: '',
    options: [
      { text: 'option1', correct: true},
      { text: 'option2', correct: false},
      { text: 'option3', correct: false}
    ]
  };


  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [ RadioButtonsComponent ],
      providers: [GlobalIndicator, JournalLogService],
      imports: [MaterialModule, SharedModule, RouterTestingModule, HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioButtonsComponent);
    component = fixture.componentInstance;
    journalLogService = TestBed.get(JournalLogService);
    component.test = radioButtonsTestDummy;
    component.models = modelsDummy;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle the model if user checks radio button', () => {

    expect(component.models.every(x => x === false)).toBeTruthy();

    spyOn(journalLogService, 'refreshJournalLog');

    component.handleModelChange(true, 1);
    fixture.detectChanges();
    expect(component.models[0]).toBeFalsy();
    expect(component.models[1]).toBeTruthy();
    expect(component.models[2]).toBeFalsy();
    expect(journalLogService.refreshJournalLog).toHaveBeenCalled();

    // check if all other radio buttons are disabled if another is checked
    component.handleModelChange(true, 0);
    fixture.detectChanges();
    expect(component.models[0]).toBeTruthy();
    expect(component.models[1]).toBeFalsy();
    expect(component.models[2]).toBeFalsy();
    expect(journalLogService.refreshJournalLog).toHaveBeenCalled();

  });


});
