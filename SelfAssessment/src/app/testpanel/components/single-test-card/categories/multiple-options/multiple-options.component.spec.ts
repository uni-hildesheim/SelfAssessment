import { RouterTestingModule } from '@angular/router/testing';
import { Category } from './../../../../../shared/models/procedure/enums/category.enum';
import { SetElementType } from './../../../../../shared/models/procedure/enums/element.type.enum';
import { MultipleOptions } from 'src/app/shared/models/procedure/categories/multiple.options.test';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { JournalLogService } from './../../../../services/journal-log.service';
import { GlobalIndicator } from './../../../../global.indicators';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleOptionsComponent } from './multiple-options.component';

describe('MultipleOptionsComponent', () => {
  let component: MultipleOptionsComponent;
  let fixture: ComponentFixture<MultipleOptionsComponent>;
  let journalLogService: Partial<JournalLogService>;


  const modelsDummy = [[false, false], [false, false], [false, false]];

  const radioButtonsTestDummy: MultipleOptions = {
    category: Category.MULTIPLE_OPTIONS,
    elementType: SetElementType.TEST,
    description: '',
    task: '',
    evaluated: true,
    id: 0,
    type: '',
    header: ['Ja', 'Nein'],
    options: [
      { text: 'option1', correct: true},
      { text: 'option2', correct: false},
      { text: 'option3', correct: false}
    ]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleOptionsComponent ],
      providers: [GlobalIndicator, JournalLogService],
      imports: [MaterialModule, SharedModule, RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleOptionsComponent);
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

    expect(component.models[0].every(x => x === false)).toBeTruthy();
    expect(component.models[1].every(x => x === false)).toBeTruthy();
    expect(component.models[2].every(x => x === false)).toBeTruthy();

    spyOn(journalLogService, 'refreshJournalLog');

    component.handleModelChange(true, 1, 1);
    fixture.detectChanges();
    expect(component.models[0].every(x => x === false)).toBeTruthy();
    expect(component.models[1][0]).toBeFalsy();
    expect(component.models[1][1]).toBeTruthy();
    expect(component.models[1][2]).toBeFalsy();
    expect(component.models[2].every(x => x === false)).toBeTruthy();
    expect(journalLogService.refreshJournalLog).toHaveBeenCalled();

    // check if the checked radio button is reset to false
    component.handleModelChange(true, 1, 2);
    fixture.detectChanges();
    expect(component.models[0].every(x => x === false)).toBeTruthy();
    expect(component.models[1][0]).toBeFalsy();
    expect(component.models[1][1]).toBeFalsy();
    expect(component.models[1][2]).toBeTruthy();
    expect(component.models[2].every(x => x === false)).toBeTruthy();
    expect(journalLogService.refreshJournalLog).toHaveBeenCalled();

  });


});
