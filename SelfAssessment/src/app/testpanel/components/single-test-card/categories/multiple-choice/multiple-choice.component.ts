import { Component, OnInit, Input } from '@angular/core';
import { MultipleChoice } from 'src/app/shared/models/procedure/categories/multiple.choice.test';
import { JournalLogService } from 'src/app/testpanel/services/journal-log.service';
import { CategoryComponent } from '../../categorie.component';

@Component({
  selector: 'app-multiple-choice',
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['../../single-test-card.component.scss']
})
export class MultipleChoiceComponent implements CategoryComponent {

  @Input() test: MultipleChoice;

  public models: boolean[];

  constructor(
    private journalLogService: JournalLogService
  ) { }

    /**
   * Adjusts the model if a value of the test element changed
   * and refreshes the journal log.
   */
  public handleModelChange(checked: boolean, i: number): void {
    this.models[i] = checked;
    this.journalLogService.refreshJournalLog();
  }


}
