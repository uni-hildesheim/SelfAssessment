import { KatexModule } from 'ng-katex';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormattedTextAreaComponent } from './formatted-text-area.component';
import { MaterialModule } from 'src/app/material/material.module';

describe('FormattedTextAreaComponent', () => {
  let component: FormattedTextAreaComponent;
  let fixture: ComponentFixture<FormattedTextAreaComponent>;

  const dummyRawText =
   `This is a dummy $$x_{a}^{3}$$ Text with two $$\\sum_{i=0}^{10} x^{i}$$ equations.`;

  const formattedText: string[] =
   [' This is a dummy ', 'x_{a}^{3}', ' Text with two ', '\\sum_{i=0}^{10} x^{i}', ' equations.'];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MaterialModule, KatexModule ],
      declarations: [ FormattedTextAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormattedTextAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should properly format the equations', () => {
    component.rawText = dummyRawText;
    fixture.detectChanges();
    component.formatEquations();
    fixture.detectChanges();
    expect(component.formattedText).toEqual(formattedText);

  });
});
