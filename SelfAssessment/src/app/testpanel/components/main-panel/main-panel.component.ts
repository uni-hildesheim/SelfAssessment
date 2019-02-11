import { Component, OnInit, forwardRef } from '@angular/core';
import { JournalService } from 'src/app/shared/services/journal.service';
import { GlobalIndicator } from '../../global.indicators';
import { MatStepper } from '@angular/material';
import { JournalStructure } from 'src/app/shared/models/state/journal.structure.model';
import { JournalLogService } from '../../services/journal-log.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { Router } from '@angular/router';

/**
 * Handles the testing procedure.
 */
@Component({
  selector: 'app-main-panel',
  templateUrl: './main-panel.component.html',
  styleUrls: ['./main-panel.component.scss']
})
export class MainPanelComponent implements OnInit {

  /**
   * The journal structure which is beeing iterated inside
   * the template of this component.
   */
  public journalStructure: JournalStructure;

  /**
   * Inidcates if the user made any changes that would update
   * the protocol and would consequently be updated in the database
   * if the user goes to the next test.
   */
  private updateProtocol: boolean;

  /**
   * The progess value of the current set.
   */
  public progressVal = 0;

  constructor(
    private journalService: JournalService,
    private journalLogService: JournalLogService,
    private globals: GlobalIndicator,
    private storageService: LocalStorageService,
    private logging: LoggingService,
    private router: Router
  ) { }

  ngOnInit() {

    this.journalStructure = this.storageService.getJournalStructure();
    this.journalLogService.getJournalLogAsObservable().subscribe(
      (data) => {
        this.updateProtocol = true;
        this.logging.debug('Journal log changed', this.storageService.prepareJournalLogForSaving(data));
      }
    );
  }

  /**
   * Moves the test procedure forward.
   * If any changes to the journal log occurred, store the update the current
   * instance in the backend.
   *
   * @param foward Indicates the direction.
   * @param stepper The stepper element from the template.
   */
  public moveToNextSetElement(foward: boolean, stepper: MatStepper): void {


    // update the journal log if the current set element is a test and changes occured
    if (this.currentElements[this.setElemIndex].setType === 'test' && this.updateProtocol) {
      this.journalService.saveJournalLog(this.journalLogService.journalLogInstance).subscribe(
        () => {
          this.updateProtocol = false;
          this.adjustIndices(foward, stepper);
        },
        err => this.logging.error('Error occurred', err)
      );
    } else {
      this.adjustIndices(foward, stepper);
    }

  }



  private adjustIndices(foward: boolean, stepper: MatStepper): void {

    // if this is the last test start the evaluation
    if (this.setIndex === this.journalStructure.sets.length - 1 &&
      this.setElemIndex === this.journalStructure.sets[this.journalStructure.sets.length - 1].elements.length - 1) {
      this.router.navigateByUrl('/evaluation');
      return;
    }

    // adjust the indices
    if (foward) {
      if (this.setElemIndex === this.currentElements.length - 1) {
        stepper.next();
        this.setElemIndex = 0;
        this.setIndex = this.setIndex + 1;
      } else {
        this.setElemIndex = this.setElemIndex + 1;
      }

    } else {
      if (this.setElemIndex === 0) {
        stepper.previous();
        this.setIndex = this.setIndex - 1;
        this.setElemIndex = this.currentElements.length - 1;

      } else {
        this.setElemIndex = this.setElemIndex - 1;
      }
    }

    // adjust the progess value
    this.progressVal = Math.ceil(this.setElemIndex / (this.currentElements.length - 1) * 100);
  }

  /**
   * Getter for the current set.
   */
  get currentSet() {
    return this.journalStructure.sets[this.setIndex];
  }

  /**
   * Getter for the current set elements (test/infopage).
   */
  get currentElements() {
    return this.journalStructure.sets[this.setIndex].elements;
  }

  /**
   * Setter for the set index.
   */
  set setIndex(set: number) {
    this.globals.setIndex = set;
  }

  /**
   * Setter for the set element index.
   */
  set setElemIndex(test: number) {
    this.globals.setElemIndex = test;
  }

  /**
   * Getter for the set index.
   */
  get setIndex() {
    return this.globals.setIndex;
  }

  /**
   * Setter for the set element index.
   */
  get setElemIndex() {
    return this.globals.setElemIndex;
  }


}
