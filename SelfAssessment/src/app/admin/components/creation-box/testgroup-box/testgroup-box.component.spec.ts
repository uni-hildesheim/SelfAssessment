import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestgroupBoxComponent } from './testgroup-box.component';

xdescribe('TestgroupBoxComponent', () => {
  let component: TestgroupBoxComponent;
  let fixture: ComponentFixture<TestgroupBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestgroupBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestgroupBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
