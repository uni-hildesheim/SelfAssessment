import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementPickerComponent } from './element-picker.component';

xdescribe('ElementPickerComponent', () => {
  let component: ElementPickerComponent;
  let fixture: ComponentFixture<ElementPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
