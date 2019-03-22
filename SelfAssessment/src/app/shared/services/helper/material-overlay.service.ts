import { PinDialogComponent } from '../../components/dialogs/pin-dialog/pin-dialog.component';
import {
  CourseLanguageBottomSheetComponent
 } from '../../../course-overview/components/course-language-bottom-sheet/course-language-bottom-sheet.component';
import { Injectable } from '@angular/core';
import { MatBottomSheet, MatDialog, MatDialogRef } from '@angular/material';
import { ErrorDialogComponent } from '../../components/dialogs/error-dialog/error-dialog.component';
import { Observable } from 'rxjs';
import { LoadingDialogComponent } from '../../components/dialogs/loading-dialog/loading-dialog.component';

/**
 * Handles the opening of the dialogs. Methods usually return an observable to which the component
 * can subscribe to be notified if the dialog closes.
 */
@Injectable({
  providedIn: 'root'
})
export class MaterialOverlayService {

  constructor(
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog
  ) { }

  /**
   * Opens Bottom Sheet from which the user has to choose the course language.
   *
   * @param data The possible languages.
   * @param disableClose Whether the close option is enabled.
   */
  chooseCourseLanguage(data: string[], disableClose: boolean) {
    return this.bottomSheet.open(CourseLanguageBottomSheetComponent,
      {data, disableClose})
    .afterDismissed();
  }

  /**
   * Opens dialog which receives a pin from the user.
   *
   * @param data Configuration data for dialog.
   */
  openPinDialog(data: any): Observable<any> {
    return this.dialog
    .open(PinDialogComponent, {data})
    .afterClosed();
  }

  /**
   * Opens dialog which displays the error type to the user and an option to retry the failed
   * request.
   * @param data The error message.
   */
  openErrorDialog(data: any): Observable<void> {
    return this.dialog
    .open(ErrorDialogComponent, {
      disableClose: true,
      width: '200px',
      data: data
    })
    .afterClosed();
  }

  /**
   * Opens a loading dialog with a custom loading message.
   *
   * @param data The loading message.
   */
  openLoadingDialog(data: any): MatDialogRef<LoadingDialogComponent> {
    return this.dialog
    .open(LoadingDialogComponent, {
      disableClose: true,
      width: '200px',
      data: data
    });
  }





}
