import { MaterialOverlayService } from '../../../shared/services/helper/material-overlay.service';
import { LocalStorageService } from './../../../shared/services/local-storage.service';
import { ConfigService } from './../../../shared/services/config.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ResultService } from 'src/app/evaluation/services/result.service';
import { of } from 'rxjs';

/**
 * Component which aks the user for a pin, takes the provided pin and loads either the current test
 * progress or the evaluation. After that it navigates to the corresponding component.
 */
@Component({
  selector: 'app-pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.scss']
})
export class PinComponent implements OnInit {

  /**
   * The pin.
   */
  public pin: string;

  /**
   * The constructor for this component.
   */
  constructor(
    private overlaySerivce: MaterialOverlayService,
    private router: Router,
    private configService: ConfigService,
    private resultService: ResultService,
    private storageService: LocalStorageService
  ) { }

  ngOnInit() {}

  /**
   * Shows the pin dialog.
   */
  public showDialog(): void {
  this.overlaySerivce
  .openPinDialog({ width: '250px' })
  .subscribe((data) => {
      if (!data) {
        return;
      }
      this.initateNavigation(data);
    });
  }


  /**
   * Initiates the navigation based on the passed data from the dialog.
   *
   * @param data The raw loaded data from the dialog.
   */
  public initateNavigation(data: Object): void {
    this.storageService.persistJournal(data['journal']);
    this.resultService.loadResults(data['pin']).subscribe(
      result => {
        this.resultService.evaluation = of(result);
        this.configService.initEvaluationFromPin(result);
        this.router.navigate(['/evaluation', {show: false}]);
      },
      err => {
        this.configService.initJournalLogFromPin((data['journal']).log);
        this.router.navigateByUrl('/testpanel');
      }
    );
  }

}
