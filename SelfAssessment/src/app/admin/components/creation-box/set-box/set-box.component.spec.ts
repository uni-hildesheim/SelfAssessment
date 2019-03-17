import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetBoxComponent } from './set-box.component';

xdescribe('SetBoxComponent', () => {
  let component: SetBoxComponent;
  let fixture: ComponentFixture<SetBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
