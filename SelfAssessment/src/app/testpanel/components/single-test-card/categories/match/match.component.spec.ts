import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchComponent } from './match.component';
import { MaterialModule } from 'src/app/material/material.module';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GlobalIndicator } from 'src/app/testpanel/global.indicators';
import { RouterTestingModule } from '@angular/router/testing';
import { JournalLogService } from 'src/app/testpanel/services/journal-log.service';
import { Category } from 'src/app/shared/models/procedure/enums/category.enum';
import { SetElementType } from 'src/app/shared/models/procedure/enums/element.type.enum';
import { Match } from 'src/app/shared/models/procedure/categories/match.test';
import { By } from '@angular/platform-browser';


@Component({
  selector: 'app-countdown',
  template: ''
})
class FakeCountdownComponent {
  @Input() seconds: number;
  @Output() finished: EventEmitter<any> = new EventEmitter<any>();
}

xdescribe('MatchComponent', () => {
  let component: MatchComponent;
  let fixture: ComponentFixture<MatchComponent>;
  let journalLogService: JournalLogService;


  const dummyTestMatch: Match = {
    description: 'dummy speed test',
    category: Category.MATCH,
    elementType: SetElementType.TEST,
    seconds: 10,
    evaluated: true,
    task: 'dummy speed task',
    id: '1004',
    type: 'dummyType',
    options: [
      {
        text: 'dummy first option',
        correct: 'um'
      },
      {
        text: 'dummy second option',
        correct: 'se'
      }
    ]
  };

  beforeEach(async(() => {

    const journalLogStub = { refreshJournalLog() {} };

    TestBed.configureTestingModule({
      declarations: [ MatchComponent, FakeCountdownComponent],
      providers: [GlobalIndicator,
        { provide: JournalLogService, useValue: journalLogStub }
      ],
      imports: [MaterialModule, RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchComponent);
    component = fixture.componentInstance;
    component.test = dummyTestMatch;
    component.models = [false, false];
    journalLogService = TestBed.get(JournalLogService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should highlight chars on mouse over', () => {

    // highlight without adjusting
    component.spanMouseAction(true, 0, 5);
    expect(component.coloredOptions).toEqual(
      [
        [false, false, false, false, true, true, false, false,
           false, false, false, false, false, false, false, false, false, false ],
        [false, false, false, false, false, false, false, false,
           false, false, false, false, false, false, false, false, false, false, false ]
      ]);
    component.spanMouseAction(false, 0, 5);
    expect(component.coloredOptions).toEqual(
      [
        [false, false, false, false, false, false, false, false,
           false, false, false, false, false, false, false, false, false, false ],
        [false, false, false, false, false, false, false, false,
           false, false, false, false, false, false, false, false, false, false, false ]
      ]);

      // highlight with adjusting

      // left
      component.spanMouseAction(true, 0, 0);

      // right
      component.spanMouseAction(true, 0, 18);

  });

  // it('should add clicked chars and remove the option on click', () => {
  //   spyOn(journalLogService, 'refreshJournalLog');
  //   component.handleModelChange(true, 0, 5);
  //   expect(component.models[0]).toEqual('y ');
  //   expect(journalLogService.refreshJournalLog).toHaveBeenCalled();

  //   component.removeOption(0);
  //   expect(component.models[0]).toEqual(false);
  // });



});
