import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Validators, FormControl } from '@angular/forms';
import { JournalService } from 'src/app/shared/services/journal/journal.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { StorageItem } from 'src/app/shared/services/local.storage.values.enum';

/**
 * Realizes the Pin Dialog.
 */
@Component({
  selector: 'app-pin-dialog',
  templateUrl: './pin-dialog.component.html',
  styleUrls: ['./pin-dialog.component.scss']
})
export class PinDialogComponent {

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

  /**
   * Constructor for this component.
   */
  constructor(
    public dialogRef: MatDialogRef<PinDialogComponent>,
    private journalService: JournalService,
    private storageService: LocalStorageService
  ) { }

  /**
   * Gets the protocol associated with the pin that the user provided.
   * If the pin does not exist the user is notified.
   */
  public getJournal(): void {
    this.loading = true;
    this.errorMessage = null;

    const pin = this.pinFormControl.value;

    // load structure
    this.journalService.loadJournal(parseInt(pin, 0)).subscribe(
      data => {
        this.storageService.persistInStorage(StorageItem.PIN, pin);
        this.dialogRef.close({pin, journal: data});
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
