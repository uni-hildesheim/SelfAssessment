import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedTestCardComponent } from './speed-test-card.component';

xdescribe('SpeedTestCardComponent', () => {
  let component: SpeedTestCardComponent;
  let fixture: ComponentFixture<SpeedTestCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedTestCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedTestCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
