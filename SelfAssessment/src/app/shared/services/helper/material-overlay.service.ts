import { PinDialogComponent } from '../../components/dialogs/pin-dialog/pin-dialog.component';
import {
  CourseLanguageBottomSheetComponent
 } from '../../../course-overview/components/course-language-bottom-sheet/course-language-bottom-sheet.component';
import { Injectable } from '@angular/core';
import { MatBottomSheet, MatDialog, MatDialogRef } from '@angular/material';
import { ErrorDialogComponent } from '../../components/dialogs/error-dialog/error-dialog.component';
import { Observable } from 'rxjs';
import { LoadingDialogComponent } from '../../components/dialogs/loading-dialog/loading-dialog.component';

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

  openPinDialog(data: any): Observable<any> {
    return this.dialog
    .open(PinDialogComponent, {data})
    .afterClosed();
  }

  openErrorDialog(data: any): Observable<void> {
    return this.dialog
    .open(ErrorDialogComponent, {
      disableClose: true,
      width: '200px',
      data: data
    })
    .afterClosed();
  }

  openLoadingDialog(data: any): MatDialogRef<LoadingDialogComponent> {
    return this.dialog
    .open(LoadingDialogComponent, {
      disableClose: true,
      width: '200px',
      data: data
    });
  }





}
