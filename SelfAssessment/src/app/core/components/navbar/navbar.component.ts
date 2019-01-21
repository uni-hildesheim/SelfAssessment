import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PinDialogComponent } from 'src/app/shared/components/dialogs/pin-dialog/pin-dialog.component';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/shared/services/config.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

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
