import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';

/**
 * Bottom Sheet Component from which the user has to choose the course-language.
 */
@Component({
  selector: 'app-course-language-bottom-sheet',
  templateUrl: './course-language-bottom-sheet.component.html',
  styleUrls: ['./course-language-bottom-sheet.component.scss']
})
export class CourseLanguageBottomSheetComponent implements OnInit {

  /**
   * Constructor for this component.
   */
  constructor(
    private bottomSheetRef: MatBottomSheetRef<CourseLanguageBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: string[]
  ) { }

  ngOnInit() { }

  /**
   * Dissmisses the bottom sheet with the choosen language.
   * @param value The choosen language.
   */
  langChange(value: string) {
    this.bottomSheetRef.dismiss(value);
  }

}
