import { async, ComponentFixture, TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';

import { CountdownComponent } from './countdown.component';
import { MaterialModule } from 'src/app/material/material.module';

describe('CountdownComponent', () => {
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
    spyOn(component.finished, 'emit');
    component.seconds = 2;
    component.startTimer();
    tick(3000);
    expect(component.finished.emit).toHaveBeenCalled();
  }));

});
