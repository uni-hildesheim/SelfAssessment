import { Component, OnInit } from '@angular/core';
import { JournalService } from 'src/app/shared/services/journal.service';
import { GlobalIndicator } from '../../global.indicators';
import { MatStepper } from '@angular/material';
import { JournalStructure } from 'src/app/shared/models/state/journal.structure.model';
import { JournalLogService } from '../../services/journal-log.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { Router } from '@angular/router';
import { SetElementType } from 'src/app/shared/models/procedure/enums/element.type.enum';
import { StorageItem } from 'src/app/shared/services/local.storage.values.enum';

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
  public updateProtocol: boolean;

  /**
   * The progess value of the current set.
   */
  public progressVal = 0;

  /**
   * Indicates if the ui needs to wait for api requests.
   */
  public loading = false;

  /**
   * Helper variable to control the navigation flow.
   */
  private elementIndex = null;

  setElementType = SetElementType;


  constructor(
    private journalService: JournalService,
    private journalLogService: JournalLogService,
    private globals: GlobalIndicator,
    private storageService: LocalStorageService,
    private logging: LoggingService,
    private router: Router
  ) { }

  ngOnInit() {

    this.journalStructure = this.storageService.retrieveFromStorage(StorageItem.JOURNAL_STRUCTURE);
    this.journalLogService.getJournalLogAsObservable().subscribe(
      (data) => {
        this.updateProtocol = true;
        this.logging.debug('Journal log changed', data);
      }
    );
  }

  /**
   * Moves the test procedure forward.
   * If any changes to the journal log occurred, store the update the current
   * instance in the backend.
   *
   * @param forward Indicates the direction.
   * @param stepper The stepper element from the template.
   */
  public moveToNextSetElement(forward: boolean, stepper: MatStepper): void {
    // update the journal log if the current set element is a test and changes occured
    if (this.currentElements[this.setElemIndex].elementType === SetElementType.TEST && this.updateProtocol) {
      this.loading = true;
      this.journalService.saveJournalLog(this.journalLogService.journalLogInstance).subscribe(
        () => {
          this.updateProtocol = false;
          this.adjustIndices(forward, stepper);
        },
        err => this.logging.error('Error occurred', err)
      ).add(() => this.loading = false);
    } else {
      this.adjustIndices(forward, stepper);
    }

  }


  /**
   * Adjusts the global indices for the journal structure
   * according to the users actions.
   *
   * @param forward Indicates the direction.
   * @param stepper The stepper instance.
   */
  public adjustIndices(forward: boolean, stepper: MatStepper): void {

    // if this is the last test start the evaluation
    if (this.setIndex === this.journalStructure.sets.length - 1 && forward &&
      this.setElemIndex === this.journalStructure.sets[this.journalStructure.sets.length - 1].elements.length - 1) {
      this.router.navigateByUrl('/evaluation');
      return;
    }

    // adjust the indices
    if (forward) {
      if (this.setElemIndex === this.currentElements.length - 1) {
        // Going forward: The last element of a set was reached
        stepper.next();
      } else {
        this.setElemIndex = this.setElemIndex + 1;
      }
    } else {
      if (this.setElemIndex === 0) {
        // Going backward: The first element of a set was reached
        this.elementIndex = this.journalStructure.sets[this.setIndex - 1].elements.length - 1;
        stepper.previous();
      } else {
        this.setElemIndex = this.setElemIndex - 1;
      }
    }

    // adjust the progess value
    this.progressVal = Math.ceil(this.setElemIndex / (this.currentElements.length - 1) * 100);
  }

  /**
   * Called whenever the stepper jumps from one to another set.
   * This method is called in two cases:
   *
   * 1. The user clicks a specific step in the header navigation,
   *    in that case the method is called directly from the stepper.
   * 2. The user uses the navigation buttons to change sets, in that
   *    case the the method is called indirectly.
   *
   * @param selectedIndex The selected index from the mat stepper.
   */
  public jumpToNextSet(selectedIndex: number): void {
      this.setIndex = selectedIndex;
      if (this.elementIndex) {
        // The user choose the navigation buttons
        this.setElemIndex = this.elementIndex;
        this.elementIndex = null;
      } else {
        // The user choose the header navigation
        this.setElemIndex = 0;
        this.progressVal = Math.ceil(this.setElemIndex / (this.currentElements.length - 1) * 100);
      }
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
