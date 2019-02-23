import { Component, OnInit, Input } from '@angular/core';
import { MultipleOptions } from 'src/app/shared/models/procedure/categories/multiple.options.test';
import { JournalLogService } from 'src/app/testpanel/services/journal-log.service';
import { CategoryComponent } from '../../categorie.component';

@Component({
  selector: 'app-multiple-options',
  templateUrl: './multiple-options.component.html',
  styleUrls: ['../../single-test-card.component.scss']
})
export class MultipleOptionsComponent implements CategoryComponent,  OnInit {

  @Input() test: MultipleOptions;

  public models: boolean[][];


  constructor(
    private journalLogService: JournalLogService
  ) { }

  ngOnInit() { }

    /**
   * Adjusts the model if a value of the test element changed
   * and refreshes the journal log.
   */
  public handleModelChange(checked: boolean, i: number, j: number): void {

    // Set all radio buttons for the specific header to false to prevent mulitple
    // answers in the model for the category multiple-options.
    this.models[i].fill(false);
    this.models[i][j] = checked;
    this.journalLogService.refreshJournalLog();
  }

}
