import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Test } from 'src/app/shared/models/testspecific/test.model';
import { JournalLogService } from '../../services/journal-log.service';

/**
 * Component which displays a single test instance.
 */
@Component({
  selector: 'app-single-test-card',
  templateUrl: './single-test-card.component.html',
  styleUrls: ['./single-test-card.component.scss']
})
export class SingleTestCardComponent implements OnInit, OnChanges {

  /**
   * The test which this card displays.
   */
  @Input() singleTest: Test;

  /**
   * The models for the test elements e.g checkboxes/radio-buttons.
   */
  public models: any[] = [];

  constructor(
    private journalLogService: JournalLogService
  ) { }

  ngOnInit() {}

  /**
   * Updates the model if this component receives a new test instance.
   */
  ngOnChanges() {
    this.models = this.journalLogService.getModelByID(this.singleTest.id);
  }

  /**
   * Adjusts the model if a value of the test element changed
   * and refreshes the journal log.
   */
  public changeValue(type: string, checked: boolean, i: number, j?: number): void {

    // Set all radio buttons to false to prevent mulitple answers in the model.
    if (type === 'radio-buttons') {
      this.models.fill(false);
    }

    // Set all radio buttons for the specific header to false to prevent mulitple
    // answers in the model for the category multiple-options.
    if (type === 'multiple-options') {
      this.models[i].fill(false);
      this.models[i][j] = checked;
    } else {
      this.models[i] = checked;
    }
    this.journalLogService.refreshJournalLog();
  }

}
