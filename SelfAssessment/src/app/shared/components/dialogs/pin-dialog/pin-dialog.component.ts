import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Validators, FormControl } from '@angular/forms';
import { JournalService } from 'src/app/shared/services/journal.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

/**
 * Realizes the Pin Dialog.
 */
@Component({
  selector: 'app-pin-dialog',
  templateUrl: './pin-dialog.component.html',
  styleUrls: ['./pin-dialog.component.scss']
})
export class PinDialogComponent implements OnInit {

  /**
   * Specifies whether there is an api call that is not finished.
   */
  public loading = false;

  /**
   * The potential error message.
   */
  public errorMessage: string;

  /**
   * The form controll for the pin input.
   */
  public pinFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9]{8}')
  ]);

  constructor(
    public dialogRef: MatDialogRef<PinDialogComponent>,
    private protocolService: JournalService,
    private storageService: LocalStorageService
  ) { }

  ngOnInit() { }

  /**
   * Gets the protocol associated with the pin that the user provided.
   * If the pin does not exist the user is notified.
   */
  public getProtocol(): void {
    this.loading = true;
    this.errorMessage = null;

    this.protocolService.loadJournal(parseInt(this.pinFormControl.value, 0)).subscribe(
      data => {
        this.storageService.storePin(this.pinFormControl.value);
        this.dialogRef.close(data);
      },
      err => {
        if (err.status === 404) {
          this.errorMessage = 'The PIN does not exist.';
        } else {
          console.log(err);
          this.errorMessage = 'Contact your admin.';
        }
      }
    ).add(() => this.loading = false);
  }

}
