import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseLanguageBottomSheetComponent } from './course-language-bottom-sheet.component';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { Pipe, PipeTransform } from '@angular/core';
import { MaterialModule } from 'src/app/material/material.module';

@Pipe({name: 'language'})
class MockPipe implements PipeTransform {
    transform(value: string): string {
        return '';
    }
}

describe('CourseLanguageBottomSheetComponent', () => {
  let component: CourseLanguageBottomSheetComponent;
  let fixture: ComponentFixture<CourseLanguageBottomSheetComponent>;
  let bottomSheetRef: MatBottomSheetRef;

  beforeEach(async(() => {

    const bottomSheetRefStub = {
      dismiss(value: string) {}
    };

    TestBed.configureTestingModule({
      declarations: [ CourseLanguageBottomSheetComponent, MockPipe ],
      providers: [
        {provide: MatBottomSheetRef, useValue: bottomSheetRefStub},
        {provide: MAT_BOTTOM_SHEET_DATA, useValue: []}
      ],
      imports: [ MaterialModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseLanguageBottomSheetComponent);
    component = fixture.componentInstance;
    bottomSheetRef = TestBed.get(MatBottomSheetRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should ', () => {
    spyOn(bottomSheetRef, 'dismiss');
    component.langChange('English');
    expect(bottomSheetRef.dismiss).toHaveBeenCalledWith('English');
  });
});
