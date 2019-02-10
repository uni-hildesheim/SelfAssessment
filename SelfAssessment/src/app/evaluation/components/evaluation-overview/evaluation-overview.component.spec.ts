import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationOverviewComponent } from './evaluation-overview.component';

xdescribe('EvaluationOverviewComponent', () => {
  let component: EvaluationOverviewComponent;
  let fixture: ComponentFixture<EvaluationOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluationOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
