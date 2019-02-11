import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA, MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-course-language-bottom-sheet',
  templateUrl: './course-language-bottom-sheet.component.html',
  styleUrls: ['./course-language-bottom-sheet.component.scss']
})
export class CourseLanguageBottomSheetComponent implements OnInit {

  constructor(
    private bottomSheetRef: MatBottomSheetRef<CourseLanguageBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: string[]
  ) { }

  ngOnInit() { }

  langChange(matselect: MatSelectChange) {
    this.bottomSheetRef.dismiss(matselect.value);
  }

}
