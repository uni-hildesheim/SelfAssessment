import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfopageBoxComponent } from './infopage-box.component';

xdescribe('InfopageBoxComponent', () => {
  let component: InfopageBoxComponent;
  let fixture: ComponentFixture<InfopageBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfopageBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfopageBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
