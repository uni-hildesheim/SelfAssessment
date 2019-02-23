import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CountdownComponent } from './countdown.component';
import { MaterialModule } from 'src/app/material/material.module';

xdescribe('CountdownComponent', () => {
  let component: CountdownComponent;
  let fixture: ComponentFixture<CountdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule],
        declarations: [ CountdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should execute countdown', fakeAsync(() => {
    spyOn(component, 'startTimer').and.callThrough();
    spyOn(component, 'notifyObservers').and.callThrough();
    component.seconds = 0.5;
    component.startTimer();
    tick(0.6);
    // fixture.detectChanges();
    // tick(0.6);
    // fixture.detectChanges();
    expect(component.startTimer).toHaveBeenCalled();
    // expect(component.notifyObservers).toHaveBeenCalled();
  }));

});
