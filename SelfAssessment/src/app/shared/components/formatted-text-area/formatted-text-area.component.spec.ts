import { KatexModule } from 'ng-katex';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormattedTextAreaComponent } from './formatted-text-area.component';
import { MaterialModule } from 'src/app/material/material.module';

describe('FormattedTextAreaComponent', () => {
  let component: FormattedTextAreaComponent;
  let fixture: ComponentFixture<FormattedTextAreaComponent>;

  const dummyRawText =
   `This is a dummy $$x_{a}^{3}$$ Text with two $$\\sum_{i=0}^{10} x^{i}$$ equations and an image \`\`image.jpg\`\`.`;

  const formattedText: string[] =
   [' This is a dummy ', 'x_{a}^{3}', ' Text with two ', '\\sum_{i=0}^{10} x^{i}',
    ' equations and an image <img src=backend:8000/image.jpg>.'];

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
    component.rawText = dummyRawText;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should properly format the equations', () => {
    component.rawText = dummyRawText;
    component.backendUrl = 'backend:8000';
    fixture.detectChanges();
    component.formatImages();
    component.formatEquations();
    fixture.detectChanges();
    expect(component.formattedText).toEqual(formattedText);

  });
});
