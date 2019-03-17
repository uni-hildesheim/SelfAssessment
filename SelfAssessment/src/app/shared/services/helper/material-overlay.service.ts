import { InfopageBlock } from './../../../admin/models/infopage.block.model';
import { CreateCategoryComponent } from './../../../admin/components/category/create-category/create-category.component';
import { TestBlock } from './../../../admin/models/test.block.model';
import { CreateInfopageComponent } from './../../../admin/components/creation-box/infopage-box/create-infopage/create-infopage.component';
import { Infopage } from 'src/app/shared/models/procedure/infopage.model';
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

  openBuildTestDialog(test: TestBlock): Observable<any> {

    return this.dialog
      .open(CreateCategoryComponent, {
      minWidth: '400px',
      disableClose: true,
      data: test
    })
    .afterClosed();
  }

  openBuildInfopageDialog(page: InfopageBlock): Observable<any> {
    return this.dialog
    .open(CreateInfopageComponent, {
      minWidth: '400px',
      disableClose: true,
      data: page
    })
    .afterClosed();
  }






}
