import { Component, OnInit, Input } from '@angular/core';
import { MultipleOptions } from 'src/app/shared/models/procedure/categories/multiple.options.test';
import { JournalLogService } from 'src/app/testpanel/services/journal-log.service';
import { CategoryComponent } from '../../categorie.component';

/**
 * The Component that realizes the multiple options functionality.
 * Receives a [Test]{@link Test} of type [MultipleOptions]{@link MultipleOptions}.
 */
@Component({
  selector: 'app-multiple-options',
  templateUrl: './multiple-options.component.html',
  styleUrls: ['../../single-test-card.component.scss']
})
export class MultipleOptionsComponent implements CategoryComponent,  OnInit {

  /**
   * The multiple options test.
   */
  @Input() test: MultipleOptions;

  /**
   * The model for the multiple options test is a two dimensional array, since for every options
   * there are *n* possibilities with *n* beeing the number of [headers]{@link MultipleOptions#header}.
   */
  public models: boolean[][];

  /**
   * Constructor for this component.
   */
  constructor(
    private journalLogService: JournalLogService
  ) { }

  ngOnInit() { }

  /**
   * Adjusts the model if a radio button has been checked and refreshes the journal log.
   */
  public handleModelChange(checked: boolean, i: number, j: number): void {

    // Set all radio buttons for the specific header to false to prevent mulitple
    // answers in the model for the category multiple-options.
    this.models[i].fill(false);
    this.models[i][j] = checked;
    this.journalLogService.refreshJournalLog();
  }

}
