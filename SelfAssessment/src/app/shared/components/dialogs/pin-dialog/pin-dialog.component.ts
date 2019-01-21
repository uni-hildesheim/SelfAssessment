import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Validators, FormControl } from '@angular/forms';
import { JournalService } from 'src/app/shared/services/journal.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-pin-dialog',
  templateUrl: './pin-dialog.component.html',
  styleUrls: ['./pin-dialog.component.scss']
})
export class PinDialogComponent implements OnInit {

  loading = false;
  errorMessage: string;

  pinFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9]{8}')
  ]);

  constructor(
    public dialogRef: MatDialogRef<PinDialogComponent>,
    private protocolService: JournalService,
    private storageService: LocalStorageService
  ) { }

  ngOnInit() { }

  getProtocol() {
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
