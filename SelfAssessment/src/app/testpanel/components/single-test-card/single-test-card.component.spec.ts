import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleTestCardComponent } from './single-test-card.component';
import { MaterialModule } from 'src/app/material/material.module';
import { GlobalIndicator } from '../../global.indicators';
import { Test } from 'src/app/shared/models/testspecific/test.model';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { JournalService } from 'src/app/shared/services/journal.service';

xdescribe('SingleTestCardComponent', () => {
  let component: SingleTestCardComponent;
  let fixture: ComponentFixture<SingleTestCardComponent>;
  let de: DebugElement;


  beforeEach(async(() => {

    const protocolStub = {
      refreshProtocol: () => true
    };

    TestBed.configureTestingModule({
      declarations: [SingleTestCardComponent],
      providers: [GlobalIndicator, { provide: JournalService, useValue: protocolStub }],
      imports: [MaterialModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {

    const mockSingleTest = {
      'id': 3000,
      'task': 'task description',
      'description': 'description',
      'options': [{ text: 'option1' }, { text: 'option2' }],
      'category': 'radio-buttons'
    };

    fixture = TestBed.createComponent(SingleTestCardComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    component.singleTest = mockSingleTest as Test;
    fixture.detectChanges();
  });

  it('should call change method on click', () => {
    spyOn(component, 'changeValue');
    const hostElement = fixture.nativeElement;
    const buttonInput: HTMLInputElement = hostElement.querySelector('input');
    expect(buttonInput.checked).toBeFalsy();
    buttonInput.click();
    expect(buttonInput.checked).toBeTruthy();
    expect(component.changeValue).toHaveBeenCalled();

  });

  it('should verify the result of change method', () => {
    const hostElement = fixture.nativeElement;
    const buttonInput: HTMLInputElement = hostElement.querySelector('input');

    expect(buttonInput.checked).toBeFalsy();

    component.changeValue('radio-buttons', true, 0);

    buttonInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(buttonInput.checked).toBeTruthy();


  });


  it('should check if model is updated when onChange occurs', () => {

    const mockChangedTest = {
      'id': 3001,
      'task': 'task description',
      'description': 'description',
      'options': [{ text: 'option1' }, { text: 'option2' }],
      'category': 'multiple-choices'
    };

    component.singleTest = mockChangedTest as Test;

    fixture.detectChanges();

    expect(de.queryAll(By.css('h3'))[0].nativeElement.textContent).toContain(mockChangedTest.id);

  });



});
