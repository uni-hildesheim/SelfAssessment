import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ErrorDialogComponent } from '../components/dialogs/error-dialog/error-dialog.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorDialogService {


  constructor(public dialog: MatDialog) { }

  openDialog(data): Observable<void> {

    const dialogRef = this.dialog.open(ErrorDialogComponent, {
      disableClose: true,
      width: '200px',
      data: data
    });

    return dialogRef.afterClosed();

  }
}

