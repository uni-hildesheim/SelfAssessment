import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInfopageComponent } from './create-infopage.component';

xdescribe('CreateInfopageComponent', () => {
  let component: CreateInfopageComponent;
  let fixture: ComponentFixture<CreateInfopageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateInfopageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInfopageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
