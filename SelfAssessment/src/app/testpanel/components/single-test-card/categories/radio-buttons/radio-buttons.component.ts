import { Component, OnInit, Input } from '@angular/core';
import { RadioButtons } from 'src/app/shared/models/procedure/categories/radio.buttons.test';
import { JournalLogService } from 'src/app/testpanel/services/journal-log.service';
import { CategoryComponent } from '../../categorie.component';

/**
 * The Component that realizes the radio buttons functionality.
 * Receives a [Test]{@link Test} of type [RadioButtons]{@link RadioButtons}.
 *
 */
@Component({
  selector: 'app-radio-buttons',
  templateUrl: './radio-buttons.component.html',
  styleUrls: ['../../single-test-card.component.scss']
})
export class RadioButtonsComponent implements CategoryComponent, OnInit {

  /**
   * The radio buttons test.
   */
  @Input() test: RadioButtons;

  @Input() admin?: boolean;

  /**
   * The models array which contains an array of booleans of the checked answers.
   */
  @Input() models: boolean[];

  constructor(
    private journalLogService: JournalLogService
  ) { }

  ngOnInit() { }

  /**
   * Adjusts the model if a radio button has been checked.
   */
  public handleModelChange(checked: boolean, i: number): void {

    if (this.admin) {
      return;
    }

    // Set all radio buttons to false to prevent mulitple answers in the model.
    this.models.fill(false);
    this.models[i] = checked;
    this.journalLogService.refreshJournalLog();
  }

}
