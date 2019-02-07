import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/shared/services/config.service';
import { PinDialogComponent } from 'src/app/shared/components/dialogs/pin-dialog/pin-dialog.component';

@Component({
  selector: 'app-pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.scss']
})
export class PinComponent implements OnInit {

  pin: string;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private configService: ConfigService
  ) { }

  ngOnInit() {

  }

  showDialog() {
    const dialogRef = this.dialog.open(PinDialogComponent, { width: '250px' });

    dialogRef.afterClosed().subscribe(result => {

      if (!result) {
        return;
      }

      this.configService.initJournalFromPin(result);
      this.router.navigateByUrl('/testpanel');

    });
  }
}
