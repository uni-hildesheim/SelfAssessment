import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestResultPanelComponent } from './result-tree.component';

xdescribe('ResultTreeComponent', () => {
  let component: TestResultPanelComponent;
  let fixture: ComponentFixture<TestResultPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestResultPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestResultPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
