import { Component, OnInit, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

/**
 * The dialog which displays an error message if an api request failed.
 */
@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent implements OnInit {

  /**
   * Constructor
   * @param dialogRef The dialog reference.
   * @param data The error message.
   */
  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

  ngOnInit() {}

  /**
   * Close the dialog.
   */
  public retry(): void {
    this.dialogRef.close(true);
  }


}
