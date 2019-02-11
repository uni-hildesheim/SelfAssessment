import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseLanguageBottomSheetComponent } from './course-language-bottom-sheet.component';

xdescribe('CourseLanguageBottomSheetComponent', () => {
  let component: CourseLanguageBottomSheetComponent;
  let fixture: ComponentFixture<CourseLanguageBottomSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseLanguageBottomSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseLanguageBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
