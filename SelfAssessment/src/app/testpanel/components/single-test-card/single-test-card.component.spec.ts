import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleTestCardComponent } from './single-test-card.component';
import { MaterialModule } from 'src/app/material/material.module';
import { GlobalIndicator } from '../../global.indicators';
import { Test } from 'src/app/shared/models/procedure/test.model';
import { DebugElement, Component, Input } from '@angular/core';
import { JournalLogService } from '../../services/journal-log.service';
import { SharedModule } from 'src/app/shared/shared.module';

xdescribe('SingleTestCardComponent', () => {
  let component: SingleTestCardComponent;
  let fixture: ComponentFixture<SingleTestCardComponent>;
  let de: DebugElement;



  beforeEach(async(() => {


    @Component({
      selector: 'app-speed-test-card',
      template: ''
    })
    class SpeedTestCardMockComponent {
      @Input() singleTest: Test;
    }

    const journalLogServiceStub = {
      getModelByID(id: number): any { },
      refreshJournalLog() { }
    };

    TestBed.configureTestingModule({
      declarations: [SingleTestCardComponent, SpeedTestCardMockComponent],
      providers: [GlobalIndicator, { provide: JournalLogService, useValue: journalLogServiceStub }],
      imports: [MaterialModule, SharedModule, ]
    })
      .compileComponents();
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(SingleTestCardComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });




  // it('should call change method on click', () => {
  //   spyOn(component, 'changeValue');
  //   const hostElement = fixture.nativeElement;
  //   const buttonInput: HTMLInputElement = hostElement.querySelector('input');
  //   expect(buttonInput.checked).toBeFalsy();
  //   buttonInput.click();
  //   expect(buttonInput.checked).toBeTruthy();
  //   expect(component.changeValue).toHaveBeenCalled();

  // });

  // it('should verify the result of change method', () => {
  //   const hostElement = fixture.nativeElement;
  //   const buttonInput: HTMLInputElement = hostElement.querySelector('input');

  //   expect(buttonInput.checked).toBeFalsy();

  //   component.changeValue('radio-buttons', true, 0);

  //   buttonInput.dispatchEvent(new Event('input'));
  //   fixture.detectChanges();

  //   expect(buttonInput.checked).toBeTruthy();


  // });


  // it('should check if model is updated when onChange occurs', () => {

  //   const mockChangedTest = {
  //     'id': 3001,
  //     'task': 'task description',
  //     'description': 'description',
  //     'options': [{ text: 'option1' }, { text: 'option2' }],
  //     'category': 'multiple-choices'
  //   };

  //   component.singleTest = mockChangedTest as Test;

  //   fixture.detectChanges();

  //   expect(de.queryAll(By.css('h3'))[0].nativeElement.textContent).toContain(mockChangedTest.id);

  // });



});
