import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormattedTextAreaComponent } from './formatted-text-area.component';

xdescribe('FormattedTextAreaComponent', () => {
  let component: FormattedTextAreaComponent;
  let fixture: ComponentFixture<FormattedTextAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
});
