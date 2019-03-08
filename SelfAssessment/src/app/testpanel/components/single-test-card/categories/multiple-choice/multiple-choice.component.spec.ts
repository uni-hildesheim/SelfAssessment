import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from './../../../../../material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { JournalLogService } from './../../../../services/journal-log.service';
import { GlobalIndicator } from './../../../../global.indicators';
import { Category } from 'src/app/shared/models/procedure/enums/category.enum';
import { SetElementType } from './../../../../../shared/models/procedure/enums/element.type.enum';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleChoiceComponent } from './multiple-choice.component';
import { MultipleChoice } from 'src/app/shared/models/procedure/categories/multiple.choice.test';

describe('MultipleChoiceComponent', () => {
  let component: MultipleChoiceComponent;
  let fixture: ComponentFixture<MultipleChoiceComponent>;
  let journalLogService: Partial<JournalLogService>;


  const modelsDummy = [false, false, false];

  const radioButtonsTestDummy: MultipleChoice = {
    category: Category.MULTIPLE_CHOICE,
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
      declarations: [ MultipleChoiceComponent ],
      providers: [GlobalIndicator, JournalLogService],
      imports: [MaterialModule, SharedModule, RouterTestingModule, HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleChoiceComponent);
    component = fixture.componentInstance;
    journalLogService = TestBed.get(JournalLogService);
    component.test = radioButtonsTestDummy;
    component.models = modelsDummy;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle the model if user checks checkbox', () => {

    expect(component.models.every(x => x === false)).toBeTruthy();

    spyOn(journalLogService, 'refreshJournalLog');

    component.handleModelChange(true, 1);
    fixture.detectChanges();
    expect(component.models[0]).toBeFalsy();
    expect(component.models[1]).toBeTruthy();
    expect(component.models[2]).toBeFalsy();
    expect(journalLogService.refreshJournalLog).toHaveBeenCalled();

    // check if all other checked boxes are still checked if another is checked
    component.handleModelChange(true, 0);
    fixture.detectChanges();
    expect(component.models[0]).toBeTruthy();
    expect(component.models[1]).toBeTruthy();
    expect(component.models[2]).toBeFalsy();
    expect(journalLogService.refreshJournalLog).toHaveBeenCalled();

  });
});
