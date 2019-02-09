import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ErrorDialogComponent } from '../components/dialogs/error-dialog/error-dialog.component';
import { Observable } from 'rxjs';

/**
 * Handles the opening and closing of the error dialog.
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorDialogService {


  constructor(public dialog: MatDialog) { }

  /**
   * Opens the dialog on the screen.
   *
   * @param data The error message.
   */
  public openDialog(data: string): Observable<void> {

    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      disableClose: true,
      width: '200px',
      data: data
    });

    return dialogRef.afterClosed();

  }
}

