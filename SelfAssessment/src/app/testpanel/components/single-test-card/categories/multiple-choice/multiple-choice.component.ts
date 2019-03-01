import { Component, OnInit, Input } from '@angular/core';
import { MultipleChoice } from 'src/app/shared/models/procedure/categories/multiple.choice.test';
import { JournalLogService } from 'src/app/testpanel/services/journal-log.service';
import { CategoryComponent } from '../../categorie.component';

/**
 * The Component that realizes the multiple choice functionality.
 * Receives a [Test]{@link Test} of type [MultipleChoice]{@link MultipleChoice}.
 */
@Component({
  selector: 'app-multiple-choice',
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['../../single-test-card.component.scss']
})
export class MultipleChoiceComponent implements CategoryComponent {

  /**
   * The multiple choice test.
   */
  @Input() test: MultipleChoice;

  /**
   * The models array which contains an array of booleans of the checked answers.
   */
  public models: boolean[];

  constructor(
    private journalLogService: JournalLogService
  ) { }

  /**
   * Adjusts the model if a checkbox has been checked and refresh the journal log.
   */
  public handleModelChange(checked: boolean, i: number): void {
    this.models[i] = checked;
    this.journalLogService.refreshJournalLog();
  }
}
