import { Component, OnInit, Input } from '@angular/core';
import { RadioButtons } from 'src/app/shared/models/procedure/categories/radio.buttons.test';
import { JournalLogService } from 'src/app/testpanel/services/journal-log.service';
import { CategoryComponent } from '../../categorie.component';


@Component({
  selector: 'app-radio-buttons',
  templateUrl: './radio-buttons.component.html',
  styleUrls: ['../../single-test-card.component.scss']
})
export class RadioButtonsComponent implements CategoryComponent, OnInit {

  @Input() test: RadioButtons;

  public models: boolean[];

  constructor(
    private journalLogService: JournalLogService
  ) { }

  ngOnInit() { }

  /**
   * Adjusts the model if a value of the test element changed
   * and refreshes the journal log.
   */
  public handleModelChange(checked: boolean, i: number): void {

    // Set all radio buttons to false to prevent mulitple answers in the model.
    this.models.fill(false);
    this.models[i] = checked;
    this.journalLogService.refreshJournalLog();
  }

}
