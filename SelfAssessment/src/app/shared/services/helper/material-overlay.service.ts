import { PinDialogComponent } from '../../components/dialogs/pin-dialog/pin-dialog.component';
import {
  CourseLanguageBottomSheetComponent
 } from '../../../course-overview/components/course-language-bottom-sheet/course-language-bottom-sheet.component';
import { Injectable } from '@angular/core';
import { MatBottomSheet, MatDialog } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class MaterialOverlayService {

  constructor(
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog
  ) { }


  chooseCourseLanguage(data: string[], disableClose: boolean) {
    return this.bottomSheet.open(CourseLanguageBottomSheetComponent,
      {data, disableClose})
    .afterDismissed();
  }

  openPinDialog(data: any): any {
    return this.dialog.open(PinDialogComponent, {data}).afterClosed();
  }

}
