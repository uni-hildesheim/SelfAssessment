import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchModeComponent } from './switch-mode.component';

xdescribe('SwitchModeComponent', () => {
  let component: SwitchModeComponent;
  let fixture: ComponentFixture<SwitchModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwitchModeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
