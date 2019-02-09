import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackBarLanguageComponent } from './snack-bar-language.component';

xdescribe('SnackBarLanguageComponent', () => {
  let component: SnackBarLanguageComponent;
  let fixture: ComponentFixture<SnackBarLanguageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnackBarLanguageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackBarLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
