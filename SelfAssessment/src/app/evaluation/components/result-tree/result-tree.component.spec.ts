import { OptionPipe } from './../../pipes/option.pipe';
import { MaterialModule } from 'src/app/material/material.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestResultPanelComponent } from './result-tree.component';
import { resultSetDummy } from 'src/app/spec-helper/dummy.values';
import { SharedModule } from 'src/app/shared/shared.module';

describe('ResultTreeComponent', () => {
  let component: TestResultPanelComponent;
  let fixture: ComponentFixture<TestResultPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, MaterialModule],
      declarations: [ TestResultPanelComponent, OptionPipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestResultPanelComponent);
    component = fixture.componentInstance;
    component.tests = resultSetDummy[0].tests;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
